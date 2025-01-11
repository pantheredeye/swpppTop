import { useEffect } from 'react'
import {
  Home,
  Users,
  FolderOpen,
  FileText,
  Building2,
  LogOut,
  ArrowLeft,
  User,
  Settings,
} from 'lucide-react'
import { Link, navigate, routes } from '@redwoodjs/router'
import { useParams } from '@redwoodjs/router'
import { useAuth } from 'src/auth'

import { Button } from 'src/components/ui/Button'
import { ScrollArea } from 'src/components/ui/ScrollArea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'src/components/ui/Tooltip'
import { Separator } from 'src/components/ui/Separator'
import { cn } from 'src/lib/utils'
import { ThemeToggle } from './ThemeToggle/ThemeToggle'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface ActionItem {
  name: string
  action: 'back' | 'logout'
  icon: React.ComponentType<{ className?: string }>
}

interface SidebarProps {
  collapsed?: boolean
}

const actions: ActionItem[] = [
  { name: 'Back', action: 'back', icon: ArrowLeft },
  { name: 'Logout', action: 'logout', icon: LogOut },
]

const Sidebar = ({ collapsed = false }: SidebarProps) => {
  const { logOut, currentUser } = useAuth()
  const { organizationId } = useParams()

  useEffect(() => {
    if (!organizationId) navigate('/')
  }, [organizationId])

  if (!organizationId) return null

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: `/org/${organizationId}/dashboard`,
      icon: Home,
    },
    {
      name: 'Inspections',
      href: `/org/${organizationId}/inspections`,
      icon: Users,
    },
    {
      name: 'Sites',
      href: `/org/${organizationId}/sites`,
      icon: FolderOpen,
    },
    {
      name: 'BMPs',
      href: `/org/${organizationId}/bmps`,
      icon: FileText,
    },
    {
      name: 'Profile',
      href: `/org/${organizationId}/profile/${currentUser.id}`,
      icon: User,
    },
    {
      name: 'Organization Settings',
      href: `/org/${organizationId}/organization-settings`,
      icon: Settings,
    },
  ]

  const NavItem = ({ item }: { item: NavigationItem }) => {
    const content = (
      <Link
        to={item.href}
        className={cn(
          'group flex w-full items-center rounded-md px-3 py-2',
          'text-sm font-medium',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'transition-colors'
        )}
      >
        <item.icon
          className={cn(
            'h-4 w-4',
            'text-muted-foreground group-hover:text-current',
            collapsed ? 'mx-auto' : 'mr-2'
          )}
        />
        {!collapsed && <span>{item.name}</span>}
      </Link>
    )

    return collapsed ? (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={20}>
          {item.name}
        </TooltipContent>
      </Tooltip>
    ) : (
      content
    )
  }

  const ActionButton = ({ action }: { action: ActionItem }) => {
    const handleAction = () => {
      if (action.action === 'back') {
        window.history.back()
      } else if (action.action === 'logout') {
        logOut()
      }
    }

    const content = (
      <Button
        variant="ghost"
        onClick={handleAction}
        className={cn(
          'w-full justify-start',
          'group flex items-center rounded-md px-3 py-2',
          'text-sm font-medium',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
      >
        <action.icon
          className={cn(
            'h-4 w-4',
            'text-muted-foreground group-hover:text-current',
            collapsed ? 'mx-auto' : 'mr-2'
          )}
        />
        {!collapsed && <span>{action.name}</span>}
      </Button>
    )

    return collapsed ? (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={20}>
          {action.name}
        </TooltipContent>
      </Tooltip>
    ) : (
      content
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'flex h-screen flex-col border-r bg-background',
          collapsed ? 'w-16' : 'w-64',
          'transition-all duration-300'
        )}
      >
        <div className="flex h-16 items-center px-4">
          {!collapsed && (
            <span className="text-xl font-semibold">SWPPP-Tip</span>
          )}
        </div>

        <div
          className={cn(
            'flex h-12 items-center px-4',
            collapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <ThemeToggle />
        </div>

        <Separator />

        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          <Separator className="my-4" />

          <div className="px-2">
            <NavItem
              item={{
                name: 'Switch Organizations',
                href: routes.switch({ organizationId }),
                icon: Building2,
              }}
            />
          </div>

          <Separator className="my-4" />

          <div className="space-y-1 px-2">
            {actions.map((action) => (
              <ActionButton key={action.name} action={action} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  )
}

export default Sidebar
