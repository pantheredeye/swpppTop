import type { Meta, StoryObj } from '@storybook/react'

import CreateOrganizationPage from './CreateOrganizationPage'

const meta: Meta<typeof CreateOrganizationPage> = {
  component: CreateOrganizationPage,
}

export default meta

type Story = StoryObj<typeof CreateOrganizationPage>

export const Primary: Story = {}
