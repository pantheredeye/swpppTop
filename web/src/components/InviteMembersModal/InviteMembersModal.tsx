import { useState, useEffect, useMemo } from 'react'

import { UserPlus } from 'lucide-react'
import { useThrottle } from 'react-use'

import { useQuery, useMutation } from '@redwoodjs/web'

import { Alert, AlertDescription } from 'src/components/ui/Alert'
import { Button } from 'src/components/ui/Button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from 'src/components/ui/Dialog'
import { useToast } from 'src/components/ui/UseToast'

import InviteQueue from './InviteQueue/InviteQueue'
import SearchInput from './SearchInput/SearchInput'
import SearchResults from './SearchResults/SearchResults'

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
  query FindOrgRolesQuery2($isSystemDefined: Boolean, $id: String, $excludeRoles: [String!] ) {
    organizationRoles: findMembershipRoles(
      isSystemDefined: $isSystemDefined
      organizationId: $id
      excludeRoles: $excludeRoles

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

  const throttledSearchTerm = useThrottle(searchTerm, 1000)

  useEffect(() => {
    setDebouncedSearch(throttledSearchTerm)
  }, [throttledSearchTerm])

  const { data: searchData, loading: searchLoading } = useQuery(
    SEARCH_USERS_QUERY,
    {
      variables: {
        organizationId,
        searchTerm: debouncedSearch,
      },
      skip: debouncedSearch.length < 2,
      // fetchPolicy: 'no-cache',
    }
  )

  const { data: rolesData } = useQuery(FIND_ORG_ROLES_QUERY, {
    variables: { organizationId, excludeRoles: ['OWNER'], },
  })

  const [inviteMembers, { loading: inviting }] = useMutation(
    INVITE_MEMBERS_MUTATION,
    {
      refetchQueries: ["SearchUsers"],
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
    if (!inviteQueue.length) return

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
              roleIds: roleIds,
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
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader className="space-y-2">
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Search existing users or invite by email address
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            manualEmail={manualEmail}
            setManualEmail={setManualEmail}
            handleAddEmail={handleAddEmail}
            handleKeyDown={handleKeyDown}
          />

          {searchTerm.length >= 2 && (
            <SearchResults
              searchData={searchData}
              searchLoading={searchLoading}
              inviteQueue={inviteQueue}
              handleAddToQueue={handleAddToQueue}
            />
          )}

          {inviteQueue.length > 0 && (
            <InviteQueue
              inviteQueue={inviteQueue}
              rolesData={rolesData}
              selectedRoleForBatch={selectedRoleForBatch}
              setSelectedRoleForBatch={setSelectedRoleForBatch}
              handleBatchRoleChange={handleBatchRoleChange}
              handleRoleChange={handleRoleChange}
              handleRemoveFromQueue={handleRemoveFromQueue}
            />
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleInvite}
            disabled={inviting || !inviteQueue.length}
            className="w-full sm:w-auto"
          >
            {inviting
              ? 'Sending invites...'
              : `Send ${inviteQueue.length} Invite${inviteQueue.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InviteMembersModal
