import { render } from '@cedarjs/testing/web'

import SwitchPage from './SwitchPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SwitchPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SwitchPage />)
    }).not.toThrow()
  })
})
