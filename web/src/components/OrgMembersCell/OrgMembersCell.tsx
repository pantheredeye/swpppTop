import type { OrgMembersQuery, OrgMembersQueryVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ orgMembers }: CellSuccessProps<OrgMembersQuery>) => {
  console.log(orgMembers)
  const activeMembers = orgMembers.filter((member) => member.status === 'ACTIVE');
const pendingInvitations = orgMembers.filter((member) => member.status === 'INVITED' || member.status === 'PENDING');
  return (
    <div>
      {orgMembers.map((member) => (
        <div
          key={member.id}
          className="border border-gray-700 rounded-lg bg-gray-800 mb-4"
        >
          <h3 className="px-4 py-3 font-medium text-gray-200">
            {member.user.email}
            {/* {role.isSystemDefined && (
              <Badge variant="secondary" className="bg-gray-700 text-gray-300 ml-2">
                System
              </Badge>
            )} */}
          </h3>
          {/* <PermissionAccordion permissions={role.permissions} /> */}
        </div>
      ))}
    </div>
  )
}
