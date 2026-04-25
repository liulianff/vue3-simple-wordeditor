import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ImageRun, TextWrappingType, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, HorizontalPositionAlign, VerticalPositionAlign, type ParagraphChild } from 'docx'
import type { ShallowRef } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { downloadFile, generateFilename, processImagesWithCrop } from './utils'

async function fetchImageAsBase64(url: string): Promise<string | null> {
  console.log('尝试下载图片:', url)
  
  console.log('优先使用 XMLHttpRequest 方式...')
  try {
    return await new Promise((resolve) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'blob'
      
      xhr.onload = function() {
        if (xhr.status === 200) {
          console.log('XHR方式下载成功')
          const reader = new FileReader()
          reader.onloadend = function() {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(xhr.response)
        } else {
          console.warn('XHR下载失败，状态:', xhr.status)
          resolve(null)
        }
      }
      
      xhr.onerror = function() {
        console.warn('XHR请求失败')
        resolve(null)
      }
      
      xhr.send()
    })
  } catch (xhrError) {
    console.warn('XHR方式失败，尝试 fetch:', xhrError)
  }
  
  console.log('尝试使用 fetch API...')
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'force-cache'
    })
    
    if (!response.ok) {
      console.warn('Fetch下载失败，HTTP状态:', response.status)
      return null
    }
    
    const blob = await response.blob()
    console.log('Fetch下载成功，大小:', blob.size, '类型:', blob.type)
    
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.warn('Fetch方式也失败:', error)
    return null
  }
}

function getTextAlign(htmlAlign: string | null): typeof AlignmentType[keyof typeof AlignmentType] | undefined {
  switch (htmlAlign) {
    case 'left': return AlignmentType.LEFT
    case 'center': return AlignmentType.CENTER
    case 'right': return AlignmentType.RIGHT
    case 'justify': return AlignmentType.JUSTIFIED
    default: return undefined
  }
}

async function parseInlineRuns(node: Node, runs: ParagraphChild[], imgSizes?: Map<string, { width: number; height: number }>, imgCache?: Map<string, string>) {
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
    console.log('处理图片元素，src:', src)
    if (src) {
      let base64Data = src
      
      if (!src.startsWith('data:image')) {
        console.log('需要下载网络图片')
        if (imgCache && imgCache.has(src)) {
          console.log('使用缓存的图片')
          base64Data = imgCache.get(src)!
        } else {
          console.log('开始下载图片...')
          const downloaded = await fetchImageAsBase64(src)
          if (downloaded) {
            base64Data = downloaded
            if (imgCache) imgCache.set(src, base64Data)
            console.log('图片下载并缓存成功')
          } else {
            console.warn('无法下载图片，跳过此图片:', src)
            return
          }
        }
      } else {
        console.log('图片已经是base64格式')
      }
      
      if (base64Data && base64Data.startsWith('data:image')) {
        try {
          const base64 = base64Data.split(',')[1]
          const binary = atob(base64)
          const bytes = new Uint8Array(binary.length)
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i)
          }
          const mimeMatch = base64Data.match(/data:image\/(\w+);/)
          const type = (mimeMatch && mimeMatch[1]) || 'png'

          let imgSize = imgSizes?.get(src)
          let imgWidth = imgSize?.width || 500
          let imgHeight = imgSize?.height || 375

          const layout = el.getAttribute('data-layout') ||
            (el.classList.contains('wrap-left') ? 'wrap-left' :
            el.classList.contains('wrap-right') ? 'wrap-right' :
            el.classList.contains('block') ? 'block' : 'inline')

          const getStyleMargin = (prop: string) => {
            const val = el.style.getPropertyValue(prop)
            return val ? parseInt(val, 10) : 0
          }
          const marginRight = getStyleMargin('marginRight')
          const marginLeft = getStyleMargin('marginLeft')
          const marginBottom = getStyleMargin('marginBottom')
          const pxToEmu = (px: number) => Math.round(px * 9525)

          let floating: any = undefined
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
                side: 'right',
              },
              margins: {
                top: 0,
                bottom: pxToEmu(marginBottom || 8),
                left: 0,
                right: pxToEmu(marginRight || 16),
              },
              allowOverlap: false,
            }
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
                side: 'left',
              },
              margins: {
                top: 0,
                bottom: pxToEmu(marginBottom || 8),
                left: pxToEmu(marginLeft || 16),
                right: 0,
              },
              allowOverlap: false,
            }
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

  for (const child of children) {
    await parseInlineRuns(child, runs, imgSizes, imgCache)
  }
}

async function parseHtmlToDocx(html: string, imgSizes?: Map<string, { width: number; height: number }>, domImgCache?: Map<string, string>): Promise<Document> {
  let processedHtml = html.replace(/&nbsp;/gi, ' ')
  
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = processedHtml
  const paragraphs: Paragraph[] = []
  const imgCache = new Map<string, string>()
  
  if (domImgCache) {
    for (const [key, value] of domImgCache) {
      imgCache.set(key, value)
      console.log('预加载图片到缓存:', key)
    }
  }

  async function processElement(el: HTMLElement): Promise<Paragraph | null> {
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
      for (const child of children) {
        await parseInlineRuns(child, runs, imgSizes, imgCache)
      }

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

  async function processNode(node: Node): Promise<Paragraph | null> {
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

  for (const node of Array.from(tempDiv.childNodes)) {
    const p = await processNode(node)
    if (p) paragraphs.push(p)
  }

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

async function collectLoadedImagesFromEditor(editor: Editor): Promise<Map<string, string>> {
  const cache = new Map<string, string>()
  
  try {
    const editorElement = editor.view?.dom
    if (!editorElement) return cache
    
    const images = editorElement.querySelectorAll('img')
    console.log('在编辑器中找到', images.length, '张图片')
    
    for (const img of images) {
      const src = img.getAttribute('src')
      if (!src || cache.has(src)) continue
      
      if (src.startsWith('data:image')) {
        console.log('发现已有的base64图片')
        cache.set(src, src)
        continue
      }
      
      console.log('尝试从 DOM 读取图片:', src)
      
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        canvas.width = img.naturalWidth || img.width || 500
        canvas.height = img.naturalHeight || img.height || 375
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          const dataUrl = canvas.toDataURL('image/png')
          cache.set(src, dataUrl)
          console.log('成功从 DOM 读取图片:', src)
        }
      } catch (e) {
        console.warn('无法从 DOM 读取图片，将尝试下载:', src)
      }
    }
  } catch (e) {
    console.warn('收集编辑器图片失败:', e)
  }
  
  return cache
}

export function useExporterDocx(editor: ShallowRef<Editor | undefined>) {
  async function exportAsDocx() {
    const rawHtml = editor.value?.getHTML() || ''
    const { html: processedHtml, imgSizes } = await processImagesWithCrop(rawHtml)
    
    let domImgCache = new Map<string, string>()
    if (editor.value) {
      domImgCache = await collectLoadedImagesFromEditor(editor.value)
    }
    
    const doc = await parseHtmlToDocx(processedHtml, imgSizes, domImgCache)
    const blob = await Packer.toBlob(doc)
    downloadFile(blob, generateFilename('docx'), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  }

  return { exportAsDocx }
}
