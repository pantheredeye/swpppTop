import { render } from "@redwoodjs/testing/web";

import DeleteOrganization from "./DeleteOrganization";

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe("DeleteOrganization", () => {
  it("renders successfully", () => {
    expect(() => {
      render(<DeleteOrganization />);
    }).not.toThrow();
  });
});
