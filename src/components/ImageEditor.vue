<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">图片编辑</h3>
        <button
          @click="$emit('close')"
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div class="p-4">
        <div class="relative mx-auto max-w-md mb-4">
          <img
            :src="imageSrc"
            :alt="imageAlt"
            :style="imageStyle"
            class="max-w-full h-auto"
            ref="imageRef"
          />
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">宽度</label>
            <div class="flex items-center gap-2">
              <input
                type="range"
                v-model="width"
                min="50"
                max="500"
                class="flex-1"
              />
              <span class="text-sm text-gray-600 w-16">{{ width }}px</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">旋转</label>
            <div class="flex items-center gap-2">
              <input
                type="range"
                v-model="rotation"
                min="-180"
                max="180"
                class="flex-1"
              />
              <span class="text-sm text-gray-600 w-16">{{ rotation }}°</span>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">布局方式</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="layout in layouts"
              :key="layout.value"
              @click="selectedLayout = layout.value"
              :class="[
                'px-3 py-1.5 text-sm rounded transition-colors',
                selectedLayout === layout.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ layout.label }}
            </button>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="cropImage"
            class="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
          >
            <Crop class="w-4 h-4" />
            裁剪
          </button>
          <button
            @click="resetImage"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Crop } from 'lucide-vue-next'

defineProps<{
  visible: boolean
  imageSrc: string
  imageAlt: string
}>()

const emit = defineEmits<{
  close: []
  apply: [data: { width: number; rotation: number; layout: string }]
}>()

const width = ref(300)
const rotation = ref(0)
const selectedLayout = ref('inline')

const layouts = [
  { label: '行内', value: 'inline' },
  { label: '块级', value: 'block' },
  { label: '左浮动', value: 'wrap-left' },
  { label: '右浮动', value: 'wrap-right' },
]

const imageStyle = computed(() => ({
  width: `${width.value}px`,
  transform: `rotate(${rotation.value}deg)`,
}))

function cropImage() {
  emit('apply', {
    width: width.value,
    rotation: rotation.value,
    layout: selectedLayout.value,
  })
}

function resetImage() {
  width.value = 300
  rotation.value = 0
  selectedLayout.value = 'inline'
}

function applyChanges() {
  emit('apply', {
    width: width.value,
    rotation: rotation.value,
    layout: selectedLayout.value,
  })
}
</script>
