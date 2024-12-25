import type { Meta, StoryObj } from '@storybook/react'

import OrganizationSettingsPage from './OrganizationSettingsPage'

const meta: Meta<typeof OrganizationSettingsPage> = {
  component: OrganizationSettingsPage,
}

export default meta

type Story = StoryObj<typeof OrganizationSettingsPage>

export const Primary: Story = {}
