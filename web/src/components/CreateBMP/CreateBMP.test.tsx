import { render } from '@cedarjs/testing/web'

import CreateBmp from './CreateBMP'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CreateBmp', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CreateBmp />)
    }).not.toThrow()
  })
})
