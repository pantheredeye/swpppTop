import type { PendingMembershipRole } from '@prisma/client'

import {
  pendingMembershipRoles,
  pendingMembershipRole,
  createPendingMembershipRole,
  updatePendingMembershipRole,
  deletePendingMembershipRole,
} from './pendingMembershipRoles'
import type { StandardScenario } from './pendingMembershipRoles.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('pendingMembershipRoles', () => {
  scenario(
    'returns all pendingMembershipRoles',
    async (scenario: StandardScenario) => {
      const result = await pendingMembershipRoles()

      expect(result.length).toEqual(
        Object.keys(scenario.pendingMembershipRole).length
      )
    }
  )

  scenario(
    'returns a single pendingMembershipRole',
    async (scenario: StandardScenario) => {
      const result = await pendingMembershipRole({
        id: scenario.pendingMembershipRole.one.id,
      })

      expect(result).toEqual(scenario.pendingMembershipRole.one)
    }
  )

  scenario(
    'creates a pendingMembershipRole',
    async (scenario: StandardScenario) => {
      const result = await createPendingMembershipRole({
        input: {
          membershipId: scenario.pendingMembershipRole.two.membershipId,
          roleId: scenario.pendingMembershipRole.two.roleId,
        },
      })

      expect(result.membershipId).toEqual(
        scenario.pendingMembershipRole.two.membershipId
      )
      expect(result.roleId).toEqual(scenario.pendingMembershipRole.two.roleId)
    }
  )

  scenario(
    'updates a pendingMembershipRole',
    async (scenario: StandardScenario) => {
      const original = (await pendingMembershipRole({
        id: scenario.pendingMembershipRole.one.id,
      })) as PendingMembershipRole
      const result = await updatePendingMembershipRole({
        id: original.id,
        input: {
          membershipId: scenario.pendingMembershipRole.two.membershipId,
        },
      })

      expect(result.membershipId).toEqual(
        scenario.pendingMembershipRole.two.membershipId
      )
    }
  )

  scenario(
    'deletes a pendingMembershipRole',
    async (scenario: StandardScenario) => {
      const original = (await deletePendingMembershipRole({
        id: scenario.pendingMembershipRole.one.id,
      })) as PendingMembershipRole
      const result = await pendingMembershipRole({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
