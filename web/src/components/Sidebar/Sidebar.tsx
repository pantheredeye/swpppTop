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
  ChevronLeft,
} from 'lucide-react'

import { Link, navigate, routes, useLocation } from '@cedarjs/router'
import { useParams } from '@cedarjs/router'

import { useAuth } from 'src/auth'
import { Button } from 'src/components/ui/Button'
import { Separator } from 'src/components/ui/Separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'src/components/ui/Tooltip'
import { cn } from 'src/lib/utils'

import { ThemeToggle } from './ThemeToggle'

interface SidebarProps {
  isMobile: boolean
  collapsed?: boolean
  onToggleCollapse?: () => void
  onNavigate?: () => void
}

const Sidebar = ({
  isMobile,
  collapsed = false,
  onToggleCollapse,
  onNavigate,
}: SidebarProps) => {
  const { logOut, currentUser } = useAuth()
  const { organizationId } = useParams()
  const location = useLocation()

  useEffect(() => {
    if (!organizationId) navigate('/')
  }, [organizationId])

  if (!organizationId) return null

  const navigation = [
    { name: 'Dashboard', href: `/org/${organizationId}/dashboard`, icon: Home },
    {
      name: 'Inspections',
      href: `/org/${organizationId}/inspections`,
      icon: Users,
    },
    { name: 'Sites', href: `/org/${organizationId}/sites`, icon: FolderOpen },
    { name: 'BMPs', href: `/org/${organizationId}/bmps`, icon: FileText },
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

  const handleNavigation = () => {
    if (isMobile && onNavigate) {
      onNavigate()
    }
  }

  const NavItem = ({ item }) => {
    const active = location.pathname === item.href
    const content = (
      <Link
        to={item.href}
        onClick={handleNavigation}
        className={cn(
          'group flex w-full items-center rounded-md px-3 py-2',
          'text-sm font-medium transition-colors',
          active
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <item.icon
          className={cn(
            'h-4 w-4',
            active
              ? 'text-primary'
              : 'text-muted-foreground group-hover:text-current',
            collapsed ? 'mx-auto' : 'mr-2'
          )}
        />
        {!collapsed && <span>{item.name}</span>}
      </Link>
    )

    return collapsed && !isMobile ? (
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

  return (
    <div
      className={cn(
        'flex h-screen flex-col border-r bg-background',
        collapsed && !isMobile ? 'w-16' : 'w-64',
        'transition-all duration-300'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {(!collapsed || isMobile) && (
          <span className="text-xl font-semibold">SWPPP-TOP</span>
        )}
      </div>

      <div
        className={cn(
          'flex h-12 items-center px-4',
          collapsed && !isMobile ? 'justify-center' : 'justify-between'
        )}
      >
        <ThemeToggle />
        {!isMobile && onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-2 hover:bg-accent rounded-md"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ChevronLeft
                  className={cn(
                    'h-4 w-4 transition-transform',
                    collapsed && 'rotate-180'
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={20}>
                {collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              </TooltipContent>
            </Tooltip>
          </Button>
        )}
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 px-2 py-2">
        {navigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      <Separator />

      <div className="p-2">
        <Button
          variant="ghost"
          onClick={() => {
            handleNavigation()
            logOut()
          }}
          className="w-full justify-start"
        >
          <LogOut
            className={cn(
              'h-4 w-4 text-muted-foreground',
              collapsed && !isMobile ? 'mx-auto' : 'mr-2'
            )}
          />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
