import type { Permission } from "@prisma/client";

import {
  permissions,
  permission,
  createPermission,
  updatePermission,
  deletePermission,
} from "./permissions";
import type { StandardScenario } from "./permissions.scenarios";

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe("permissions", () => {
  scenario("returns all permissions", async (scenario: StandardScenario) => {
    const result = await permissions();

    expect(result.length).toEqual(Object.keys(scenario.permission).length);
  });

  scenario(
    "returns a single permission",
    async (scenario: StandardScenario) => {
      const result = await permission({ id: scenario.permission.one.id });

      expect(result).toEqual(scenario.permission.one);
    },
  );

  scenario("creates a permission", async () => {
    const result = await createPermission({
      input: {
        action: "CREATE",
        subject: "String",
        updatedAt: "2024-12-31T21:25:28.638Z",
      },
    });

    expect(result.action).toEqual("CREATE");
    expect(result.subject).toEqual("String");
    expect(result.updatedAt).toEqual(new Date("2024-12-31T21:25:28.638Z"));
  });

  scenario("updates a permission", async (scenario: StandardScenario) => {
    const original = (await permission({
      id: scenario.permission.one.id,
    })) as Permission;
    const result = await updatePermission({
      id: original.id,
      input: { action: "DELETE" },
    });

    expect(result.action).toEqual("DELETE");
  });

  scenario("deletes a permission", async (scenario: StandardScenario) => {
    const original = (await deletePermission({
      id: scenario.permission.one.id,
    })) as Permission;
    const result = await permission({ id: original.id });

    expect(result).toEqual(null);
  });
});
