<template>
  <div class="editor-toolbar flex flex-wrap items-center gap-1 overflow-x-auto relative" style="background-color: var(--editor-toolbar-bg, #f9fafb); border-bottom: 1px solid var(--editor-border-color, #e5e7eb); padding: 0.5rem;">
    <Teleport to="body">
      <div
        v-if="tooltip.visible"
        class="fixed z-[9999] px-2 py-1 text-xs rounded whitespace-nowrap pointer-events-none"
        :style="{
          left: tooltip.x + 'px',
          top: tooltip.y + 'px',
          transform: tooltip.above ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
          backgroundColor: 'var(--editor-text-color, #1f2937)',
          color: 'var(--editor-bg-color, #ffffff)',
        }"
      >
        {{ tooltip.text }}
      </div>
    </Teleport>
    <div class="flex items-center gap-1">
      <select
        :value="headingLevel ?? 0"
        @change="onHeadingChange"
        class="px-2 py-1.5 text-sm rounded editor-select min-w-[80px]"
      >
        <option value="0">正文</option>
        <option value="1">H1 标题</option>
        <option value="2">H2 标题</option>
        <option value="3">H3 标题</option>
        <option value="4">H4 标题</option>
        <option value="5">H5 标题</option>
        <option value="6">H6 标题</option>
      </select>
    </div>

    <div class="w-px h-6 mx-1 editor-divider"></div>

    <div class="flex items-center gap-1">
      <button
        @click="$emit('toggleBold')"
        @mouseenter="showTooltip($event, '加粗')"
        @mouseleave="hideTooltip"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isBold
            ? 'editor-btn-active'
            : 'editor-btn-default'
        ]"
      >
        <Bold class="w-4 h-4" />
      </button>
      <button
        @click="$emit('toggleItalic')"
        @mouseenter="showTooltip($event, '斜体')"
        @mouseleave="hideTooltip"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isItalic
            ? 'editor-btn-active'
            : 'editor-btn-default'
        ]"
      >
        <Italic class="w-4 h-4" />
      </button>
      <button
        @click="$emit('toggleUnderline')"
        @mouseenter="showTooltip($event, '下划线')"
        @mouseleave="hideTooltip"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isUnderline
            ? 'editor-btn-active'
            : 'editor-btn-default'
        ]"
      >
        <Underline class="w-4 h-4" />
      </button>
      <button
        @click="$emit('toggleStrike')"
        @mouseenter="showTooltip($event, '删除线')"
        @mouseleave="hideTooltip"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isStrike
            ? 'editor-btn-active'
            : 'editor-btn-default'
        ]"
      >
        <Strikethrough class="w-4 h-4" />
      </button>
    </div>

    <div class="w-px h-6 mx-1 editor-divider"></div>

    <div class="flex items-center gap-1">
      <select
        :value="fontFamily"
        @change="$emit('setFontFamily', ($event.target as HTMLSelectElement).value)"
        class="px-2 py-1.5 text-sm rounded editor-select"
      >
        <option value="sans-serif">无衬线字体</option>
        <option value="serif">衬线字体</option>
        <option value="monospace">等宽字体</option>
        <option value="Microsoft+YaHei">微软雅黑</option>
        <option value="SimSun">宋体</option>
        <option value="SimHei">黑体</option>
        <option value="KaiTi">楷体</option>
      </select>
      <select
        :value="fontSize"
        @change="$emit('setFontSize', ($event.target as HTMLSelectElement).value)"
        class="px-2 py-1.5 text-sm rounded editor-select"
      >
        <option v-for="size in ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48']" :key="size" :value="size">
          {{ size }}px
        </option>
      </select>
    </div>

    <div class="w-px h-6 mx-1 editor-divider"></div>

    <div class="flex items-center gap-1">
      <button
        @click.stop="openTextColorPicker($event)"
        @mouseenter="showTooltip($event, '文字颜色')"
        @mouseleave="hideTooltip"
        class="w-8 h-8 flex items-center justify-center rounded transition-colors editor-btn-default relative"
      >
        <Type class="w-4 h-4" />
        <span class="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-white" :style="{ backgroundColor: textColor }"></span>
      </button>
    </div>

    <div class="flex items-center gap-1">
      <button
        @click.stop="openHighlightColorPicker($event)"
        @mouseenter="showTooltip($event, '背景高亮')"
        @mouseleave="hideTooltip"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors relative',
          isHighlight
            ? 'editor-btn-active'
            : 'editor-btn-default'
        ]"
      >
        <Highlighter class="w-4 h-4" />
        <span class="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-white" :style="{ backgroundColor: highlightColor }"></span>
      </button>
    </div>

    <div class="w-px h-6 mx-1 editor-divider"></div>

    <div class="flex items-center gap-1">
      <button
        v-for="align in ['left', 'center', 'right', 'justify']"
        :key="align"
        @click="$emit('setAlign', align)"
        @mouseenter="showTooltip($event, alignLabels[align])"
        @mouseleave="hideTooltip"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          textAlign === align
            ? 'editor-btn-active'
            : 'editor-btn-default'
        ]"
      >
        <component :is="alignIcons[align]" class="w-4 h-4" />
      </button>
    </div>

    <div class="w-px h-6 mx-1 editor-divider"></div>

    <div class="flex items-center gap-1">
      <button
        @click="$emit('toggleBulletList')"
        @mouseenter="showTooltip($event, '无序列表')"
        @mouseleave="hideTooltip"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isBulletList
            ? 'editor-btn-active'
            : 'editor-btn-default'
        ]"
      >
        <List class="w-4 h-4" />
      </button>
      <button
        @click="$emit('toggleOrderedList')"
        @mouseenter="showTooltip($event, '有序列表')"
        @mouseleave="hideTooltip"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isOrderedList
            ? 'editor-btn-active'
            : 'editor-btn-default'
        ]"
      >
        <ListOrdered class="w-4 h-4" />
      </button>
      <button
        @click="$emit('toggleBlockquote')"
        @mouseenter="showTooltip($event, '引用')"
        @mouseleave="hideTooltip"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isBlockquote
            ? 'editor-btn-active'
            : 'editor-btn-default'
        ]"
      >
        <Quote class="w-4 h-4" />
      </button>
    </div>

    <div class="w-px h-6 mx-1 editor-divider"></div>

    <div class="flex items-center gap-1">
      <button
        @click="openLinkDialog($event)"
        @mouseenter="showTooltip($event, '插入链接')"
        @mouseleave="hideTooltip"
        class="w-8 h-8 flex items-center justify-center rounded transition-colors editor-btn-default"
      >
        <Link2 class="w-4 h-4" />
      </button>

      <button
        @click="$emit('unsetLink')"
        @mouseenter="showTooltip($event, '删除链接')"
        @mouseleave="hideTooltip"
        class="w-8 h-8 flex items-center justify-center rounded transition-colors editor-btn-danger"
      >
        <Link2 class="w-4 h-4" />
      </button>

      <label
        @mouseenter="showTooltip($event, '插入图片')"
        @mouseleave="hideTooltip"
        class="w-8 h-8 flex items-center justify-center rounded transition-colors editor-btn-default cursor-pointer"
      >
        <ImageIcon class="w-4 h-4" />
        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageUpload"
        />
      </label>
    </div>
  </div>
  
  <Teleport to="body">
    <div
      v-if="showLinkDialog"
      class="fixed p-3 z-[100] min-w-[200px]"
      :style="{ left: linkDialogPosition.x + 'px', top: linkDialogPosition.y + 'px', backgroundColor: 'var(--editor-bg-color, #ffffff)', border: '1px solid var(--editor-border-color, #e5e7eb)', borderRadius: 'var(--editor-radius, 0.5rem)', boxShadow: 'var(--editor-shadow-lg, 0 4px 6px -1px rgba(0,0,0,0.1))' }"
    >
      <input
        v-model="linkUrl"
        type="text"
        placeholder="输入链接地址"
        class="w-full px-2 py-1.5 text-sm rounded editor-input"
        @keyup.enter="insertLink"
        @click.stop
      />
      <div class="flex gap-2 mt-2">
        <button
          @click="insertLink"
          class="flex-1 px-3 py-1.5 text-sm rounded editor-btn-primary"
        >
          确定
        </button>
        <button
          @click="showLinkDialog = false"
          class="flex-1 px-3 py-1.5 text-sm rounded editor-btn-secondary"
        >
          取消
        </button>
      </div>
    </div>
    
    <div
      v-if="showLinkDialog"
      class="fixed inset-0 z-[99]"
      @click="showLinkDialog = false"
    ></div>
  </Teleport>

  <Teleport to="body">
    <div 
      v-if="showTextColorPicker" 
      class="fixed inset-0 z-[99] bg-transparent"
      @click="closeTextColorPicker"
    ></div>
    <div 
      v-if="showTextColorPicker" 
      class="text-color-picker-container fixed p-3 z-[100]"
      :style="{ left: textColorPickerPosition.x + 'px', top: textColorPickerPosition.y + 'px', backgroundColor: 'var(--editor-bg-color, #ffffff)', border: '1px solid var(--editor-border-color, #e5e7eb)', borderRadius: 'var(--editor-radius, 0.5rem)', boxShadow: 'var(--editor-shadow-lg, 0 4px 6px -1px rgba(0,0,0,0.1))' }"
    >
        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="color in textColors"
            :key="color"
            @click="selectPresetTextColor(color)"
            class="w-7 h-7 rounded border editor-color-swatch hover:ring-2 transition-all relative overflow-hidden"
            :style="{ borderColor: 'var(--editor-border-color, #e5e7eb)', '--tw-ring-color': 'var(--editor-primary-color, #3b82f6)' }"
            :class="{ 'bg-white': color === 'transparent' }"
          >
            <span v-if="color === 'transparent'" class="absolute inset-0 flex items-center justify-center">
              <span class="w-full h-0.5 bg-red-500 rotate-45 absolute"></span>
            </span>
            <span v-else class="w-full h-full block rounded" :style="{ backgroundColor: color }"></span>
          </button>
        </div>
        <div class="mt-2 pt-2" style="border-top: 1px solid var(--editor-border-color, #e5e7eb);">
          <div class="flex items-center gap-2">
            <input
              type="color"
              :value="textColor"
              @input="selectTextColor(($event.target as HTMLInputElement).value)"
              class="w-7 h-7 cursor-pointer rounded"
              style="border: 1px solid var(--editor-border-color, #e5e7eb);"
            />
            <span class="text-xs editor-text-secondary">自定义颜色</span>
          </div>
        </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div 
      v-if="showHighlightColorPicker" 
      class="fixed inset-0 z-[99] bg-transparent"
      @click="closeHighlightColorPicker"
    ></div>
    <div 
      v-if="showHighlightColorPicker" 
      class="highlight-color-picker-container fixed p-3 z-[100]"
      :style="{ left: highlightColorPickerPosition.x + 'px', top: highlightColorPickerPosition.y + 'px', backgroundColor: 'var(--editor-bg-color, #ffffff)', border: '1px solid var(--editor-border-color, #e5e7eb)', borderRadius: 'var(--editor-radius, 0.5rem)', boxShadow: 'var(--editor-shadow-lg, 0 4px 6px -1px rgba(0,0,0,0.1))' }"
    >
        <div class="grid grid-cols-6 gap-1">
          <button
            v-for="color in highlightColors"
            :key="color"
            @click="selectPresetHighlightColor(color)"
            class="w-7 h-7 rounded border editor-color-swatch hover:ring-2 transition-all relative overflow-hidden"
            :style="{ borderColor: 'var(--editor-border-color, #e5e7eb)', '--tw-ring-color': 'var(--editor-primary-color, #3b82f6)' }"
            :class="{ 'bg-white': color === 'transparent' }"
          >
            <span v-if="color === 'transparent'" class="absolute inset-0 flex items-center justify-center">
              <span class="w-full h-0.5 bg-red-500 rotate-45 absolute"></span>
            </span>
            <span v-else class="w-full h-full block rounded" :style="{ backgroundColor: color }"></span>
          </button>
        </div>
        <div class="mt-2 pt-2" style="border-top: 1px solid var(--editor-border-color, #e5e7eb);">
          <div class="flex items-center gap-2">
            <input
              type="color"
              :value="highlightColor"
              @input="selectHighlightColor(($event.target as HTMLInputElement).value)"
              class="w-7 h-7 cursor-pointer rounded"
              style="border: 1px solid var(--editor-border-color, #e5e7eb);"
            />
            <span class="text-xs editor-text-secondary">自定义颜色</span>
          </div>
        </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Type,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
} from 'lucide-vue-next'

