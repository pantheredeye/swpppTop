import { useState, ReactNode } from 'react'
import { Sheet, SheetContent, SheetTrigger } from "src/components/ui/Sheet"
import { Button } from "src/components/ui/Button"
import { Menu, ChevronLeft } from "lucide-react"
import Sidebar from 'src/components/Sidebar'
import { Toast } from "src/components/ui/Toast"
import { ScrollArea } from "src/components/ui/ScrollArea"
import { useMediaQuery } from "src/lib/use-media-query"

interface AuthenticatedLayoutProps {
  children: ReactNode
  title?: string
}

// Custom hook for handling sidebar state with persistence
const useSidebarState = () => {
  // Initialize from localStorage if available, otherwise default to true for desktop
  const initialState = typeof window !== 'undefined'
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

const AuthenticatedLayout = ({ children, title }: AuthenticatedLayoutProps) => {
  // Check if we're on mobile
  const isMobile = useMediaQuery("(max-width: 1024px)")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { isOpen: desktopSidebarOpen, toggleSidebar } = useSidebarState()

  return (
    <div className="flex min-h-screen font-sans text-gray-300">
      {/* Mobile Sidebar using Sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="p-4 text-gray-300 hover:text-gray-200 focus:outline-none"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] p-0"
        >
          <ScrollArea className="h-full">
            <Sidebar />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Collapsible */}
      <div className={`hidden lg:flex lg:flex-col lg:shadow-lg transition-all duration-300 ${
        desktopSidebarOpen ? 'lg:w-64' : 'lg:w-16'
      }`}>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-[-12px] top-4 z-10 hidden lg:flex"
            onClick={toggleSidebar}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${
              desktopSidebarOpen ? '' : 'rotate-180'
            }`} />
          </Button>
          <ScrollArea className="h-screen">
            <Sidebar collapsed={!desktopSidebarOpen} />
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col border-l">
        {/* Header Section */}
        <header className="sticky top-0 z-10 border-b bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
          <div className="flex h-16 items-center gap-4 px-4">
            {title && (
              <h1 className="text-xl font-semibold text-gray-100">
                {title}
              </h1>
            )}
          </div>
        </header>

        {/* Main Section with ScrollArea */}
        <ScrollArea className="flex-grow">
          <main className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="rounded-xl p-3 shadow-lg">
                {children}
              </div>
            </div>
          </main>
        </ScrollArea>

        {/* Footer */}
        <footer className="border-t bg-gray-900 py-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2024 SWPPP-TOP. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Global Toast Notifications */}
      <Toast />
    </div>
  )
}

export default AuthenticatedLayout
