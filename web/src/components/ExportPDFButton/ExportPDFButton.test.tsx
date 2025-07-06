import { render } from '@cedarjs/testing/web'

import ExportPDFButton from './ExportPDFButton'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ExportPDFButton', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ExportPDFButton />)
    }).not.toThrow()
  })
})
