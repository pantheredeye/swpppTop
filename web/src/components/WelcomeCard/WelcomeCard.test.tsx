import { render } from '@cedarjs/testing/web'

import WelcomeCard from './WelcomeCard'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('WelcomeCard', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<WelcomeCard />)
    }).not.toThrow()
  })
})
