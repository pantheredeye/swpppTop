// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  fetchRoles: [
    {
      __typename: 'fetchRoles' as const,
      id: 42,
    },
    {
      __typename: 'fetchRoles' as const,
      id: 43,
    },
    {
      __typename: 'fetchRoles' as const,
      id: 44,
    },
  ],
})
