import { render } from '@cedarjs/testing/web'

import RoleManagementDialog from './RoleManagementDialog'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('RoleManagementDialog', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RoleManagementDialog />)
    }).not.toThrow()
  })
})
