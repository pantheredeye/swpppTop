import { useRef, useEffect } from 'react'

import {
  Form,
  Label,
  FieldError,
  useForm,
  TextField,
  PasswordField,
} from '@cedarjs/forms'
import { Link, navigate, routes } from '@cedarjs/router'
import { Metadata } from '@cedarjs/web'
import { toast, Toaster } from '@cedarjs/web/toast'

import { useAuth } from 'src/auth'
import Button from 'src/components/Button/Button'

const LoginPage = () => {
  const { isAuthenticated, logIn, currentUser } = useAuth()
  const formMethods = useForm()

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(
        routes.dashboard({ organizationId: currentUser.defaultOrganizationId })
      );
    }
  }, [isAuthenticated, currentUser?.defaultOrganizationId]);

  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await logIn({
      username: data.email,
      password: data.password,
    })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      toast.success('Welcome back!')
      navigate(
        routes.dashboard({ organizationId: response.defaultOrganizationId })
      )
    }
  }

  return (
    <>
      <Metadata title="Login" />
      <main className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="SWPPP-TOP"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <Form
              onSubmit={onSubmit}
              className="space-y-6"
              formMethods={formMethods}
            >
              <div>
                <Label
                  name="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                  errorClassName="block text-sm font-medium leading-6 text-red-600"
                >
                  Email address
                </Label>
                <div className="mt-2">
                  <TextField
                    name="email"
                    ref={emailRef}
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    errorClassName="block w-full rounded-md border-0 py-1.5 text-red-600 shadow-sm ring-1 ring-inset ring-red-300 placeholder:text-red-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                    validation={{
                      required: {
                        value: true,
                        message: 'Email is required',
                      },
                    }}
                  />
                </div>
                <FieldError
                  name="email"
                  className="mt-2 text-sm text-red-600"
                />
              </div>
              <div>
                <Label
                  name="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                  errorClassName="block text-sm font-medium leading-6 text-red-600"
                >
                  Password
                </Label>
                <div className="mt-2">
                  <PasswordField
                    name="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    errorClassName="block w-full rounded-md border-0 py-1.5 text-red-600 shadow-sm ring-1 ring-inset ring-red-300 placeholder:text-red-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                    validation={{
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    }}
                  />
                </div>
                <FieldError
                  name="password"
                  className="mt-2 text-sm text-red-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm leading-6">
                  <Link
                    to={routes.forgotPassword()}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div>
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </Button>
              </div>
            </Form>
            <p className="mt-10 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                to={routes.signup()}
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

export default LoginPage
