<template>
  <div
    ref="rootRef"
    v-if="!inline"
    class="vue-word-editor editor-container editor-preview-only"
    :class="{ dark: isDark }"
  >
    <div class="editor-content-wrapper">
      <div class="editor-content tiptap" v-html="html"></div>
    </div>
  </div>
  <div ref="rootRef" v-else class="editor-content tiptap" :class="{ dark: isDark }" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, nextTick, watch, ref } from 'vue'

interface Props {
  html: string
  theme?: 'light' | 'dark' | 'auto'
  inline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  inline: false
})

const isDark = computed(() => {
  if (props.theme !== 'auto') return props.theme === 'dark'
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true
  }
  return false
})

const rootRef = ref<HTMLElement | null>(null)
const cropHandlers = new Map<HTMLImageElement, () => void>()

interface CropData {
  x: number
  y: number
  width: number
  height: number
}

function applyCropToImage(img: HTMLImageElement) {
  const cropRaw = img.getAttribute('data-crop')
  if (!cropRaw) return
  let crop: CropData
  try {
    crop = JSON.parse(cropRaw)
  } catch {
    return
  }
  if (!crop || (crop.width >= 100 && crop.height >= 100 && crop.x === 0 && crop.y === 0)) return

  const doCrop = () => {
    const naturalW = img.naturalWidth
    const naturalH = img.naturalHeight
    if (naturalW === 0 || naturalH === 0) return

    const displayW = img.width || img.offsetWidth || 200
    const cropNaturalW = naturalW * (crop.width / 100)
    const scaleFactor = displayW / cropNaturalW
    const displayH = naturalH * scaleFactor * (crop.height / 100)
    const imgW = naturalW * scaleFactor
    const imgH = naturalH * scaleFactor
    const offsetX = -(crop.x / 100) * imgW
    const offsetY = -(crop.y / 100) * imgH

    const wrapper = document.createElement('span')
    wrapper.style.cssText = `display:inline-block;overflow:hidden;width:${Math.round(displayW)}px;height:${Math.round(displayH)}px;line-height:0;vertical-align:bottom;border-radius:2px`
    img.style.cssText = `width:${imgW}px !important;height:${imgH}px !important;max-width:none !important;vertical-align:bottom;margin:0 !important;transform:translate(${offsetX}px,${offsetY}px)`

    img.parentNode?.insertBefore(wrapper, img)
    wrapper.appendChild(img)
    cropHandlers.delete(img)
  }

  if (img.complete && img.naturalWidth > 0) {
    doCrop()
  } else {
    const onLoad = () => doCrop()
    img.addEventListener('load', onLoad, { once: true })
    cropHandlers.set(img, onLoad)
  }
}

function applyImageCrops() {
  nextTick(() => {
    const container = rootRef.value
    if (!container) return
    container.querySelectorAll('img[data-crop]').forEach((el) => {
      applyCropToImage(el as HTMLImageElement)
    })
  })
}

function cleanupCropHandlers() {
  for (const [img, handler] of cropHandlers) {
    img.removeEventListener('load', handler)
  }
  cropHandlers.clear()
}

watch(() => props.html, () => {
  cleanupCropHandlers()
  applyImageCrops()
})

onMounted(() => {
  applyImageCrops()
})

onBeforeUnmount(() => {
  cleanupCropHandlers()
})
</script>

<style scoped>
.editor-preview-only {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--editor-bg-color, #ffffff);
  border-radius: var(--editor-radius, 0.5rem);
  border: 1px solid var(--editor-border-color, #e5e7eb);
  box-shadow: var(--editor-shadow, 0 1px 3px rgba(0,0,0,0.1));
}

.editor-preview-only.editor-container {
  padding: 0;
}
</style>
