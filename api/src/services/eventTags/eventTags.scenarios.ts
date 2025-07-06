import type { Prisma, EventTag } from '@prisma/client'

import type { ScenarioData } from '@cedarjs/testing/api'

export const standard = defineScenario<Prisma.EventTagCreateArgs>({
  eventTag: {
    one: {
      data: {
        tag: 'String',
        event: {
          create: {
            type: 'SITE_TYPE_CREATED',
            site: {
              create: {
                name: 'String',
                updatedAt: '2024-12-01T14:26:13.057Z',
                organization: { create: { name: 'String' } },
              },
            },
            membership: {
              create: {
                invitationChannel: 'EMAIL',
                user: {
                  create: {
                    email: 'String7743998',
                    hashedPassword: 'String',
                    salt: 'String',
                    updatedAt: '2024-12-01T14:26:13.057Z',
                  },
                },
                organization: { create: { name: 'String' } },
              },
            },
            organization: { create: { name: 'String' } },
          },
        },
      },
    },
    two: {
      data: {
        tag: 'String',
        event: {
          create: {
            type: 'SITE_TYPE_CREATED',
            site: {
              create: {
                name: 'String',
                updatedAt: '2024-12-01T14:26:13.057Z',
                organization: { create: { name: 'String' } },
              },
            },
            membership: {
              create: {
                invitationChannel: 'EMAIL',
                user: {
                  create: {
                    email: 'String2677564',
                    hashedPassword: 'String',
                    salt: 'String',
                    updatedAt: '2024-12-01T14:26:13.057Z',
                  },
                },
                organization: { create: { name: 'String' } },
              },
            },
            organization: { create: { name: 'String' } },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<EventTag, 'eventTag'>
