<template>
  <Teleport to="body">
    <div v-if="visible" class="image-editor-overlay" @click.self="$emit('close')">
      <div class="image-editor-backdrop"></div>
      <div class="image-editor-modal">
        <div class="image-editor-header">
          <h3 class="image-editor-title">{{ t('imageEditor.title') }}</h3>
          <button
            @click="$emit('close')"
            class="image-editor-close-btn"
          >
            <X class="image-editor-icon" />
          </button>
        </div>

        <div class="image-editor-content">
          <div v-if="mode === 'crop'" class="image-editor-crop-area">
            <Cropper
              ref="cropperRef"
              :src="imageSrc"
              class="image-editor-cropper"
              :stencil-props="{
                aspectRatio: cropAspectRatio,
              }"
              :check-orientation="true"
              :zoomable="true"
              :rotatable="true"
            />
          </div>

          <div v-else class="image-editor-edit-area">
            <div class="image-editor-preview-wrapper">
              <img
                :src="previewSrc"
                :alt="imageAlt"
                :style="previewStyle"
                class="image-editor-preview"
                ref="previewRef"
              />
            </div>

            <div class="image-editor-grid">
              <div class="image-editor-field">
                <label class="image-editor-label">{{ t('imageEditor.edit.width') }}</label>
                <div class="image-editor-input-group">
                  <input
                    type="range"
                    :value="editWidth"
                    @input="editWidth = Math.round(Number(($event.target as HTMLInputElement).value))"
                    min="50"
                    max="800"
                    class="image-editor-slider"
                  />
                  <span class="image-editor-value">{{ editWidth }}px</span>
                </div>
              </div>
              <div class="image-editor-field">
                <label class="image-editor-label">{{ t('imageEditor.edit.rotation') }}</label>
                <div class="image-editor-input-group">
                  <input
                    type="range"
                    :value="editRotation"
                    @input="editRotation = Number(($event.target as HTMLInputElement).value)"
                    min="-180"
                    max="180"
                    class="image-editor-slider"
                  />
                  <span class="image-editor-value">{{ editRotation }}°</span>
                </div>
              </div>
            </div>

            <div class="image-editor-section">
              <label class="image-editor-label">{{ t('imageEditor.edit.textWrap') }}</label>
              <div class="image-editor-layout-buttons">
                <button
                  v-for="layout in layoutOptions"
                  :key="layout.value"
                  @click="editLayout = layout.value"
                  :class="[
                    'image-editor-layout-btn',
                    editLayout === layout.value
                      ? 'image-editor-layout-btn-active'
                      : 'image-editor-layout-btn-inactive'
                  ]"
                >
                  <component :is="layout.icon" class="image-editor-layout-icon" />
                  {{ layout.label }}
                </button>
              </div>
            </div>

            <div v-if="editLayout === 'wrap-left' || editLayout === 'wrap-right'" class="image-editor-grid">
              <div class="image-editor-field">
                <label class="image-editor-label">
                  {{ editLayout === 'wrap-left' ? t('imageEditor.edit.rightMargin') : t('imageEditor.edit.leftMargin') }}
                </label>
                <div class="image-editor-input-group">
                  <input
                    type="range"
                    :value="editMargin"
                    @input="editMargin = Math.round(Number(($event.target as HTMLInputElement).value))"
                    min="4"
                    max="64"
                    class="image-editor-slider"
                  />
                  <span class="image-editor-value-sm">{{ editMargin }}px</span>
                </div>
              </div>
              <div class="image-editor-field">
                <label class="image-editor-label">{{ t('imageEditor.edit.bottomMargin') }}</label>
                <div class="image-editor-input-group">
                  <input
                    type="range"
                    :value="editMarginBottom"
                    @input="editMarginBottom = Math.round(Number(($event.target as HTMLInputElement).value))"
                    min="0"
                    max="64"
                    class="image-editor-slider"
                  />
                  <span class="image-editor-value-sm">{{ editMarginBottom }}px</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="image-editor-footer">
          <div v-if="mode === 'crop'" class="image-editor-btn-group">
            <button
              @click="cancelCrop"
              class="image-editor-btn image-editor-btn-secondary"
            >
              {{ t('imageEditor.crop.cancel') }}
            </button>
            <button
              @click="applyCrop"
              class="image-editor-btn image-editor-btn-primary image-editor-btn-flex"
            >
              <Check class="image-editor-btn-icon" />
              {{ t('imageEditor.crop.confirm') }}
            </button>
          </div>
          <div v-else class="image-editor-btn-group">
            <button
              @click="enterCropMode"
              class="image-editor-btn image-editor-btn-warning image-editor-btn-flex"
            >
              <Crop class="image-editor-btn-icon" />
              {{ t('imageEditor.edit.crop') }}
            </button>
            <button
              @click="resetImage"
              class="image-editor-btn image-editor-btn-secondary"
            >
              {{ t('imageEditor.edit.reset') }}
            </button>
            <button
              @click="applyChanges"
              class="image-editor-btn image-editor-btn-primary image-editor-btn-flex-grow"
            >
              {{ t('imageEditor.edit.apply') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, Crop, Check, AlignCenter, AlignLeft, AlignRight, Minus } from 'lucide-vue-next'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useI18n } from '../composables/useI18n'
import type { ImageLayoutType } from '../types/editor'

const props = defineProps<{
  visible: boolean
  imageSrc: string
  imageAlt: string
  initialWidth?: number
  initialLayout?: ImageLayoutType
  initialMargin?: number
  initialMarginBottom?: number
}>()

