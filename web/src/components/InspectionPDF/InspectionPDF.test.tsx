import { render } from '@cedarjs/testing/web'

import InspectionPDF from './InspectionPDF'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe.skip('InspectionPdf', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<InspectionPDF inspection={{}} />)
    }).not.toThrow()
  })
})
