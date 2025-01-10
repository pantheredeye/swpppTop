import { Plus } from 'lucide-react'

import { Button } from 'src/components/ui/Button'

const SearchResults = ({
  searchData,
  searchLoading,
  inviteQueue,
  handleAddToQueue,
}) => {
  if (searchLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">Searching...</div>
    )
  }

  if (!searchData?.searchUsers.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No existing users found
      </div>
    )
  }

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
    <div className="max-h-56 overflow-y-auto rounded-md border">
      <div className="divide-y divide-border">
        {searchData.searchUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {getInitials(user)}
                </span>
              </div>
              <div>
                <div className="font-medium">{getUserDisplayName(user)}</div>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleAddToQueue(user)}
              disabled={inviteQueue.some((item) => item.user?.id === user.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default SearchResults