defineProps<{
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  isStrike: boolean
  isHighlight: boolean
  isLink: boolean
  headingLevel: number | null
  textAlign: string
  isBulletList: boolean
  isOrderedList: boolean
  isBlockquote: boolean
  fontFamily: string
  fontSize: string
  textColor: string
  highlightColor: string
}>()

const emit = defineEmits<{
  toggleBold: []
  toggleItalic: []
  toggleUnderline: []
  toggleStrike: []
  toggleHighlight: []
  toggleLink: []
  unsetLink: []
  setHeading: [level: number]
  setAlign: [align: string]
  toggleBulletList: []
  toggleOrderedList: []
  toggleBlockquote: []
  setLink: [href: string, target: string]
  setFontSize: [size: string]
  setFontFamily: [family: string]
  setTextColor: [color: string]
  setHighlightColor: [color: string]
  clearTextColor: []
  clearHighlightColor: []
  addImage: [src: string, alt: string]
}>()

const showTextColorPicker = ref(false)
const showHighlightColorPicker = ref(false)
const textColorPickerPosition = ref({ x: 0, y: 0 })
const highlightColorPickerPosition = ref({ x: 0, y: 0 })
const showLinkDialog = ref(false)
const linkUrl = ref('')
const linkDialogPosition = ref({ x: 0, y: 0 })

