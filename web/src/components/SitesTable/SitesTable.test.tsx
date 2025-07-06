import { render } from '@cedarjs/testing/web'

import SitesTable from './SitesTable'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SitesTable', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SitesTable columns={[]} data={[]} />)
    }).not.toThrow()
  })
})
