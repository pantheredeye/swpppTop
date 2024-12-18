import type { FindUserQuery, FindUserQueryVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import ProfileForm from '../ProfileForm/ProfileForm'

export const QUERY: TypedDocumentNode<FindUserQuery, FindUserQueryVariables> =
  gql`
    query FindUserQuery($id: String!) {
      user(id: $id) {
        id
        firstName
        lastName
        # role {
        #   name
        # }
        email
        phoneNumber
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindUserQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  user,
}: CellSuccessProps<FindUserQuery, FindUserQueryVariables>) => {
  return <ProfileForm user={user} />
}
