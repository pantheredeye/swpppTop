import { render } from '@cedarjs/testing/web'

import BmpItem from './BmpItem'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('BmpItem', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <BmpItem
          bmp={{
            id: 0,
            name: 'test-name',
            description: 'test-description',
            implemented: false,
            maintenanceRequired: false,
            repeatOccurrence: false,
            correctiveActionNeeded: 'test-correctiveActionNeeded',
            notes: 'test-notes',
          }}
        />
      )
    }).not.toThrow()
  })
})
