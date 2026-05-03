import type { ShallowRef } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { useExporterHTML } from './html'
import { useExporterJSON } from './json'
import { useExporterMarkdown } from './markdown'
import { useExporterPDF } from './pdf'
import { useExporterDocx } from './docx'
import { extractImagesForUpload, replaceImagesInHTML, type ImageUploadItem } from './utils'

export type ExportFormat = 'html' | 'json' | 'md' | 'pdf' | 'docx'

export function useExport(editor: ShallowRef<Editor | undefined>) {
  const { exportAsHTML } = useExporterHTML(editor)
  const { exportAsJSON, getJSON } = useExporterJSON(editor)
  const { exportAsMD, getMarkdown } = useExporterMarkdown(editor)
  const { exportAsPDF } = useExporterPDF(editor)
  const { exportAsDocx } = useExporterDocx(editor)

  let currentHtmlWithTempIds: string | null = null

  function getHTML(): string {
    let html = editor.value?.getHTML() || ''
    html = html
      .replace(/<p\s*>\s*<\/p>/gi, '<p>&nbsp;</p>')
      .replace(/<p\s+[^>]*>\s*<\/p>/gi, (match) => match.replace(/><\/p>/, '>&nbsp;</p>'))
    return html
  }

  async function exportAs(format: ExportFormat) {
    switch (format) {
      case 'html':
        await exportAsHTML()
        break
      case 'json':
        await exportAsJSON()
        break
      case 'md':
        await exportAsMD()
        break
      case 'pdf':
        await exportAsPDF()
        break
      case 'docx':
        await exportAsDocx()
        break
    }
  }

  async function getImagesForUpload(): Promise<ImageUploadItem[]> {
    const html = getHTML()
    const result = await extractImagesForUpload(html)
    currentHtmlWithTempIds = result.htmlWithTempIds
    return result.images
  }

  function replaceImageSrc(oldSrc: string, newSrc: string): boolean {
    if (!editor.value) return false

    const html = getHTML()
    const mapping = new Map([[oldSrc, newSrc]])
    const newHtml = replaceImagesInHTML(html, mapping)

    editor.value.commands.setContent(newHtml)
    currentHtmlWithTempIds = null
    return true
  }

  function replaceMultipleImages(srcMapping: Map<string, string>): boolean {
    if (!editor.value) return false

    const html = currentHtmlWithTempIds || getHTML()
    const newHtml = replaceImagesInHTML(html, srcMapping)

    editor.value.commands.setContent(newHtml)
    currentHtmlWithTempIds = null
    return true
  }

  return {
    exportAs,
    exportAsHTML,
    exportAsJSON,
    exportAsMD,
    exportAsPDF,
    exportAsDocx,
    getHTML,
    getJSON,
    getMarkdown,
    getImagesForUpload,
    replaceImageSrc,
    replaceMultipleImages,
  }
}

export { extractImagesForUpload, replaceImagesInHTML, type ImageUploadItem }
