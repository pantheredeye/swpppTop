import { render } from '@redwoodjs/testing/web'

import LeadForm from './LeadForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('LeadForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LeadForm />)
    }).not.toThrow()
  })
})