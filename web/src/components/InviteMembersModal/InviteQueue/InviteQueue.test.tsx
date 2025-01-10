import { render } from '@redwoodjs/testing/web'

import InviteQueue from './InviteQueue'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('InviteQueue', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<InviteQueue />)
    }).not.toThrow()
  })
})
