import { render } from '@cedarjs/testing/web'

import SitesPage from './SitesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SitesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SitesPage />)
    }).not.toThrow()
  })
})
