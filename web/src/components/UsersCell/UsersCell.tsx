import type { UsersQuery, UsersQueryVariables } from 'types/graphql'

import { SelectField } from '@cedarjs/forms'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@cedarjs/web'

export const QUERY: TypedDocumentNode<UsersQuery, UsersQueryVariables> = gql`
  query UsersQuery {
    users {
      id
      firstName
      lastName
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  users,
  currentUserId,
}: CellSuccessProps<UsersQuery> & { currentUserId: number }) => {
  return (
    <SelectField
      name="inspectorId"
      defaultValue={currentUserId}
      validation={{ required: true }}
      className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
    >
      {users.map((user) => {
        return (
          <option key={user.id} value={user.id}>
            {user.firstName} {user.lastName}
          </option>
        )
      })}
    </SelectField>
  )
}
