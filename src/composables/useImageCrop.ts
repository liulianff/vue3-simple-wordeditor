import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import type { CropData } from '../types/editor'

export function useImageCrop(
  nodeAttrs: { value: { src: string; width?: number; crop?: CropData | null } },
  isResizing: { value: boolean },
  localWidth: { value: number },
  updateAttributes: (attrs: Record<string, any>) => void,
) {
  const isCropping = ref(false)
  const cropImageRef = ref<HTMLImageElement | null>(null)
  const normalImageRef = ref<HTMLImageElement | null>(null)
  const normalCropImageRef = ref<HTMLImageElement | null>(null)
  const cropWrapRef = ref<HTMLElement | null>(null)
  const cropRect = ref({ x: 0, y: 0, w: 100, h: 100 })
  const imageNaturalSize = ref({ w: 0, h: 0 })
  const cropDisplaySize = ref({ w: 0, h: 0 })
  const persistentNaturalSize = ref({ w: 0, h: 0 })
  const cropDragStart = ref({ x: 0, y: 0, rx: 0, ry: 0, rw: 0, rh: 0 })
  const activeHandle = ref<string | null>(null)
  const isMoving = ref(false)
  const moveStart = ref({ x: 0, y: 0, rx: 0, ry: 0 })
  const offscreenImg = ref<HTMLImageElement | null>(null)

  const hasCrop = computed(() => {
    const c = nodeAttrs.value.crop
    return c && (c.width < 100 || c.height < 100 || c.x > 0 || c.y > 0)
  })

  function onNormalImageLoad(e: Event) {
    const img = e.target as HTMLImageElement
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      persistentNaturalSize.value = { w: img.naturalWidth, h: img.naturalHeight }
    }
  }

  function loadNaturalSize() {
    if (offscreenImg.value) return
    const img = new Image()
    img.onload = () => {
      persistentNaturalSize.value = { w: img.naturalWidth, h: img.naturalHeight }
    }
    img.onerror = () => {
      console.warn('Failed to load image for size detection')
    }
    img.src = nodeAttrs.value.src
    offscreenImg.value = img
  }

  loadNaturalSize()

  watch(() => nodeAttrs.value.src, () => {
    offscreenImg.value = null
    loadNaturalSize()
  }, { immediate: true })

  const cropHandles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

  function getClientXY(e: MouseEvent | TouchEvent): { clientX: number; clientY: number } {
    if ('touches' in e) {
      const touch = e.touches[0] || (e as TouchEvent).changedTouches[0]
      return { clientX: touch.clientX, clientY: touch.clientY }
    }
    return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY }
  }

  let rafId: number | null = null
  function scheduleUpdate(fn: () => void) {
    if (rafId !== null) return
    rafId = requestAnimationFrame(() => {
      rafId = null
      fn()
    })
  }

  function cancelScheduledUpdate() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  function startCropResize(e: MouseEvent | TouchEvent, handle: string) {
    e.preventDefault()
    e.stopPropagation()
    activeHandle.value = handle
    const { clientX, clientY } = getClientXY(e)
    cropDragStart.value = {
      x: clientX,
      y: clientY,
      rx: cropRect.value.x,
      ry: cropRect.value.y,
      rw: cropRect.value.w,
      rh: cropRect.value.h,
    }
    document.addEventListener('mousemove', onCropResize)
    document.addEventListener('mouseup', stopCropResize)
    document.addEventListener('touchmove', onCropResize, { passive: false })
    document.addEventListener('touchend', stopCropResize)
  }

  function onCropResize(e: MouseEvent | TouchEvent) {
    e.preventDefault()
    e.stopPropagation()
    scheduleUpdate(() => {
      const { clientX, clientY } = getClientXY(e)
      const dx = clientX - cropDragStart.value.x
      const dy = clientY - cropDragStart.value.y
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
    })
  }

  function stopCropResize() {
    cancelScheduledUpdate()
    activeHandle.value = null
    document.removeEventListener('mousemove', onCropResize)
    document.removeEventListener('mouseup', stopCropResize)
    document.removeEventListener('touchmove', onCropResize)
    document.removeEventListener('touchend', stopCropResize)
  }

  function startCropMove(e: MouseEvent | TouchEvent) {
    const target = e.target as HTMLElement
    if (target.classList.contains('crop-handle')) return
    e.preventDefault()
    e.stopPropagation()
    isMoving.value = true
    const { clientX, clientY } = getClientXY(e)
    moveStart.value = {
      x: clientX,
      y: clientY,
      rx: cropRect.value.x,
      ry: cropRect.value.y,
    }
    document.addEventListener('mousemove', onCropMove)
    document.addEventListener('mouseup', stopCropMove)
    document.addEventListener('touchmove', onCropMove, { passive: false })
    document.addEventListener('touchend', stopCropMove)
  }

  function onCropMove(e: MouseEvent | TouchEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!isMoving.value) return
    scheduleUpdate(() => {
      const { clientX, clientY } = getClientXY(e)
      const dx = clientX - moveStart.value.x
      const dy = clientY - moveStart.value.y
      const dw = cropDisplaySize.value.w
      const dh = cropDisplaySize.value.h
      const rw = cropRect.value.w
      const rh = cropRect.value.h
      let x = moveStart.value.rx + dx
      let y = moveStart.value.ry + dy
      x = Math.max(0, Math.min(dw - rw, x))
      y = Math.max(0, Math.min(dh - rh, y))
      cropRect.value = { ...cropRect.value, x: Math.round(x), y: Math.round(y) }
    })
  }

  function stopCropMove() {
    cancelScheduledUpdate()
    isMoving.value = false
    document.removeEventListener('mousemove', onCropMove)
    document.removeEventListener('mouseup', stopCropMove)
    document.removeEventListener('touchmove', onCropMove)
    document.removeEventListener('touchend', stopCropMove)
  }

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

  function getCropScaleFactor(displayW: number): { scaleFactor: number; imgWidth: number; imgHeight: number } {
    let scaleFactor = 1
    let imgWidth = 1000
    let imgHeight = 1000
    const c = nodeAttrs.value.crop as CropData | null

    if (persistentNaturalSize.value.w > 0 && persistentNaturalSize.value.h > 0) {
      imgWidth = persistentNaturalSize.value.w
      imgHeight = persistentNaturalSize.value.h
      if (c) {
        const cropWidth = imgWidth * (c.width / 100)
        scaleFactor = displayW / cropWidth
      } else {
        scaleFactor = displayW / imgWidth
      }
    } else if (c) {
      scaleFactor = 1
    }

    return { scaleFactor, imgWidth, imgHeight }
  }

  const cropViewStyle = computed(() => {
    const c = nodeAttrs.value.crop as CropData | null
    if (!c) return {}
    const displayW = isResizing.value ? localWidth.value : (nodeAttrs.value.width || 200)
    const { scaleFactor, imgHeight } = getCropScaleFactor(displayW)
    const displayH = imgHeight * scaleFactor * (c.height / 100)
    return {
      width: `${Math.round(displayW)}px`,
      height: `${Math.round(displayH)}px`,
      overflow: 'hidden',
      position: 'relative' as const,
      lineHeight: 0,
    }
  })

  const cropImgStyle = computed(() => {
    const c = nodeAttrs.value.crop as CropData | null
    if (!c) return {}
    const displayW = isResizing.value ? localWidth.value : (nodeAttrs.value.width || 200)
    const { scaleFactor, imgWidth, imgHeight } = getCropScaleFactor(displayW)
    const offsetX = -(c.x / 100) * imgWidth * scaleFactor
    const offsetY = -(c.y / 100) * imgHeight * scaleFactor
    return {
      width: `${imgWidth * scaleFactor}px`,
      height: `${imgHeight * scaleFactor}px`,
      maxWidth: 'none',
      verticalAlign: 'bottom',
      transform: `translate(${offsetX}px, ${offsetY}px)`,
    }
  })

  function initCrop() {
    const img = cropImageRef.value
    if (!img) return
    imageNaturalSize.value = { w: img.naturalWidth, h: img.naturalHeight }
    persistentNaturalSize.value = { w: img.naturalWidth, h: img.naturalHeight }
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

    updateAttributes({ crop, width: cropRect.value.w })
    isCropping.value = false
    document.removeEventListener('mousedown', onOutsideClick)
    document.removeEventListener('touchstart', onOutsideClick)

    nextTick(() => {
      offscreenImg.value = null
      loadNaturalSize()
    })
  }

  function resetCrop() {
    const img = cropImageRef.value
    const dw = cropDisplaySize.value.w || (img ? img.offsetWidth : 0)
    const dh = cropDisplaySize.value.h || (img ? img.offsetHeight : 0)
    if (dw === 0 || dh === 0) return
    cropRect.value = { x: 0, y: 0, w: dw, h: dh }
  }

  function cancelCrop() {
    isCropping.value = false
    document.removeEventListener('mousedown', onOutsideClick)
    document.removeEventListener('touchstart', onOutsideClick)
  }

  function enterCropMode() {
    isCropping.value = true
    nextTick(() => {
      initCrop()
      document.addEventListener('mousedown', onOutsideClick)
      document.addEventListener('touchstart', onOutsideClick)
    })
  }

  watch(isCropping, (val) => {
    window.dispatchEvent(new CustomEvent('image-crop-state-changed', { detail: { isCropping: val } }))
  })

  function onOutsideClick(e: MouseEvent | TouchEvent) {
    if (!isCropping.value) return
    const target = e.target as HTMLElement
    if (target.closest('.bubble-menu') || target.closest('.crop-wrapper')) return
    applyCrop()
  }

  function onCropEvent() {
    enterCropMode()
  }

  function onCropApplyEvent() { applyCrop() }
  function onCropCancelEvent() { cancelCrop() }
  function onCropResetEvent() { resetCrop() }

  onMounted(() => {
    window.addEventListener('image-start-crop', onCropEvent)
    window.addEventListener('image-crop-apply', onCropApplyEvent)
    window.addEventListener('image-crop-cancel', onCropCancelEvent)
    window.addEventListener('image-crop-reset', onCropResetEvent)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('image-start-crop', onCropEvent)
    window.removeEventListener('image-crop-apply', onCropApplyEvent)
    window.removeEventListener('image-crop-cancel', onCropCancelEvent)
    window.removeEventListener('image-crop-reset', onCropResetEvent)
    document.removeEventListener('mousemove', onCropResize)
    document.removeEventListener('mouseup', stopCropResize)
    document.removeEventListener('touchmove', onCropResize)
    document.removeEventListener('touchend', stopCropResize)
    document.removeEventListener('mousemove', onCropMove)
    document.removeEventListener('mouseup', stopCropMove)
    document.removeEventListener('touchmove', onCropMove)
    document.removeEventListener('touchend', stopCropMove)
    document.removeEventListener('mousedown', onOutsideClick)
    document.removeEventListener('touchstart', onOutsideClick)
    cancelScheduledUpdate()
  })

  return {
    isCropping,
    cropImageRef,
    normalImageRef,
    normalCropImageRef,
    cropWrapRef,
    cropRect,
    cropDisplaySize,
    persistentNaturalSize,
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
  }
}
