import type {
  FindOrgRolesQuery,
  FindOrgRolesQueryVariables,
} from 'types/graphql'

import { Shield, Copy, ChevronRight, Plus } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from 'src/components/ui/Card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'src/components/ui/Accordion'
import { Button } from 'src/components/ui/Button'
import { Badge } from 'src/components/ui/Badge'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<
  FindOrgRolesQuery,
  FindOrgRolesQueryVariables
> = gql`
  query FindOrgRolesQuery($id: String!) {
    organizationRoles: organization(id: $id) {
      id
      name
      membershipRoles {
        id
        name
        isSystemDefined
        permissions {
          permission {
            id
            action
            subject
            description
          }
        }
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindOrgRolesQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  organizationRoles,
}: CellSuccessProps<FindOrgRolesQuery, FindOrgRolesQueryVariables>) => {
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
          <Accordion type="single" collapsible className="space-y-4">
            {organizationRoles.membershipRoles.map((role) => (
              <AccordionItem
                key={role.id}
                value={role.id}
                className="border border-gray-700 rounded-lg bg-gray-800"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-750">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-5 w-5 text-indigo-400" />
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-200">
                        {role.name}
                      </span>
                      {role.isSystemDefined && (
                        <Badge
                          variant="secondary"
                          className="bg-gray-700 text-gray-300"
                        >
                          System
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        {role.permissions.length} permissions assigned
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Clone Role
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {role.permissions.map((perm) => (
                        <div
                          key={perm.permission.id}
                          className="flex items-center justify-between rounded-md bg-gray-750 px-3 py-2"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-300">
                              {perm.permission.action}
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-400">
                              {perm.permission.subject}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
