import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageNodeView from '../components/ImageNodeView.vue'
import type { ImageAttributes, ImageLayoutType, CropData } from '../types/editor'

export interface DraggableImageOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    draggableImage: {
      setDraggableImage: (attrs: ImageAttributes) => ReturnType
      updateImageAttributes: (attrs: Partial<ImageAttributes>) => ReturnType
    }
  }
}

export const DraggableImage = Node.create<DraggableImageOptions>({
  name: 'draggableImage',

  group: 'inline',

  inline: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: (el) => {
          const w = el.getAttribute('width')
          return w ? parseInt(w, 10) : null
        },
        renderHTML: (attrs) => {
          if (!attrs.width) return {}
          return { width: attrs.width }
        },
      },
      height: {
        default: null,
        parseHTML: (el) => {
          const h = el.getAttribute('height')
          return h ? parseInt(h, 10) : null
        },
        renderHTML: (attrs) => {
          if (!attrs.height) return {}
          return { height: attrs.height }
        },
      },
      layout: {
        default: 'inline' as ImageLayoutType,
        parseHTML: (el) => {
          const layout = el.getAttribute('data-layout')
          if (layout && ['inline', 'block', 'wrap-left', 'wrap-right', 'break'].includes(layout)) {
            return layout as ImageLayoutType
          }
          if (el.classList.contains('wrap-left')) return 'wrap-left'
          if (el.classList.contains('wrap-right')) return 'wrap-right'
          if (el.classList.contains('block')) return 'block'
          return 'inline'
        },
        renderHTML: (attrs) => {
          if (!attrs.layout || attrs.layout === 'inline') return {}
          return { 'data-layout': attrs.layout }
        },
      },
      crop: {
        default: null,
        parseHTML: (el) => {
          const raw = el.getAttribute('data-crop')
          if (!raw) return null
          try {
            return JSON.parse(raw) as CropData
          } catch {
            return null
          }
        },
        renderHTML: (attrs) => {
          if (!attrs.crop) return {}
          return { 'data-crop': JSON.stringify(attrs.crop) }
        },
      },
      marginTop: {
        default: 0,
      },
      marginRight: {
        default: 16,
      },
      marginBottom: {
        default: 8,
      },
      marginLeft: {
        default: 16,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (el) => {
          if (typeof el === 'string') return {}
          const img = el as HTMLImageElement
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            width: img.getAttribute('width') ? parseInt(img.getAttribute('width')!, 10) : null,
            height: img.getAttribute('height') ? parseInt(img.getAttribute('height')!, 10) : null,
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = HTMLAttributes as Record<string, any>
    const classes: string[] = []

    if (attrs.layout === 'wrap-left') classes.push('wrap-left')
    else if (attrs.layout === 'wrap-right') classes.push('wrap-right')
    else if (attrs.layout === 'block') classes.push('block')

    const style: Record<string, string> = {}
    if (attrs.layout === 'wrap-left') {
      style.marginRight = `${attrs.marginRight ?? 16}px`
      style.marginBottom = `${attrs.marginBottom ?? 8}px`
    } else if (attrs.layout === 'wrap-right') {
      style.marginLeft = `${attrs.marginLeft ?? 16}px`
      style.marginBottom = `${attrs.marginBottom ?? 8}px`
    }

    const styleStr = Object.entries(style)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ')

    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: classes.join(' '),
        style: styleStr || undefined,
        'data-layout': attrs.layout !== 'inline' ? attrs.layout : undefined,
      }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageNodeView as any)
  },

  addCommands() {
    return {
      setDraggableImage:
        (attrs: ImageAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: attrs.src,
              alt: attrs.alt || '',
              title: attrs.title || '',
              width: attrs.width || null,
              height: attrs.height || null,
              layout: attrs.layout || 'inline',
              marginTop: attrs.marginTop || 0,
              marginRight: attrs.marginRight ?? 16,
              marginBottom: attrs.marginBottom ?? 8,
              marginLeft: attrs.marginLeft ?? 16,
            },
          })
        },
      updateImageAttributes:
        (attrs: Partial<ImageAttributes>) =>
        ({ editor }) => {
          const { from, to } = editor.state.selection
          const nodes: { pos: number; node: any }[] = []
          editor.state.doc.nodesBetween(from, to, (node: any, pos: number) => {
            if (node.type.name === this.name) {
              nodes.push({ pos, node })
            }
          })
          if (nodes.length > 0) {
            const tr = editor.state.tr
            nodes.forEach(({ pos }) => {
              Object.entries(attrs).forEach(([key, value]) => {
                if (value !== undefined) {
                  tr.setNodeAttribute(pos, key, value)
                }
              })
            })
            editor.view.dispatch(tr)
            return true
          }
          return false
        },
    }
  },
})
