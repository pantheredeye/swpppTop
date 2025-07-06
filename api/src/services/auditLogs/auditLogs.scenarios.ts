import type { Prisma, AuditLog } from '@prisma/client'

import type { ScenarioData } from '@cedarjs/testing/api'

export const standard = defineScenario<Prisma.AuditLogCreateArgs>({
  auditLog: {
    one: {
      data: { action: 'String', resourceType: 'String', resourceId: 'String' },
    },
    two: {
      data: { action: 'String', resourceType: 'String', resourceId: 'String' },
    },
  },
})

export type StandardScenario = ScenarioData<AuditLog, 'auditLog'>
