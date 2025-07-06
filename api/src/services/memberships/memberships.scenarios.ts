import type { Prisma, Membership } from '@prisma/client'

import type { ScenarioData } from '@cedarjs/testing/api'

export const standard = defineScenario<Prisma.MembershipCreateArgs>({
  membership: {
    one: {
      data: {
        invitationChannel: 'EMAIL',
        user: {
          create: {
            email: 'String365175',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2024-12-01T14:20:33.758Z',
          },
        },
        organization: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        invitationChannel: 'EMAIL',
        user: {
          create: {
            email: 'String7925632',
            hashedPassword: 'String',
            salt: 'String',
            updatedAt: '2024-12-01T14:20:33.758Z',
          },
        },
        organization: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Membership, 'membership'>
