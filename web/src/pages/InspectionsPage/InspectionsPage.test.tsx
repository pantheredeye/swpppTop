import { render } from '@cedarjs/testing/web'

import InspectionsPage from './InspectionsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('InspectionsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<InspectionsPage />)
    }).not.toThrow()
  })
})
