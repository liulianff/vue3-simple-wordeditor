import VueWordEditor from './components/VueWordEditor.vue'
import './styles/editor.css'

export { VueWordEditor }
export { useEditor } from './composables/useEditor'
export { useExport, extractImagesForUpload, replaceImagesInHTML } from './composables/useExport'
export type { ExportFormat, ImageUploadItem } from './composables/useExport'
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
