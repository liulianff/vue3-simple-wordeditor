<template>
  <div class="vue-word-editor editor-container flex flex-col h-full" :class="{ dark: effectiveTheme === 'dark' }" :data-theme="effectiveTheme">
    <div class="relative">
      <EditorToolbar
      :is-bold="isBold"
      :is-italic="isItalic"
      :is-underline="isUnderline"
      :is-strike="isStrike"
      :is-highlight="isHighlight"
      :is-link="isLink"
      :heading-level="headingLevel ?? null"
      :text-align="textAlign"
      :is-bullet-list="isBulletList"
      :is-ordered-list="isOrderedList"
      :is-blockquote="isBlockquote"
      :font-family="fontFamily"
      :font-size="fontSize"
      :text-color="textColor"
      :highlight-color="highlightColor"
      @toggle-bold="toggleBold"
      @toggle-italic="toggleItalic"
      @toggle-underline="toggleUnderline"
      @toggle-strike="toggleStrike"
      @toggle-highlight="toggleHighlight"
      @toggle-link="toggleLink"
      @unset-link="unsetLink"
      @set-heading="setHeading"
      @set-align="setAlign"
      @toggle-bullet-list="toggleBulletList"
      @toggle-ordered-list="toggleOrderedList"
      @toggle-blockquote="toggleBlockquote"
      @set-link="setLink"
      @set-font-size="setFontSize"
      @set-font-family="setFontFamily"
      @set-text-color="setTextColor"
      @set-highlight-color="setHighlightColor"
      @clear-text-color="unsetTextColor"
      @clear-highlight-color="unsetHighlightColor"
      @add-image="addImage"
      @export="handleExport"
      />
    </div>

    <div class="flex-1 overflow-auto p-4 relative" ref="editorContainerRef">
      <EditorContent
        :editor="editor"
        class="editor-content focus:outline-none min-h-[400px]"
      />
      
      <BubbleMenu
        v-if="editor"
        :editor="editor"
        :should-show="shouldShowBubbleMenu"
        :tippy-options="bubbleMenuTippyOptions"
        class="bubble-menu editor-popup flex items-center gap-1 px-2 py-1"
      >
        <template v-if="isImageSelected">
          <button
            @click="toggleBulletList"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded transition-colors',
              isBulletList ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.bulletList')"
          >
            <List class="w-4 h-4" />
          </button>
          <button
            @click="toggleOrderedList"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded transition-colors',
              isOrderedList ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.orderedList')"
          >
            <ListOrdered class="w-4 h-4" />
          </button>
          <button
            @click="toggleBlockquote"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded transition-colors',
              isBlockquote ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.blockquote')"
          >
            <Quote class="w-4 h-4" />
          </button>
          <div class="w-px h-6 mx-1 editor-divider"></div>
          <button
            v-for="opt in imageLayoutOptions"
            :key="opt.value"
            @click="setImageLayout(opt.value)"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded transition-colors',
              currentImageLayout === opt.value ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="opt.label"
          >
            <component :is="opt.icon" class="w-4 h-4" />
          </button>
          <div class="w-px h-6 mx-1 editor-divider"></div>
          <span class="flex items-center gap-2 px-1">
            <input
              type="range"
              :value="sliderWidth"
              @input="onSliderInput"
              @change="onSliderChange"
              min="30"
              max="800"
              class="w-20 h-1 appearance-none rounded-full outline-none cursor-pointer editor-slider"
            />
            <span class="text-xs min-w-[36px] text-right editor-text-secondary">{{ sliderWidth }}px</span>
          </span>
          <div class="w-px h-6 mx-1 editor-divider"></div>
          <button
            @click="startCropImage"
            class="w-8 h-8 flex items-center justify-center rounded transition-colors editor-btn-default"
            :title="t('bubbleMenu.cropImage')"
          >
            <Crop class="w-4 h-4" />
          </button>
          <button
            @click="deleteImage"
            class="w-8 h-8 flex items-center justify-center rounded transition-colors editor-btn-danger"
            :title="t('bubbleMenu.deleteImage')"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </template>
        <template v-else>
          <button
            @click="toggleBold"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded transition-colors',
              isBold ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.bold')"
          >
            <Bold class="w-4 h-4" />
          </button>
          <button
            @click="toggleItalic"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded transition-colors',
              isItalic ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.italic')"
          >
            <Italic class="w-4 h-4" />
          </button>
          <button
            @click="toggleUnderline"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded transition-colors',
              isUnderline ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.underline')"
          >
            <Underline class="w-4 h-4" />
          </button>
          <button
            @click="toggleStrike"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded transition-colors',
              isStrike ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.strike')"
          >
            <Strikethrough class="w-4 h-4" />
          </button>
          <div class="w-px h-6 mx-1 editor-divider"></div>
          <button
            @click="toggleBulletList"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded transition-colors',
              isBulletList ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.bulletList')"
          >
            <List class="w-4 h-4" />
          </button>
          <button
            @click="toggleOrderedList"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded transition-colors',
              isOrderedList ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.orderedList')"
          >
            <ListOrdered class="w-4 h-4" />
          </button>
          <div class="w-px h-6 mx-1 editor-divider"></div>
          <button
            @click="toggleBlockquote"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded transition-colors',
              isBlockquote ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.blockquote')"
          >
            <Quote class="w-4 h-4" />
          </button>
        </template>
      </BubbleMenu>

      <Teleport to="body">
        <div
          v-if="showLinkMenu"
          class="fixed z-[100] p-2 link-menu-popup editor-popup"
          :style="{ left: linkMenuPosition.x + 'px', top: linkMenuPosition.y + 'px' }"
        >
          <div class="py-1">
            <button
              @click="editLink"
              class="w-full px-4 py-2 text-left text-sm rounded editor-btn-default"
            >
              {{ t('linkMenu.edit') }}
            </button>
            <button
              @click="removeLink"
              class="w-full px-4 py-2 text-left text-sm rounded editor-btn-default"
            >
              {{ t('linkMenu.remove') }}
            </button>
          </div>
        </div>
      </Teleport>
      
      <Teleport to="body">
        <div
          v-if="showLinkMenu"
          class="fixed inset-0 z-[99]"
          @click="showLinkMenu = false"
        ></div>
      </Teleport>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { EditorContent } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { Trash2, Crop, AlignLeft, AlignRight, AlignCenter, Minus, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote } from 'lucide-vue-next'
import EditorToolbar from './EditorToolbar.vue'
import { useEditor } from '../composables/useEditor'
import { useExport } from '../composables/useExport'
import { useI18n } from '../composables/useI18n'
import { throttle } from '../utils/throttle'
import type { ImageLayoutType } from '../types/editor'
import type { Locale } from '../locales/types'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  editable?: boolean
  theme?: 'light' | 'dark' | 'auto'
  locale?: Locale
}>(), {
  modelValue: '',
  placeholder: '',
  editable: true,
  theme: 'light',
  locale: 'zh-CN',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'localeChange': [locale: Locale]
}>()

const { t, setLocale, locale: currentLocale } = useI18n()

const resolvedPlaceholder = computed(() => props.placeholder || t('placeholder'))

watch(() => props.locale, (newLocale) => {
  if (newLocale && newLocale !== currentLocale.value) {
    setLocale(newLocale)
  }
}, { immediate: true })

const editorContainerRef = ref<HTMLElement | null>(null)

const {
  editor,
  fontSize,
  fontFamily,
  textColor,
  highlightColor,
  isBold,
  isItalic,
  isUnderline,
  isStrike,
  isHighlight,
  isLink,
  headingLevel,
  textAlign,
  isBulletList,
  isOrderedList,
  isBlockquote,
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrike,
  toggleHighlight,
  toggleLink,
  setHeading,
  setAlign,
  toggleBulletList,
  toggleOrderedList,
  toggleBlockquote,
  setLink,
  unsetLink,
  setFontSize,
  setFontFamily,
  setTextColor,
  setHighlightColor,
  unsetTextColor,
  unsetHighlightColor,
  addImage,
  getHTML,
  setHTML,
} = useEditor({
  content: props.modelValue || '',
  placeholder: resolvedPlaceholder.value,
  editable: props.editable,
})

watch(resolvedPlaceholder, (newPlaceholder) => {
  if (editor.value) {
    editor.value.setOptions({
      editorProps: {
        attributes: {
          placeholder: newPlaceholder,
        },
      },
    })
  }
})

const { exportAs, getImagesForUpload, replaceImageSrc, replaceMultipleImages } = useExport(editor)

async function handleExport(format: string) {
  await exportAs(format as any)
}

const showLinkMenu = ref(false)
const linkMenuPosition = ref({ x: 0, y: 0 })
const currentLinkHref = ref('')

