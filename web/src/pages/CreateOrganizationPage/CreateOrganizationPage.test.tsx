import { render } from '@redwoodjs/testing/web'

import CreateOrganizationPage from './CreateOrganizationPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('CreateOrganizationPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CreateOrganizationPage />)
    }).not.toThrow()
  })
})
