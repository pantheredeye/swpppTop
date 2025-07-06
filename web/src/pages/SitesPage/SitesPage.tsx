import { Metadata } from '@cedarjs/web'

import SitesListCell from 'src/components/SitesListCell'

const SitesPage = () => {
  return (
    <>
      <Metadata title="Sites" description="Sites page" />

      <SitesListCell />
    </>
  )
}

export default SitesPage
