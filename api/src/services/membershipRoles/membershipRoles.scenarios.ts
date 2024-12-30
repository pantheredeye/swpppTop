import type { Prisma, MembershipRole } from "@prisma/client";
import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.MembershipRoleCreateArgs>({
  membershipRole: {
    one: {
      data: {
        name: "String",
        updatedAt: "2024-12-30T15:40:07.886Z",
        organization: { create: { name: "String1866" } },
      },
    },
    two: {
      data: {
        name: "String",
        updatedAt: "2024-12-30T15:40:07.886Z",
        organization: { create: { name: "String9296769" } },
      },
    },
  },
});

export type StandardScenario = ScenarioData<MembershipRole, "membershipRole">;
