import type { ShallowRef } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { downloadFile, generateFilename, processImagesWithCrop } from './utils'

export function useExporterHTML(editor: ShallowRef<Editor | undefined>) {
  async function exportAsHTML() {
    const rawHtml = editor.value?.getHTML() || ''
    const { html: processedHtml } = await processImagesWithCrop(rawHtml)
    
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: 0 auto; }
    blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; margin-left: 0; color: #6b7280; background: #f3f4f6; padding: 0.5rem 1rem; border-radius: 0 0.25rem 0.25rem 0; }
    a { color: #3b82f6; }
    img { max-width: 100%; height: auto; }
    img.wrap-left { float: left; margin-right: 16px; margin-bottom: 8px; display: block; }
    img.wrap-right { float: right; margin-left: 16px; margin-bottom: 8px; display: block; }
    img.block { display: block; margin: 0 auto; }
    mark { background-color: #ffff00; padding: 0 0.2em; }
  </style>
</head>
<body>
${processedHtml}
</body>
</html>`
    downloadFile(html, generateFilename('html'), 'text/html')
  }

  return { exportAsHTML }
}
