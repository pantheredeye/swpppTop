import type { Prisma, Inspection } from '@prisma/client'

import type { ScenarioData } from '@cedarjs/testing/api'

export const standard = defineScenario<Prisma.InspectionCreateArgs>({
  inspection: {
    one: {
      data: {
        organization: { create: { name: 'String' } },
        site: {
          create: {
            name: 'String',
            updatedAt: '2024-12-01T14:27:12.152Z',
            organization: { create: { name: 'String' } },
          },
        },
      },
    },
    two: {
      data: {
        organization: { create: { name: 'String' } },
        site: {
          create: {
            name: 'String',
            updatedAt: '2024-12-01T14:27:12.152Z',
            organization: { create: { name: 'String' } },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Inspection, 'inspection'>
