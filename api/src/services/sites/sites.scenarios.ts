import type { Prisma, Site } from '@prisma/client'

import type { ScenarioData } from '@cedarjs/testing/api'

export const standard = defineScenario<Prisma.SiteCreateArgs>({
  site: {
    one: {
      data: {
        name: 'String',
        updatedAt: '2024-12-01T14:25:31.085Z',
        organization: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        name: 'String',
        updatedAt: '2024-12-01T14:25:31.085Z',
        organization: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Site, 'site'>
