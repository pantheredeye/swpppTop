import { useEffect, useState } from 'react'
import { useOrganization } from 'src/context/OrganizationContext'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from 'src/components/ui/Select' // shadcn Select component
import { Button } from 'src/components/ui/Button' // shadcn Button component
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from 'src/components/ui/Card' // shadcn Card component

const SET_DEFAULT_ORGANIZATION_MUTATION = gql`
  mutation SetDefaultOrganization($id: String!) {
    setDefaultOrganization(id: $id) {
      id
      defaultOrganizationId
    }
  }
`

const OrganizationSwitcher = () => {
  const { currentOrganization, availableOrganizations, switchOrganization } =
    useOrganization()
  const [defaultOrgId, setDefaultOrgId] = useState<string | null>(
    currentOrganization?.id || null
  )
  const [isSwitching, setIsSwitching] = useState(false)

  const [setDefaultOrganization] = useMutation(
    SET_DEFAULT_ORGANIZATION_MUTATION,
    {
      onCompleted: () => {
        toast.success('Default organization updated successfully')
      },
      onError: (error) => {
        toast.error('Failed to update default organization')
        console.error(error)
      },
    }
  )

  const handleSwitchDefaultOrg = async (orgId: string) => {
    if (orgId === defaultOrgId) return

    setIsSwitching(true)
    try {
      await setDefaultOrganization({ variables: { id: orgId } })
      setDefaultOrgId(orgId)
      await switchOrganization(orgId) // Switch the organization in the context
    } catch (error) {
      console.error('Failed to switch default organization:', error)
    } finally {
      setIsSwitching(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Switch Organizations</CardTitle>
        <CardDescription>
          Select your default organization to switch contexts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            value={defaultOrgId || ''}
            onValueChange={handleSwitchDefaultOrg}
            disabled={isSwitching}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an organization" />
            </SelectTrigger>
            <SelectContent>
              {availableOrganizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name} {org.id === defaultOrgId && '(Default)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {availableOrganizations.length === 0 && (
            <p className="text-sm text-gray-500">No organizations available.</p>
          )}

          <Button
            onClick={() => handleSwitchDefaultOrg(defaultOrgId!)}
            disabled={isSwitching || !defaultOrgId}
            className="w-full"
          >
            {isSwitching ? 'Switching...' : 'Switch to Default'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrganizationSwitcher
