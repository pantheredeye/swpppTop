import { useParams } from '@cedarjs/router'

import ProfileCell from 'src/components/ProfileCell'

const ProfilePage = () => {
  const { id } = useParams()

  return <ProfileCell id={parseInt(id, 10)} />
}

export default ProfilePage
