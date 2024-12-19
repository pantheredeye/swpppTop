import { useEffect, useRef } from 'react'

import { Form, Label, TextField, Submit, FieldError } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

const ForgotPasswordPage = () => {
  const { isAuthenticated, forgotPassword } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    emailRef?.current?.focus()
  }, [])

  const onSubmit = async (data: { email: string }) => {
    const response = await forgotPassword(data.email)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success(
        'A link to reset your password was sent to ' + response.email
      )
      navigate(routes.login())
    }
  }

  return (
    <>
      <Metadata title="Forgot Password" />
      <main className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="SWPPP-TOP"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address below and we&apos;ll send you a link to
            reset your password.
          </p>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <Form onSubmit={onSubmit} className="space-y-6">
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
                    type="email"
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
                <Submit className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Submit
                </Submit>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </>
  )
}

export default ForgotPasswordPage
