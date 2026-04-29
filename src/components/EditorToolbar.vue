<template>
  <div class="editor-toolbar">
    <div class="editor-toolbar-wrapper">
        <button
          @click="toggleBold"
          :class="['editor-button', { active: isBold }]"
          @mouseenter="showTooltip($event, t('toolbar.bold'))"
          @mouseleave="hideTooltip"
        >
          <Bold class="icon" />
        </button>
        <button
          @click="toggleItalic"
          :class="['editor-button', { active: isItalic }]"
          @mouseenter="showTooltip($event, t('toolbar.italic'))"
          @mouseleave="hideTooltip"
        >
          <Italic class="icon" />
        </button>
        <button
          @click="toggleUnderline"
          :class="['editor-button', { active: isUnderline }]"
          @mouseenter="showTooltip($event, t('toolbar.underline'))"
          @mouseleave="hideTooltip"
        >
          <Underline class="icon" />
        </button>
        <button
          @click="toggleStrike"
          :class="['editor-button', { active: isStrike }]"
          @mouseenter="showTooltip($event, t('toolbar.strike'))"
          @mouseleave="hideTooltip"
        >
          <Strikethrough class="icon" />
        </button>
        <div class="editor-divider"></div>
        <select
          :value="currentFontFamily"
          @change="onFontFamilyChange"
          class="editor-select"
          style="min-width: 100px;"
        >
          <option value="none">{{ t('toolbar.fontFamily.none') }}</option>
          <option value="sans-serif">{{ t('toolbar.fontFamily.sansSerif') }}</option>
          <option value="serif">{{ t('toolbar.fontFamily.serif') }}</option>
          <option value="monospace">{{ t('toolbar.fontFamily.monospace') }}</option>
          <option value="Microsoft+YaHei">{{ t('toolbar.fontFamily.microsoftYaHei') }}</option>
          <option value="SimSun">{{ t('toolbar.fontFamily.simSun') }}</option>
          <option value="SimHei">{{ t('toolbar.fontFamily.simHei') }}</option>
          <option value="KaiTi">{{ t('toolbar.fontFamily.kaiTi') }}</option>
        </select>
        <select
          :value="currentFontSize"
          @change="onFontSizeChange"
          class="editor-select"
          style="min-width: 60px;"
        >
          <option value="none">{{ t('toolbar.fontSizeNone') }}</option>
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
          <option value="20">20px</option>
          <option value="24">24px</option>
          <option value="28">28px</option>
          <option value="32">32px</option>
          <option value="36">36px</option>
          <option value="48">48px</option>
        </select>
        <div class="editor-divider"></div>
        <select
          :value="currentHeadingLevel"
          @change="onHeadingChange"
          class="editor-select"
          style="min-width: 90px;"
        >
          <option value="0">{{ t('toolbar.heading.paragraph') }}</option>
          <option value="1">{{ t('toolbar.heading.h1') }}</option>
          <option value="2">{{ t('toolbar.heading.h2') }}</option>
          <option value="3">{{ t('toolbar.heading.h3') }}</option>
          <option value="4">{{ t('toolbar.heading.h4') }}</option>
          <option value="5">{{ t('toolbar.heading.h5') }}</option>
          <option value="6">{{ t('toolbar.heading.h6') }}</option>
        </select>
        <div class="editor-divider"></div>
        <button
          @click="toggleBulletList"
          :class="['editor-button', { active: isBulletList }]"
          @mouseenter="showTooltip($event, t('toolbar.bulletList'))"
          @mouseleave="hideTooltip"
        >
          <List class="icon" />
        </button>
        <button
          @click="toggleOrderedList"
          :class="['editor-button', { active: isOrderedList }]"
          @mouseenter="showTooltip($event, t('toolbar.orderedList'))"
          @mouseleave="hideTooltip"
        >
          <ListOrdered class="icon" />
        </button>
        <button
          @click="toggleBlockquote"
          :class="['editor-button', { active: isBlockquote }]"
          @mouseenter="showTooltip($event, t('toolbar.blockquote'))"
          @mouseleave="hideTooltip"
        >
          <Quote class="icon" />
        </button>
        <div class="editor-divider"></div>
        <button
          @click="toggleAlignment('left')"
          :class="['editor-button', { active: alignment === 'left' }]"
          @mouseenter="showTooltip($event, t('toolbar.align.left'))"
          @mouseleave="hideTooltip"
        >
          <AlignLeft class="icon" />
        </button>
        <button
          @click="toggleAlignment('center')"
          :class="['editor-button', { active: alignment === 'center' }]"
          @mouseenter="showTooltip($event, t('toolbar.align.center'))"
          @mouseleave="hideTooltip"
        >
          <AlignCenter class="icon" />
        </button>
        <button
          @click="toggleAlignment('right')"
          :class="['editor-button', { active: alignment === 'right' }]"
          @mouseleave="hideTooltip"
          @mouseenter="showTooltip($event, t('toolbar.align.right'))"
        >
          <AlignRight class="icon" />
        </button>
        <button
          @click="toggleAlignment('justify')"
          :class="['editor-button', { active: alignment === 'justify' }]"
          @mouseenter="showTooltip($event, t('toolbar.align.justify'))"
          @mouseleave="hideTooltip"
        >
          <AlignJustify class="icon" />
        </button>
        <div class="editor-divider"></div>
        <button
          @click="insertLink($event)"
          :class="['editor-button', { active: isLink }]"
          @mouseenter="showTooltip($event, t('toolbar.insertLink'))"
          @mouseleave="hideTooltip"
        >
          <Link class="icon" />
        </button>
        <button
          @click="removeLink"
          :class="['editor-button']"
          @mouseenter="showTooltip($event, t('toolbar.removeLink'))"
          @mouseleave="hideTooltip"
        >
          <Unlink class="icon" />
        </button>
        <button
          @click="insertImage"
          :class="['editor-button']"
          @mouseenter="showTooltip($event, t('toolbar.insertImage'))"
          @mouseleave="hideTooltip"
        >
          <Image class="icon" />
        </button>
        <button
          :class="['editor-button', { active: isInTable }]"
          @mouseenter="showTableGridPickerFn($event)"
          @mouseleave="startHideTableGridPickerFn"
        >
          <Table2 class="icon" />
        </button>
        <div class="editor-divider"></div>
        <button
          @click="toggleTextColorPicker"
          :class="['editor-button']"
          @mouseenter="showTooltip($event, t('toolbar.textColor'))"
          @mouseleave="hideTooltip"
        >
          <div class="color-indicator" :style="{ backgroundColor: textColor }">
            <Palette class="icon" :style="{ color: getContrastColor(textColor) }" />
          </div>
        </button>
        <button
          @click="toggleHighlightColorPicker"
          :class="['editor-button']"
          @mouseenter="showTooltip($event, t('toolbar.highlightColor'))"
          @mouseleave="hideTooltip"
        >
          <div class="color-indicator" :style="{ backgroundColor: highlightColor }">
            <Highlighter class="icon" :style="{ color: getContrastColor(highlightColor) }" />
          </div>
        </button>
        <div class="editor-divider"></div>
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

    <Teleport to="body">
      <div v-if="showLinkDialog" class="editor-popup-fixed editor-popup link-dialog" :style="{ left: linkDialogPosition.x + 'px', top: linkDialogPosition.y + 'px' }" @click.stop>
        <div class="link-dialog-content">
          <input
            v-model="linkUrl"
            type="url"
            placeholder="https://..."
            class="editor-input link-input"
          />
          <div class="link-dialog-buttons">
            <button @click="showLinkDialog = false" class="link-dialog-btn editor-btn-secondary">
              {{ t('toolbar.linkDialog.cancel') }}
            </button>
            <button @click="confirmLink" class="link-dialog-btn editor-btn-primary">
              {{ t('toolbar.linkDialog.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div 
        v-if="showTextColorPicker" 
        class="editor-popup-fixed editor-popup editor-color-picker text-color-picker"
        :style="{ left: textColorPickerPosition.x + 'px', top: textColorPickerPosition.y + 'px' }"
        @click.stop
      >
        <div class="color-picker-grid text-color-grid">
          <button
            v-for="color in textColorOptions"
            :key="color"
            class="color-swatch"
            :style="{ backgroundColor: color }"
            @click="setColor(color)"
          />
          <button
            class="color-swatch transparent-color"
            @click="removeTextColor"
          >
            <div class="transparent-indicator"></div>
          </button>
        </div>
        <div class="color-picker-divider"></div>
        <div class="custom-color-section">
          <label class="custom-color-label">{{ t('toolbar.customColor') }}</label>
          <input
            v-model="customTextColor"
            type="color"
            @input="setColor(customTextColor)"
            class="custom-color-input editor-input"
          />
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div 
        v-if="showHighlightColorPicker" 
        class="editor-popup-fixed editor-popup editor-color-picker highlight-color-picker"
        :style="{ left: highlightColorPickerPosition.x + 'px', top: highlightColorPickerPosition.y + 'px' }"
        @click.stop
      >
        <div class="color-picker-grid highlight-color-grid">
          <button
            v-for="color in highlightColorOptions"
            :key="color"
            class="color-swatch"
            :style="{ backgroundColor: color }"
            @click="setHighlightColor(color)"
          />
          <button
            class="color-swatch transparent-color"
            @click="removeHighlightColor"
          >
            <div class="transparent-indicator"></div>
          </button>
        </div>
        <div class="color-picker-divider"></div>
        <div class="custom-color-section">
          <label class="custom-color-label">{{ t('toolbar.customColor') }}</label>
          <input
            v-model="customHighlightColor"
            type="color"
            @input="setHighlightColor(customHighlightColor)"
            class="custom-color-input editor-input"
          />
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showTableMenu"
        class="editor-popup-fixed editor-popup table-menu"
        :style="{ left: tableMenuPosition.x + 'px', top: tableMenuPosition.y + 'px' }"
        @click.stop
      >
        <div class="table-menu-content">
          <button
            @click="handleInsertTable"
            class="table-menu-item editor-btn-default"
          >
            <Table2 class="icon" />
            <span>{{ t('toolbar.table.insertTable') }}</span>
          </button>
          <template v-if="isInTable">
            <div class="editor-divider"></div>
            <button
              @click="handleTableAction('addColumnBefore')"
              class="table-menu-item editor-btn-default"
            >
              <Plus class="icon" />
              <span>{{ t('toolbar.table.addColumnBefore') }}</span>
            </button>
            <button
              @click="handleTableAction('addColumnAfter')"
              class="table-menu-item editor-btn-default"
            >
              <Plus class="icon" />
              <span>{{ t('toolbar.table.addColumnAfter') }}</span>
            </button>
            <button
              @click="handleTableAction('deleteColumn')"
              class="table-menu-item editor-btn-default"
            >
              <Minus class="icon" />
              <span>{{ t('toolbar.table.deleteColumn') }}</span>
            </button>
            <div class="editor-divider"></div>
            <button
              @click="handleTableAction('addRowBefore')"
              class="table-menu-item editor-btn-default"
            >
              <Plus class="icon" />
              <span>{{ t('toolbar.table.addRowBefore') }}</span>
            </button>
            <button
              @click="handleTableAction('addRowAfter')"
              class="table-menu-item editor-btn-default"
            >
              <Plus class="icon" />
              <span>{{ t('toolbar.table.addRowAfter') }}</span>
            </button>
            <button
              @click="handleTableAction('deleteRow')"
              class="table-menu-item editor-btn-default"
            >
              <Minus class="icon" />
              <span>{{ t('toolbar.table.deleteRow') }}</span>
            </button>
            <div class="editor-divider"></div>
            <button
              @click="handleTableAction('mergeCells')"
              class="table-menu-item editor-btn-default"
            >
              <Merge class="icon" />
              <span>{{ t('toolbar.table.mergeCells') }}</span>
            </button>
            <button
              @click="handleTableAction('splitCell')"
              class="table-menu-item editor-btn-default"
            >
              <Split class="icon" />
              <span>{{ t('toolbar.table.splitCell') }}</span>
            </button>
            <div class="editor-divider"></div>
            <button
              @click="handleTableAction('toggleHeaderColumn')"
              class="table-menu-item editor-btn-default"
            >
              <Columns class="icon" />
              <span>{{ t('toolbar.table.toggleHeaderColumn') }}</span>
            </button>
            <button
              @click="handleTableAction('toggleHeaderRow')"
              class="table-menu-item editor-btn-default"
            >
              <Rows class="icon" />
              <span>{{ t('toolbar.table.toggleHeaderRow') }}</span>
            </button>
            <div class="editor-divider"></div>
            <button
              @click="handleTableAction('deleteTable')"
              class="table-menu-item editor-btn-danger"
            >
              <Trash2 class="icon" />
              <span>{{ t('toolbar.table.deleteTable') }}</span>
            </button>
          </template>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showTableGridPicker"
        class="editor-popup-fixed editor-popup table-grid-picker"
        :style="{ left: tableGridPickerPosition.x + 'px', top: tableGridPickerPosition.y + 'px' }"
        @click.stop
        @mouseenter="onGridPickerMouseEnter"
        @mouseleave="onGridPickerMouseLeave"
      >
        <div class="table-grid-picker-content">
          <div class="table-grid-picker-grid">
            <div
              v-for="row in 8"
              :key="'row-' + row"
              class="table-grid-picker-row"
            >
              <div
                v-for="col in 10"
                :key="'cell-' + row + '-' + col"
                class="table-grid-picker-cell"
                :class="{
                  'active': row <= hoveredRow && col <= hoveredCol
                }"
                @mouseenter="onGridCellHover(row, col)"
                @click="onGridCellClick(row, col)"
              ></div>
            </div>
          </div>
          <div class="table-grid-picker-label">
            {{ hoveredRow }} × {{ hoveredCol }}
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link, Unlink, Image, Palette, Highlighter, Download, Eye, Table2, Plus, Minus, Trash2, Merge, Split, Columns, Rows } from 'lucide-vue-next'
import { useI18n } from '../composables/useI18n'

const props = defineProps<{
  editor: any
  isDark: boolean
  currentFontSize?: string
  currentFontFamily?: string
  headingLevel?: number
  isInTable?: boolean
}>()

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

const showLinkDialog = ref(false)
const linkUrl = ref('')
const linkDialogPosition = ref({ x: 0, y: 0 })

const showTextColorPicker = ref(false)
const textColor = ref('#000000')
const customTextColor = ref('#000000')
const textColorOptions = [
  '#000000', '#666666', '#999999', '#ff0000', '#ff9900',
  '#ffff00', '#00ff00', '#0066cc', '#9933ff', '#ff66cc'
]
const textColorPickerPosition = ref({ x: 0, y: 0 })

const showHighlightColorPicker = ref(false)
const highlightColor = ref('#ffff00')
const customHighlightColor = ref('#ffff00')
const highlightColorOptions = [
  '#ffff00', '#ffcc00', '#ff9900', '#ff6600', '#ff0000',
  '#ff66cc', '#9933ff', '#0066cc', '#00ff00', '#00ffff'
]
const highlightColorPickerPosition = ref({ x: 0, y: 0 })

const tooltip = ref({ visible: false, text: '', x: 0, y: 0, above: true })
let tooltipTimer: ReturnType<typeof setTimeout> | null = null

const showTableMenu = ref(false)
const tableMenuPosition = ref({ x: 0, y: 0 })

const showTableGridPicker = ref(false)
const tableGridPickerPosition = ref({ x: 0, y: 0 })
const hoveredRow = ref(0)
const hoveredCol = ref(0)
let hideGridTimer: ReturnType<typeof setTimeout> | null = null

const isBold = computed(() => props.editor?.isActive('bold') || false)
const isItalic = computed(() => props.editor?.isActive('italic') || false)
const isUnderline = computed(() => props.editor?.isActive('underline') || false)
const isStrike = computed(() => props.editor?.isActive('strike') || false)

const isBulletList = computed(() => props.editor?.isActive('bulletList') || false)
const isOrderedList = computed(() => props.editor?.isActive('orderedList') || false)
const isBlockquote = computed(() => props.editor?.isActive('blockquote') || false)
const isLink = computed(() => props.editor?.isActive('link') || false)

const alignment = computed(() => {
  if (props.editor?.isActive('textAlign', { align: 'left' })) return 'left'
  if (props.editor?.isActive('textAlign', { align: 'center' })) return 'center'
  if (props.editor?.isActive('textAlign', { align: 'right' })) return 'right'
  if (props.editor?.isActive('textAlign', { align: 'justify' })) return 'justify'
  return 'left'
})

function toggleBold() {
  props.editor?.chain().focus().toggleBold().run()
}

function toggleItalic() {
  props.editor?.chain().focus().toggleItalic().run()
}

function toggleUnderline() {
  props.editor?.chain().focus().toggleUnderline().run()
}

function toggleStrike() {
  props.editor?.chain().focus().toggleStrike().run()
}

function onHeadingChange(event: Event) {
  const value = parseInt((event.target as HTMLSelectElement).value)
  emit('setHeading', value)
}

function onFontSizeChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('setFontSize', value)
}

function onFontFamilyChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('setFontFamily', value)
}

function toggleBulletList() {
  props.editor?.chain().focus().toggleBulletList().run()
}

function toggleOrderedList() {
  props.editor?.chain().focus().toggleOrderedList().run()
}

function toggleBlockquote() {
  props.editor?.chain().focus().toggleBlockquote().run()
}

function toggleAlignment(align: string) {
  props.editor?.chain().focus().setTextAlign({ align }).run()
}

function insertLink(event: MouseEvent) {
  event.stopPropagation()
  const selection = props.editor?.state.selection
  if (selection) {
    showLinkDialog.value = true
    const target = event.currentTarget as HTMLElement
    if (target) {
      const rect = target.getBoundingClientRect()
      linkDialogPosition.value = {
        x: rect.left + rect.width / 2 - 100,
        y: rect.bottom + 8
      }
    }
  }
}

function confirmLink() {
  if (linkUrl.value) {
    props.editor?.chain().focus().setLink({ href: linkUrl.value, target: '_blank' }).run()
    emit('setLink', linkUrl.value)
    showLinkDialog.value = false
    linkUrl.value = ''
  }
}

function insertImage() {
  emit('insertImage')
}

function removeLink() {
  props.editor?.chain().focus().extendMarkRange('link').unsetLink().run()
}

