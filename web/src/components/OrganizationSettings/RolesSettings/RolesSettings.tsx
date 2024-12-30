import { useQuery } from '@redwoodjs/web'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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
    <>
    <Card>
      <CardHeader>
        <CardTitle>Roles & Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        {/* We'll add the RolesManagement component here next */}
        <pre>
          {JSON.stringify(data?.organization?.membershipRoles, null, 2)}
        </pre>
      </CardContent>
    </Card>
    </>
  )
}

export default RolesSettings
