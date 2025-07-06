import { render } from '@cedarjs/testing/web'

import OrganizationSettingsPage from './OrganizationSettingsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('OrganizationSettingsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OrganizationSettingsPage />)
    }).not.toThrow()
  })
})
