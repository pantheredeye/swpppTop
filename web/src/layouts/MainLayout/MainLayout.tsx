import { Link, routes, useLocation } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

const MainLayout = ({ children }) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col  bg-gray-900 text-gray-900">
      <header className="flex items-center justify-between  bg-gray-900 px-6 py-4 text-white shadow">
        <h1 className="text-2xl font-bold">SWPPP-TOP</h1>
        <nav>
          <Link to={routes.home()} className="px-4">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={routes.dashboard({
                  organizationId: currentUser.defaultOrganizationId,
                })}
                className="px-4"
              >
                Dashboard
              </Link>

              <button onClick={logOut} className="px-4">
                Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== routes.login() && (
                <Link to={routes.login()} className="px-4">
                  Login
                </Link>
              )}
              {location.pathname !== routes.signup() && (
                <Link to={routes.signup()} className="px-4">
                  Sign Up
                </Link>
              )}
            </>
          )}
        </nav>
      </header>
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <footer className="mt-auto bg-gray-400 py-4 text-center">
        <p className="text-sm text-gray-700">
          &copy; 2024 SWPPP-TOP. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default MainLayout
