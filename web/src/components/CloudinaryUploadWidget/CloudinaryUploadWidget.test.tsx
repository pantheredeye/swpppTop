import { render } from '@cedarjs/testing/web'

import CloudinaryUploadWidget from './CloudinaryUploadWidget'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CloudinaryUploadWidget', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CloudinaryUploadWidget />)
    }).not.toThrow()
  })
})
