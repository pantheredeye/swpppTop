// web/src/pages/OrganizationSettingsPage/OrganizationSettingsPage.jsx
import { useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import OrganizationSettingsLayout from 'src/layouts/OrganizationSettingsLayout'
import GeneralSettings from 'src/components/OrganizationSettings/GeneralSettings'
import RolesSettings from 'src/components/OrganizationSettings/RolesSettings'
import MembersSettings from 'src/components/OrganizationSettings/MembersSettings'
import DeleteOrganization from 'src/components/OrganizationSettings/DeleteOrganization'

const OrganizationSettingsPage = () => {
  const { organizationId, tab = 'general' } = useParams()

  const renderTabContent = () => {
    switch (tab) {
      case 'general':
        return <GeneralSettings />
      case 'roles':
        return <RolesSettings />
      case 'members':
        return <MembersSettings />
        case 'delete':
          return <DeleteOrganization />
      default:
        return <GeneralSettings />
    }
  }

  return (
    <OrganizationSettingsLayout>
      <Metadata title="Organization Settings" />
      {renderTabContent()}
    </OrganizationSettingsLayout>
  )
}

export default OrganizationSettingsPage
