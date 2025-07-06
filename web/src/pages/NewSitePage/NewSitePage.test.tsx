import { render } from '@cedarjs/testing/web'

import NewSitePage from './NewSitePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('NewSitePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewSitePage />)
    }).not.toThrow()
  })
})
