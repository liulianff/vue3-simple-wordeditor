<template>
  <div
    v-if="tooltip.visible"
    class="editor-tooltip-fixed editor-tooltip"
    :style="{
      left: tooltip.x + 'px',
      top: tooltip.y + 'px',
      transform: tooltip.above ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
    }"
  >
    {{ tooltip.text }}
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const tooltip = ref({ visible: false, text: '', x: 0, y: 0, above: true })
let tooltipTimer: ReturnType<typeof setTimeout> | null = null

function showTooltip(event: MouseEvent, text: string) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  if (tooltipTimer) clearTimeout(tooltipTimer)
  const tooltipHeight = 28
  const spaceAbove = rect.top
  const showAbove = spaceAbove >= tooltipHeight + 8

  tooltipTimer = setTimeout(() => {
    tooltip.value = {
      visible: true,
      text,
      x: rect.left + rect.width / 2,
      y: showAbove ? rect.top : rect.bottom + 8,
      above: showAbove
    }
  }, 500)
}

function hideTooltip() {
  if (tooltipTimer) clearTimeout(tooltipTimer)
  tooltip.value = { ...tooltip.value, visible: false }
}

onUnmounted(() => {
  if (tooltipTimer) clearTimeout(tooltipTimer)
})

defineExpose({
  showTooltip,
  hideTooltip
})
</script>

<style scoped>
.editor-tooltip-fixed {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
}

.editor-tooltip {
  background-color: var(--editor-tooltip-bg, #1f2937);
  color: var(--editor-tooltip-color, #ffffff);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
}
</style>
