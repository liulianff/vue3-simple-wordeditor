import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import type { ShallowRef } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { generateFilename } from './utils'

export function useExporterPDF(_editor: ShallowRef<Editor | undefined>) {
  async function exportAsPDF() {
    const editorEl = document.querySelector('.vue-word-editor .tiptap') as HTMLElement
    if (!editorEl) return

    try {
      const canvas = await html2canvas(editorEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: editorEl.offsetWidth,
      })

      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 40
      const contentWidth = pageWidth - margin * 2
      const contentHeight = (canvas.height * contentWidth) / canvas.width
      let heightLeft = contentHeight
      let position = margin

      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - contentHeight + margin
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight)
        heightLeft -= pageHeight
      }

      pdf.save(generateFilename('pdf'))
    } catch (error) {
      console.error('PDF export failed:', error)
    }
  }

  return { exportAsPDF }
}
