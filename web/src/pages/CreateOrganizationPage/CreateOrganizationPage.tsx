import { useState } from 'react'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useOrganization } from 'src/context/OrganizationContext'

const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      status
    }
  }
`

const CreateOrganizationPage = () => {
  const [name, setName] = useState('')
  const { switchOrganization, refreshOrganizations } = useOrganization()
  const [loading, setLoading] = useState(false)

  const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      users {
        id
        roles {
          id
          name
        }
      }
    }
  }
`

const [createOrganization] = useMutation(CREATE_ORGANIZATION, {
  onCompleted: async (data) => {
    setLoading(true)
    try {
      await refreshOrganizations() // Refresh the organizations list
      await switchOrganization(data.createOrganization.organization.id)
      toast.success('Organization created successfully')
      navigate(routes.organizationSettings({
        organizationId: data.createOrganization.organization.id,
        tab: 'roles'
      }))
    } catch (error) {
      console.error('Failed to switch organization:', error)
      toast.error('Organization created but failed to switch context')
    } finally {
      setLoading(false)
    }
  },
  onError: (error) => {
    toast.error(error.message)
    setLoading(false)
  },
})

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    await createOrganization({
      variables: {
        input: {
          name: name.trim(),
          status: 'ACTIVE'
        },
      },
    })
  }

  return (
    <>
      <Metadata title="Create Organization" />

      <div className="min-h-screen bg-gray-800 p-6">
        <div className="mx-auto max-w-xl">
          <div className="rounded-xl bg-gray-900 p-8 shadow-2xl">
            <div className="border-b border-gray-700 pb-5">
              <h2 className="text-3xl font-bold text-gray-100">
                Create New Organization
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Get started by naming your organization
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-200"
                >
                  Organization Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter organization name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end space-x-4 border-t border-gray-700 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(routes.dashboard())}
                  className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                  disabled={loading || !name.trim()}
                >
                  {loading ? 'Creating...' : 'Create Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateOrganizationPage
