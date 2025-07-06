import { render } from '@cedarjs/testing/web'

import NewInspectionPage from './NewInspectionPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe.skip('NewInspectionPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewInspectionPage />)
    }).not.toThrow()
  })
})
