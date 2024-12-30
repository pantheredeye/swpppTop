import type { Prisma, Permission } from "@prisma/client";
import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.PermissionCreateArgs>({
  permission: {
    one: {
      data: {
        action: "CREATE",
        subject: "String",
        updatedAt: "2024-12-30T15:39:53.844Z",
      },
    },
    two: {
      data: {
        action: "CREATE",
        subject: "String",
        updatedAt: "2024-12-30T15:39:53.844Z",
      },
    },
  },
});

export type StandardScenario = ScenarioData<Permission, "permission">;
