import type {
  FindMembershipRoleQuery,
  FindMembershipRoleQueryVariables,
} from "types/graphql";

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from "@redwoodjs/web";

export const QUERY: TypedDocumentNode<
  FindMembershipRoleQuery,
  FindMembershipRoleQueryVariables
> = gql`
  query FindMembershipRoleQuery($id: String!) {
    membershipRole: membershipRole(id: $id) {
      id
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
  error,
}: CellFailureProps<FindMembershipRoleQueryVariables>) => (
  <div style={{ color: "red" }}>Error: {error?.message}</div>
);

export const Success = ({
  membershipRole,
}: CellSuccessProps<
  FindMembershipRoleQuery,
  FindMembershipRoleQueryVariables
>) => {
  return <div>{JSON.stringify(membershipRole)}</div>;
};
