import { Shield, Copy, ChevronRight, Plus } from 'lucide-react'
import type {
  FindOrgRolesQuery,
  FindOrgRolesQueryVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'src/components/ui/Accordion'
import { Badge } from 'src/components/ui/Badge'
import { Button } from 'src/components/ui/Button'
import {
  Card,
  CardContent,
} from 'src/components/ui/Card'

export const QUERY: TypedDocumentNode<
  FindOrgRolesQuery,
  FindOrgRolesQueryVariables
> = gql`
  query FindOrgRolesQuery($isSystemDefined: Boolean, $id: String) {
    organizationRoles: findMembershipRoles(
      isSystemDefined: $isSystemDefined
      organizationId: $id
    ) {
      id
      name
      isSystemDefined
      permissions {
        id
        permission {
          action
          conditions
          description
          id
          subject
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
  console.log(organizationRoles)
  return (

          <Accordion type="single" collapsible className="space-y-4">
            {organizationRoles.map((role) => (
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

  )
}
