import { render } from '@redwoodjs/testing/web'

import SearchInput from './SearchInput'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SearchInput', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SearchInput />)
    }).not.toThrow()
  })
})