function openPreview() {
  emit('openPreview')
}

function toggleExportMenu(event: MouseEvent) {
  event.stopPropagation()
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  exportMenuPosition.value = {
    x: rect.left + rect.width / 2 - 75,
    y: rect.bottom + 8
  }
  showExportMenu.value = !showExportMenu.value
  showLinkDialog.value = false
  showTextColorPicker.value = false
  showHighlightColorPicker.value = false
}

function handleExport(format: string) {
  emit('export', format)
  showExportMenu.value = false
}

function toggleTextColorPicker(event: MouseEvent) {
  event.stopPropagation()
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  textColorPickerPosition.value = {
    x: rect.left - 100,
    y: rect.bottom + 8
  }
  showTextColorPicker.value = !showTextColorPicker.value
  showHighlightColorPicker.value = false
  showExportMenu.value = false
  showLinkDialog.value = false
}

function toggleHighlightColorPicker(event: MouseEvent) {
  event.stopPropagation()
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  highlightColorPickerPosition.value = {
    x: rect.left - 100,
    y: rect.bottom + 8
  }
  showHighlightColorPicker.value = !showHighlightColorPicker.value
  showTextColorPicker.value = false
  showExportMenu.value = false
  showLinkDialog.value = false
}

function setColor(color: string) {
  props.editor?.chain().focus().setColor(color).run()
  textColor.value = color
  customTextColor.value = color
}

