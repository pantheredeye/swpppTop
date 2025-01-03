import type {
  FindMembershipQuery,
  FindMembershipQueryVariables,
} from "types/graphql";

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from "@redwoodjs/web";

export const QUERY: TypedDocumentNode<
  FindMembershipQuery,
  FindMembershipQueryVariables
> = gql`
  query FindMembershipQuery($id: String!) {
    membership: membership(id: $id) {
      id
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
  error,
}: CellFailureProps<FindMembershipQueryVariables>) => (
  <div style={{ color: "red" }}>Error: {error?.message}</div>
);

export const Success = ({
  membership,
}: CellSuccessProps<FindMembershipQuery, FindMembershipQueryVariables>) => {
  return <div>{JSON.stringify(membership)}</div>;
};
