import React, { createContext, useContext, useEffect, useState } from 'react'
import { navigate } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'
import { useAuth } from 'src/auth'

interface Organization {
  id: string
  name: string
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED' | 'PENDING'
}

interface OrganizationContextType {
  currentOrganization: Organization | null
  availableOrganizations: Organization[]
  switchOrganization: (organizationId: string) => Promise<void>
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
    }
  }
`

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null)
  const [availableOrganizations, setAvailableOrganizations] = useState<
    Organization[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { currentUser } = useAuth()
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

  useEffect(() => {
    if (data?.userOrganizations) {
      setAvailableOrganizations(data.userOrganizations)

      const defaultOrgId = currentUser?.defaultOrganizationId
      const storedOrgId = localStorage.getItem('currentOrganizationId')
      const targetOrgId = defaultOrgId || storedOrgId

      if (targetOrgId) {
        const org = data.userOrganizations.find(
          (org) => org.id === targetOrgId
        )
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

  const switchOrganization = async (organizationId: string) => {
    try {
      let newOrg = availableOrganizations.find(
        (org) => org.id === organizationId
      )

      if (!newOrg) {
        const refreshedOrgs = await refreshOrganizations()
        newOrg = refreshedOrgs.find((org) => org.id === organizationId)

        if (!newOrg) {
          throw new Error('Organization not found even after refresh')
        }
      }

      setCurrentOrganization(newOrg)
      localStorage.setItem('currentOrganizationId', organizationId)
      navigate(`/org/${organizationId}/dashboard`)
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
        availableOrganizations,
        switchOrganization,
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
