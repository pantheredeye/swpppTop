import { render } from '@cedarjs/testing/web'

import QuickActionsCard from './QuickActionsCard'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('QuickActionsCard', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QuickActionsCard />)
    }).not.toThrow()
  })
})
