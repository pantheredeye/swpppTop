import { render } from '@cedarjs/testing/web'

import OrganizationSettingsLayout from './OrganizationSettingsLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('OrganizationSettingsLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OrganizationSettingsLayout />)
    }).not.toThrow()
  })
})
