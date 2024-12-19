import { useRef, useEffect } from 'react'

import {
  Form,
  Label,
  EmailField,
  PasswordField,
  FieldError,
  useForm,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import Button from 'src/components/Button/Button'

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()
  const formMethods = useForm()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await signUp({
      username: data.email,
      password: data.password,
    })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      toast.success('Welcome!')
      if (response.id && response.organizationId) {
        navigate(
          routes.profile({
            id: response.id,
            organizationId: response.organizationId,
          }) + '?firstTime=true'
        )
      } else {
        toast.error('Missing profile information')
        navigate(routes.home())
      }
    }
  }

  return (
    <>
      <Metadata title="Signup" />
      <main className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="SWPPP-TOP"
          /> */}
          <h1>THE ONE PROGRAM FOR STORMWATER MANAGEMENT</h1>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create your account
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
                  <EmailField
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
              <div>
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign up
                </Button>
              </div>
            </Form>
            <p className="mt-10 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                to={routes.login()}
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignupPage
