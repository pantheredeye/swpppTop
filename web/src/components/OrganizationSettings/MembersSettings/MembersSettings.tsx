
import { Plus } from 'lucide-react'

import { useQuery } from '@redwoodjs/web'

import OrgMembersCell from 'src/components/OrgMembersCell'
import { Button } from 'src/components/ui/Button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from 'src/components/ui/Card'

const MembersSettings = ({ organizationId }) => {
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
            <Button
              variant="outline"
              className="border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Invite Members
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <OrgMembersCell id={organizationId} />
        </CardContent>
      </Card>
    </div>
  )
}

export default MembersSettings
