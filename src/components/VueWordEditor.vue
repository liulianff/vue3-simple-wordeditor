<template>
  <div class="vue-word-editor flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm">
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
      />
    </div>

    <div class="flex-1 overflow-auto p-4 relative">
      <EditorContent
        :editor="editor"
        class="editor-content focus:outline-none min-h-[400px]"
      />
      
      <BubbleMenu
        v-if="editor"
        :editor="editor"
        class="bubble-menu flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-lg shadow-lg"
      >
        <button
          @click="toggleBold"
          :class="[
            'w-8 h-8 flex items-center justify-center rounded transition-colors',
            isBold ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
          ]"
          title="加粗"
        >
          <strong>B</strong>
        </button>
        <button
          @click="toggleItalic"
          :class="[
            'w-8 h-8 flex items-center justify-center rounded transition-colors',
            isItalic ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
          ]"
          title="斜体"
        >
          <em>I</em>
        </button>
        <button
          @click="toggleUnderline"
          :class="[
            'w-8 h-8 flex items-center justify-center rounded transition-colors',
            isUnderline ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
          ]"
          title="下划线"
        >
          <u>U</u>
        </button>
        <button
          @click="toggleStrike"
          :class="[
            'w-8 h-8 flex items-center justify-center rounded transition-colors',
            isStrike ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
          ]"
          title="删除线"
        >
          <s>S</s>
        </button>
        <div class="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          @click="toggleBulletList"
          :class="[
            'w-8 h-8 flex items-center justify-center rounded transition-colors',
            isBulletList ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
          ]"
          title="无序列表"
        >
          •
        </button>
        <button
          @click="toggleOrderedList"
          :class="[
            'w-8 h-8 flex items-center justify-center rounded transition-colors',
            isOrderedList ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
          ]"
          title="有序列表"
        >
          1.
        </button>
        <div class="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          @click="toggleBlockquote"
          :class="[
            'w-8 h-8 flex items-center justify-center rounded transition-colors',
            isBlockquote ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
          ]"
          title="引用"
        >
          "
        </button>
      </BubbleMenu>
      
      <Teleport to="body">
        <div
          v-if="showLinkMenu"
          class="fixed z-[100] bg-white border border-gray-200 rounded-lg shadow-lg p-2"
          :style="{ left: linkMenuPosition.x + 'px', top: linkMenuPosition.y + 'px' }"
        >
          <div class="py-1">
            <button
              @click="editLink"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              修改链接
            </button>
            <button
              @click="removeLink"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              取消链接
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
import { ref, watch, onMounted } from 'vue'
import { EditorContent } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import EditorToolbar from './EditorToolbar.vue'
import { useEditor } from '../composables/useEditor'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  editable?: boolean
}>(), {
  modelValue: '',
  placeholder: '开始编辑...',
  editable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

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
  placeholder: props.placeholder,
  editable: props.editable,
})

const showLinkMenu = ref(false)
const linkMenuPosition = ref({ x: 0, y: 0 })
const currentLinkHref = ref('')

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
    }
  })
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
}

.editor-content :deep(h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.5em 0;
}

.editor-content :deep(h3) {
  font-size: 1.25em;
  font-weight: bold;
  margin: 0.5em 0;
}

.editor-content :deep(h4) {
  font-size: 1em;
  font-weight: bold;
  margin: 0.5em 0;
}

.editor-content :deep(h5) {
  font-size: 0.875em;
  font-weight: bold;
  margin: 0.5em 0;
}

.editor-content :deep(h6) {
  font-size: 0.75em;
  font-weight: bold;
  margin: 0.5em 0;
}

.editor-content :deep(p) {
  margin: 0.5em 0;
  line-height: 1.6;
}

.editor-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.5em 0;
}

.editor-content :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0.5em 0;
}

.editor-content :deep(li) {
  margin: 0.25em 0;
}

.editor-content :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin: 1em 0;
  color: #6b7280;
  background-color: #f3f4f6;
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
}

.editor-content :deep(a) {
  color: #3b82f6;
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
