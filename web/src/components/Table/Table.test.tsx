import { render } from '@cedarjs/testing/web'

import Table from './Table'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Table', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <Table headers={[]}>
          <tr>
            <th scope="row">Donuts</th>
            <td>3,000</td>
          </tr>
        </Table>
      )
    }).not.toThrow()
  })
})
