<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
      <div class="fixed inset-0 bg-black bg-opacity-50"></div>
      <div class="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
          <h3 class="text-lg font-semibold text-gray-800">图片编辑</h3>
          <button
            @click="$emit('close')"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X class="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div class="flex-1 overflow-auto p-4">
          <div v-if="mode === 'crop'" class="h-[400px]">
            <Cropper
              ref="cropperRef"
              :src="imageSrc"
              class="h-full"
              :stencil-props="{
                aspectRatio: cropAspectRatio,
              }"
              :check-orientation="true"
              :zoomable="true"
              :rotatable="true"
            />
          </div>

          <div v-else class="space-y-6">
            <div class="relative mx-auto max-w-lg mb-4">
              <img
                :src="previewSrc"
                :alt="imageAlt"
                :style="previewStyle"
                class="max-w-full h-auto rounded"
                ref="previewRef"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">宽度</label>
                <div class="flex items-center gap-2">
                  <input
                    type="range"
                    :value="editWidth"
                    @input="editWidth = Math.round(Number(($event.target as HTMLInputElement).value))"
                    min="50"
                    max="800"
                    class="flex-1"
                  />
                  <span class="text-sm text-gray-600 w-16">{{ editWidth }}px</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">旋转</label>
                <div class="flex items-center gap-2">
                  <input
                    type="range"
                    :value="editRotation"
                    @input="editRotation = Number(($event.target as HTMLInputElement).value)"
                    min="-180"
                    max="180"
                    class="flex-1"
                  />
                  <span class="text-sm text-gray-600 w-16">{{ editRotation }}°</span>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">文字环绕方式</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="layout in layoutOptions"
                  :key="layout.value"
                  @click="editLayout = layout.value"
                  :class="[
                    'px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-1.5',
                    editLayout === layout.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  <component :is="layout.icon" class="w-4 h-4" />
                  {{ layout.label }}
                </button>
              </div>
            </div>

            <div v-if="editLayout === 'wrap-left' || editLayout === 'wrap-right'" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ editLayout === 'wrap-left' ? '右边距' : '左边距' }}
                </label>
                <div class="flex items-center gap-2">
                  <input
                    type="range"
                    :value="editMargin"
                    @input="editMargin = Math.round(Number(($event.target as HTMLInputElement).value))"
                    min="4"
                    max="64"
                    class="flex-1"
                  />
                  <span class="text-sm text-gray-600 w-12">{{ editMargin }}px</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">下边距</label>
                <div class="flex items-center gap-2">
                  <input
                    type="range"
                    :value="editMarginBottom"
                    @input="editMarginBottom = Math.round(Number(($event.target as HTMLInputElement).value))"
                    min="0"
                    max="64"
                    class="flex-1"
                  />
                  <span class="text-sm text-gray-600 w-12">{{ editMarginBottom }}px</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 p-4 shrink-0">
          <div v-if="mode === 'crop'" class="flex gap-3">
            <button
              @click="cancelCrop"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              取消裁剪
            </button>
            <button
              @click="applyCrop"
              class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Check class="w-4 h-4" />
              确认裁剪
            </button>
          </div>
          <div v-else class="flex gap-3">
            <button
              @click="enterCropMode"
              class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
            >
              <Crop class="w-4 h-4" />
              裁剪
            </button>
            <button
              @click="resetImage"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              重置
            </button>
            <button
              @click="applyChanges"
              class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              应用
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

const layoutOptions = [
  { label: '无环绕', value: 'inline' as ImageLayoutType, icon: Minus },
  { label: '左环绕', value: 'wrap-left' as ImageLayoutType, icon: AlignLeft },
  { label: '右环绕', value: 'wrap-right' as ImageLayoutType, icon: AlignRight },
  { label: '块级居中', value: 'block' as ImageLayoutType, icon: AlignCenter },
]

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
