import React, { createContext, useContext, useState } from 'react'
import { navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

interface OrganizationContextType {
  currentOrganization: string | null
  switchOrganization: (organizationId: string) => Promise<void>
}

const OrganizationContext = createContext<OrganizationContextType>({
  currentOrganization: null,
  switchOrganization: async () => {}
})

export const OrganizationProvider: React.FC = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = useState<string | null>(
    localStorage.getItem('currentOrganization')
  )

  const switchOrganization = async (organizationId: string) => {
    // Validate organization access (use your current user's memberships)
    const user = // get current user from context/auth
    // const hasAccess = user.memberships.some(
    //   membership => membership.organizationId === organizationId
    // )

    // if (!hasAccess) {
    //   throw new Error('Unauthorized organization access')
    // }

    // Update local state and storage
    setCurrentOrganization(organizationId)
    localStorage.setItem('currentOrganization', organizationId)

    // Navigate to organization-specific dashboard
    navigate(`/org/${organizationId}/dashboard`)
  }

  return (
    <OrganizationContext.Provider value={{
      currentOrganization,
      switchOrganization
    }}>
      {children}
    </OrganizationContext.Provider>
  )
}

export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}