const emit = defineEmits<{
  close: []
  apply: [data: {
    src: string
    width: number
    rotation: number
    layout: ImageLayoutType
    margin: number
    marginBottom: number
  }]
}>()

const { t } = useI18n()

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)
const previewRef = ref<HTMLElement | null>(null)

const mode = ref<'edit' | 'crop'>('edit')
const editWidth = ref(300)
const editRotation = ref(0)
const editLayout = ref<ImageLayoutType>('inline')
const editMargin = ref(16)
const editMarginBottom = ref(8)
const croppedSrc = ref<string | null>(null)
const cropAspectRatio = ref<number | null>(null)

const previewSrc = computed(() => croppedSrc.value || props.imageSrc)

const previewStyle = computed(() => ({
  width: `${editWidth.value}px`,
  transform: `rotate(${editRotation.value}deg)`,
  maxWidth: '100%',
}))

const layoutOptions = computed(() => [
  { label: t('imageEditor.edit.wrapNone'), value: 'inline' as ImageLayoutType, icon: Minus },
  { label: t('imageEditor.edit.wrapLeft'), value: 'wrap-left' as ImageLayoutType, icon: AlignLeft },
  { label: t('imageEditor.edit.wrapRight'), value: 'wrap-right' as ImageLayoutType, icon: AlignRight },
  { label: t('imageEditor.edit.blockCenter'), value: 'block' as ImageLayoutType, icon: AlignCenter },
])

watch(() => props.visible, (val) => {
  if (val) {
    mode.value = 'edit'
    editWidth.value = props.initialWidth || 300
    editRotation.value = 0
    editLayout.value = props.initialLayout || 'inline'
    editMargin.value = props.initialMargin ?? 16
    editMarginBottom.value = props.initialMarginBottom ?? 8
    croppedSrc.value = null
    cropAspectRatio.value = null
  }
})

function enterCropMode() {
  mode.value = 'crop'
  cropAspectRatio.value = null
}

function cancelCrop() {
  mode.value = 'edit'
}

async function applyCrop() {
  if (cropperRef.value) {
    const result = cropperRef.value.getResult()
    if (result.canvas) {
      croppedSrc.value = result.canvas.toDataURL()
    }
  }
  mode.value = 'edit'
}

function resetImage() {
  editWidth.value = 300
  editRotation.value = 0
  editLayout.value = 'inline'
  editMargin.value = 16
  editMarginBottom.value = 8
  croppedSrc.value = null
}

function applyChanges() {
  emit('apply', {
    src: previewSrc.value,
    width: editWidth.value,
    rotation: editRotation.value,
    layout: editLayout.value,
    margin: editMargin.value,
    marginBottom: editMarginBottom.value,
  })
}
</script>

<style scoped>
/* Overlay */
.image-editor-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.image-editor-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

/* Modal */
.image-editor-modal {
  position: relative;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 48rem;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Header */
.image-editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.image-editor-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.image-editor-close-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  transition: background-color 0.2s;
}

.image-editor-close-btn:hover {
  background-color: #f3f4f6;
}

.image-editor-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

/* Content */
.image-editor-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}

.image-editor-crop-area {
  height: 400px;
}

.image-editor-cropper {
  height: 100%;
}

.image-editor-edit-area {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.image-editor-preview-wrapper {
  position: relative;
  margin-left: auto;
  margin-right: auto;
  max-width: 32rem;
  margin-bottom: 1rem;
}

.image-editor-preview {
  max-width: 100%;
  height: auto;
  border-radius: 0.25rem;
}

/* Grid */
.image-editor-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Field */
.image-editor-field {
  display: flex;
  flex-direction: column;
}

.image-editor-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.image-editor-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.image-editor-slider {
  flex: 1;
}

.image-editor-value {
  font-size: 0.875rem;
  color: #4b5563;
  width: 4rem;
  text-align: right;
}

.image-editor-value-sm {
  font-size: 0.875rem;
  color: #4b5563;
  width: 3rem;
  text-align: right;
}

/* Section */
.image-editor-section {
  display: flex;
  flex-direction: column;
}

/* Layout buttons */
.image-editor-layout-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.image-editor-layout-btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.image-editor-layout-btn-inactive {
  background-color: #f3f4f6;
  color: #374151;
}

.image-editor-layout-btn-inactive:hover {
  background-color: #e5e7eb;
}

.image-editor-layout-btn-active {
  background-color: #3b82f6;
  color: #ffffff;
}

.image-editor-layout-icon {
  width: 1rem;
  height: 1rem;
}

/* Footer */
.image-editor-footer {
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  flex-shrink: 0;
}

.image-editor-btn-group {
  display: flex;
  gap: 0.75rem;
}

.image-editor-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  font-size: 0.875rem;
}

.image-editor-btn-primary {
  background-color: #3b82f6;
  color: #ffffff;
}

.image-editor-btn-primary:hover {
  background-color: #2563eb;
}

.image-editor-btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.image-editor-btn-secondary:hover {
  background-color: #d1d5db;
}

.image-editor-btn-warning {
  background-color: #f59e0b;
  color: #ffffff;
}

.image-editor-btn-warning:hover {
  background-color: #d97706;
}

.image-editor-btn-flex {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.image-editor-btn-flex-grow {
  flex: 1;
  justify-content: center;
}

.image-editor-btn-icon {
  width: 1rem;
  height: 1rem;
}
</style>
