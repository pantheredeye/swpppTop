import { render } from '@cedarjs/testing/web'

import StatisticsCard from './StatisticsCard'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('StatisticsCard', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<StatisticsCard />)
    }).not.toThrow()
  })
})
