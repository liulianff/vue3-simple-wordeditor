import type { ShallowRef } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { downloadFile, generateFilename, cropImage, type CropData } from './utils'

async function processJsonImages(json: any): Promise<any> {
  if (!json) return json

  if (Array.isArray(json)) {
    return Promise.all(json.map(item => processJsonImages(item)))
  }

  if (typeof json === 'object' && json !== null) {
    if (json.type === 'draggableImage' && json.attrs) {
      const src = json.attrs.src
      const crop = json.attrs.crop as CropData | null

      delete json.attrs['data-crop']
      delete json.attrs.crop

      if (src && crop && crop.width < 100) {
        try {
          const croppedSrc = await cropImage(src, crop)
          json.attrs.src = croppedSrc
        } catch (e) {
          console.warn('Failed to crop image for JSON export:', e)
        }
      }
      return json
    }

    const result: any = {}
    for (const key in json) {
      result[key] = await processJsonImages(json[key])
    }
    return result
  }

  return json
}

export function useExporterJSON(editor: ShallowRef<Editor | undefined>) {
  async function getJSON(): Promise<string> {
    const originalJson = editor.value?.getJSON() || {}
    const processedJson = await processJsonImages(originalJson)
    return JSON.stringify(processedJson, null, 2)
  }

  async function exportAsJSON() {
    const json = await getJSON()
    downloadFile(json, generateFilename('json'), 'application/json')
  }

  return { getJSON, exportAsJSON }
}