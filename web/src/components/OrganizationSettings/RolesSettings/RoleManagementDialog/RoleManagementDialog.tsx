import { useState } from 'react'

import { Button } from 'src/components/ui/Button'
import { Checkbox } from 'src/components/ui/Checkbox'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/Dialog'

// Component for managing member roles
const RoleManagementDialog = ({ member, availableRoles, onUpdateRoles }) => {
  const [selectedRoles, setSelectedRoles] = useState(
    member.roles.map((role) => role.id)
  )

  const handleRoleToggle = (roleId) => {
    setSelectedRoles((current) =>
      current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId]
    )
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Manage Roles</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          {availableRoles.map((role) => (
            <div key={role.id} className="flex items-center space-x-2">
              <Checkbox
                id={`role-${role.id}`}
                checked={selectedRoles.includes(role.id)}
                onCheckedChange={() => handleRoleToggle(role.id)}
              />
              <label
                htmlFor={`role-${role.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {role.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          variant="secondary"
          onClick={() => onUpdateRoles(selectedRoles)}
        >
          Save Changes
        </Button>
      </div>
    </DialogContent>
  )
}

export default RoleManagementDialog
