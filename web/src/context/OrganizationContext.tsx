import React, { createContext, useContext, useEffect, useState } from 'react'

import { navigate } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'

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
}

const OrganizationContext = createContext<OrganizationContextType | null>(null)

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

  const GET_USER_ORGANIZATIONS = gql`
    query GetUserOrganizations {
      organizations {
        id
        name
        status
      }
    }
  `

  const { data, error: queryError } = useQuery(GET_USER_ORGANIZATIONS)

  useEffect(() => {
    if (data?.organizations) {
      setAvailableOrganizations(data.organizations)

      // Set default organization
      const defaultOrgId = currentUser?.defaultOrganizationId
      const defaultOrg = data.organizations.find(
        (org) => org.id === defaultOrgId
      )

      if (defaultOrg) {
        setCurrentOrganization(defaultOrg)
        localStorage.setItem('currentOrganizationId', defaultOrg.id)
      }
    }

    if (queryError) {
      setError(queryError)
    }

    setLoading(false)
  }, [data, queryError, currentUser])

  const switchOrganization = async (organizationId: string) => {
    try {
      const newOrg = availableOrganizations.find(
        (org) => org.id === organizationId
      )
      if (!newOrg) {
        throw new Error('Organization not found')
      }

      setCurrentOrganization(newOrg)
      localStorage.setItem('currentOrganizationId', organizationId)
      navigate(`/org/${organizationId}/dashboard`)
    } catch (err) {
      setError(err as Error)
      throw err
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
