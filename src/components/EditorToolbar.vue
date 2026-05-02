<template>
  <div ref="toolbarRef" class="editor-toolbar">
    <div class="editor-toolbar-wrapper">
      <TextFormatButtons
        :editor="editor"
        :is-bold="isBold"
        :is-italic="isItalic"
        :is-underline="isUnderline"
        :is-strike="isStrike"
        @show-tooltip="showTooltip"
        @hide-tooltip="hideTooltip"
      />

      <div class="editor-divider"></div>

      <FontSelector
        :current-font-family="currentFontFamily"
        :current-font-size="currentFontSize"
        @set-font-size="onFontSizeChange"
        @set-font-family="onFontFamilyChange"
      />

      <div class="editor-divider"></div>

      <HeadingSelector
        :current-heading-level="currentHeadingLevel"
        @set-heading="onHeadingChange"
      />

      <div class="editor-divider"></div>

      <ListButtons
        :editor="editor"
        :is-bullet-list="isBulletList"
        :is-ordered-list="isOrderedList"
        :is-blockquote="isBlockquote"
        @show-tooltip="showTooltip"
        @hide-tooltip="hideTooltip"
      />

      <div class="editor-divider"></div>

      <AlignmentButtons
        :editor="editor"
        :alignment="alignment"
        @show-tooltip="showTooltip"
        @hide-tooltip="hideTooltip"
      />

      <div class="editor-divider"></div>

      <LinkButtons
        :editor="editor"
        :is-link="isLink"
        @insert-image="insertImage"
        @set-link="setLink"
        @show-tooltip="showTooltip"
        @hide-tooltip="hideTooltip"
      />

      <TableGridPicker
        :is-in-table="isInTable"
        @insert-table="onGridCellClick"
      />

      <div class="editor-divider"></div>

      <ColorPicker
        ref="colorPickerRef"
        :editor="editor"
        @close-other-popups="closeOtherPopups"
        @show-tooltip="showTooltip"
        @hide-tooltip="hideTooltip"
      />

      <div class="editor-divider"></div>

      <ExportMenu
        ref="exportMenuRef"
        @export="handleExport"
        @open-preview="openPreview"
        @close-other-popups="closeOtherPopups"
        @show-tooltip="showTooltip"
        @hide-tooltip="hideTooltip"
      />
    </div>

    <ToolbarTooltip ref="tooltipRef" />

    <TableMenu
      :show-table-menu="showTableMenu"
      :table-menu-position="tableMenuPosition"
      :is-in-table="isInTable"
      @insert-table="handleInsertTable"
      @add-column-before="onTableAction('addColumnBefore')"
      @add-column-after="onTableAction('addColumnAfter')"
      @delete-column="onTableAction('deleteColumn')"
      @add-row-before="onTableAction('addRowBefore')"
      @add-row-after="onTableAction('addRowAfter')"
      @delete-row="onTableAction('deleteRow')"
      @delete-table="onTableAction('deleteTable')"
      @merge-cells="onTableAction('mergeCells')"
      @split-cell="onTableAction('splitCell')"
      @toggle-header-column="onTableAction('toggleHeaderColumn')"
      @toggle-header-row="onTableAction('toggleHeaderRow')"
      @close-menu="closeTableMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TextFormatButtons from './toolbar/TextFormatButtons.vue'
import FontSelector from './toolbar/FontSelector.vue'
import HeadingSelector from './toolbar/HeadingSelector.vue'
import ListButtons from './toolbar/ListButtons.vue'
import AlignmentButtons from './toolbar/AlignmentButtons.vue'
import LinkButtons from './toolbar/LinkButtons.vue'
import ColorPicker from './toolbar/ColorPicker.vue'
import TableMenu from './toolbar/TableMenu.vue'
import TableGridPicker from './toolbar/TableGridPicker.vue'
import ExportMenu from './toolbar/ExportMenu.vue'
import ToolbarTooltip from './toolbar/ToolbarTooltip.vue'

