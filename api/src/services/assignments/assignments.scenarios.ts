import type { Prisma, Assignment } from '@prisma/client'

import type { ScenarioData } from '@cedarjs/testing/api'

export const standard = defineScenario<Prisma.AssignmentCreateArgs>({
  assignment: {
    one: {
      data: {
        site: {
          create: {
            name: 'String',
            updatedAt: '2024-12-01T14:20:47.509Z',
            organization: { create: { name: 'String' } },
          },
        },
        member: {
          create: {
            invitationChannel: 'EMAIL',
            user: {
              create: {
                email: 'String3951652',
                hashedPassword: 'String',
                salt: 'String',
                updatedAt: '2024-12-01T14:20:47.509Z',
              },
            },
            organization: { create: { name: 'String' } },
          },
        },
        organization: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        site: {
          create: {
            name: 'String',
            updatedAt: '2024-12-01T14:20:47.509Z',
            organization: { create: { name: 'String' } },
          },
        },
        member: {
          create: {
            invitationChannel: 'EMAIL',
            user: {
              create: {
                email: 'String1418767',
                hashedPassword: 'String',
                salt: 'String',
                updatedAt: '2024-12-01T14:20:47.509Z',
              },
            },
            organization: { create: { name: 'String' } },
          },
        },
        organization: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Assignment, 'assignment'>
