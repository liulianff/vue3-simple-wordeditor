<template>
  <node-view-wrapper class="image-node-view" :class="{
    'is-selected': selected,
    'is-cropping': isCropping,
    'has-crop': hasCrop,
    [`layout-${nodeAttrs.layout || 'inline'}`]: true
  }" :style="nodeStyle" :draggable="isCropping ? false : true" @dragstart.prevent>
    <div v-if="isCropping" class="crop-wrapper" contenteditable="false" @mousedown.stop @dragstart.prevent>
      <div class="crop-image-wrap" ref="cropWrapRef">
        <img
          :src="nodeAttrs.src"
          :alt="nodeAttrs.alt || ''"
          :style="imgStyle"
          class="crop-image"
          draggable="false"
          ref="cropImageRef"
          @load="initCrop"
        />
        <div class="crop-mask" :style="maskStyle"></div>
        <div class="crop-box" :style="cropBoxStyle" @mousedown.stop="startCropMove" @dragstart.prevent>
          <div
            v-for="(handle, i) in cropHandles"
            :key="i"
            class="crop-handle"
            :class="'handle-' + handle"
            @mousedown.stop="startCropResize($event, handle)"
          ></div>
        </div>
      </div>
      <div class="crop-toolbar">
        <button class="crop-btn reset" @click.stop="resetCrop">重置裁剪</button>
        <button class="crop-btn cancel" @click.stop="cancelCrop">取消</button>
        <button class="crop-btn apply" @click.stop="applyCrop">确认裁剪</button>
      </div>
    </div>
    <template v-else>
      <div v-if="hasCrop" class="crop-view" :style="cropViewStyle">
        <img
          :src="nodeAttrs.src"
          :alt="nodeAttrs.alt || ''"
          :style="cropImgStyle"
          draggable="false"
          @dragstart.prevent
          @dblclick.stop="enterCropMode"
        />
      </div>
      <img
        v-else
        :src="nodeAttrs.src"
        :alt="nodeAttrs.alt || ''"
        :width="nodeAttrs.width || undefined"
        :style="imgStyle"
        draggable="false"
        @dragstart.prevent
        @dblclick.stop="enterCropMode"
      />
      <span
        v-if="selected"
        class="image-resize-handle"
        contenteditable="false"
        @mousedown.stop="startResize"
        @dragstart.prevent
      ></span>
    </template>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { CropData } from '../types/editor'

const props = defineProps<{
  editor: any
  node: any
  selected: boolean
  getPos: () => number | undefined
  updateAttributes: (attrs: Record<string, any>) => void
  deleteNode: () => void
}>()

const isResizing = ref(false)
const resizeStart = ref({ x: 0, y: 0, w: 0 })
const localWidth = ref(0)

const nodeAttrs = computed(() => props.node.attrs)

const hasCrop = computed(() => {
  return nodeAttrs.value.crop && nodeAttrs.value.crop.width < 100
})

const nodeStyle = computed(() => {
  const style: Record<string, string> = {}
  const a = nodeAttrs.value
  if (a.layout === 'wrap-left') {
    style.cssFloat = 'left'
    style.marginRight = `${a.marginRight ?? 16}px`
    style.marginBottom = `${a.marginBottom ?? 8}px`
  } else if (a.layout === 'wrap-right') {
    style.cssFloat = 'right'
    style.marginLeft = `${a.marginLeft ?? 16}px`
    style.marginBottom = `${a.marginBottom ?? 8}px`
  } else if (a.layout === 'block') {
    style.display = 'inline-block'
  }
  return style
})

const imgStyle = computed(() => {
  const style: Record<string, string> = {}
  const w = isResizing.value ? localWidth.value : (nodeAttrs.value.width || 0)
  if (w) {
    style.width = `${w}px`
  }
  style.maxWidth = '100%'
  style.verticalAlign = 'bottom'
  return style
})

const cropViewStyle = computed(() => {
  const a = nodeAttrs.value
  const c = a.crop as CropData | null
  if (!c) return {}
  const displayW = isResizing.value ? localWidth.value : (a.width || 200)
  const w = displayW * (c.width / 100)
  const h = w * (c.height / c.width)
  return {
    width: `${Math.round(w)}px`,
    height: `${Math.round(h)}px`,
    overflow: 'hidden',
    position: 'relative' as const,
    lineHeight: 0,
  }
})

const cropImgStyle = computed(() => {
  const a = nodeAttrs.value
  const c = a.crop as CropData | null
  if (!c) return {}
  const displayW = isResizing.value ? localWidth.value : (a.width || 200)
  const fullW = displayW
  const fullH = fullW
  const offsetX = -(c.x / 100) * fullW
  const offsetY = -(c.y / 100) * fullH
  return {
    width: `${fullW}px`,
    maxWidth: 'none',
    verticalAlign: 'bottom',
    transform: `translate(${offsetX}px, ${offsetY}px)`,
  }
})

function startResize(e: MouseEvent) {
  e.preventDefault()
  isResizing.value = true
  const startW = nodeAttrs.value.width || 200
  localWidth.value = startW
  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    w: startW,
  }
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

