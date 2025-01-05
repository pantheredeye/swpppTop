import { render } from "@redwoodjs/testing/web";

import InviteMembersModal from "./InviteMembersModal";

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe("InviteMembersModal", () => {
  it("renders successfully", () => {
    expect(() => {
      render(<InviteMembersModal />);
    }).not.toThrow();
  });
});
