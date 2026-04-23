<template>
  <div class="editor-toolbar bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1 overflow-x-auto relative">
    <div class="flex items-center gap-1">
      <button
        v-for="level in [1, 2, 3, 4, 5, 6]"
        :key="'heading-' + level"
        @click="$emit('setHeading', level)"
        :class="[
          'px-3 py-1.5 text-sm font-bold rounded transition-colors',
          headingLevel === level
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        ]"
      >
        H{{ level }}
      </button>
    </div>

    <div class="w-px h-6 bg-gray-300 mx-1"></div>

    <div class="flex items-center gap-1">
      <button
        @click="$emit('toggleBold')"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isBold
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        ]"
        title="加粗"
      >
        <Bold class="w-4 h-4" />
      </button>
      <button
        @click="$emit('toggleItalic')"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isItalic
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        ]"
        title="斜体"
      >
        <Italic class="w-4 h-4" />
      </button>
      <button
        @click="$emit('toggleUnderline')"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isUnderline
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        ]"
        title="下划线"
      >
        <Underline class="w-4 h-4" />
      </button>
      <button
        @click="$emit('toggleStrike')"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isStrike
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        ]"
        title="删除线"
      >
        <Strikethrough class="w-4 h-4" />
      </button>
    </div>

    <div class="w-px h-6 bg-gray-300 mx-1"></div>

    <div class="flex items-center gap-1">
      <select
        :value="fontFamily"
        @change="$emit('setFontFamily', ($event.target as HTMLSelectElement).value)"
        class="px-2 py-1.5 text-sm border border-gray-200 rounded bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        class="px-2 py-1.5 text-sm border border-gray-200 rounded bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option v-for="size in ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48']" :key="size" :value="size">
          {{ size }}px
        </option>
      </select>
    </div>

    <div class="w-px h-6 bg-gray-300 mx-1"></div>

    <div class="flex items-center gap-1">
      <button
        @click.stop="openTextColorPicker($event)"
        class="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 hover:bg-gray-100 transition-colors relative"
        title="文字颜色"
      >
        <Type class="w-4 h-4 text-gray-700" />
        <span class="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-white" :style="{ backgroundColor: textColor }"></span>
      </button>
    </div>

    <div class="flex items-center gap-1">
      <button
        @click.stop="openHighlightColorPicker($event)"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors relative',
          isHighlight
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        ]"
        title="背景高亮"
      >
        <Highlighter class="w-4 h-4" />
        <span class="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-white" :style="{ backgroundColor: highlightColor }"></span>
      </button>
    </div>

    <div class="w-px h-6 bg-gray-300 mx-1"></div>

    <div class="flex items-center gap-1">
      <button
        v-for="align in ['left', 'center', 'right', 'justify']"
        :key="align"
        @click="$emit('setAlign', align)"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          textAlign === align
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        ]"
        :title="alignLabels[align]"
      >
        <component :is="alignIcons[align]" class="w-4 h-4" />
      </button>
    </div>

    <div class="w-px h-6 bg-gray-300 mx-1"></div>

    <div class="flex items-center gap-1">
      <button
        @click="$emit('toggleBulletList')"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isBulletList
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        ]"
        title="无序列表"
      >
        <List class="w-4 h-4" />
      </button>
      <button
        @click="$emit('toggleOrderedList')"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isOrderedList
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        ]"
        title="有序列表"
      >
        <ListOrdered class="w-4 h-4" />
      </button>
      <button
        @click="$emit('toggleBlockquote')"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isBlockquote
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        ]"
        title="引用"
      >
        <Quote class="w-4 h-4" />
      </button>
    </div>

    <div class="w-px h-6 bg-gray-300 mx-1"></div>

    <div class="flex items-center gap-1">
      <button
        @click="openLinkDialog($event)"
        class="w-8 h-8 flex items-center justify-center rounded bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-colors"
        title="插入链接"
      >
        <Link2 class="w-4 h-4" />
      </button>

      <button
        @click="$emit('toggleLink')"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded transition-colors',
          isLink
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        ]"
        title="切换链接"
      >
        <Link2 class="w-4 h-4" />
      </button>

      <label class="w-8 h-8 flex items-center justify-center rounded bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer" title="插入图片">
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
      class="fixed p-3 bg-white border border-gray-200 rounded shadow-lg z-[100] min-w-[200px]"
      :style="{ left: linkDialogPosition.x + 'px', top: linkDialogPosition.y + 'px' }"
    >
      <input
        v-model="linkUrl"
        type="text"
        placeholder="输入链接地址"
        class="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keyup.enter="insertLink"
        @click.stop
      />
      <div class="flex gap-2 mt-2">
        <button
          @click="insertLink"
          class="flex-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          确定
        </button>
        <button
          @click="showLinkDialog = false"
          class="flex-1 px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
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
      class="text-color-picker-container fixed p-3 bg-white border border-gray-200 rounded shadow-lg z-[100]" 
      :style="{ left: textColorPickerPosition.x + 'px', top: textColorPickerPosition.y + 'px' }"
    >
    <!-- 预设颜色 - 点击后关闭 -->
        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="color in textColors"
            :key="color"
            @click="selectPresetTextColor(color)"
            class="w-7 h-7 rounded border border-gray-200 hover:ring-2 hover:ring-blue-500 transition-all relative overflow-hidden"
            :class="{ 'bg-white': color === 'transparent' }"
          >
            <span v-if="color === 'transparent'" class="absolute inset-0 flex items-center justify-center">
              <span class="w-full h-0.5 bg-red-500 rotate-45 absolute"></span>
            </span>
            <span v-else class="w-full h-full block rounded" :style="{ backgroundColor: color }"></span>
          </button>
        </div>
        <div class="mt-2 pt-2 border-t border-gray-200">
          <div class="flex items-center gap-2">
            <input
              type="color"
              :value="textColor"
              @input="selectTextColor(($event.target as HTMLInputElement).value)"
              class="w-7 h-7 cursor-pointer rounded border border-gray-200"
            />
            <span class="text-xs text-gray-500">自定义颜色</span>
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
      class="highlight-color-picker-container fixed p-3 bg-white border border-gray-200 rounded shadow-lg z-[100]"
      :style="{ left: highlightColorPickerPosition.x + 'px', top: highlightColorPickerPosition.y + 'px' }"
    >
        <div class="grid grid-cols-6 gap-1">
          <button
            v-for="color in highlightColors"
            :key="color"
            @click="selectPresetHighlightColor(color)"
            class="w-7 h-7 rounded border border-gray-200 hover:ring-2 hover:ring-blue-500 transition-all relative overflow-hidden"
            :class="{ 'bg-white': color === 'transparent' }"
          >
            <span v-if="color === 'transparent'" class="absolute inset-0 flex items-center justify-center">
              <span class="w-full h-0.5 bg-red-500 rotate-45 absolute"></span>
            </span>
            <span v-else class="w-full h-full block rounded" :style="{ backgroundColor: color }"></span>
          </button>
        </div>
        <div class="mt-2 pt-2 border-t border-gray-200">
          <div class="flex items-center gap-2">
            <input
              type="color"
              :value="highlightColor"
              @input="selectHighlightColor(($event.target as HTMLInputElement).value)"
              class="w-7 h-7 cursor-pointer rounded border border-gray-200"
            />
            <span class="text-xs text-gray-500">自定义颜色</span>
          </div>
        </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
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
  // 不要关闭，让用户可以继续选择
  // showTextColorPicker.value = false
}

function selectHighlightColor(color: string) {
  emit('setHighlightColor', color)
  // 不要关闭
  // showHighlightColorPicker.value = false
}

// 添加一个新的函数，用于完成选择后关闭（例如点击预设颜色时）
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
