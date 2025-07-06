// ExportPDFButton.tsx
import { pdf } from '@react-pdf/renderer'

import InspectionPDF from 'src/components/InspectionPDF/InspectionPDF'
import { useFetchInspection } from 'src/utils/fetchInspection'

interface ExportPDFButtonProps {
  inspectionId: number
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ inspectionId }) => {
  const { fetchInspection, loading, error } = useFetchInspection()

  const handleExportPDF = async () => {
    if (loading) return
    if (error) {
      console.error('Error fetching inspection data:', error)
      return
    }

    try {
      const data = await fetchInspection(inspectionId)
      const pdfDoc = <InspectionPDF inspection={data} />
      const blob = await pdf(pdfDoc).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${data.title || 'inspection'}-${inspectionId}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error generating PDF:', err)
    }
  }

  return (
    <button onClick={handleExportPDF} disabled={loading}>
      {loading ? 'Generating PDF...' : 'Export PDF'}
    </button>
  )
}

export default ExportPDFButton
