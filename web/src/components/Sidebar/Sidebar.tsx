import {  useEffect } from 'react'

import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  DocumentDuplicateIcon,
  BuildingOfficeIcon,
  ArrowLeftEndOnRectangleIcon, // Logout icon
  ArrowUturnLeftIcon, // Back icon
  UserIcon,
} from '@heroicons/react/24/outline'

import { Link, navigate, routes } from '@redwoodjs/router'
import { useParams } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const actions = [
  { name: 'Back', action: 'back', icon: ArrowUturnLeftIcon },
  { name: 'Logout', action: 'logout', icon: ArrowLeftEndOnRectangleIcon },
]

const Sidebar = () => {
  const { logOut, currentUser } = useAuth()
  const { organizationId } = useParams()

  // Use useEffect to handle the redirect
  useEffect(() => {
    if (!organizationId) {
      navigate('/')
    }
  }, [organizationId])

  if (!organizationId) {
    return null // Return nothing while redirecting
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: `/org/${organizationId}/dashboard`,
      icon: HomeIcon,
    },
    {
      name: 'Inspections',
      href: `/org/${organizationId}/inspections`,
      icon: UsersIcon,
    },
    { name: 'Sites', href: `/org/${organizationId}/sites`, icon: FolderIcon },
    {
      name: 'BMPs',
      href: `/org/${organizationId}/bmps`,
      icon: DocumentDuplicateIcon,
    },
    {
      name: 'Profile',
      href: `/org/${organizationId}/profile/${currentUser.id}`,
      icon: UserIcon,
    },
    {
      name: 'Organizations',
      href: `/org/${organizationId}/organization-settings`,
      icon: UserIcon,
    },
  ]
  return (
    <div
      className={classNames(
        'flex flex-col transition-all duration-300 w-64 bg-gray-900 text-gray-300 shadow-inner'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <span className="text-2xl font-bold text-gray-200">SWPPP-Tip</span>
      </div>

      <nav className="flex-1 px-2">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={classNames(
                  'group relative flex items-center rounded-xl px-2 py-2 text-sm font-medium bg-gray-800 hover:bg-gray-700 shadow-lg justify-start'
                )}
              >
                <item.icon
                  className="h-6 w-6 text-gray-400 group-hover:text-gray-200"
                  aria-hidden="true"
                />

                <span className="ml-3 text-gray-200">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Actions at the Bottom */}
      <div className="px-2 py-2 pb-4">
        <ul className="space-y-2">
          <li>
            <Link
              to={routes.switch({ organizationId })}
              className={classNames(
                'group relative flex items-center rounded-xl px-2 py-2 text-sm font-medium bg-gray-800 hover:bg-gray-700 shadow-lg justify-start'
              )}
            >
              <BuildingOfficeIcon
                className="h-6 w-6 text-gray-400 group-hover:text-gray-200"
                aria-hidden="true"
              />

              <span className="ml-3 text-gray-200">Switch Orgs</span>
            </Link>
          </li>
          {actions.map((action) => (
            <li key={action.name}>
              <button
                onClick={() => {
                  if (action.action === 'back') {
                    window.history.back()
                  } else if (action.action === 'logout') {
                    logOut()
                  }
                }}
                className={classNames(
                  'group relative flex w-full items-center rounded-xl px-2 py-2 text-sm font-medium bg-gray-800 hover:bg-gray-700 shadow-lg justify-start'
                )}
              >
                <action.icon
                  className="h-6 w-6 text-gray-400 group-hover:text-gray-200"
                  aria-hidden="true"
                />

                <span className="ml-3 text-gray-200">{action.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
