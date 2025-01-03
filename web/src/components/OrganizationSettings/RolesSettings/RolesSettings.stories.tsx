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

import type { Meta, StoryObj } from '@storybook/react'

import RolesSettings from './RolesSettings'

const meta: Meta<typeof RolesSettings> = {
  component: RolesSettings,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof RolesSettings>

export const Primary: Story = {}
