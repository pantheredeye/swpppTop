import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

// export const QUERY: TypedDocumentNode<
//   FindStandardBmpsQuery,
//   FindStandardBmpsQueryVariables
// > = gql`
//   query FindStandardBmpsQuery {
//     standardBmps {
//       id
//       name
//       description
//       isStandard
//     }
//   }
// `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>No standard BMPs found</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ standardBmps }) => {
  return (
    <ul className="mt-4">
      {standardBmps.map((bmp) => (
        <li key={bmp.id}>
          {bmp.name} - {bmp.description}
        </li>
      ))}
    </ul>
  )
}
