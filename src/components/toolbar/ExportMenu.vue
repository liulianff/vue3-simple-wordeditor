<template>
  <div class="toolbar-group">
    <button
      @click="openPreview"
      :class="['editor-button']"
      @mouseenter="showTooltip($event, t('toolbar.preview'))"
      @mouseleave="hideTooltip"
    >
      <Eye class="icon" />
    </button>
    <button
      @click="toggleExportMenu"
      :class="['editor-button']"
      @mouseenter="showTooltip($event, t('toolbar.export'))"
      @mouseleave="hideTooltip"
    >
      <Download class="icon" />
    </button>
  </div>

  <Teleport to="body">
    <div
      v-if="showExportMenu"
      class="editor-popup-fixed editor-popup export-menu"
      :style="{ left: exportMenuPosition.x + 'px', top: exportMenuPosition.y + 'px' }"
      @click.stop
    >
      <div class="export-menu-content">
        <button
          v-for="opt in exportOptions"
          :key="opt.value"
          @click="handleExport(opt.value)"
          class="export-menu-item editor-btn-default"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Eye, Download } from 'lucide-vue-next'
import { useI18n } from '../../composables/useI18n'

const emit = defineEmits<{
  export: [format: string]
  openPreview: []
  closeOtherPopups: []
  showTooltip: [event: MouseEvent, text: string]
  hideTooltip: []
}>()

const { t } = useI18n()

const showExportMenu = ref(false)
const exportMenuPosition = ref({ x: 0, y: 0 })
const exportOptions = [
  { label: 'HTML', value: 'html' },
  { label: 'JSON', value: 'json' },
  { label: 'Markdown', value: 'md' },
  { label: 'PDF', value: 'pdf' },
  { label: 'Word (.docx)', value: 'docx' },
]

function openPreview() {
  emit('openPreview')
}

function toggleExportMenu(event: MouseEvent) {
  event.stopPropagation()
  emit('closeOtherPopups')
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  exportMenuPosition.value = {
    x: rect.left + rect.width / 2 - 75,
    y: rect.bottom + 8
  }
  showExportMenu.value = !showExportMenu.value
}

function handleExport(format: string) {
  emit('export', format)
  showExportMenu.value = false
}

function showTooltip(event: MouseEvent, text: string) {
  emit('showTooltip', event, text)
}

function hideTooltip() {
  emit('hideTooltip')
}

function closeMenu() {
  showExportMenu.value = false
}

defineExpose({
  closeMenu
})
</script>

<style scoped>
.export-menu {
  width: 150px;
}

.export-menu-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.export-menu-item {
  padding: 0.5rem;
  text-align: left;
  border: none;
  background: transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--editor-text-color, #1f2937);
}

.export-menu-item:hover {
  background-color: var(--editor-border-color, #e5e7eb);
}
</style>
