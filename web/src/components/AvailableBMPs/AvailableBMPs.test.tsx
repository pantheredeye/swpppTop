import { render } from '@cedarjs/testing/web'

import AvailableBmps from './AvailableBMPs'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AvailableBmps', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AvailableBmps bmps={[]} onSelect={console.info} />)
    }).not.toThrow()
  })
})
