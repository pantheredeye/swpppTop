// import { Link, routes } from '@cedarjs/router'
import { Metadata } from '@cedarjs/web'

const RequestInvitePage = () => {
  return (
    <>
      <Metadata title="RequestInvite" description="RequestInvite page" />

      <h1>RequestInvitePage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/RequestInvitePage/RequestInvitePage.tsx</code>
      </p>
      {/*
          My default route is named `requestInvite`, link to me with:
          `<Link to={routes.requestInvite()}>RequestInvite</Link>`
      */}
    </>
  )
}

export default RequestInvitePage
