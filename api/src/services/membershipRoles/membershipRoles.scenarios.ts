import type { Prisma, MembershipRole } from "@prisma/client";
import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.MembershipRoleCreateArgs>({
  membershipRole: {
    one: {
      data: {
        name: "String",
        updatedAt: "2024-12-29T19:42:42.185Z",
        organization: { create: { name: "String" } },
      },
    },
    two: {
      data: {
        name: "String",
        updatedAt: "2024-12-29T19:42:42.185Z",
        organization: { create: { name: "String" } },
      },
    },
  },
});

export type StandardScenario = ScenarioData<MembershipRole, "membershipRole">;
