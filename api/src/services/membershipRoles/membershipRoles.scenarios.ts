import type { Prisma, MembershipRole } from '@prisma/client'

import type { ScenarioData } from '@cedarjs/testing/api'

export const standard = defineScenario<Prisma.MembershipRoleCreateArgs>({
  membershipRole: {
    one: { data: { name: 'String' } },
    two: { data: { name: 'String' } },
  },
})

export type StandardScenario = ScenarioData<MembershipRole, 'membershipRole'>
