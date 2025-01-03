import type { Prisma, RolePermission } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.RolePermissionCreateArgs>({
  rolePermission: {
    one: {
      data: {
        fields: 'String',
        role: {
          create: {
            name: 'String',
            updatedAt: '2024-12-29T19:43:50.547Z',
            organization: { create: { name: 'String' } },
          },
        },
        permission: {
          create: {
            action: 'CREATE',
            subject: 'String',
            updatedAt: '2024-12-29T19:43:50.547Z',
          },
        },
      },
    },
    two: {
      data: {
        fields: 'String',
        role: {
          create: {
            name: 'String',
            updatedAt: '2024-12-29T19:43:50.547Z',
            organization: { create: { name: 'String' } },
          },
        },
        permission: {
          create: {
            action: 'CREATE',
            subject: 'String',
            updatedAt: '2024-12-29T19:43:50.547Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<RolePermission, 'rolePermission'>
