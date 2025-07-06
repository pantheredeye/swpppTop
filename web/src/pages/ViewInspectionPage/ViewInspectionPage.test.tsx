import { render } from '@cedarjs/testing/web'

import ViewInspectionPage from './ViewInspectionPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ViewInspectionPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ViewInspectionPage />)
    }).not.toThrow()
  })
})
