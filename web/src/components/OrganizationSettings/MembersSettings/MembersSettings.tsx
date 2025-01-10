import { useState } from 'react'

import InviteMembersModal from 'src/components/InviteMembersModal/InviteMembersModal'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from 'src/components/ui/Card'

import OrgMembersCell from './OrgMembersCell/'

const MembersSettings = ({ organizationId }) => {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-100">
                Organization Members
              </CardTitle>
              <CardDescription className="mt-2 text-gray-400">
                Manage members, invite and assign roles.
              </CardDescription>
            </div>
            <InviteMembersModal
              organizationId={organizationId}
              onInviteComplete={handleRefresh}
            />
          </div>
        </CardHeader>
        <CardContent>
          <OrgMembersCell
            id={organizationId}
            key={refreshKey}
            handleRefresh={handleRefresh}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default MembersSettings
