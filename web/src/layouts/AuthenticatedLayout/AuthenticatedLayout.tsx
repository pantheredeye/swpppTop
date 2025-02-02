import { useState, ReactNode } from 'react'

import { Menu, Settings } from 'lucide-react'

import OrganizationSwitcher from 'src/components/OrganizationSwitcher'
import Sidebar from 'src/components/Sidebar/Sidebar'
import { Button } from 'src/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/DropdownMenu'
import { ScrollArea } from 'src/components/ui/ScrollArea'
import { Separator } from 'src/components/ui/Separator'
import { Sheet, SheetContent, SheetTrigger } from 'src/components/ui/Sheet'
import { Toaster } from 'src/components/ui/Toaster'
import { useOrganization } from 'src/context/OrganizationContext'
interface LayoutProps {
  children: ReactNode
  title?: string
}

const useSidebarState = () => {
  const [isOpen, setIsOpen] = useState(
    localStorage.getItem('sidebarOpen') !== 'false'
  )

  const toggleSidebar = () => {
    const newState = !isOpen
    setIsOpen(newState)
    localStorage.setItem('sidebarOpen', String(newState))
  }

  return { isOpen, toggleSidebar }
}

const AuthenticatedLayout = ({ children }: LayoutProps) => {
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
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <ScrollArea className="h-full">
            <Sidebar
              isMobile={true}
              onNavigate={() => setMobileSidebarOpen(false)}
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col transition-all duration-300 border-r ${
          desktopSidebarOpen ? 'lg:w-64' : 'lg:w-16'
        }`}
      >
        <ScrollArea className="h-screen">
          <Sidebar
            isMobile={false}
            collapsed={!desktopSidebarOpen}
            onToggleCollapse={toggleSidebar}
          />
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between px-4">
            <OrganizationSwitcher organizations={availableOrganizations} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
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
        </header>

        <ScrollArea className="flex-grow">
          <main className="container py-6 px-4 sm:px-6">
            <div className="rounded-lg border bg-card p-4 sm:p-6 text-card-foreground shadow-sm">
              {children}
            </div>
          </main>
        </ScrollArea>

        <footer className="border-t bg-muted/50 py-4">
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
