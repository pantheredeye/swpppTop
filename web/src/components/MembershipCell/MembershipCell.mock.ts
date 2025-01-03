// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  membership: {
    __typename: "Membership" as const,
    id: "42",
  },
});
