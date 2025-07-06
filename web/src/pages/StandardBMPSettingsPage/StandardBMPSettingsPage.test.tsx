import { render } from '@cedarjs/testing/web'

import StandardBmpSettingsPage from './StandardBMPSettingsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('StandardBmpSettingsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<StandardBmpSettingsPage />)
    }).not.toThrow()
  })
})
