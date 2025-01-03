import type { Prisma, Organization } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.OrganizationCreateArgs>({
  organization: {
    one: { data: { name: 'String1373599' } },
    two: { data: { name: 'String3567984' } },
  },
})

export type StandardScenario = ScenarioData<Organization, 'organization'>