const props = withDefaults(defineProps<{
  editor: any
  isDark: boolean
  currentFontSize?: string
  currentFontFamily?: string
  headingLevel?: number
  isInTable?: boolean
  isBold?: boolean
  isItalic?: boolean
  isUnderline?: boolean
  isStrike?: boolean
  isBulletList?: boolean
  isOrderedList?: boolean
  isBlockquote?: boolean
  isLink?: boolean
  alignment?: string
}>(), {
  isInTable: false,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrike: false,
  isBulletList: false,
  isOrderedList: false,
  isBlockquote: false,
  isLink: false,
  alignment: 'left',
})

const emit = defineEmits<{
  export: [format: string]
  insertImage: []
  setLink: [url: string]
  openPreview: []
  setFontSize: [size: string]
  setFontFamily: [family: string]
  setHeading: [level: number]
  insertTable: [rows?: number, cols?: number]
  addColumnBefore: []
  addColumnAfter: []
  deleteColumn: []
  addRowBefore: []
  addRowAfter: []
  deleteRow: []
  deleteTable: []
  mergeCells: []
  splitCell: []
  toggleHeaderColumn: []
  toggleHeaderRow: []
}>()

const currentFontSize = computed(() => props.currentFontSize ?? '16')
const currentFontFamily = computed(() => props.currentFontFamily ?? 'sans-serif')
const currentHeadingLevel = computed(() => props.headingLevel ?? 0)

const tooltipRef = ref<InstanceType<typeof ToolbarTooltip> | null>(null)
const colorPickerRef = ref<InstanceType<typeof ColorPicker> | null>(null)
const exportMenuRef = ref<InstanceType<typeof ExportMenu> | null>(null)
const toolbarRef = ref<HTMLElement | null>(null)

const showTableMenu = ref(false)
const tableMenuPosition = ref({ x: 0, y: 0 })

function showTooltip(event: MouseEvent, text: string) {
  const target = event.currentTarget as HTMLElement
  if (!target || !toolbarRef.value) return
  const targetRect = target.getBoundingClientRect()
  const toolbarRect = toolbarRef.value.getBoundingClientRect()

  const x = targetRect.left + targetRect.width / 2 - toolbarRect.left
  const tooltipHeight = 28
  const spaceAbove = targetRect.top - toolbarRect.top
  const showAbove = spaceAbove >= tooltipHeight + 8

  const y = showAbove
    ? targetRect.top - toolbarRect.top - 4
    : targetRect.bottom - toolbarRect.top + 8

  tooltipRef.value?.showTooltip(x, y, text, showAbove)
}

function hideTooltip() {
  tooltipRef.value?.hideTooltip()
}

function onFontSizeChange(size: string) {
  emit('setFontSize', size)
}

function onFontFamilyChange(family: string) {
  emit('setFontFamily', family)
}

function onHeadingChange(level: number) {
  emit('setHeading', level)
}

function insertImage() {
  emit('insertImage')
}

function setLink(url: string) {
  emit('setLink', url)
}

function openPreview() {
  emit('openPreview')
}

function handleExport(format: string) {
  emit('export', format)
}

function handleInsertTable() {
  emit('insertTable')
  showTableMenu.value = false
}

function onTableAction(action: string) {
  return () => {
    emit(action as any)
    showTableMenu.value = false
  }
}

function closeTableMenu() {
  showTableMenu.value = false
}

function closeOtherPopups() {
  colorPickerRef.value?.closeAllPickers()
  exportMenuRef.value?.closeMenu()
  showTableMenu.value = false
}

function onGridCellClick(row: number, col: number) {
  emit('insertTable', row, col)
}

function handleDocumentClick() {
  showTableMenu.value = false
  closeOtherPopups()
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.editor-toolbar {
  position: relative;
  overflow: visible;
  background-color: var(--editor-toolbar-bg, #f9fafb);
  padding: 0.5rem;
}

.editor-toolbar-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.editor-divider {
  width: 1px;
  height: 1.25rem;
  background-color: var(--editor-border-color, #e5e7eb);
  margin: 0 0.25rem;
}
</style>
