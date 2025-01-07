import { render } from "@redwoodjs/testing/web";

import RoleManagementModal from "./RoleManagementModal";

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe("RoleManagementModal", () => {
  it("renders successfully", () => {
    expect(() => {
      render(<RoleManagementModal />);
    }).not.toThrow();
  });
});
