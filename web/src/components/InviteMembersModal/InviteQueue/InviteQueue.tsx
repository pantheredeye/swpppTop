import { useState } from 'react'

import { X, Users } from 'lucide-react'

import { Button } from 'src/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/Select'

const InviteQueue = ({
  inviteQueue,
  rolesData,
  selectedRoleForBatch,
  setSelectedRoleForBatch,
  handleBatchRoleChange,
  handleRoleChange,
  handleRemoveFromQueue,
}) => {
  const getInitials = (user) => {
    if (!user.firstName && !user.lastName) {
      return user.email.charAt(0).toUpperCase()
    }
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  }

  const getUserDisplayName = (user) => {
    if (!user.firstName && !user.lastName) {
      return user.email
    }
    return `${user.firstName || ''} ${user.lastName || ''}`.trim()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium">
          Pending Invites ({inviteQueue.length})
        </h4>
        {inviteQueue.length > 1 && (
          <div className="flex items-center gap-3">
            <Select
              value={selectedRoleForBatch}
              onValueChange={setSelectedRoleForBatch}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role for all" />
              </SelectTrigger>
              <SelectContent>
                {rolesData?.organizationRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="secondary"
              onClick={handleBatchRoleChange}
              disabled={!selectedRoleForBatch}
              className="whitespace-nowrap"
            >
              <Users className="mr-2 h-4 w-4" />
              Apply to All
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {inviteQueue.map((item) => (
          <div
            key={item.user?.id || item.email}
            className="flex items-center justify-between rounded-lg bg-muted p-4"
          >
            <div className="flex items-center gap-4">
              {item.user ? (
                <>
                  <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      {getInitials(item.user)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {getUserDisplayName(item.user)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.user.email}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div className="font-medium">New User Invite</div>
                  <div className="text-sm text-muted-foreground">
                    {item.email}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={item.roleIds[0] || ''}
                onValueChange={(value) =>
                  handleRoleChange(item.user?.id || item.email, value)
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {rolesData?.organizationRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  handleRemoveFromQueue(item.user?.id || item.email)
                }
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InviteQueue
