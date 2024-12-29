import type { Prisma, Permission } from "@prisma/client";
import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.PermissionCreateArgs>({
  permission: {
    one: {
      data: {
        action: "CREATE",
        subject: "String",
        updatedAt: "2024-12-29T19:43:28.912Z",
      },
    },
    two: {
      data: {
        action: "CREATE",
        subject: "String",
        updatedAt: "2024-12-29T19:43:28.912Z",
      },
    },
  },
});

export type StandardScenario = ScenarioData<Permission, "permission">;
