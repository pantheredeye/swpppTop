import type { Prisma, Media } from '@prisma/client'

import type { ScenarioData } from '@cedarjs/testing/api'

export const standard = defineScenario<Prisma.MediaCreateArgs>({
  media: {
    one: {
      data: {
        url: 'String',
        type: 'IMAGE',
        organization: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        url: 'String',
        type: 'IMAGE',
        organization: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Media, 'media'>
