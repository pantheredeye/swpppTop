import { useState, ReactNode } from 'react'
import { Menu, ChevronLeft, Settings } from 'lucide-react'

import Sidebar from 'src/components/Sidebar'
import { Button } from 'src/components/ui/Button'
import { ScrollArea } from 'src/components/ui/ScrollArea'
import { Sheet, SheetContent, SheetTrigger } from 'src/components/ui/Sheet'
import { Toaster } from 'src/components/ui/Toaster'
import { useMediaQuery } from 'src/lib/use-media-query'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/DropdownMenu'
import { Separator } from 'src/components/ui/Separator'
import OrganizationSwitcher from 'src/components/OrganizationSwitcher/OrganizationSwitcher'
import { useOrganization } from 'src/context/OrganizationContext'
import { useParams } from '@redwoodjs/router'

interface AuthenticatedLayoutProps {
  children: ReactNode
  title?: string
}

const useSidebarState = () => {
  const initialState =
    typeof window !== 'undefined'
      ? localStorage.getItem('sidebarOpen') === 'true'
      : true

  const [isOpen, setIsOpen] = useState(initialState)

  const toggleSidebar = () => {
    const newState = !isOpen
    setIsOpen(newState)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', String(newState))
    }
  }

  return { isOpen, toggleSidebar }
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { isOpen: desktopSidebarOpen, toggleSidebar } = useSidebarState()
  const { availableOrganizations } = useOrganization()

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      {/* Mobile Sidebar */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="ml-2 mt-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <ScrollArea className="h-full">
          <Sidebar
  collapsed={!desktopSidebarOpen}
  onToggleCollapse={toggleSidebar}
/>          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col transition-all duration-300 border-r relative ${
          desktopSidebarOpen ? 'lg:w-64' : 'lg:w-16'
        }`}
      >
        <div className="relative">
          <Button
            variant="secondary"
            size="default"
            className="absolute right-2 top-6 z-10 hidden h-8 w-8 rounded-full shadow-md lg:flex items-center justify-center hover:scale-105 transition-transform"
            onClick={toggleSidebar}
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform ${
                desktopSidebarOpen ? '' : 'rotate-180'
              }`}
            />
          </Button>
          <ScrollArea className="h-screen">
          <Sidebar
  collapsed={!desktopSidebarOpen}
  onToggleCollapse={toggleSidebar}
/>          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-7xl mx-auto">
            <div className="flex h-16 items-center justify-between px-4">
              <OrganizationSwitcher organizations={availableOrganizations} />
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Open settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <Separator className="my-2" />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <ScrollArea className="flex-grow">
          <main className="container py-6">
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              {children}
            </div>
          </main>
        </ScrollArea>

        <footer className="border-t bg-muted/50 py-4 lg:py-6">
          <div className="container flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 SWPPP-TOP. All rights reserved.
            </p>
            <nav className="flex gap-4">
              <Button variant="link" className="text-sm text-muted-foreground">
                Privacy
              </Button>
              <Button variant="link" className="text-sm text-muted-foreground">
                Terms
              </Button>
              <Button variant="link" className="text-sm text-muted-foreground">
                Contact
              </Button>
            </nav>
          </div>
        </footer>

        <Toaster />
      </div>
    </div>
  )
}

export default AuthenticatedLayout