function removeTextColor() {
  props.editor?.chain().focus().unsetColor().run()
  textColor.value = '#000000'
  customTextColor.value = '#000000'
  showTextColorPicker.value = false
}

function setHighlightColor(color: string) {
  props.editor?.chain().focus().setHighlight({ color }).run()
  highlightColor.value = color
  customHighlightColor.value = color
}

function removeHighlightColor() {
  props.editor?.chain().focus().unsetHighlight().run()
  highlightColor.value = '#ffff00'
  customHighlightColor.value = '#ffff00'
  showHighlightColorPicker.value = false
}

function handleInsertTable() {
  emit('insertTable')
  showTableMenu.value = false
}

function handleTableAction(action: string) {
  emit(action as any)
  showTableMenu.value = false
}

function showTableGridPickerFn(event: MouseEvent) {
  if (hideGridTimer) {
    clearTimeout(hideGridTimer)
    hideGridTimer = null
  }
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  tableGridPickerPosition.value = {
    x: rect.left,
    y: rect.bottom + 8
  }
  showTableGridPicker.value = true
}

function startHideTableGridPickerFn() {
  hideGridTimer = setTimeout(() => {
    showTableGridPicker.value = false
    hoveredRow.value = 0
    hoveredCol.value = 0
  }, 300)
}

