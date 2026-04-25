import VueWordEditor from './components/VueWordEditor.vue'
import EditorPreview from './components/EditorPreview.vue'
import './styles/editor.css'

export { VueWordEditor, EditorPreview }
export { useEditor } from './composables/useEditor'
export { useExport, extractImagesForUpload, replaceImagesInHTML } from './composables/useExport'
export type { ExportFormat, ImageUploadItem } from './composables/useExport'
export { useEditorPreview } from './composables/useEditorPreview'
export { DraggableImage } from './extensions/DraggableImage'
export type {
  EditorConfig,
  ImageLayoutType,
  CropData,
  ImageAttributes,
  LinkData,
  FontStyle,
} from './types/editor'
export { useI18n } from './composables/useI18n'
export { registerLocale, zhCN, enUS } from './locales'
export type { LocaleMessages, Locale } from './locales/types'

export default VueWordEditor
