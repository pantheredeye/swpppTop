import { Plus } from 'lucide-react'

import { Button } from 'src/components/ui/Button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from 'src/components/ui/Card'

import OrgRolesCell from './OrgRolesCell/'

const RolesSettings = ({ organizationId }) => {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Roles & Permissions</CardTitle>
              <CardDescription className="mt-2">
                Manage access control with predefined system roles or create
                custom roles
              </CardDescription>
            </div>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Custom Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <OrgRolesCell id={organizationId} isSystemDefined={true} />
        </CardContent>
      </Card>
    </div>
  )
}

export default RolesSettings
