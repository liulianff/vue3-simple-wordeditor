import VueWordEditor from './components/VueWordEditor.vue'
import './styles/editor.css'

export { VueWordEditor }
export { useEditor } from './composables/useEditor'
export { DraggableImage } from './extensions/DraggableImage'
export type {
  EditorConfig,
  ImageLayoutType,
  CropData,
  ImageAttributes,
  LinkData,
  FontStyle,
} from './types/editor'

export default VueWordEditor
