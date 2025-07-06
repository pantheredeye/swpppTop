import { render } from '@cedarjs/testing/web'

import Input from './Input'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe.skip('Input', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Input label="test-label" name="test-name" />)
    }).not.toThrow()
  })
})
