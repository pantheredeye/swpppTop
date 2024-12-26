import type { Meta, StoryObj } from "@storybook/react";

import OrganizationSettingLayout from "./OrganizationSettingsLayout";

const meta: Meta<typeof OrganizationSettingLayout> = {
  component: OrganizationSettingLayout,
};

export default meta;

type Story = StoryObj<typeof OrganizationSettingLayout>;

export const Primary: Story = {};
