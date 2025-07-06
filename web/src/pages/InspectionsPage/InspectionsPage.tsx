import { Metadata } from '@cedarjs/web'

import InspectionsListCell from 'src/components/InspectionsListCell'

const InspectionsPage = () => {
  return (
    <>
      <Metadata title="Inspections" description="Inspections page" />

      <InspectionsListCell />
    </>
  )
}

export default InspectionsPage
