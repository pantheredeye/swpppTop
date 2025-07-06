import { render } from '@cedarjs/testing/web'

import InspectionsTable from './InspectionsTable'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('InspectionsTable', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<InspectionsTable columns={[]} data={[]} />)
    }).not.toThrow()
  })
})
