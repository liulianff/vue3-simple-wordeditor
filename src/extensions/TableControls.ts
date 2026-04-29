import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { NodeSelection, TextSelection } from 'prosemirror-state'
import type { Node as ProseMirrorNode } from 'prosemirror-model'

const plusSvg = '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>'
const minusSvg = '<line x1="5" y1="12" x2="19" y2="12"></line>'

function createButton(title: string, svgPath: string, onMouseDown: (e: MouseEvent) => void): HTMLElement {
  const btn = document.createElement('div')
  btn.className = 'table-control-btn'
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgPath}</svg>`
  btn.title = title
  btn.addEventListener('mousedown', onMouseDown)
  return btn
}

function findFirstCellInTable(tableNode: ProseMirrorNode, tablePos: number): number | null {
  let cellPos: number | null = null
  tableNode.descendants((node, pos) => {
    if (cellPos !== null) return false
    if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
      cellPos = tablePos + 1 + pos + 1
      return false
    }
    return true
  })
  return cellPos
}

export const TableControls = Extension.create({
  name: 'tableControls',

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { state } = this.editor.view
        if (state.selection instanceof NodeSelection && state.selection.node.type.name === 'table') {
          this.editor.commands.deleteTable()
          return true
        }
        return false
      },
    }
  },

  addProseMirrorPlugins() {
    const editor = this.editor

    return [
      new Plugin({
        key: new PluginKey('tableControls'),
        appendTransaction: (transactions, _oldState, newState) => {
          const docChanged = transactions.some(tr => tr.docChanged)
          if (!docChanged) return null

          const { doc } = newState
          const topNodes = doc.content.content
          let tr: any = null

          for (let i = topNodes.length - 1; i >= 0; i--) {
            const node = topNodes[i]
            if (node.type.name === 'table') {
              const next = topNodes[i + 1]
              if (!next || next.type.name === 'table') {
                if (!tr) tr = newState.tr
                let pos = 0
                for (let j = 0; j <= i; j++) {
                  pos += topNodes[j].nodeSize
                }
                tr.insert(pos, newState.schema.nodes.paragraph.create())
              }
            }
          }

          return tr
        },
        props: {
          decorations: (state) => {
            const decorations: Decoration[] = []
            const { doc } = state

            doc.descendants((node, pos) => {
              if (node.type.name === 'table') {
                const tableEnd = pos + node.nodeSize
                const tablePos = pos

                decorations.push(
                  Decoration.widget(tableEnd, () => {
                    const container = document.createElement('div')
                    container.className = 'table-controls-container'
                    container.contentEditable = 'false'

                    const addRowBtn = createButton('添加行', plusSvg, (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const view = editor.view
                      const tableNode = view.state.doc.nodeAt(tablePos)
                      if (!tableNode) return
                      const cellPos = findFirstCellInTable(tableNode, tablePos)
                      if (cellPos === null) return
                      view.focus()
                      const $pos = view.state.doc.resolve(cellPos)
                      view.dispatch(view.state.tr.setSelection(TextSelection.near($pos)))
                      editor.chain().addRowAfter().run()
                    })
                    addRowBtn.classList.add('table-control-add-row')
                    container.appendChild(addRowBtn)

                    const deleteRowBtn = createButton('删除行', minusSvg, (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const view = editor.view
                      const tableNode = view.state.doc.nodeAt(tablePos)
                      if (!tableNode) return
                      const cellPos = findFirstCellInTable(tableNode, tablePos)
                      if (cellPos === null) return
                      view.focus()
                      const $pos = view.state.doc.resolve(cellPos)
                      view.dispatch(view.state.tr.setSelection(TextSelection.near($pos)))
                      editor.chain().deleteRow().run()
                    })
                    deleteRowBtn.classList.add('table-control-delete-row')
                    container.appendChild(deleteRowBtn)

                    return container
                  }, { side: 1 })
                )
              }
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})