function onResize(e: MouseEvent) {
  if (!isResizing.value) return
  const dx = e.clientX - resizeStart.value.x
  const newWidth = Math.max(30, Math.min(800, resizeStart.value.w + dx))
  localWidth.value = Math.round(newWidth)
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  props.updateAttributes({ width: localWidth.value })
}

const isCropping = ref(false)
const cropImageRef = ref<HTMLImageElement | null>(null)
const cropWrapRef = ref<HTMLElement | null>(null)
const cropRect = ref({ x: 0, y: 0, w: 100, h: 100 })
const imageNaturalSize = ref({ w: 0, h: 0 })
const cropDisplaySize = ref({ w: 0, h: 0 })
const cropDragStart = ref({ x: 0, y: 0, rx: 0, ry: 0, rw: 0, rh: 0 })
const activeHandle = ref<string | null>(null)
const isMoving = ref(false)
const moveStart = ref({ x: 0, y: 0, rx: 0, ry: 0 })

const cropHandles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

const cropBoxStyle = computed(() => ({
  left: `${cropRect.value.x}px`,
  top: `${cropRect.value.y}px`,
  width: `${cropRect.value.w}px`,
  height: `${cropRect.value.h}px`,
}))

const maskStyle = computed(() => {
  const r = cropRect.value
  return {
    clipPath: `polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% 100%,
      0% 0%,
      ${r.x}px ${r.y}px,
      ${r.x}px ${r.y + r.h}px,
      ${r.x + r.w}px ${r.y + r.h}px,
      ${r.x + r.w}px ${r.y}px,
      ${r.x}px ${r.y}px
    )`,
  }
})

function initCrop() {
  const img = cropImageRef.value
  if (!img) return
  imageNaturalSize.value = { w: img.naturalWidth, h: img.naturalHeight }
  cropDisplaySize.value = { w: img.offsetWidth, h: img.offsetHeight }
  const dw = img.offsetWidth
  const dh = img.offsetHeight

  const existingCrop = nodeAttrs.value.crop as CropData | null
  if (existingCrop) {
    cropRect.value = {
      x: Math.round((existingCrop.x / 100) * dw),
      y: Math.round((existingCrop.y / 100) * dh),
      w: Math.round((existingCrop.width / 100) * dw),
      h: Math.round((existingCrop.height / 100) * dh),
    }
  } else {
    cropRect.value = { x: 0, y: 0, w: dw, h: dh }
  }
}

function startCropResize(e: MouseEvent, handle: string) {
  activeHandle.value = handle
  cropDragStart.value = {
    x: e.clientX,
    y: e.clientY,
    rx: cropRect.value.x,
    ry: cropRect.value.y,
    rw: cropRect.value.w,
    rh: cropRect.value.h,
  }
  document.addEventListener('mousemove', onCropResize)
  document.addEventListener('mouseup', stopCropResize)
}

function onCropResize(e: MouseEvent) {
  const dx = e.clientX - cropDragStart.value.x
  const dy = e.clientY - cropDragStart.value.y
  const dw = cropDisplaySize.value.w
  const dh = cropDisplaySize.value.h
  const r = cropDragStart.value
  let x = r.rx, y = r.ry, w = r.rw, h = r.rh
  const handle = activeHandle.value

  if (!handle) return

  if (handle.includes('e')) {
    w = Math.max(10, Math.min(dw - x, r.rw + dx))
  }
  if (handle.includes('w')) {
    const maxW = x + r.rw
    const newW = Math.max(10, Math.min(maxW, r.rw - dx))
    x = maxW - newW
    w = newW
  }
  if (handle.includes('s')) {
    h = Math.max(10, Math.min(dh - y, r.rh + dy))
  }
  if (handle.includes('n')) {
    const maxH = y + r.rh
    const newH = Math.max(10, Math.min(maxH, r.rh - dy))
    y = maxH - newH
    h = newH
  }

  cropRect.value = { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) }
}

function stopCropResize() {
  activeHandle.value = null
  document.removeEventListener('mousemove', onCropResize)
  document.removeEventListener('mouseup', stopCropResize)
}

function startCropMove(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('crop-handle')) return
  isMoving.value = true
  moveStart.value = {
    x: e.clientX,
    y: e.clientY,
    rx: cropRect.value.x,
    ry: cropRect.value.y,
  }
  document.addEventListener('mousemove', onCropMove)
  document.addEventListener('mouseup', stopCropMove)
}

function onCropMove(e: MouseEvent) {
  if (!isMoving.value) return
  const dx = e.clientX - moveStart.value.x
  const dy = e.clientY - moveStart.value.y
  const dw = cropDisplaySize.value.w
  const dh = cropDisplaySize.value.h
  const rw = cropRect.value.w
  const rh = cropRect.value.h
  let x = moveStart.value.rx + dx
  let y = moveStart.value.ry + dy
  x = Math.max(0, Math.min(dw - rw, x))
  y = Math.max(0, Math.min(dh - rh, y))
  cropRect.value = { ...cropRect.value, x: Math.round(x), y: Math.round(y) }
}