const isImageSelected = ref(false)
const currentImageLayout = ref<ImageLayoutType>('inline')
const currentImageWidth = ref(200)
const sliderWidth = ref(200)
const imageNodeRef = ref<HTMLElement | null>(null)

const effectiveTheme = computed(() => {
  if (props.theme !== 'auto') return props.theme
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
})

const bubbleMenuTippyOptions = computed(() => {
  if (isImageSelected.value && imageNodeRef.value) {
    return {
      placement: 'top' as const,
      getReferenceClientRect: () => imageNodeRef.value!.getBoundingClientRect(),
    }
  }
  return {}
})

const imageLayoutOptions = computed(() => [
  { label: t('bubbleMenu.imageLayout.inline'), value: 'inline' as ImageLayoutType, icon: Minus },
  { label: t('bubbleMenu.imageLayout.wrapLeft'), value: 'wrap-left' as ImageLayoutType, icon: AlignLeft },
  { label: t('bubbleMenu.imageLayout.wrapRight'), value: 'wrap-right' as ImageLayoutType, icon: AlignRight },
  { label: t('bubbleMenu.imageLayout.block'), value: 'block' as ImageLayoutType, icon: AlignCenter },
])

function shouldShowBubbleMenu({ editor }: { editor: any }) {
  const { selection } = editor.state
  const { empty, from, to } = selection
  let found = false
  editor.state.doc.nodesBetween(from, to, (node: any, pos: number) => {
    if (node.type.name === 'draggableImage') {
      found = true
      currentImageLayout.value = node.attrs.layout || 'inline'
      currentImageWidth.value = node.attrs.width || 200
      sliderWidth.value = node.attrs.width || 200
      const dom = editor.view.nodeDOM(pos) as HTMLElement | null
      imageNodeRef.value = dom
    }
  })
  isImageSelected.value = found
  if (found) return true
  if (empty) return false
  return true
}

function setImageLayout(layout: ImageLayoutType) {
  const ed = editor.value
  if (!ed) return
  const { state, view } = ed
  const { from, to } = state.selection
  state.doc.nodesBetween(from, to, (node: any, pos: number) => {
    if (node.type.name === 'draggableImage') {
      const tr = state.tr.setNodeAttribute(pos, 'layout', layout)
      view.dispatch(tr)
    }
  })
  currentImageLayout.value = layout
}

const throttledDispatchWidth = throttle((value: number) => {
  const ed = editor.value
  if (!ed) return
  const { state, view } = ed
  const { from, to } = state.selection
  state.doc.nodesBetween(from, to, (node: any, pos: number) => {
    if (node.type.name === 'draggableImage') {
      const tr = state.tr.setNodeAttribute(pos, 'width', value)
      view.dispatch(tr)
    }
  })
  currentImageWidth.value = value
}, 30)

function onSliderInput(e: Event) {
  const value = parseInt((e.target as HTMLInputElement).value, 10)
  sliderWidth.value = value
  throttledDispatchWidth(value)
}

function onSliderChange(e: Event) {
  const value = parseInt((e.target as HTMLInputElement).value, 10)
  sliderWidth.value = value
  currentImageWidth.value = value
}

function deleteImage() {
  const { state, view } = editor.value!
  const { from, to } = state.selection
  let pos: number | null = null
  state.doc.nodesBetween(from, to, (node: any, p: number) => {
    if (node.type.name === 'draggableImage') {
      pos = p
    }
  })
  if (pos !== null) {
    const tr = state.tr.delete(pos, pos + 1)
    view.dispatch(tr)
    view.focus()
  }
}

function startCropImage() {
  window.dispatchEvent(new CustomEvent('image-start-crop'))
}

function handleLinkClick(event: MouseEvent, href: string) {
  event.preventDefault()
  event.stopPropagation()
  
  if (event.ctrlKey || event.metaKey) {
    window.open(href, '_blank')
  } else {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    const menuHeight = 60
    const bottomSpace = window.innerHeight - rect.bottom
    
    let top = rect.bottom + 8
    if (bottomSpace < menuHeight) {
      top = rect.top - menuHeight - 8
    }
    
    linkMenuPosition.value = { x: rect.left, y: top }
    currentLinkHref.value = href
    showLinkMenu.value = true
  }
}

function editLink() {
  const newHref = prompt('请输入新的链接地址:', currentLinkHref.value)
  if (newHref && newHref.trim()) {
    editor.value!.chain().extendMarkRange('link').setLink({ href: newHref.trim() }).run()
  }
  showLinkMenu.value = false
}

