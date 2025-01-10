// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  orgMembers: [
    {
      __typename: 'OrgMembers' as const,
      id: 42,
    },
    {
      __typename: 'OrgMembers' as const,
      id: 43,
    },
    {
      __typename: 'OrgMembers' as const,
      id: 44,
    },
  ],
})
