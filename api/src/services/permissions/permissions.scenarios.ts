import type { Prisma, Permission } from '@prisma/client'

import type { ScenarioData } from '@cedarjs/testing/api'

export const standard = defineScenario<Prisma.PermissionCreateArgs>({
  permission: {
    one: {
      data: {
        action: 'CREATE',
        subject: 'String',
        updatedAt: '2024-12-31T21:25:28.656Z',
      },
    },
    two: {
      data: {
        action: 'CREATE',
        subject: 'String',
        updatedAt: '2024-12-31T21:25:28.656Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Permission, 'permission'>
