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

import SearchInput from './SearchInput'

const meta: Meta<typeof SearchInput> = {
  component: SearchInput,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SearchInput>

export const Primary: Story = {}
