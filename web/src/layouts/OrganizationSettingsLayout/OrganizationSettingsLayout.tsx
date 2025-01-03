import { useParams, navigate, routes } from '@redwoodjs/router'

import { useOrganization } from 'src/context/OrganizationContext'

type OrganizationSettingLayoutProps = {
  children?: React.ReactNode
}

const OrganizationSettingLayout = ({
  children,
}: OrganizationSettingLayoutProps) => {
  const { organizationId, tab = 'general' } = useParams()
  const { currentOrganization } = useOrganization()

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'roles', label: 'Roles & Permissions' },
    { id: 'members', label: 'Members' },
    { id: 'delete', label: 'Delete Organization' },
  ]

  const handleTabChange = (tabId) => {
    navigate(
      routes.organizationSettings({
        organizationId,
        tab: tabId,
      })
    )
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-100">
              {currentOrganization?.name} Settings
            </h1>
          </div>

          <div className="rounded-xl bg-gray-900 shadow-2xl">
            <div className="border-b border-gray-700">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tabItem) => (
                  <button
                    key={tabItem.id}
                    onClick={() => handleTabChange(tabItem.id)}
                    className={`${
                      tab === tabItem.id
                        ? 'border-indigo-500 text-indigo-500'
                        : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300'
                    } border-b-2 py-4 px-1 text-sm font-medium`}
                  >
                    {tabItem.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationSettingLayout
