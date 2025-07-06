// web/src/pages/ViewInspectionPage/ViewInspectionPage.js

import { useState } from 'react'

import { PDFDownloadLink } from '@react-pdf/renderer'
import type { FindInspectionQuery } from 'types/graphql'

import { useParams } from '@cedarjs/router'

import InspectionCell from 'src/components/InspectionCell'
import InspectionPDF from 'src/components/InspectionPDF/InspectionPDF'
import { Button } from 'src/components/ui/Button'

const ViewInspectionPage = () => {
  const { id } = useParams()
  const [inspectionData, setInspectionData] = useState<NonNullable<
    FindInspectionQuery['inspection']
  > | null>(null)

  const handleInspectionLoaded = (
    data: NonNullable<FindInspectionQuery['inspection']>
  ) => {
    setInspectionData(data)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">View Inspection</h1>
      <div id="inspection-content">
        <InspectionCell id={parseInt(id)} onSuccess={handleInspectionLoaded} />
      </div>
      {inspectionData && (
        <PDFDownloadLink
          document={<InspectionPDF inspection={inspectionData} />}
          fileName="inspection-report.pdf"
        >
          {({ loading }) =>
            loading ? (
              <Button disabled>Loading document...</Button>
            ) : (
              <Button className="mt-6">Export to PDF</Button>
            )
          }
        </PDFDownloadLink>
      )}
    </div>
  )
}

export default ViewInspectionPage
