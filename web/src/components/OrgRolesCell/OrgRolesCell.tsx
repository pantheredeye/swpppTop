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
// Collapse by Role
// Explore "Module" based grouping - by Subject not Action

const PermissionAccordion = ({ permissions }) => {
  const actionGroups = permissions.reduce((acc, perm) => {
    const action = perm.permission.action;
    const subject = perm.permission.subject;
    if (!acc[action]) {
      acc[action] = [];
    }
    acc[action].push(subject);
    return acc;
  }, {});

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {Object.keys(actionGroups).map((action) => (
        <AccordionItem key={action} value={action} className="border border-gray-700 rounded-lg bg-gray-800">
          <AccordionTrigger className="px-4 py-3 hover:bg-gray-750">
            <div className="flex items-center space-x-4">
              <Shield className="h-5 w-5 text-indigo-400" />
              <span className="font-medium text-gray-200">{action} Permissions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-3">
            <ul className="space-y-2">
              {actionGroups[action].map((subject, index) => (
                <li key={index} className="flex items-center justify-between rounded-md bg-gray-750 px-3 py-2">
                  <span className="text-sm font-medium text-gray-300">{subject}</span>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">
                    <Copy className="mr-2 h-4 w-4" />
                    Clone Permission
                  </Button>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};


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
    <div>
      {organizationRoles.map((role) => (
        <div key={role.id} className="border border-gray-700 rounded-lg bg-gray-800 mb-4">
          <h3 className="px-4 py-3 font-medium text-gray-200">
            {role.name}
            {role.isSystemDefined && (
              <Badge variant="secondary" className="bg-gray-700 text-gray-300 ml-2">
                System
              </Badge>
            )}
          </h3>
          <PermissionAccordion permissions={role.permissions} />
        </div>
      ))}
    </div>
  );
};
