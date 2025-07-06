import type { Prisma, Event } from '@prisma/client'

import type { ScenarioData } from '@cedarjs/testing/api'

export const standard = defineScenario<Prisma.EventCreateArgs>({
  event: {
    one: {
      data: {
        type: 'SITE_TYPE_CREATED',
        site: {
          create: {
            name: 'String',
            updatedAt: '2024-12-01T14:21:02.630Z',
            organization: { create: { name: 'String' } },
          },
        },
        membership: {
          create: {
            invitationChannel: 'EMAIL',
            user: {
              create: {
                email: 'String1921249',
                hashedPassword: 'String',
                salt: 'String',
                updatedAt: '2024-12-01T14:21:02.630Z',
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
        type: 'SITE_TYPE_CREATED',
        site: {
          create: {
            name: 'String',
            updatedAt: '2024-12-01T14:21:02.630Z',
            organization: { create: { name: 'String' } },
          },
        },
        membership: {
          create: {
            invitationChannel: 'EMAIL',
            user: {
              create: {
                email: 'String3176282',
                hashedPassword: 'String',
                salt: 'String',
                updatedAt: '2024-12-01T14:21:02.630Z',
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

export type StandardScenario = ScenarioData<Event, 'event'>