function stopCropMove() {
  isMoving.value = false
  document.removeEventListener('mousemove', onCropMove)
  document.removeEventListener('mouseup', stopCropMove)
}

function applyCrop() {
  const dw = cropDisplaySize.value.w
  const dh = cropDisplaySize.value.h
  if (dw === 0 || dh === 0) return

  const crop: CropData = {
    x: Math.round((cropRect.value.x / dw) * 10000) / 100,
    y: Math.round((cropRect.value.y / dh) * 10000) / 100,
    width: Math.round((cropRect.value.w / dw) * 10000) / 100,
    height: Math.round((cropRect.value.h / dh) * 10000) / 100,
  }

  props.updateAttributes({ crop })
  isCropping.value = false
  document.removeEventListener('mousedown', onOutsideClick)
}

function resetCrop() {
  const dw = cropDisplaySize.value.w
  const dh = cropDisplaySize.value.h
  cropRect.value = { x: 0, y: 0, w: dw, h: dh }
}

function cancelCrop() {
  isCropping.value = false
  document.removeEventListener('mousedown', onOutsideClick)
}

function enterCropMode() {
  isCropping.value = true
  nextTick(() => {
    initCrop()
    document.addEventListener('mousedown', onOutsideClick)
  })
}

function onOutsideClick() {
  if (!isCropping.value) return
  applyCrop()
}

defineExpose({ enterCropMode })

onMounted(() => {
  window.addEventListener('image-start-crop', onCropEvent)
})

function onCropEvent() {
  enterCropMode()
}

onBeforeUnmount(() => {
  window.removeEventListener('image-start-crop', onCropEvent)
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('mousemove', onCropResize)
  document.removeEventListener('mouseup', stopCropResize)
  document.removeEventListener('mousemove', onCropMove)
  document.removeEventListener('mouseup', stopCropMove)
  document.removeEventListener('mousedown', onOutsideClick)
})
</script>

<style scoped>
.image-node-view {
  position: relative;
  display: inline-block;
  line-height: 0;
  border-radius: 2px;
  transition: box-shadow 0.15s;
  user-select: none;
  vertical-align: bottom;
  cursor: default;
}

.image-node-view.is-selected {
  box-shadow: 0 0 0 2px var(--editor-selection-color, #4a90d9);
  border-radius: 2px;
}

.image-node-view.has-crop {
  box-shadow: 0 0 0 1px var(--editor-selection-color, #4a90d9);
  border-radius: 2px;
}

.image-node-view img {
  border-radius: 2px;
}

.image-resize-handle {
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 10px;
  height: 10px;
  background: var(--editor-selection-color, #4a90d9);
  border: 2px solid #fff;
  border-radius: 1px;
  cursor: se-resize;
  z-index: 10;
  box-shadow: var(--editor-shadow, 0 1px 3px rgba(0,0,0,0.3));
}

.crop-wrapper {
  position: relative;
  display: inline-block;
}

.crop-image-wrap {
  position: relative;
  display: inline-block;
  line-height: 0;
}

.crop-image {
  display: block;
  max-width: 100%;
  border-radius: 2px;
}

.crop-mask {
  position: absolute;
  inset: 0;
  background: var(--editor-mask-color, rgba(0, 0, 0, 0.5));
  pointer-events: none;
}

.crop-box {
  position: absolute;
  border: 2px solid #fff;
  outline: 1px solid rgba(0, 0, 0, 0.3);
  cursor: move;
  z-index: 5;
  box-sizing: border-box;
}

.crop-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #fff;
  border: 1px solid #666;
  z-index: 6;
  box-sizing: border-box;
}

.crop-handle.handle-nw { top: -5px; left: -5px; cursor: nw-resize; }
.crop-handle.handle-n { top: -5px; left: 50%; margin-left: -5px; cursor: n-resize; }
.crop-handle.handle-ne { top: -5px; right: -5px; cursor: ne-resize; }
.crop-handle.handle-e { top: 50%; right: -5px; margin-top: -5px; cursor: e-resize; }
.crop-handle.handle-se { bottom: -5px; right: -5px; cursor: se-resize; }
.crop-handle.handle-s { bottom: -5px; left: 50%; margin-left: -5px; cursor: s-resize; }
.crop-handle.handle-sw { bottom: -5px; left: -5px; cursor: sw-resize; }
.crop-handle.handle-w { top: 50%; left: -5px; margin-top: -5px; cursor: w-resize; }

.crop-toolbar {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  line-height: 1;
}

.crop-btn {
  padding: 5px 16px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  transition: all 0.12s;
}

.crop-btn.reset {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #d0d0d0;
}

.crop-btn.reset:hover {
  background: #e0e0e0;
}

.crop-btn.cancel {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #d0d0d0;
}

.crop-btn.cancel:hover {
  background: #e0e0e0;
}

.crop-btn.apply {
  background: #4a90d9;
  color: #fff;
}

.crop-btn.apply:hover {
  background: #357abd;
}

.crop-view {
  border-radius: 2px;
}
</style>
