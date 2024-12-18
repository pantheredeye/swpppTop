import type { Prisma, User } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        email: 'String7565373',
        hashedPassword: 'String',
        salt: 'String',
        updatedAt: '2024-12-04T21:12:10.587Z',
        defaultOrganization: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        email: 'String1018290',
        hashedPassword: 'String',
        salt: 'String',
        updatedAt: '2024-12-04T21:12:10.587Z',
        defaultOrganization: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