const tooltip = ref({ visible: false, text: '', x: 0, y: 0, above: true })
let tooltipTimer: ReturnType<typeof setTimeout> | null = null

function showTooltip(event: MouseEvent, text: string) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  if (tooltipTimer) clearTimeout(tooltipTimer)
  const tooltipHeight = 28
  const spaceAbove = rect.top
  const showAbove = spaceAbove >= tooltipHeight + 8
  tooltip.value = {
    visible: true,
    text,
    x: rect.left + rect.width / 2,
    y: showAbove ? rect.top - 8 : rect.bottom + 8,
    above: showAbove,
  }
}

function hideTooltip() {
  if (tooltipTimer) clearTimeout(tooltipTimer)
  tooltipTimer = setTimeout(() => {
    tooltip.value.visible = false
  }, 50)
}

const textColors = [
  'transparent', '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
  '#ff0000', '#ff6600', '#ffcc00', '#33cc00', '#00ccff', '#0066ff',
  '#9933ff', '#ff33ff', '#000080', '#800000', '#808000', '#008000',
]

const highlightColors = [
  'transparent', '#ffff00', '#ffcc00', '#ff9900', '#ff6666', '#ff99cc', '#cc99ff',
  '#99ccff', '#66ffcc', '#99ff99', '#ffff99', '#ffffff',
]

