import { render } from "@redwoodjs/testing/web";

import GeneralSettings from "./GeneralSettings";

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe("GeneralSettings", () => {
  it("renders successfully", () => {
    expect(() => {
      render(<GeneralSettings />);
    }).not.toThrow();
  });
});
