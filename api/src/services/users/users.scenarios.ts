import type { Prisma, User } from "@prisma/client";
import type { ScenarioData } from "@redwoodjs/testing/api";

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        email: "String2362350",
        hashedPassword: "String",
        salt: "String",
        updatedAt: "2025-01-04T12:49:38.826Z",
        defaultOrganization: { create: { name: "String6826998" } },
      },
    },
    two: {
      data: {
        email: "String4052507",
        hashedPassword: "String",
        salt: "String",
        updatedAt: "2025-01-04T12:49:38.826Z",
        defaultOrganization: { create: { name: "String3742900" } },
      },
    },
  },
});

export type StandardScenario = ScenarioData<User, "user">;
