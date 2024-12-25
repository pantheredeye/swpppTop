// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const OrganizationSettingsPage = () => {
  return (
    <>
      <Metadata
        title="OrganizationSettings"
        description="OrganizationSettings page"
      />

      <h1>OrganizationSettingsPage</h1>
      <p>
        Find me in{' '}
        <code>
          ./web/src/pages/OrganizationSettingsPage/OrganizationSettingsPage.tsx
        </code>
      </p>
      {/*
          My default route is named `organizationSettings`, link to me with:
          `<Link to={routes.organizationSettings()}>OrganizationSettings</Link>`
      */}
    </>
  )
}

export default OrganizationSettingsPage
