import type { User } from '@prisma/client'

import { users, user, createUser, updateUser, deleteUser } from './users'
import type { StandardScenario } from './users.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('users', () => {
  scenario('returns all users', async (scenario: StandardScenario) => {
    const result = await users()

    expect(result.length).toEqual(Object.keys(scenario.user).length)
  })

  scenario('returns a single user', async (scenario: StandardScenario) => {
    const result = await user({ id: scenario.user.one.id })

    expect(result).toEqual(scenario.user.one)
  })

  scenario('creates a user', async (scenario: StandardScenario) => {
    const result = await createUser({
      input: {
        email: 'String7042985',
        hashedPassword: 'String',
        salt: 'String',
        updatedAt: '2024-12-04T21:12:10.559Z',
        defaultOrganizationId: scenario.user.two.defaultOrganizationId,
      },
    })

    expect(result.email).toEqual('String7042985')
    expect(result.hashedPassword).toEqual('String')
    expect(result.salt).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2024-12-04T21:12:10.559Z'))
    expect(result.defaultOrganizationId).toEqual(
      scenario.user.two.defaultOrganizationId
    )
  })

  scenario('updates a user', async (scenario: StandardScenario) => {
    const original = (await user({ id: scenario.user.one.id })) as User
    const result = await updateUser({
      id: original.id,
      input: { email: 'String97878852' },
    })

    expect(result.email).toEqual('String97878852')
  })

  scenario('deletes a user', async (scenario: StandardScenario) => {
    const original = (await deleteUser({ id: scenario.user.one.id })) as User
    const result = await user({ id: original.id })

    expect(result).toEqual(null)
  })
})
