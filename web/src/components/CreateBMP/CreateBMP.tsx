import { useState } from 'react'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

// const CREATE_BMP = gql`
//   mutation CreateBmp($input: CreateBmpInput!) {
//     createBmp(input: $input) {
//       id
//       name
//       description
//       isStandard
//     }
//   }
// `

const CreateBMP = () => {
  // const [createBmp] = useMutation(CREATE_BMP)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isStandard, setIsStandard] = useState<boolean>(false)

  const handleCreateBmp = async () => {
    // await createBmp({
    //   variables: {
    //     input: {
    //       name,
    //       description,
    //       isStandard,
    //     },
    //   },
    // })
    toast.success('BMP created')
  }

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Add New BMP
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please fill out the details for the new BMP.
          </p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  BMP Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    name="description"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="isStandard"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Is Standard
                </label>
                <div className="mt-2">
                  <input
                    type="checkbox"
                    name="isStandard"
                    id="isStandard"
                    checked={isStandard}
                    onChange={(e) => setIsStandard(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateBmp}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create BMP
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBMP
