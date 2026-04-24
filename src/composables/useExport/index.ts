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

  function getHTML(): string {
    return editor.value?.getHTML() || ''
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
    return await extractImagesForUpload(html)
  }

  function replaceImageSrc(oldSrc: string, newSrc: string): boolean {
    if (!editor.value) return false

    const html = getHTML()
    const mapping = new Map([[oldSrc, newSrc]])
    const newHtml = replaceImagesInHTML(html, mapping)

    editor.value.commands.setContent(newHtml)
    return true
  }

  function replaceMultipleImages(srcMapping: Map<string, string>): boolean {
    if (!editor.value) return false

    const html = getHTML()
    const newHtml = replaceImagesInHTML(html, srcMapping)

    editor.value.commands.setContent(newHtml)
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
