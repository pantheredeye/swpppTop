import type { RolePermission } from "@prisma/client";

import {
  rolePermissions,
  rolePermission,
  createRolePermission,
  updateRolePermission,
  deleteRolePermission,
} from "./rolePermissions";
import type { StandardScenario } from "./rolePermissions.scenarios";

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe("rolePermissions", () => {
  scenario(
    "returns all rolePermissions",
    async (scenario: StandardScenario) => {
      const result = await rolePermissions();

      expect(result.length).toEqual(
        Object.keys(scenario.rolePermission).length,
      );
    },
  );

  scenario(
    "returns a single rolePermission",
    async (scenario: StandardScenario) => {
      const result = await rolePermission({
        id: scenario.rolePermission.one.id,
      });

      expect(result).toEqual(scenario.rolePermission.one);
    },
  );

  scenario("creates a rolePermission", async (scenario: StandardScenario) => {
    const result = await createRolePermission({
      input: {
        roleId: scenario.rolePermission.two.roleId,
        permissionId: scenario.rolePermission.two.permissionId,
        fields: "String",
      },
    });

    expect(result.roleId).toEqual(scenario.rolePermission.two.roleId);
    expect(result.permissionId).toEqual(
      scenario.rolePermission.two.permissionId,
    );
    expect(result.fields).toEqual("String");
  });

  scenario("updates a rolePermission", async (scenario: StandardScenario) => {
    const original = (await rolePermission({
      id: scenario.rolePermission.one.id,
    })) as RolePermission;
    const result = await updateRolePermission({
      id: original.id,
      input: { fields: "String2" },
    });

    expect(result.fields).toEqual("String2");
  });

  scenario("deletes a rolePermission", async (scenario: StandardScenario) => {
    const original = (await deleteRolePermission({
      id: scenario.rolePermission.one.id,
    })) as RolePermission;
    const result = await rolePermission({ id: original.id });

    expect(result).toEqual(null);
  });
});
