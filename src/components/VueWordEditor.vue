<template>
  <div class="vue-word-editor editor-container" :class="{ dark: effectiveTheme === 'dark' }" :data-theme="effectiveTheme">
    <div class="editor-toolbar-wrapper">
      <EditorToolbar
      :editor="editor"
      :is-dark="effectiveTheme === 'dark'"
      @export="handleExport"
      @insert-image="addImage"
      @set-link="setLink"
      @open-preview="openExportPreview"
      />
    </div>

    <div class="editor-content-wrapper" ref="editorContainerRef">
      <EditorContent
        :editor="editor"
        class="editor-content"
      />
      
      <BubbleMenu
        v-if="editor"
        :editor="editor"
        :should-show="shouldShowBubbleMenu"
        :tippy-options="bubbleMenuTippyOptions"
        class="bubble-menu editor-popup"
      >
        <template v-if="isImageSelected">
          <button
            @click="toggleBulletList"
            :class="[
              'editor-button',
              isBulletList ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.bulletList')"
          >
            <List class="icon" />
          </button>
          <button
            @click="toggleOrderedList"
            :class="[
              'editor-button',
              isOrderedList ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.orderedList')"
          >
            <ListOrdered class="icon" />
          </button>
          <button
            @click="toggleBlockquote"
            :class="[
              'editor-button',
              isBlockquote ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.blockquote')"
          >
            <Quote class="icon" />
          </button>
          <div class="editor-divider"></div>
          <button
            v-for="opt in imageLayoutOptions"
            :key="opt.value"
            @click="setImageLayout(opt.value)"
            :class="[
              'editor-button',
              currentImageLayout === opt.value ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="opt.label"
          >
            <component :is="opt.icon" class="icon" />
          </button>
          <div class="editor-divider"></div>
          <span class="slider-container">
            <input
              type="range"
              :value="sliderWidth"
              @input="onSliderInput"
              @change="onSliderChange"
              min="30"
              max="800"
              class="editor-slider"
            />
            <span class="slider-label editor-text-secondary">{{ sliderWidth }}px</span>
          </span>
          <div class="editor-divider"></div>
          <button
            @click="startCropImage"
            class="editor-button editor-btn-default"
            :title="t('bubbleMenu.cropImage')"
          >
            <Crop class="icon" />
          </button>
          <button
            @click="deleteImage"
            class="editor-button editor-btn-danger"
            :title="t('bubbleMenu.deleteImage')"
          >
            <Trash2 class="icon" />
          </button>
        </template>
        <template v-else>
          <button
            @click="toggleBold"
            :class="[
              'editor-button',
              isBold ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.bold')"
          >
            <Bold class="icon" />
          </button>
          <button
            @click="toggleItalic"
            :class="[
              'editor-button',
              isItalic ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.italic')"
          >
            <Italic class="icon" />
          </button>
          <button
            @click="toggleUnderline"
            :class="[
              'editor-button',
              isUnderline ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.underline')"
          >
            <Underline class="icon" />
          </button>
          <button
            @click="toggleStrike"
            :class="[
              'editor-button',
              isStrike ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.strike')"
          >
            <Strikethrough class="icon" />
          </button>
          <div class="editor-divider"></div>
          <button
            @click="toggleBulletList"
            :class="[
              'editor-button',
              isBulletList ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.bulletList')"
          >
            <List class="icon" />
          </button>
          <button
            @click="toggleOrderedList"
            :class="[
              'editor-button',
              isOrderedList ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.orderedList')"
          >
            <ListOrdered class="icon" />
          </button>
          <div class="editor-divider"></div>
          <button
            @click="toggleBlockquote"
            :class="[
              'editor-button',
              isBlockquote ? 'editor-btn-active' : 'editor-btn-default'
            ]"
            :title="t('bubbleMenu.blockquote')"
          >
            <Quote class="icon" />
          </button>
        </template>
      </BubbleMenu>

      <Teleport to="body">
        <div
          v-if="showLinkMenu"
          class="editor-popup-fixed link-menu-popup editor-popup"
          :style="{ left: linkMenuPosition.x + 'px', top: linkMenuPosition.y + 'px' }"
          @click.stop
        >
          <div class="link-menu-content">
            <button
              @click="editLink"
              class="link-menu-item editor-btn-default"
            >
              {{ t('linkMenu.edit') }}
            </button>
            <button
              @click="removeLink"
              class="link-menu-item editor-btn-default"
            >
              {{ t('linkMenu.remove') }}
            </button>
          </div>
        </div>
      </Teleport>

      <Teleport to="body">
        <div
          v-if="showLinkEditDialog"
          class="editor-popup-fixed link-edit-dialog editor-popup"
          :style="{ left: linkEditPosition.x + 'px', top: linkEditPosition.y + 'px' }"
          @click.stop
        >
          <div class="link-edit-dialog-content">
            <input
              v-model="linkEditUrl"
              type="url"
              placeholder="https://..."
              class="editor-input link-edit-input"
            />
            <div class="link-edit-dialog-buttons">
              <button @click="cancelLinkEdit" class="link-edit-dialog-btn editor-btn-secondary">
                {{ t('toolbar.linkDialog.cancel') }}
              </button>
              <button @click="confirmLinkEdit" class="link-edit-dialog-btn editor-btn-primary">
                {{ t('toolbar.linkDialog.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <Teleport to="body">
        <ExportPreview
          ref="exportPreviewRef"
          :visible="showExportPreview"
          @close="showExportPreview = false"
        />
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
import ExportPreview from './ExportPreview.vue'
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
  isBold,
  isItalic,
  isUnderline,
  isStrike,
  isBulletList,
  isOrderedList,
  isBlockquote,
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrike,
  toggleBulletList,
  toggleOrderedList,
  toggleBlockquote,
  setLink,
  unsetLink,
  addImage,
  setHTML,
  setJSON,
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

const { exportAs, getHTML, getJSON, getMarkdown, getImagesForUpload, replaceImageSrc, replaceMultipleImages } = useExport(editor)

async function handleExport(format: string) {
  await exportAs(format as any)
}

const showLinkMenu = ref(false)
const linkMenuPosition = ref({ x: 0, y: 0 })
const currentLinkHref = ref('')
const showLinkEditDialog = ref(false)
const linkEditUrl = ref('')
const linkEditPosition = ref({ x: 0, y: 0 })
const showExportPreview = ref(false)
const exportPreviewRef = ref()

async function openExportPreview() {
  if (!editor.value) return
  
  const finalHTML = getHTML()
  const finalJSON = await getJSON()
  const finalMarkdown = await getMarkdown()
  
  console.log('Export preview data:', { finalHTML, finalJSON, finalMarkdown })
  
  showExportPreview.value = true
  
  setTimeout(() => {
    exportPreviewRef.value?.open(finalHTML, finalJSON, finalMarkdown)
  }, 0)
}

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
      const attrs = node.attrs
      const tr = state.tr.setNodeAttribute(pos, 'layout', layout)
      // 根据 layout 设置对应的内联 style
      let style = ''
      if (layout === 'wrap-left') {
        style = `float:left; margin-right:${attrs.marginRight ?? 16}px; margin-bottom:${attrs.marginBottom ?? 8}px`
      } else if (layout === 'wrap-right') {
        style = `float:right; margin-left:${attrs.marginLeft ?? 16}px; margin-bottom:${attrs.marginBottom ?? 8}px`
      } else if (layout === 'block') {
        style = `display:block; margin:0 auto`
      }
      // inline 时清空 style（也可保留为空）
      tr.setNodeAttribute(pos, 'style', style || null)
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
  linkEditUrl.value = currentLinkHref.value
  // 显示链接编辑对话框
  showLinkEditDialog.value = true
  // 位置设置为与链接菜单相同
  linkEditPosition.value = { ...linkMenuPosition.value }
  showLinkMenu.value = false
}

function confirmLinkEdit() {
  if (linkEditUrl.value && linkEditUrl.value.trim()) {
    editor.value!.chain().extendMarkRange('link').setLink({ href: linkEditUrl.value.trim() }).run()
  }
  showLinkEditDialog.value = false
  linkEditUrl.value = ''
}

function cancelLinkEdit() {
  showLinkEditDialog.value = false
  linkEditUrl.value = ''
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

// 点击文档其他地方关闭链接菜单和编辑对话框
function handleDocumentClick() {
  showLinkMenu.value = false
  showLinkEditDialog.value = false
  linkEditUrl.value = ''
}

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
      showLinkMenu.value = false
      showLinkEditDialog.value = false
      linkEditUrl.value = ''
    }
  })

  // 添加文档点击事件监听
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  // 移除文档点击事件监听
  document.removeEventListener('click', handleDocumentClick)
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
  setJSON,
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

.link-menu-popup {
  width: 120px;
}

.link-menu-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.link-menu-item {
  padding: 0.5rem;
  text-align: left;
  border: none;
  background: transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--editor-text-color, #1f2937);
}

.link-menu-item:hover {
  background-color: var(--editor-border-color, #e5e7eb);
}

.link-edit-dialog {
  width: 200px;
}

.link-edit-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
}

.link-edit-input {
  width: 100%;
}

.link-edit-dialog-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.link-edit-dialog-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

@media (max-width: 640px) {
  .vue-word-editor {
    min-height: 400px;
  }
}
</style>