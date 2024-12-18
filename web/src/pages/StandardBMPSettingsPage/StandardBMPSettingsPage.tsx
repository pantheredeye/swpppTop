// import { useState } from 'react'

// import { useMutation } from '@redwoodjs/web'
// import { toast } from '@redwoodjs/web/toast'

// import StandardBmpsCell, {
//   QUERY as STANDARD_BMPS_QUERY,
// } from 'src/components/StandardBMPsCell'

// const CREATE_STANDARD_BMP = gql`
//   mutation CreateStandardBmp($input: CreateBmpInput!) {
//     createBmp(input: $input) {
//       id
//       name
//       description
//       isStandard
//       siteId
//     }
//   }
// `

// const StandardBmpsSettingsPage = () => {
//   const [createStandardBmp] = useMutation(CREATE_STANDARD_BMP, {
//     onCompleted: () => {
//       toast.success('Standard BMP added')
//     },
//     onError: (error) => {
//       toast.error(error.message)
//     },
//     refetchQueries: [{ query: STANDARD_BMPS_QUERY }],
//   })

//   const [name, setName] = useState<string>('')
//   const [description, setDescription] = useState<string>('')

//   const handleAddBmp = async () => {
//     await createStandardBmp({
//       variables: {
//         input: { name, description, isStandard: true, siteId: null },
//       },
//     })
//     setName('')
//     setDescription('')
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold">Configure Standard BMPs</h1>
//       <div className="mt-4">
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="BMP Name"
//           className="border p-2"
//         />
//         <input
//           type="text"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="BMP Description"
//           className="border p-2"
//         />
//         <button
//           onClick={handleAddBmp}
//           className="ml-2 bg-blue-600 p-2 text-white"
//         >
//           Add BMP
//         </button>
//       </div>
//       <StandardBmpsCell />
//     </div>
//   )
// }

// export default StandardBmpsSettingsPage
