// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  membershipRole: {
    __typename: "MembershipRole" as const,
    id: "42",
  },
});
