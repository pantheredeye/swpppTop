import type { Prisma, InspectionEventDetails } from '@prisma/client'

import type { ScenarioData } from '@cedarjs/testing/api'

export const standard = defineScenario<Prisma.InspectionEventDetailsCreateArgs>(
  {
    inspectionEventDetails: {
      one: {
        data: {
          event: {
            create: {
              type: 'SITE_TYPE_CREATED',
              site: {
                create: {
                  name: 'String',
                  updatedAt: '2024-12-01T14:26:51.376Z',
                  organization: { create: { name: 'String' } },
                },
              },
              membership: {
                create: {
                  invitationChannel: 'EMAIL',
                  user: {
                    create: {
                      email: 'String1535415',
                      hashedPassword: 'String',
                      salt: 'String',
                      updatedAt: '2024-12-01T14:26:51.376Z',
                    },
                  },
                  organization: { create: { name: 'String' } },
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
          event: {
            create: {
              type: 'SITE_TYPE_CREATED',
              site: {
                create: {
                  name: 'String',
                  updatedAt: '2024-12-01T14:26:51.376Z',
                  organization: { create: { name: 'String' } },
                },
              },
              membership: {
                create: {
                  invitationChannel: 'EMAIL',
                  user: {
                    create: {
                      email: 'String8118157',
                      hashedPassword: 'String',
                      salt: 'String',
                      updatedAt: '2024-12-01T14:26:51.376Z',
                    },
                  },
                  organization: { create: { name: 'String' } },
                },
              },
              organization: { create: { name: 'String' } },
            },
          },
          organization: { create: { name: 'String' } },
        },
      },
    },
  }
)

export type StandardScenario = ScenarioData<
  InspectionEventDetails,
  'inspectionEventDetails'
>
