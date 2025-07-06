import { render } from '@cedarjs/testing/web'

import RolesSettings from './RolesSettings'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('RolesSettings', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RolesSettings />)
    }).not.toThrow()
  })
})
