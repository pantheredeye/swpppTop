// web/src/pages/OrganizationSettingsPage/OrganizationSettingsPage.jsx
import { useParams } from '@cedarjs/router'
import { Metadata } from '@cedarjs/web'

import DeleteOrganization from 'src/components/OrganizationSettings/DeleteOrganization/DeleteOrganization'
import GeneralSettings from 'src/components/OrganizationSettings/GeneralSettings/GeneralSettings'
import MembersSettings from 'src/components/OrganizationSettings/MembersSettings/MembersSettings'
import RolesSettings from 'src/components/OrganizationSettings/RolesSettings/RolesSettings'
import OrganizationSettingsLayout from 'src/layouts/OrganizationSettingsLayout/OrganizationSettingsLayout'

const OrganizationSettingsPage = () => {
  const { organizationId, tab = 'general' } = useParams()

  const renderTabContent = () => {
    switch (tab) {
      case 'general':
        return <GeneralSettings organizationId={organizationId} />
      case 'roles':
        return <RolesSettings organizationId={organizationId} />
      case 'members':
        return <MembersSettings organizationId={organizationId} />
      case 'delete':
        return <DeleteOrganization />
      default:
        return <GeneralSettings organizationId={organizationId} />
    }
  }

  return (
    <OrganizationSettingsLayout>
      <Metadata title="Organization Settings" />
      <div className="max-w-full overflow-x-hidden">{renderTabContent()}</div>
    </OrganizationSettingsLayout>
  )
}

export default OrganizationSettingsPage
