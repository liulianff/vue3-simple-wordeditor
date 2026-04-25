import { useEditor as useTiptapEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle, FontSize, FontFamily } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { ref, computed } from 'vue'
import Link  from '@tiptap/extension-link'
import { DraggableImage } from '../extensions/DraggableImage'
import type { ImageAttributes } from '../types/editor'

type Level = 1 | 2 | 3 | 4 | 5 | 6

export function useEditor({ placeholder = '开始编辑...', content = '', editable = true } = {}) {
  const isReady = ref(false)
  
  const editor = useTiptapEditor({
    content,
    editable,
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6] as Level[],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      DraggableImage.configure({}),
      TextStyle,
      FontSize.configure({
        types: ['textStyle'],
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({ multicolor: true }),
      Link.configure({
      openOnClick: false,
      enableClickSelection: true,
    }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
        placeholder,
      },
    },
    onCreate: () => {
      isReady.value = true
    },
  })

  const fontSize = ref('16')
  const fontFamily = ref('sans-serif')
  const textColor = ref('#000000')
  const highlightColor = ref('#ffff00')

  const isBold = computed(() => editor.value?.isActive('bold') ?? false)
  const isItalic = computed(() => editor.value?.isActive('italic') ?? false)
  const isUnderline = computed(() => editor.value?.isActive('underline') ?? false)
  const isStrike = computed(() => editor.value?.isActive('strike') ?? false)
  const isHighlight = computed(() => editor.value?.isActive('highlight') ?? false)
  const isLink = computed(() => editor.value?.isActive('link') ?? false)

  const headingLevel = computed(() => {
    if (!editor.value) return null
    const attrs = editor.value.getAttributes('heading')
    return attrs?.level as number | null
  })

  const textAlign = computed(() => {
    if (!editor.value) return 'left'
    const paragraphAttrs = editor.value.getAttributes('paragraph')
    const headingAttrs = editor.value.getAttributes('heading')
    return paragraphAttrs?.textAlign || headingAttrs?.textAlign || 'left'
  })

  const isBulletList = computed(() => editor.value?.isActive('bulletList') ?? false)
  const isOrderedList = computed(() => editor.value?.isActive('orderedList') ?? false)
  const isBlockquote = computed(() => editor.value?.isActive('blockquote') ?? false)

  function ensureReady() {
    return isReady.value && editor.value
  }

  function ensureFocus() {
    if (!ensureReady()) return false
    if (!editor.value!.isFocused) {
      editor.value!.commands.focus()
    }
    return true
  }

  function toggleBold() {
    if (!ensureFocus()) return
    editor.value!.commands.toggleBold()
  }

  function toggleItalic() {
    if (!ensureFocus()) return
    editor.value!.commands.toggleItalic()
  }

  function toggleUnderline() {
    if (!ensureFocus()) return
    editor.value!.commands.toggleUnderline()
  }

  function toggleStrike() {
    if (!ensureFocus()) return
    editor.value!.commands.toggleStrike()
  }

  function toggleHighlight() {
    if (!ensureFocus()) return
    editor.value!.commands.toggleHighlight({ color: highlightColor.value })
  }

  function setHeading(level: number) {
    if (!ensureFocus()) return
    if (level === 0) {
      editor.value!.commands.setParagraph()
      return
    }
    const l = level as Level
    if (headingLevel.value === level) {
      editor.value!.commands.setParagraph()
    } else {
      editor.value!.commands.toggleHeading({ level: l })
    }
  }

  function setAlign(align: string) {
    if (!ensureFocus()) return
    editor.value!.commands.setTextAlign(align)
  }

  function toggleBulletList() {
    if (!ensureFocus()) return
    editor.value!.commands.toggleBulletList()
  }

  function toggleOrderedList() {
    if (!ensureFocus()) return
    editor.value!.commands.toggleOrderedList()
  }

  function toggleBlockquote() {
    if (!ensureFocus()) return
    editor.value!.commands.toggleBlockquote()
  }

  function setLink(href: string, target: string = '_blank') {
    if (!ensureFocus()) return
    editor.value!.chain().extendMarkRange('link').setLink({ href, target }).run()
  }

  function unsetLink() {
    if (!ensureFocus()) return
    editor.value!.chain().extendMarkRange('link').unsetLink().run()
  }

  function toggleLink() {
    if (!ensureFocus()) return
    if (isLink.value) {
      editor.value!.chain().extendMarkRange('link').unsetLink().run()
    }
  }

  function setFontSize(size: string) {
    fontSize.value = size
    if (!ensureFocus()) return
    editor.value!.commands.setMark('textStyle', { fontSize: `${size}px` })
  }

  function setFontFamily(family: string) {
    fontFamily.value = family
    if (!ensureFocus()) return
    editor.value!.commands.setMark('textStyle', { fontFamily: family.replace('+', ' ') })
  }

  function setTextColor(color: string) {
    textColor.value = color
    if (!ensureReady()) return
    if (editor.value!.isFocused) {
      editor.value!.commands.setColor(color)
    } else {
      editor.value!.commands.focus()
      setTimeout(() => {
        editor.value!.commands.setColor(color)
      }, 10)
    }
  }

  function setHighlightColor(color: string) {
    highlightColor.value = color
    if (!ensureReady()) return
    if (editor.value!.isFocused) {
      editor.value!.commands.toggleHighlight({ color })
    } else {
      editor.value!.commands.focus()
      setTimeout(() => {
        editor.value!.commands.toggleHighlight({ color })
      }, 10)
    }
  }

  function unsetTextColor() {
    if (!ensureReady()) return
    if (editor.value!.isFocused) {
      editor.value!.commands.unsetColor()
    } else {
      editor.value!.commands.focus()
      setTimeout(() => {
        editor.value!.commands.unsetColor()
      }, 10)
    }
  }

  function unsetHighlightColor() {
    highlightColor.value = '#ffff00'
    if (!ensureReady()) return
    if (editor.value!.isFocused) {
      editor.value!.commands.unsetHighlight()
    } else {
      editor.value!.commands.focus()
      setTimeout(() => {
        editor.value!.commands.unsetHighlight()
      }, 10)
    }
  }

  function addImage(src?: string, alt: string = '') {
    if (!ensureFocus()) return

    if (src) {
      const img = new Image()
      img.onload = () => {
        const naturalWidth = img.naturalWidth
        const maxWidth = 800
        const displayWidth = Math.min(naturalWidth, maxWidth)
        editor.value!.commands.setDraggableImage({
          src,
          alt,
          width: displayWidth,
          height: img.naturalHeight
        })
      }
      img.onerror = () => {
        editor.value!.commands.setDraggableImage({ src, alt })
      }
      img.src = src
    } else {
      // 弹出文件选择器
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const result = event.target?.result as string
            addImage(result, file.name)
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
    }
  }

  function updateImageAttributes(attrs: Partial<ImageAttributes>) {
    if (!editor.value) return
    editor.value.commands.updateImageAttributes(attrs)
  }

  function getHTML() {
    if (!editor.value) return ''
    let html = editor.value.getHTML()
    // 处理空段落，用 &nbsp; 填充
    html = html
      .replace(/<p\s*>\s*<\/p>/gi, '<p>&nbsp;</p>')
      .replace(/<p\s+[^>]*>\s*<\/p>/gi, (match) => match.replace(/><\/p>/, '>&nbsp;</p>'))
    return html
  }

  function setHTML(html: string) {
    if (!editor.value) return
    editor.value.commands.setContent(html)
  }

  function setJSON(json: any) {
    if (!editor.value) return
    editor.value.commands.setContent(json)
  }

  return {
    editor,
    isReady,
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
    updateImageAttributes,
    getHTML,
    setHTML,
    setJSON,
  }
}
