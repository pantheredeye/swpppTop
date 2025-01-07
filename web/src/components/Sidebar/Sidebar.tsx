import { useEffect } from 'react'
import { Link, navigate, routes } from '@redwoodjs/router'
import { useParams } from '@redwoodjs/router'
import { useAuth } from 'src/auth'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import { Button } from "src/components/ui/Button"
import { ScrollArea } from "src/components/ui/ScrollArea"
import { Tooltip, TooltipContent, TooltipTrigger } from "src/components/ui/Tooltip"
import {
  Home,
  Users,
  FolderOpen,
  FileText,
  Building2,
  LogOut,
  ArrowLeft,
  User,
  Settings
} from "lucide-react"
import { cn } from "src/lib/utils"

// Define the props interface for the Sidebar
interface SidebarProps {
  collapsed?: boolean
}

// Helper function to create navigation items
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

const actions: ActionItem[] = [
  { name: 'Back', action: 'back', icon: ArrowLeft },
  { name: 'Logout', action: 'logout', icon: LogOut },
]

const Sidebar = ({ collapsed = false }: SidebarProps) => {
  const { logOut, currentUser } = useAuth()
  const { organizationId } = useParams()

  useEffect(() => {
    if (!organizationId) {
      navigate('/')
    }
  }, [organizationId])

  if (!organizationId) {
    return null
  }

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
          "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-800 hover:text-gray-200",
          "transition-all duration-200 ease-in-out",
          "focus:bg-gray-800 focus:text-gray-200 focus:outline-none"
        )}
      >
        <item.icon className={cn(
          "h-5 w-5 text-gray-400 group-hover:text-gray-200",
          collapsed ? "mx-auto" : "mr-3"
        )} />
        {!collapsed && <span>{item.name}</span>}
      </Link>
    )

    return collapsed ? (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="bg-gray-800 text-gray-200">
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
          "w-full group flex items-center rounded-lg px-3 py-2 text-sm font-medium",
          "hover:bg-gray-800 hover:text-gray-200",
          "focus:bg-gray-800 focus:text-gray-200",
          "justify-start"
        )}
      >
        <action.icon className={cn(
          "h-5 w-5 text-gray-400 group-hover:text-gray-200",
          collapsed ? "mx-auto" : "mr-3"
        )} />
        {!collapsed && <span>{action.name}</span>}
      </Button>
    )

    return collapsed ? (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="bg-gray-800 text-gray-200">
          {action.name}
        </TooltipContent>
      </Tooltip>
    ) : (
      content
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-gray-900 text-gray-300 shadow-inner",
        collapsed ? "w-16" : "w-64",
        "transition-all duration-300"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center px-4 justify-between">
        {!collapsed && <span className="text-2xl font-bold text-gray-200">SWPPP-Tip</span>}
      </div>

      {/* Theme Toggle */}
      <div className={cn(
        "flex h-10 items-center px-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1 py-4">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Organization Switcher */}
        <div className="py-2">
          <NavItem
            item={{
              name: "Switch Organizations",
              href: routes.switch({ organizationId }),
              icon: Building2
            }}
          />
        </div>

        {/* Actions */}
        <div className="space-y-1 py-2">
          {actions.map((action) => (
            <ActionButton key={action.name} action={action} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default Sidebar