const alignIcons: Record<string, unknown> = {
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
  justify: AlignJustify,
}

const alignLabels: Record<string, string> = {
  left: '左对齐',
  center: '居中',
  right: '右对齐',
  justify: '两端对齐',
}

function openTextColorPicker(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const pickerHeight = 140
  const bottomSpace = window.innerHeight - rect.bottom
  
  let top = rect.bottom + 8
  if (bottomSpace < pickerHeight) {
    top = rect.top - pickerHeight - 8
  }
  
  textColorPickerPosition.value = { x: rect.left, y: top }
  showHighlightColorPicker.value = false
  showTextColorPicker.value = true
}

function closeTextColorPicker() {
  showTextColorPicker.value = false
}

function closeHighlightColorPicker() {
  showHighlightColorPicker.value = false
}

function openHighlightColorPicker(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const pickerHeight = 140
  const bottomSpace = window.innerHeight - rect.bottom
  
  let top = rect.bottom + 8
  if (bottomSpace < pickerHeight) {
    top = rect.top - pickerHeight - 8
  }
  
  highlightColorPickerPosition.value = { x: rect.left, y: top }
  showTextColorPicker.value = false
  showHighlightColorPicker.value = true
}

function selectTextColor(color: string) {
  emit('setTextColor', color)
}

function selectHighlightColor(color: string) {
  emit('setHighlightColor', color)
}

function selectPresetTextColor(color: string) {
  if (color === 'transparent') {
    emit('clearTextColor')
  } else {
    emit('setTextColor', color)
  }
  showTextColorPicker.value = false
}

function selectPresetHighlightColor(color: string) {
  if (color === 'transparent') {
    emit('clearHighlightColor')
  } else {
    emit('setHighlightColor', color)
  }
  showHighlightColorPicker.value = false
}

function openLinkDialog(event: MouseEvent) {
  const target = event.target as HTMLElement
  const rect = target.getBoundingClientRect()
  const dialogHeight = 80
  const bottomSpace = window.innerHeight - rect.bottom
  
  let top = rect.bottom + 8
  if (bottomSpace < dialogHeight) {
    top = rect.top - dialogHeight - 8
  }
  
  linkDialogPosition.value = { x: rect.left, y: top }
  showLinkDialog.value = true
}

function insertLink() {
  if (linkUrl.value.trim()) {
    emit('setLink', linkUrl.value.trim(), '_blank')
    showLinkDialog.value = false
    linkUrl.value = ''
  }
}

function onHeadingChange(event: Event) {
  const value = parseInt((event.target as HTMLSelectElement).value, 10)
  if (value === 0) {
    emit('setHeading', 0)
  } else {
    emit('setHeading', value)
  }
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      emit('addImage', e.target?.result as string, file.name)
    }
    reader.readAsDataURL(file)
    target.value = ''
  }
}
</script>

<style scoped>
.editor-toolbar {
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.editor-toolbar::-webkit-scrollbar {
  display: none;
}

.editor-toolbar > div {
  position: relative;
}

@media (max-width: 640px) {
  .editor-toolbar {
    padding: 1px;
  }
}
</style>