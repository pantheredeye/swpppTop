import React, { createContext, useContext, useEffect, useState } from 'react'
import { navigate } from '@cedarjs/router'
import { useMutation, useQuery } from '@cedarjs/web'
import { useAuth } from 'src/auth'

interface Organization {
  type: string
  id: string
  name: string
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED' | 'PENDING'
}


interface OrganizationContextType {
  currentOrganization: Organization | null
  defaultOrganization: Organization | null
  availableOrganizations: Organization[]
  switchOrganization: (organizationId: string, redirect?: boolean) => Promise<{ success: boolean }>
  setDefaultOrganization: (organizationId: string) => Promise<void>
  loading: boolean
  error: Error | null
  refreshOrganizations: () => Promise<void>
}


const OrganizationContext = createContext<OrganizationContextType | null>(null)

const GET_USER_ORGANIZATIONS = gql`
  query GetUserOrganizations {
    userOrganizations {
      id
      name
      status
      type
    }
  }
`

const SET_DEFAULT_ORGANIZATION_MUTATION = gql`
  mutation SetDefaultOrganization($id: String!) {
    setDefaultOrganization(id: $id) {
      id
      defaultOrganizationId
    }
  }
`

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [availableOrganizations, setAvailableOrganizations] = useState<Organization[]>([])
  const [defaultOrganization, setDefaultOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { currentUser } = useAuth()
  const [setDefaultOrgMutation] = useMutation(SET_DEFAULT_ORGANIZATION_MUTATION)

  const { data, error: queryError, refetch } = useQuery(GET_USER_ORGANIZATIONS, {
    fetchPolicy: 'cache-first',
  })

  const refreshOrganizations = async () => {
    try {
      const { data: refreshedData } = await refetch()
      if (refreshedData?.userOrganizations) {
        setAvailableOrganizations(refreshedData.userOrganizations)
        return refreshedData.userOrganizations
      }
      return []
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh organizations'))
      return []
    }
  }

  const setDefaultOrg = async (organizationId: string) => {
    try {
      await setDefaultOrgMutation({ variables: { id: organizationId } })
      const newDefaultOrg = availableOrganizations.find(org => org.id === organizationId)
      if (newDefaultOrg) {
        setDefaultOrganization(newDefaultOrg)
      }
    } catch (err) {
      throw new Error('Failed to set default organization')
    }
  }

  useEffect(() => {
    if (data?.userOrganizations) {
      setAvailableOrganizations(data.userOrganizations)

      // Handle defaultOrganization from currentUser
      if (currentUser?.defaultOrganizationId) {
        const defaultOrg = data.userOrganizations.find(
          (org) => org.id === currentUser.defaultOrganizationId
        )
        if (defaultOrg) {
          setDefaultOrganization(defaultOrg)
        }
      }

      // Handle currentOrganization
      const storedOrgId = localStorage.getItem('currentOrganizationId')
      const targetOrgId = storedOrgId || currentUser?.defaultOrganizationId

      if (targetOrgId) {
        const org = data.userOrganizations.find((org) => org.id === targetOrgId)
        if (org) {
          setCurrentOrganization(org)
          localStorage.setItem('currentOrganizationId', org.id)
        }
      }
    }

    if (queryError) {
      setError(queryError)
    }

    setLoading(false)
  }, [data, queryError, currentUser])

  const switchOrganization = async (organizationId: string, redirect: boolean = true) => {
    try {
      let newOrg = availableOrganizations.find((org) => org.id === organizationId)

      if (!newOrg) {
        const refreshedOrgs = await refreshOrganizations()
        newOrg = refreshedOrgs.find((org) => org.id === organizationId)
        if (!newOrg) throw new Error('Organization not found')
      }

      setCurrentOrganization(newOrg)
      localStorage.setItem('currentOrganizationId', organizationId)

      if (redirect) {
        navigate(`/org/${organizationId}/dashboard`)
      }

      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to switch organization')
      setError(error)
      throw error
    }
  }

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        defaultOrganization,
        availableOrganizations,
        switchOrganization,
        setDefaultOrganization: setDefaultOrg,
        loading,
        error,
        refreshOrganizations,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider'
    )
  }
  return context
}