function onGridCellHover(row: number, col: number) {
  hoveredRow.value = row
  hoveredCol.value = col
}

function onGridCellClick(row: number, col: number) {
  emit('insertTable', row, col)
  showTableGridPicker.value = false
  hoveredRow.value = 0
  hoveredCol.value = 0
}

function onGridPickerMouseEnter() {
  if (hideGridTimer) {
    clearTimeout(hideGridTimer)
    hideGridTimer = null
  }
}

function onGridPickerMouseLeave() {
  showTableGridPicker.value = false
  hoveredRow.value = 0
  hoveredCol.value = 0
}

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

// 点击文档其他地方关闭所有弹出菜单
function handleDocumentClick() {
  showExportMenu.value = false
  showLinkDialog.value = false
  showTextColorPicker.value = false
  showHighlightColorPicker.value = false
  showTableMenu.value = false
  showTableGridPicker.value = false
  hoveredRow.value = 0
  hoveredCol.value = 0
}

function getContrastColor(backgroundColor: string): string {
  // 从RGB颜色中提取R、G、B值
  let r: number, g: number, b: number;
  
  // 处理十六进制颜色
  if (backgroundColor.startsWith('#')) {
    const hex = backgroundColor.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
  } 
  // 处理RGB颜色
  else if (backgroundColor.startsWith('rgb')) {
    const match = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      r = parseInt(match[1]);
      g = parseInt(match[2]);
      b = parseInt(match[3]);
    } else {
      // 默认值
      r = 0;
      g = 0;
      b = 0;
    }
  } 
  // 默认值
  else {
    r = 0;
    g = 0;
    b = 0;
  }
  
  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // 根据亮度返回黑色或白色
  return brightness > 128 ? '#000000' : '#ffffff';
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
  if (tooltipTimer) clearTimeout(tooltipTimer)
})
</script>

<style scoped>
/* 工具栏容器 */
.editor-toolbar {
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

.editor-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--editor-border-color, #e5e7eb);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: var(--editor-text-color, #1f2937);
  background-color: var(--editor-bg-color, #ffffff);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.editor-select:hover {
  border-color: var(--editor-primary-color, #3b82f6);
}

.editor-select:focus {
  outline: none;
  border-color: var(--editor-primary-color, #3b82f6);
  box-shadow: 0 0 0 2px var(--editor-primary-color, #3b82f6);
}

/* 工具栏分组 */
.toolbar-group {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

/* 按钮 */
.editor-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  color: var(--editor-text-color, #1f2937);
}

.editor-button:hover {
  background-color: var(--editor-border-color, #e5e7eb);
}

.editor-button.active {
  background-color: var(--editor-primary-color, #3b82f6);
  color: #ffffff;
}

/* 图标 */
.icon {
  width: 1rem;
  height: 1rem;
}

/* 分隔线 */
.editor-divider {
  width: 1px;
  height: 1.25rem;
  background-color: var(--editor-border-color, #e5e7eb);
  margin: 0 0.25rem;
}

/* 颜色指示器 */
.color-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 0.25rem;
  overflow: hidden;
}

.color-indicator .icon {
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 导出菜单 */
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

/* 链接对话框 */
.link-dialog {
  width: 200px;
}

.link-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link-input {
  width: 100%;
}

.link-dialog-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.link-dialog-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* 颜色选择器 */
.editor-color-picker {
  width: 200px;
  padding: 0.5rem;
}

.color-picker-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border: 1px solid var(--editor-border-color, #e5e7eb);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.transparent-color {
  position: relative;
  background-color: #ffffff;
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
}

.transparent-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border: 2px solid var(--editor-border-color, #e5e7eb);
  border-radius: 50%;
  background-color: transparent;
}

.color-picker-divider {
  height: 1px;
  background-color: var(--editor-border-color, #e5e7eb);
  margin: 0.5rem 0;
}

.custom-color-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.custom-color-label {
  font-size: 12px;
}

.custom-color-input {
  width: 28px;
  height: 28px;
  padding: 0;
  cursor: pointer;
}

/* 通用输入框 */
.editor-input {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--editor-border-color, #e5e7eb);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: var(--editor-text-color, #1f2937);
  background-color: var(--editor-bg-color, #ffffff);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.editor-input:focus {
  outline: none;
  border-color: var(--editor-primary-color, #3b82f6);
  box-shadow: 0 0 0 2px var(--editor-primary-color, #3b82f6);
}

/* 通用按钮样式 */
.editor-btn-default {
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--editor-text-color, #1f2937);
}

.editor-btn-default:hover {
  background-color: var(--editor-border-color, #e5e7eb);
}

.editor-btn-primary {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: var(--editor-primary-color, #3b82f6);
  color: #ffffff;
}

.editor-btn-primary:hover {
  background-color: var(--editor-primary-hover, #2563eb);
}

.editor-btn-secondary {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: var(--editor-border-color, #e5e7eb);
  color: var(--editor-text-color, #1f2937);
}

.editor-btn-secondary:hover {
  background-color: var(--editor-border-color, #d1d5db);
}
</style>