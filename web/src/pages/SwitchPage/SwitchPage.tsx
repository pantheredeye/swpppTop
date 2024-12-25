import { useEffect, useState } from 'react'
import { navigate, Link, routes, useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useOrganization } from 'src/context/OrganizationContext'
import { toast } from '@redwoodjs/web/toast'

const SwitchPage = () => {
  const { organizationId } = useParams()
  const {
    availableOrganizations,
    currentOrganization,
    switchOrganization,
    loading,
  } = useOrganization()
  const [switchingOrgId, setSwitchingOrgId] = useState<string | null>(null)

  useEffect(() => {
    if (!organizationId) {
      navigate('/')
    }
  }, [organizationId])

  const handleSwitchOrg = async (orgId: string) => {
    if (orgId === currentOrganization?.id) return
    try {
      setSwitchingOrgId(orgId)
      const { success } = await switchOrganization(orgId, false)
      // TODO: Fix Toast & Handle Switching more elegantly
      // if (success) {
      //   toast.success('Organization switched successfully')
      // }
    } catch (error) {
      console.error('Failed to switch organization:', error)
    } finally {
      setSwitchingOrgId(null)
    }
  }

  if (!organizationId || loading) {
    return (
      <div className="min-h-screen bg-gray-800 p-6">
        <div className="mx-auto max-w-3xl text-center text-gray-200">
          Loading organizations...
        </div>
      </div>
    )
  }

  return (
    <>
      <Metadata
        title="Switch Organizations"
        description="Switch between your organizations"
      />

      <div className="min-h-screen bg-gray-800 p-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl bg-gray-900 p-8 shadow-2xl">
            <div className="border-b border-gray-700 pb-5">
              <h2 className="text-3xl font-bold text-gray-100">
                Switch Organizations
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Select an organization to switch to, or create a new one
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {availableOrganizations.map((org) => (
                <div
                  key={org.id}
                  className={`rounded-lg border p-4 ${
                    org.id === currentOrganization?.id
                      ? 'border-indigo-500 bg-gray-800'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-100">
                        {org.name}
                      </h3>
                      <span className="mt-1 text-sm text-gray-400">
                        Status: {org.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSwitchOrg(org.id)}
                      disabled={
                        org.id === currentOrganization?.id ||
                        org.status !== 'ACTIVE'
                      }
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        org.id === currentOrganization?.id
                          ? 'bg-gray-700 text-gray-400'
                          : org.status === 'ACTIVE'
                            ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                            : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {org.id === currentOrganization?.id
                        ? 'Current'
                        : switchingOrgId === org.id
                          ? 'Switching...'
                          : 'Switch'}
                    </button>
                  </div>
                </div>
              ))}

              {availableOrganizations.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No organizations available
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between border-t border-gray-700 pt-6">
              <Link
                to={routes.requestInvite({ organizationId })}
                className="rounded-lg border border-gray-600 bg-transparent px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-800"
              >
                Request to Join
              </Link>
              <div className="space-x-4">
                <Link
                  to={routes.dashboard({ organizationId })}
                  className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
                >
                  Cancel
                </Link>
                <Link
                  to={routes.createOrganization({ organizationId })}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  Create New Organization
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SwitchPage
