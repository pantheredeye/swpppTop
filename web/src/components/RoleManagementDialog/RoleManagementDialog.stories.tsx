// Pass props to your component by passing an `args` object to your story
//
// ```tsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { Meta, StoryObj } from "@storybook/react";

import RoleManagementDialog from "./RoleManagementDialog";

const meta: Meta<typeof RoleManagementDialog> = {
  component: RoleManagementDialog,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof RoleManagementDialog>;

export const Primary: Story = {};
