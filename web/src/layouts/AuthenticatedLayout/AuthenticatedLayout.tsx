import { useState, Fragment, ReactNode } from 'react'

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import Sidebar from 'src/components/Sidebar'

interface AuthenticatedLayoutProps {
  children: ReactNode
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // const { currentUser } = useAuth()

  // TODO: Uncomment when org.ids?.length is available

  // useEffect(() => {
  //   if (currentUser?.defaultOrganizationId) {
  //     navigate(`/org/${currentUser.defaultOrganizationId}/dashboard`)
  //   } else if (currentUser?.organizationIds?.length) {
  //     navigate(`/org/${currentUser.organizationIds[0]}/dashboard`)
  //   }
  // }, [currentUser])

  return (
    <div className="flex min-h-screen bg-gray-900 font-sans text-gray-300">
      {/* Mobile Sidebar */}
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={() => setSidebarOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80" />
          </TransitionChild>

          <div className="fixed inset-0 flex">
            <TransitionChild
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative flex w-full max-w-xs flex-1 bg-gray-900 shadow-lg">
                <TransitionChild
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="text-gray-300 hover:text-gray-200 focus:outline-none"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>
                <Sidebar />
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:shadow-lg">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col border-l border-gray-700">
        {/* Mobile Sidebar Toggle */}
        <div className="px-4 py-2 lg:hidden">
          <button
            type="button"
            className="text-gray-300 hover:text-gray-200 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Main Section */}
        <main className="flex-grow py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Example of a card/container following the style guide */}
            <div className="rounded-xl bg-gray-800 p-3 shadow-lg">
              {children}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 py-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2024 SWPPP-TOP. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default AuthenticatedLayout
