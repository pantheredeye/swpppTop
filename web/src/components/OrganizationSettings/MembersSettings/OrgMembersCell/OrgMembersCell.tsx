import { useState } from 'react'

import { MoreHorizontal, UserCog } from 'lucide-react'
import type { OrgMembersQuery, OrgMembersQueryVariables } from 'types/graphql'

import {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
  useMutation,
} from '@cedarjs/web'

import { Badge } from 'src/components/ui/Badge'
import { Button } from 'src/components/ui/Button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/components/ui/Card'
import { Dialog } from 'src/components/ui/Dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'src/components/ui/DropdownMenu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/Table'

import RoleManagementDialog from '../../RolesSettings/RoleManagementDialog/RoleManagementDialog'

export const QUERY: TypedDocumentNode<
  OrgMembersQuery,
  OrgMembersQueryVariables
> = gql`
  query OrgMembersQuery($id: String!) {
    orgMembers: findOrgMembers(organizationId: $id) {
      id
      user {
        firstName
        lastName
        email
      }
      roles {
        id
        name
      }
      status
      invitedEmail
      invitedAt
      invitationExpiresAt
    }
  }
`

// GraphQL Mutation Definitions
const REVOKE_ACCESS_MUTATION = gql`
  mutation RevokeAccess($id: String!) {
    revokeAccess(id: $id) {
      success
      message
      deletedMembership {
        id
      }
    }
  }
`

const SUSPEND_MEMBER_MUTATION = gql`
  mutation SuspendMember($id: String!, $status: MembershipStatus!) {
    suspendMember(id: $id, status: $status) {
      id
      status
    }
  }
`

const UPDATE_MEMBER_ROLES_MUTATION = gql`
  mutation UpdateMemberRoles($id: String!, $roles: [String!]!) {
    updateMemberRoles(id: $id, roles: $roles) {
      id
      roles {
        id
        name
      }
    }
  }
`

// Status badge configurations for consistent styling
const STATUS_CONFIGS = {
  ACTIVE: {
    variant: 'default',
    label: 'Active',
    className: 'bg-green-500 hover:bg-green-500/80',
  },
  INVITED: {
    variant: 'secondary',
    label: 'Invited',
    className: 'bg-yellow-500 hover:bg-yellow-500/80',
  },
  PENDING: {
    variant: 'outline',
    label: 'Pending',
    className: 'border-blue-500 text-blue-500',
  },
  SUSPENDED: { variant: 'destructive', label: 'Suspended' },
} as const // Using 'as const' to make TypeScript understand these are literal types

const availableRoles = [
  { id: '1', name: 'OWNER' },
  { id: '2', name: 'MEMBER' },
  { id: '3', name: 'ADMIN' },
]

// export const beforeQuery = (props) => {
//   return {
//     variables: props,
//     fetchPolicy: 'no-cache', // Set fetchPolicy to 'no-cache'
//   }
// }

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  orgMembers,
  handleRefresh,
}: CellSuccessProps<OrgMembersQuery> & { handleRefresh: () => void }) => {
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [revokeAccess] = useMutation(REVOKE_ACCESS_MUTATION, {refetchQueries: ["OrgMembersQuery"]})
  const [suspendMember] = useMutation(SUSPEND_MEMBER_MUTATION)
  const [updateMemberRoles] = useMutation(UPDATE_MEMBER_ROLES_MUTATION, {refetchQueries: ["OrgMembersQuery"]})

  // Action handlers with optimistic updates
  const handleRevokeAccess = async (memberId) => {
    try {
      await revokeAccess({ variables: { id: memberId } })
      handleRefresh()
    } catch (error) {
      // Add error handling with toast
      console.error('Failed to revoke access:', error)
    }
  }

  const handleSuspendMember = async (memberId) => {
    try {
      await suspendMember({
        variables: { id: memberId, status: 'SUSPENDED' },
        optimisticResponse: {
          suspendMember: {
            id: memberId,
            status: 'SUSPENDED',
            __typename: 'Member',
          },
        },
      })
      // Add toast notification for success
    } catch (error) {
      // Add error handling with toast
      console.error('Failed to suspend member:', error)
    }
  }

  const handleUpdateRoles = async (memberId, roles) => {
    try {
      await updateMemberRoles({
        variables: { id: memberId, roles },
        optimisticResponse: {
          updateMemberRoles: {
            id: memberId,
            roles: roles.map((roleId) => ({
              id: roleId,
              name: availableRoles.find((r) => r.id === roleId)?.name || '',
              __typename: 'Role',
            })),
            __typename: 'Member',
          },
        },
      })
      setShowRoleDialog(false)
      // Add toast notification for success
    } catch (error) {
      // Add error handling with toast
      console.error('Failed to update roles:', error)
    }
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orgMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {member.user.firstName} {member.user.lastName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {member.user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_CONFIGS[member.status].variant}>
                    {STATUS_CONFIGS[member.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {member.roles.map((role) => (
                      <Badge key={role.id} variant="outline">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(member.invitedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMember(member)
                          setShowRoleDialog(true)
                        }}
                      >
                        <UserCog className="mr-2 h-4 w-4" />
                        Manage Roles
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSuspendMember(member.id)}
                        className="text-yellow-600"
                      >
                        Suspend Access
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRevokeAccess(member.id)}
                        className="text-destructive"
                      >
                        Revoke Access
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
          {selectedMember && (
            <RoleManagementDialog
              member={selectedMember}
              availableRoles={availableRoles}
              onUpdateRoles={(roles) =>
                handleUpdateRoles(selectedMember.id, roles)
              }
            />
          )}
        </Dialog>
      </CardContent>
    </Card>
  )
}
