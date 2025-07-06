import type { Prisma, PendingMembershipRole } from '@prisma/client'

import type { ScenarioData } from '@cedarjs/testing/api'

export const standard = defineScenario<Prisma.PendingMembershipRoleCreateArgs>({
  pendingMembershipRole: {
    one: {
      data: {
        membership: {
          create: {
            invitationChannel: 'EMAIL',
            user: {
              create: {
                email: 'String6090639',
                hashedPassword: 'String',
                salt: 'String',
                updatedAt: '2024-12-29T19:44:09.788Z',
                defaultOrganization: { create: { name: 'String' } },
              },
            },
            organization: { create: { name: 'String' } },
          },
        },
        role: {
          create: {
            name: 'String',
            updatedAt: '2024-12-29T19:44:09.788Z',
            organization: { create: { name: 'String' } },
          },
        },
      },
    },
    two: {
      data: {
        membership: {
          create: {
            invitationChannel: 'EMAIL',
            user: {
              create: {
                email: 'String9090486',
                hashedPassword: 'String',
                salt: 'String',
                updatedAt: '2024-12-29T19:44:09.788Z',
                defaultOrganization: { create: { name: 'String' } },
              },
            },
            organization: { create: { name: 'String' } },
          },
        },
        role: {
          create: {
            name: 'String',
            updatedAt: '2024-12-29T19:44:09.788Z',
            organization: { create: { name: 'String' } },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  PendingMembershipRole,
  'pendingMembershipRole'
>
