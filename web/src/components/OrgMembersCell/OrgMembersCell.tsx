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
  const sortedMembers = [...orgMembers].sort((a, b) =>
    a.user.email.localeCompare(b.user.email)
  );

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
  {/* Display Roles */}
  <div className="mt-2">
    <span className="text-sm text-gray-400">Roles:</span>
    <div className="flex flex-wrap gap-2 mt-1">
      {member.roles.map((role) => (
        <span
          key={role.id}
          className="bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded-full"
        >
          {role.name}
        </span>
      ))}
    </div>
  </div>
  {/* Action Buttons */}
  <div className="mt-4 flex gap-2">
    <button
      className="text-sm bg-gray-600 text-gray-200 px-3 py-1 rounded hover:bg-gray-500"
      onClick={() => console.log('Edit roles for:', member.user.email)}
    >
      Edit Roles
    </button>
    <button
      className="text-sm bg-red-600 text-gray-200 px-3 py-1 rounded hover:bg-red-500"
      onClick={() => console.log('Revoke access for:', member.user.email)}
    >
      Revoke Access
    </button>
    <button
      className="text-sm bg-yellow-600 text-gray-200 px-3 py-1 rounded hover:bg-yellow-500"
      onClick={() => console.log('Suspend:', member.user.email)}
    >
      Suspend
    </button>
  </div>
</div>
      ))}
    </div>
  );
};
