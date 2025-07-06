import { render } from '@cedarjs/testing/web'

import RecentActivityCard from './RecentActivityCard'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('RecentActivityCard', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RecentActivityCard activities={[]} />)
    }).not.toThrow()
  })
})
