import {
  Form,
  TextField,
  EmailField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { useLocation, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { Label } from 'src/components/ui/Label'

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserMutation($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      phoneNumber
    }
  }
`

const ProfileForm = ({ user }) => {
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      // Handle successful update (e.g., show a notification)
    },
  })
  const { search } = useLocation()

  const queryParams = new URLSearchParams(search)
  const isFirstTime = queryParams.get('firstTime') === 'true'

  const onSubmit = (data) => {
    updateUser({
      variables: {
        id: user.id,
        input: data,
      },
    }).then(() => {
      if (isFirstTime) {
        navigate('/dashboard')
      }
    })
  }

  return (
    <Form
      onSubmit={onSubmit}
      className="mx-auto max-w-lg space-y-6 rounded-xl bg-gray-800 p-6 shadow-lg"
    >
      <div className="space-y-2">
        <Label
          htmlFor="firstName"
          className="block text-sm font-medium text-gray-200"
        >
          First Name
        </Label>
        <TextField
          name="firstName"
          defaultValue={user.firstName}
          validation={{ required: 'First name is required' }}
          className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-200 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <FieldError name="firstName" className="text-sm text-red-500" />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="lastName"
          className="block text-sm font-medium text-gray-200"
        >
          Last Name
        </Label>
        <TextField
          name="lastName"
          defaultValue={user.lastName}
          validation={{ required: 'Last name is required' }}
          className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-200 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <FieldError name="lastName" className="text-sm text-red-500" />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="block text-sm font-medium text-gray-200"
        >
          Email
        </Label>
        <EmailField
          name="email"
          defaultValue={user.email}
          validation={{ required: 'Email is required' }}
          className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-200 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <FieldError name="email" className="text-sm text-red-500" />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-200"
        >
          Phone Number
        </Label>
        <TextField
          name="phoneNumber"
          defaultValue={user.phoneNumber}
          validation={{ required: 'Phone number is required' }}
          className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-200 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <FieldError name="phoneNumber" className="text-sm text-red-500" />
      </div>

      <Submit
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </Submit>

      {error && <p className="mt-2 text-sm text-red-500">{error.message}</p>}
    </Form>
  )
}

export default ProfileForm