function removeLink() {
  unsetLink()
  showLinkMenu.value = false
}

watch(() => props.modelValue, (newValue) => {
  if (newValue !== getHTML()) {
    setHTML(newValue)
  }
})

onMounted(() => {
  editor.value?.on('update', ({ transaction }) => {
    emit('update:modelValue', getHTML())
    if (transaction.selectionSet) {
      updateCurrentStyle()
    }
  })

  editor.value?.on('selectionUpdate', () => {
    updateCurrentStyle()
  })

  editor.value?.view.dom.addEventListener('mouseup', () => {
    updateCurrentStyle()
  })

  editor.value?.view.dom.addEventListener('keyup', () => {
    updateCurrentStyle()
  })

  editor.value?.view.dom.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const link = target.closest('a')
    if (link) {
      handleLinkClick(event, link.getAttribute('href') || '')
      return
    }
  })

  editor.value?.view.dom.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
    }
  })
})

onBeforeUnmount(() => {
})

function updateCurrentStyle() {
  if (!editor.value) return
  
  const { from, to } = editor.value.state.selection
  
  if (from === to) {
    fontSize.value = '16'
    fontFamily.value = 'sans-serif'
    return
  }
  
  const fontSizeResult: string[] = []
  const fontFamilyResult: string[] = []
  
  editor.value.state.doc.nodesBetween(from, to, (node) => {
    node.marks.forEach((mark) => {
      if (mark.type.name === 'textStyle') {
        const attrs = mark.attrs as Record<string, string>
        if (attrs.fontSize) {
          fontSizeResult.push(attrs.fontSize)
        }
        if (attrs.fontFamily) {
          fontFamilyResult.push(attrs.fontFamily)
        }
      }
    })
  })
  
  if (fontSizeResult.length > 0) {
    fontSize.value = fontSizeResult[0].replace('px', '')
  } else {
    fontSize.value = '16'
  }
  
  if (fontFamilyResult.length > 0) {
    fontFamily.value = fontFamilyResult[0].replace(/\s/g, '+')
  } else {
    fontFamily.value = 'sans-serif'
  }
}

defineExpose({
  editor,
  getHTML,
  setHTML,
  getImagesForUpload,
  replaceImageSrc,
  replaceMultipleImages,
})
</script>

<style scoped>
.vue-word-editor {
  min-height: 500px;
}

.editor-content {
  outline: none;
}

.editor-content :deep(h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 0.5em 0;
  color: inherit;
}

.editor-content :deep(h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.5em 0;
  color: inherit;
}

.editor-content :deep(h3) {
  font-size: 1.25em;
  font-weight: bold;
  margin: 0.5em 0;
  color: inherit;
}

.editor-content :deep(h4) {
  font-size: 1em;
  font-weight: bold;
  margin: 0.5em 0;
  color: inherit;
}

.editor-content :deep(h5) {
  font-size: 0.875em;
  font-weight: bold;
  margin: 0.5em 0;
  color: inherit;
}

.editor-content :deep(h6) {
  font-size: 0.75em;
  font-weight: bold;
  margin: 0.5em 0;
  color: inherit;
}

.editor-content :deep(p) {
  margin: 0.5em 0;
  line-height: 1.6;
  color: inherit;
}

.editor-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.5em 0;
  color: inherit;
}

.editor-content :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0.5em 0;
  color: inherit;
}

.editor-content :deep(li) {
  margin: 0.25em 0;
  color: inherit;
}

.editor-content :deep(blockquote) {
  border-left: 4px solid var(--editor-primary-color, #3b82f6);
  padding-left: 1rem;
  margin: 1em 0;
  color: var(--editor-text-secondary, #6b7280);
  background-color: var(--editor-toolbar-bg, #f3f4f6);
  padding: 0.5rem 1rem;
  border-radius: 0 0.25rem 0.25rem 0;
}

.editor-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.25rem;
}

.editor-content :deep(mark) {
  background-color: #ffff00;
  padding: 0 0.2em;
  color: inherit;
}

.editor-content :deep(a) {
  color: var(--editor-primary-color, #3b82f6);
  text-decoration: underline;
}

.editor-content :deep(strong) {
  font-weight: bold;
}

.editor-content :deep(em) {
  font-style: italic;
}

.editor-content :deep(s) {
  text-decoration: line-through;
}

@media (max-width: 640px) {
  .vue-word-editor {
    min-height: 400px;
  }
}
</style>