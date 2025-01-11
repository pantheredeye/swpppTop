import { useEffect, useState } from 'react'
import { navigate, Link, routes, useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useMutation } from '@redwoodjs/web'
import { useOrganization } from 'src/context/OrganizationContext'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from 'src/components/ui/Card'
import { Button } from 'src/components/ui/Button'
import { Badge } from 'src/components/ui/Badge'
import { Switch } from 'src/components/ui/Switch'
import { BuildingIcon, PlusCircleIcon } from 'lucide-react'
import { ScrollArea } from 'src/components/ui/ScrollArea'
import { Separator } from 'src/components/ui/Separator'

const SET_DEFAULT_ORGANIZATION_MUTATION = gql`
  mutation SetDefaultOrganization($id: String!) {
    setDefaultOrganization(id: $id) {
      id
      defaultOrganizationId
    }
  }
`

const SwitchPage = () => {
  const { organizationId } = useParams()
  const {
    availableOrganizations,
    currentOrganization,
    switchOrganization,
    loading,
  } = useOrganization()
  const [switchingOrgId, setSwitchingOrgId] = useState(null)
  const [defaultOrgId, setDefaultOrgId] = useState(
    currentOrganization?.id || null
  )

  const [setDefaultOrganization] = useMutation(SET_DEFAULT_ORGANIZATION_MUTATION, {
    onCompleted: () => {
      toast.success('Default organization updated')
    },
    onError: (error) => {
      toast.error('Failed to update default organization')
      console.error(error)
    },
  })

  useEffect(() => {
    if (!organizationId) navigate('/')
  }, [organizationId])

  const handleSwitchOrg = async (orgId) => {
    if (orgId === currentOrganization?.id) return
    try {
      setSwitchingOrgId(orgId)
      const { success } = await switchOrganization(orgId)
      if (success) {
        toast.success('Organization switched successfully')
      }
    } catch (error) {
      toast.error('Failed to switch organization')
    } finally {
      setSwitchingOrgId(null)
    }
  }

  const handleSetDefaultOrg = async (orgId) => {
    if (orgId === defaultOrgId) return
    try {
      await setDefaultOrganization({ variables: { id: orgId } })
      setDefaultOrgId(orgId)
    } catch (error) {
      toast.error('Failed to set default organization')
    }
  }

  if (!organizationId || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <BuildingIcon className="h-5 w-5 animate-pulse text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading organizations...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Metadata
        title="Switch Organizations"
        description="Switch between your organizations"
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BuildingIcon className="h-6 w-6 text-primary" />
              <CardTitle>Organizations</CardTitle>
            </div>
            <CardDescription>
              Manage and switch between your organizations
            </CardDescription>
          </CardHeader>

          <ScrollArea className="h-[400px] px-6">
            <div className="space-y-4">
              {availableOrganizations.map((org) => (
                <div
                  key={org.id}
                  className={`rounded-lg border p-4 transition-colors ${
                    org.id === currentOrganization?.id
                      ? 'border-primary bg-muted'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <BuildingIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">
                            {org.name}
                          </h3>
                          {org.status !== 'ACTIVE' && (
                            <Badge variant="secondary" className="text-xs">
                              {org.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {org.id === currentOrganization?.id ? 'Current organization' : '\u00A0'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={org.id === defaultOrgId}
                          onCheckedChange={() => handleSetDefaultOrg(org.id)}
                          disabled={org.status !== 'ACTIVE'}
                        />
                        <span className="text-sm text-muted-foreground">Default</span>
                      </div>
                      <Button
                        variant={org.id === currentOrganization?.id ? "secondary" : "default"}
                        disabled={org.id === currentOrganization?.id || org.status !== 'ACTIVE'}
                        onClick={() => handleSwitchOrg(org.id)}
                      >
                        {org.id === currentOrganization?.id
                          ? 'Current'
                          : switchingOrgId === org.id
                          ? 'Switching...'
                          : 'Switch'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {availableOrganizations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BuildingIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No organizations available</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator className="my-6" />

          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to={routes.requestInvite({ organizationId })}>
                Request to Join
              </Link>
            </Button>
            <div className="space-x-2">
              <Button variant="outline" asChild>
                <Link to={routes.dashboard({ organizationId })}>
                  Cancel
                </Link>
              </Button>
              <Button asChild>
                <Link to={routes.createOrganization({ organizationId })}>
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  New Organization
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export default SwitchPage
