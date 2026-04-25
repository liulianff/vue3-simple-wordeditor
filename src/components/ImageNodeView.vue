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
          @mousedown.prevent
          @dragstart.prevent
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
        <button class="crop-btn reset" @click.stop="resetCrop">{{ t('imageNodeView.resetCrop') }}</button>
        <button class="crop-btn cancel" @click.stop="cancelCrop">{{ t('imageNodeView.cancel') }}</button>
        <button class="crop-btn apply" @click.stop="applyCrop">{{ t('imageNodeView.applyCrop') }}</button>
      </div>
    </div>
    <template v-else>
      <div v-if="hasCrop" class="crop-view" :style="cropViewStyle">
        <img
          :src="nodeAttrs.src"
          :alt="nodeAttrs.alt || ''"
          :style="cropImgStyle"
          draggable="false"
          ref="normalCropImageRef"
          @load="onNormalImageLoad"
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
        ref="normalImageRef"
        @load="onNormalImageLoad"
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
import { ref, computed, onBeforeUnmount } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import { useI18n } from '../composables/useI18n'
import { useImageCrop } from '../composables/useImageCrop'

const props = defineProps<{
  editor: any
  node: any
  selected: boolean
  getPos: () => number | undefined
  updateAttributes: (attrs: Record<string, any>) => void
  deleteNode: () => void
}>()

const { t } = useI18n()

const isResizing = ref(false)
const resizeStart = ref({ x: 0, y: 0, w: 0 })
const localWidth = ref(0)

const nodeAttrs = computed(() => props.node.attrs)

const {
  isCropping,
  cropImageRef,
  normalImageRef,
  normalCropImageRef,
  cropWrapRef,
  hasCrop,
  cropHandles,
  cropBoxStyle,
  maskStyle,
  cropViewStyle,
  cropImgStyle,
  onNormalImageLoad,
  initCrop,
  startCropResize,
  startCropMove,
  applyCrop,
  resetCrop,
  cancelCrop,
  enterCropMode,
} = useImageCrop(nodeAttrs, isResizing, localWidth, props.updateAttributes)

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

  if (!isCropping.value) {
    // 非裁剪模式：应用用户设置的宽度
    const w = isResizing.value ? localWidth.value : (nodeAttrs.value.width || 0)
    if (w) {
      style.width = `${w}px`
    }
    style.maxWidth = '100%'
  } else {
    // 裁剪模式：不限制宽度，让图片自然缩放（通常为容器宽度的100%）
    style.maxWidth = '100%'
  }
  
  style.verticalAlign = 'bottom'
  return style
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

defineExpose({ enterCropMode })

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.image-node-view {
  position: relative;
  display: inline-block;
  line-height: 0;
  border-radius: var(--editor-radius, 2px);
  transition: box-shadow 0.15s;
  user-select: none;
  vertical-align: bottom;
  cursor: default;
}

.image-node-view.is-selected {
  box-shadow: 0 0 0 2px var(--editor-selection-color, #4a90d9);
  border-radius: var(--editor-radius, 2px);
}

.image-node-view.has-crop {
  box-shadow: 0 0 0 1px var(--editor-selection-color, #4a90d9);
  border-radius: var(--editor-radius, 2px);
}

.image-node-view img {
  border-radius: var(--editor-radius, 2px);
}

.image-resize-handle {
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 10px;
  height: 10px;
  background: var(--editor-selection-color, #4a90d9);
  border: 2px solid var(--editor-bg-color, #fff);
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
  border-radius: var(--editor-radius, 2px);
}

.crop-mask {
  position: absolute;
  inset: 0;
  background: var(--editor-mask-color, rgba(0, 0, 0, 0.5));
  pointer-events: none;
}

.crop-box {
  position: absolute;
  border: 2px solid var(--editor-bg-color, #fff);
  outline: 1px solid var(--editor-border-color, rgba(0, 0, 0, 0.3));
  cursor: move;
  z-index: 5;
  box-sizing: border-box;
}

.crop-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--editor-bg-color, #fff);
  border: 1px solid var(--editor-border-color, #666);
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
  border-radius: var(--editor-radius, 4px);
  cursor: pointer;
  font-family: var(--editor-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
  transition: all 0.12s;
}

.crop-btn.reset {
  background: var(--editor-toolbar-bg, #f0f0f0);
  color: var(--editor-text-color, #333);
  border: 1px solid var(--editor-border-color, #d0d0d0);
}

.crop-btn.reset:hover {
  background: var(--editor-border-color, #e0e0e0);
}

.crop-btn.cancel {
  background: var(--editor-toolbar-bg, #f0f0f0);
  color: var(--editor-text-color, #333);
  border: 1px solid var(--editor-border-color, #d0d0d0);
}

.crop-btn.cancel:hover {
  background: var(--editor-border-color, #e0e0e0);
}

.crop-btn.apply {
  background: var(--editor-primary-color, #4a90d9);
  color: var(--editor-bg-color, #fff);
}

.crop-btn.apply:hover {
  background: var(--editor-primary-hover, #357abd);
}

.crop-view {
  border-radius: var(--editor-radius, 2px);
}
</style>
