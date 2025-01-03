import { Button } from 'src/components/ui/Button'

import { useQuery } from '@redwoodjs/web'
import { Plus } from 'lucide-react'
import OrgRolesCell from 'src/components/OrgRolesCell'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from 'src/components/ui/Card'

const GET_ORGANIZATION = gql`
  query GetOrganization($id: String!) {
    organization(id: $id) {
      id
      name
      membershipRoles {
        id
        name
        permissions {
          permission {
            id
            action
            subject
          }
        }
      }
    }
  }
`

const RolesSettings = ({ organizationId }) => {
  const { data } = useQuery(GET_ORGANIZATION, {
    variables: { id: organizationId },
  })


  return (
<div className="space-y-6">
      <Card className="bg-gray-900 shadow-xl">
      <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-100">
                Roles & Permissions
              </CardTitle>
              <CardDescription className="mt-2 text-gray-400">
                Manage access control with predefined system roles or create
                custom roles
              </CardDescription>
            </div>
            <Button
              variant="outline"
              className="border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
            >
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
