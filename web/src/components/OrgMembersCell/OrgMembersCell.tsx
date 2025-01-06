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
  // Sort members alphabetically by email
  const sortedMembers = [...orgMembers].sort((a, b) =>
    a.user.email.localeCompare(b.user.email)
  );

  // Helper function to get badge styling based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Active
          </span>
        );
      case 'INVITED':
        return (
          <span className="bg-yellow-500 text-gray-800 text-xs px-2 py-1 rounded-full">
            Invited
          </span>
        );
      case 'PENDING':
        return (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Pending
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {sortedMembers.map((member) => (
        <div
          key={member.id}
          className={`border rounded-lg mb-4 p-4 ${
            member.status === 'ACTIVE'
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-600 bg-gray-700 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-200">{member.user.email}</h3>
            <div>{getStatusBadge(member.status)}</div>
          </div>
          {member.status === 'INVITED' && (
            <div className="mt-2 text-sm text-gray-400">
              Invitation expires: {new Date(member.invitationExpiresAt).toLocaleDateString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
