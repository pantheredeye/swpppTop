
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import BmpItem from '../BmpItem/BmpItem'

// export const QUERY: TypedDocumentNode<
//   inspectionBmpsQuery,
//   inspectionBmpsQueryVariables
// > = gql`
//   query inspectionBmpsQuery($isStandard: Boolean, $siteId: Int) {
//     inspectionBmps(isStandard: $isStandard, siteId: $siteId) {
//       id
//       name
//       description
//     }
//   }
// `

// interface Bmp {
//   id: number
//   name: string
//   description: string
// }

export const Loading = () => (
  <div className="flex h-full items-center justify-center">
    <div className="loader h-16 w-16 rounded-full border-t-4 border-blue-500"></div>
  </div>
)

export const Empty = () => (
  <div className="p-4 text-center text-gray-400">
    <p>No BMPs found. Please add BMPs to start your inspection.</p>
  </div>
)

export const Failure = ({ error }: CellFailureProps) => (
  <div className="p-4 text-red-500">
    <p>Error: {error?.message}</p>
  </div>
)

export const Success = ({
  inspectionBmps,
}) => {
  return (
    <>
      <div className="mt-4 space-y-4">
        {inspectionBmps.map((bmp) => (
          <BmpItem
            key={bmp.id}
            bmp={{
              ...bmp,
              implemented: false,
              maintenanceRequired: false,
              repeatOccurrence: false,
              correctiveActionNeeded: '',
              notes: '',
            }}
          />
        ))}
      </div>
    </>
  )
}
