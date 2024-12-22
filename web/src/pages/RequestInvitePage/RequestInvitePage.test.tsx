import { render } from '@redwoodjs/testing/web'

import RequestInvitePage from './RequestInvitePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('RequestInvitePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RequestInvitePage />)
    }).not.toThrow()
  })
})
