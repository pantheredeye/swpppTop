import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation } from '@redwoodjs/web'
import { useThrottle } from 'react-use'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from 'src/components/ui/Dialog'
import { Input } from 'src/components/ui/Input'
import { Button } from 'src/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/Select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'src/components/ui/Tooltip'
import { useToast } from 'src/components/ui/UseToast'
import { Plus, X, Search, UserPlus, Users } from 'lucide-react'
import { Alert, AlertDescription } from 'src/components/ui/Alert'

const INVITE_MEMBERS_MUTATION = gql`
  mutation InviteMembers($input: InviteMembersInput!) {
    inviteMembers(input: $input) {
      successful {
        userId
        email
        status
      }
      failed {
        email
        error
      }
    }
  }
`

const SEARCH_USERS_QUERY = gql`
  query SearchUsers($organizationId: String!, $searchTerm: String!) {
    searchUsers(organizationId: $organizationId, searchTerm: $searchTerm) {
      id
      email
      firstName
      lastName
    }
  }
`

const FIND_ORG_ROLES_QUERY = gql`
  query FindOrgRolesQuery2($isSystemDefined: Boolean, $id: String) {
    organizationRoles: findMembershipRoles(
      isSystemDefined: $isSystemDefined
      organizationId: $id
    ) {
      id
      name
    }
  }
`

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const InviteMembersModal = ({ organizationId, onInviteComplete }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [inviteQueue, setInviteQueue] = useState([])
  const [selectedRoleForBatch, setSelectedRoleForBatch] = useState('')
  const [manualEmail, setManualEmail] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  // Throttled search value to prevent excessive API calls
  const throttledSearchTerm = useThrottle(searchTerm, 1000)

  useEffect(() => {
    setDebouncedSearch(throttledSearchTerm)
  }, [throttledSearchTerm])

  // Search users query with rate limiting
  const { data: searchData, loading: searchLoading } = useQuery(
    SEARCH_USERS_QUERY,
    {
      variables: {
        organizationId,
        searchTerm: debouncedSearch,
      },
      skip: debouncedSearch.length < 2,
      fetchPolicy: 'network-only',
    }
  )

  // Fetch roles
  const { data: rolesData } = useQuery(FIND_ORG_ROLES_QUERY, {
    variables: { organizationId },
  })

  // Invite mutation
  const [inviteMembers, { loading: inviting }] = useMutation(
    INVITE_MEMBERS_MUTATION,
    {
      onCompleted: (data) => {
        const { successful, failed } = data.inviteMembers

        if (successful.length > 0) {
          toast({
            title: 'Invites Sent Successfully',
            description: `Successfully sent ${successful.length} invite${successful.length > 1 ? 's' : ''}.`,
            duration: 5000,
          })
        }

        if (failed.length > 0) {
          toast({
            title: 'Some Invites Failed',
            description: `Failed to send ${failed.length} invite${failed.length > 1 ? 's' : ''}.`,
            variant: 'destructive',
            duration: 7000,
          })
        }

        setInviteQueue([])
        setIsOpen(false)
        onInviteComplete?.()
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
          duration: 5000,
        })
      },
    }
  )

  const defaultRole = useMemo(() => {
    const roles = rolesData?.organizationRoles || []
    const defaultRole = roles.find((role) => role.isDefault)?.id
    return defaultRole || roles[0]?.id
  }, [rolesData])

  const getInitials = (user) => {
    if (!user.firstName && !user.lastName) {
      return user.email.charAt(0).toUpperCase()
    }
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  }

  const getUserDisplayName = (user) => {
    if (!user.firstName && !user.lastName) {
      return user.email
    }
    return `${user.firstName || ''} ${user.lastName || ''}`.trim()
  }

  const handleAddToQueue = (userOrEmail) => {
    setInviteQueue((queue) => {
      const isEmail = typeof userOrEmail === 'string'
      const identifier = isEmail ? userOrEmail : userOrEmail.id

      if (
        queue.some((item) =>
          isEmail ? item.email === identifier : item.user?.id === identifier
        )
      ) {
        return queue
      }

      // Ensure selectedRoleForBatch or defaultRole is valid
      const roleId = selectedRoleForBatch || defaultRole
      if (!roleId) {
        toast({
          title: 'Error',
          description:
            'No role selected. Please select a role before adding to the queue.',
          variant: 'destructive',
          duration: 5000,
        })
        return queue
      }

      return [
        ...queue,
        {
          user: isEmail ? null : userOrEmail,
          email: isEmail ? userOrEmail : userOrEmail.email,
          roleIds: [roleId],
        },
      ]
    })

    if (typeof userOrEmail === 'string') {
      setManualEmail('')
    }
  }

  const handleRemoveFromQueue = (identifier) => {
    setInviteQueue((queue) =>
      queue.filter(
        (item) => item.user?.id !== identifier && item.email !== identifier
      )
    )
  }

  const handleBatchRoleChange = () => {
    if (!selectedRoleForBatch) {
      toast({
        title: 'Error',
        description:
          'No role selected. Please select a role before applying to all.',
        variant: 'destructive',
        duration: 5000,
      })
      return
    }

    setInviteQueue((queue) =>
      queue.map((item) => ({
        ...item,
        roleIds: [selectedRoleForBatch],
      }))
    )

    toast({
      title: 'Roles Updated',
      description: 'Updated roles for all pending invites.',
      duration: 3000,
    })
  }

  const handleRoleChange = (identifier, roleId) => {
    setInviteQueue((queue) =>
      queue.map((item) =>
        item.user?.id === identifier || item.email === identifier
          ? { ...item, roleIds: [roleId] }
          : item
      )
    )
  }

  const handleEmailInput = (e) => {
    const email = e.target.value
    setManualEmail(email)
    setError('')
  }

  const handleAddEmail = () => {
    if (!EMAIL_REGEX.test(manualEmail)) {
      setError('Please enter a valid email address')
      return
    }
    handleAddToQueue(manualEmail)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && manualEmail) {
      e.preventDefault()
      handleAddEmail()
    }
  }

  const handleInvite = async () => {
    console.log('selectedRoleForBatch:', selectedRoleForBatch)
    console.log('defaultRole:', defaultRole)
    console.log('inviteQueue:', inviteQueue)
    if (!inviteQueue.length) return

    // Validate roleIds before sending the mutation
    const invalidInvites = inviteQueue.filter(
      (item) => !item.roleIds || item.roleIds.some((id) => !id)
    )
    if (invalidInvites.length > 0) {
      toast({
        title: 'Error',
        description:
          'One or more invites have invalid roles. Please select a role for all invites.',
        variant: 'destructive',
        duration: 5000,
      })
      return
    }

    try {
      await inviteMembers({
        variables: {
          input: {
            organizationId,
            invites: inviteQueue.map(({ user, email, roleIds }) => ({
              userId: user?.id,
              email: email,
              roleIds: roleIds, // Ensure roleIds is always an array with valid role IDs
            })),
          },
        },
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invites. Please try again.',
        variant: 'destructive',
        duration: 5000,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-gray-800 hover:bg-gray-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Search existing users or invite by email
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Batch Role Assignment */}
          {inviteQueue.length > 1 && (
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3">
              <Select
                value={selectedRoleForBatch}
                onValueChange={setSelectedRoleForBatch}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select role for all" />
                </SelectTrigger>
                <SelectContent>
                  {rolesData?.organizationRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="secondary"
                onClick={handleBatchRoleChange}
                disabled={!selectedRoleForBatch}
              >
                <Users className="mr-2 h-4 w-4" />
                Apply to All
              </Button>
            </div>
          )}
        </div>
        {/* Search and Email Input */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search existing users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Or enter email address..."
              value={manualEmail}
              onChange={handleEmailInput}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAddEmail}
                  disabled={!manualEmail || !EMAIL_REGEX.test(manualEmail)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add email to invite queue</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Search Results */}
        {searchTerm.length >= 2 && (
          <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200">
            {searchLoading ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : searchData?.searchUsers.length ? (
              <div className="divide-y">
                {searchData.searchUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt=""
                            className="h-full w-full rounded-full"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-600">
                            {getInitials(user)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {getUserDisplayName(user)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAddToQueue(user)}
                      disabled={inviteQueue.some(
                        (item) => item.user?.id === user.id
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No existing users found
              </div>
            )}
          </div>
        )}

        {/* Invite Queue */}
        {inviteQueue.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">
              Pending Invites ({inviteQueue.length})
            </h4>
            <div className="space-y-3">
              {inviteQueue.map((item) => (
                <div
                  key={item.user?.id || item.email}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex items-center space-x-3">
                    {item.user ? (
                      <>
                        <div className="h-8 w-8 rounded-full bg-gray-200">
                          {item.user.avatarUrl ? (
                            <img
                              src={item.user.avatarUrl}
                              alt=""
                              className="h-full w-full rounded-full"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-600">
                              {getInitials(item.user)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {getUserDisplayName(item.user)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.user.email}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <div className="font-medium">New User Invite</div>
                        <div className="text-sm text-gray-500">
                          {item.email}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Select
                      value={item.roleIds[0] || ''} // Fallback to an empty string if roleIds[0] is null/undefined
                      onValueChange={(value) =>
                        handleRoleChange(item.user?.id || item.email, value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {rolesData?.organizationRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleRemoveFromQueue(item.user?.id || item.email)
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button
            onClick={handleInvite}
            disabled={inviting || !inviteQueue.length}
          >
            {inviting
              ? 'Sending invites...'
              : `Send ${inviteQueue.length} Invite${
                  inviteQueue.length !== 1 ? 's' : ''
                }`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InviteMembersModal
