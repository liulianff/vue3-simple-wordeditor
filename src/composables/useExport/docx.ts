import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ImageRun, TextWrappingType, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, HorizontalPositionAlign, VerticalPositionAlign, type ParagraphChild } from 'docx'
import type { ShallowRef } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { downloadFile, generateFilename, processImagesWithCrop } from './utils'

function getTextAlign(htmlAlign: string | null): typeof AlignmentType[keyof typeof AlignmentType] | undefined {
  switch (htmlAlign) {
    case 'left': return AlignmentType.LEFT
    case 'center': return AlignmentType.CENTER
    case 'right': return AlignmentType.RIGHT
    case 'justify': return AlignmentType.JUSTIFIED
    default: return undefined
  }
}

function parseInlineRuns(node: Node, runs: ParagraphChild[], imgSizes?: Map<string, { width: number; height: number }>) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || ''
    if (text) {
      runs.push(new TextRun({ text }))
    }
    return
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return

  const el = node as HTMLElement
  const tagName = el.tagName.toLowerCase()

  let text = el.textContent || ''
  let bold = false
  let italic = false
  let underline = false
  let strike = false

  if (tagName === 'strong' || tagName === 'b') bold = true
  if (tagName === 'em' || tagName === 'i') italic = true
  if (tagName === 'u') underline = true
  if (tagName === 's' || tagName === 'strike' || tagName === 'del') strike = true

  if (tagName === 'a') {
    text = el.textContent || ''
    runs.push(new TextRun({ text, color: '#3b82f6', underline: {} }))
    return
  }

  if (tagName === 'mark') {
    runs.push(new TextRun({ text, bold, italics: italic, underline: underline ? {} : undefined, strike, highlight: 'yellow' }))
    return
  }

  if (tagName === 'br') {
    runs.push(new TextRun({ text: '\n' }))
    return
  }

  if (tagName === 'img') {
    const src = el.getAttribute('src')
    if (src && src.startsWith('data:image')) {
      try {
        const base64 = src.split(',')[1]
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        const mimeMatch = src.match(/data:image\/(\w+);/)
        const type = (mimeMatch && mimeMatch[1]) || 'png'

        let imgSize = imgSizes?.get(src)
        let imgWidth = imgSize?.width || 500
        let imgHeight = imgSize?.height || 375

        const layout = el.getAttribute('data-layout') ||
          (el.classList.contains('wrap-left') ? 'wrap-left' :
          el.classList.contains('wrap-right') ? 'wrap-right' :
          el.classList.contains('block') ? 'block' : 'inline');

        // 读取 HTML 中设定的 margin（导出时写在 style 里）
        const getStyleMargin = (prop: string) => {
          const val = el.style.getPropertyValue(prop)
          return val ? parseInt(val, 10) : 0
        }
        const marginRight = getStyleMargin('marginRight');
        const marginLeft  = getStyleMargin('marginLeft');
        const marginBottom = getStyleMargin('marginBottom');
        // 将 px 转换为 EMU（1px ≈ 9525 EMU @96dpi）
        const pxToEmu = (px: number) => Math.round(px * 9525);

        let floating: any = undefined;
        if (layout === 'wrap-left') {
          floating = {
            horizontalPosition: {
              relative: HorizontalPositionRelativeFrom.MARGIN,
              align: HorizontalPositionAlign.LEFT,
            },
            verticalPosition: {
              relative: VerticalPositionRelativeFrom.PARAGRAPH,
              align: VerticalPositionAlign.TOP,
            },
            wrap: {
              type: TextWrappingType.SQUARE,
              side: 'right',                     // 文字在右侧环绕
            },
            margins: {
              top: 0,
              bottom: pxToEmu(marginBottom || 8),
              left: 0,
              right: pxToEmu(marginRight || 16), // 右侧留白
            },
            allowOverlap: false,
          };
        } else if (layout === 'wrap-right') {
          floating = {
            horizontalPosition: {
              relative: HorizontalPositionRelativeFrom.MARGIN,
              align: HorizontalPositionAlign.RIGHT,
            },
            verticalPosition: {
              relative: VerticalPositionRelativeFrom.PARAGRAPH,
              align: VerticalPositionAlign.TOP,
            },
            wrap: {
              type: TextWrappingType.SQUARE,
              side: 'left',                      // 文字在左侧环绕
            },
            margins: {
              top: 0,
              bottom: pxToEmu(marginBottom || 8),
              left: pxToEmu(marginLeft || 16),
              right: 0,
            },
            allowOverlap: false,
          };
        }

        runs.push(new ImageRun({
          type: type as 'png' | 'jpg' | 'gif' | 'bmp',
          data: bytes,
          transformation: {
            width: imgWidth,
            height: imgHeight,
          },
          floating,
        }))
      } catch (e) {
        console.warn('Failed to process image:', e)
      }
    }
    return
  }

  const children = Array.from(el.childNodes)
  if (children.length === 0 && text) {
    runs.push(new TextRun({
      text,
      bold,
      italics: italic,
      underline: underline ? {} : undefined,
      strike,
    }))
    return
  }

  children.forEach(child => parseInlineRuns(child, runs, imgSizes))
}

function parseHtmlToDocx(html: string, imgSizes?: Map<string, { width: number; height: number }>): Document {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  const paragraphs: Paragraph[] = []

  function processElement(el: HTMLElement): Paragraph | null {
    const tagName = el.tagName.toLowerCase()
    const align = getTextAlign(el.style.textAlign || el.getAttribute('align'))

    let heading: typeof HeadingLevel[keyof typeof HeadingLevel] | undefined
    if (tagName === 'h1') heading = HeadingLevel.HEADING_1
    else if (tagName === 'h2') heading = HeadingLevel.HEADING_2
    else if (tagName === 'h3') heading = HeadingLevel.HEADING_3
    else if (tagName === 'h4') heading = HeadingLevel.HEADING_4
    else if (tagName === 'h5') heading = HeadingLevel.HEADING_5
    else if (tagName === 'h6') heading = HeadingLevel.HEADING_6

    if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6') {
      const text = el.textContent?.trim() || ''
      return new Paragraph({
        children: [new TextRun({ text, bold: true, size: heading === HeadingLevel.HEADING_1 ? 48 : heading === HeadingLevel.HEADING_2 ? 36 : heading === HeadingLevel.HEADING_3 ? 32 : 28 })],
        heading,
        alignment: align,
      })
    }

    if (tagName === 'blockquote') {
      const text = el.textContent?.trim() || ''
      return new Paragraph({
        children: [new TextRun({ text, italics: true, color: '#6b7280' })],
        heading,
        alignment: align,
        border: {
          left: { color: '3b82f6', size: 4, style: BorderStyle.SINGLE },
        },
      })
    }

    if (tagName === 'ul' || tagName === 'ol') {
      const items = Array.from(el.querySelectorAll('li'))
      return new Paragraph({
        children: items.map(li => new TextRun({ text: `• ${li.textContent?.trim() || ''}`, break: 1 })),
        heading,
        alignment: align,
      })
    }

    if (tagName === 'li') {
      const text = el.textContent?.trim() || ''
      return new Paragraph({
        children: [new TextRun({ text })],
        heading,
        alignment: align,
      })
    }

    if (tagName === 'p' || tagName === 'div') {
      const children = Array.from(el.childNodes)
      if (children.length === 0) {
        return new Paragraph({
          children: [new TextRun({ text: '' })],
          heading,
          alignment: align,
        })
      }

      const runs: ParagraphChild[] = []
      children.forEach(child => parseInlineRuns(child, runs, imgSizes))

      if (runs.length === 0) {
        return new Paragraph({
          children: [new TextRun({ text: '' })],
          heading,
          alignment: align,
        })
      }

      return new Paragraph({
        children: runs,
        heading,
        alignment: align,
      })
    }

    const text = el.textContent?.trim()
    if (text) {
      return new Paragraph({
        children: [new TextRun({ text })],
        heading,
        alignment: align,
      })
    }

    return null
  }

  function processNode(node: Node): Paragraph | null {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        return new Paragraph({
          children: [new TextRun({ text })],
        })
      }
      return null
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return null

    const el = node as HTMLElement
    return processElement(el)
  }

  Array.from(tempDiv.childNodes).forEach(node => {
    const p = processNode(node)
    if (p) paragraphs.push(p)
  })

  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: '' })] }))
  }

  return new Document({
    sections: [{
      properties: {},
      children: paragraphs,
    }],
  })
}

export function useExporterDocx(editor: ShallowRef<Editor | undefined>) {
  async function exportAsDocx() {
    const rawHtml = editor.value?.getHTML() || ''
    const { html: processedHtml, imgSizes } = await processImagesWithCrop(rawHtml)
    
    const doc = parseHtmlToDocx(processedHtml, imgSizes)
    const blob = await Packer.toBlob(doc)
    downloadFile(blob, generateFilename('docx'), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  }

  return { exportAsDocx }
}
