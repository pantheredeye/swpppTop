import { useState } from 'react'

import {
  Building2,
  Search,
  Star,
  PlusCircle,
  Loader2,
  ChevronDown,
} from 'lucide-react'

import { navigate, routes, useParams } from '@cedarjs/router'

import { Button } from 'src/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from 'src/components/ui/DropdownMenu'
import { Input } from 'src/components/ui/Input'
import { useToast } from 'src/components/ui/UseToast'
import { useOrganization } from 'src/context/OrganizationContext'
import { cn } from 'src/utils/cn'

const OrganizationSwitcher = ({ organizations }) => {
  const [search, setSearch] = useState('')
  const [loadingOrgId, setLoadingOrgId] = useState(null)
  const { organizationId } = useParams()
  const {
    currentOrganization,
    switchOrganization,
    defaultOrganization,
    setDefaultOrganization,
  } = useOrganization()
  const { toast } = useToast()

  const handleSetDefaultOrg = async (orgId) => {
    if (orgId === defaultOrganization?.id) return
    try {
      setLoadingOrgId(orgId)
      await setDefaultOrganization(orgId)
      toast({
        title: 'Default Organization Set',
        description: 'Successfully set new default organization.',
        duration: 5000,
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to set default organization.',
        variant: 'destructive',
        duration: 5000,
      })
    } finally {
      setLoadingOrgId(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 rounded-lg focus:outline-none focus-visible:outline-none"
        >
          <Building2 className="h-5 w-5" />

          <h1 className="text-lg font-semibold tracking-tight">
            {organizations.find((org) => org.id === currentOrganization.id)
              ?.name || 'Select Organization'}
          </h1>
          <ChevronDown className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel className="p-2">
          Switch Organization
        </DropdownMenuLabel>
        <div className="p-2">
          <div className="flex items-center gap-2 px-2 py-1 bg-muted rounded-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search organizations..."
              className="bg-transparent text-sm"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <DropdownMenuSeparator />
        {organizations
          .filter((org) =>
            org.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((org) => (
            <DropdownMenuItem
              key={org.id}
              onSelect={() => switchOrganization(org.id)}
              className={cn(
                'flex items-center gap-2 w-full px-2 py-2 h-10 rounded-md',
                org.id === currentOrganization.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-accent'
              )}
            >
              <Building2 className="h-4 w-4" />
              <span>{org.name}</span>
              {org.id === defaultOrganization?.id && (
                <Star className="h-4 w-4 text-yellow-500 ml-auto" />
              )}
              {org.id !== defaultOrganization?.id && (
                <Button
                  size="sm"
                  variant="link"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSetDefaultOrg(org.id)
                  }}
                  className="ml-auto text-xs text-muted-foreground hover:underline h-4"
                  disabled={loadingOrgId === org.id}
                >
                  {loadingOrgId === org.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Set Default'
                  )}
                </Button>
              )}
            </DropdownMenuItem>
          ))}
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-2 px-2">
          <DropdownMenuItem
            onSelect={() => navigate(routes.requestInvite({ organizationId }))}
            className={cn(
              'flex items-center gap-2 w-full px-2 py-2 rounded-md  text-primary hover:bg-accent'
            )}
          >
            Request to Join an Organization
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              navigate(routes.createOrganization({ organizationId }))
            }
            className={cn(
              'flex items-center gap-2 w-full px-2 py-2 rounded-md bg-primary/10 text-primary hover:bg-accent'
            )}
          >
            <PlusCircle className="h-4 w-4" />
            Create New Organization
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default OrganizationSwitcher
