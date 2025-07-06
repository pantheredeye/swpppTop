import type {
  FindInspectionsListQuery,
  FindInspectionsListQueryVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@cedarjs/web'

import { columns } from 'src/components/InspectionsTable/columns'
import DataTable from 'src/components/InspectionsTable/InspectionsTable'

export const QUERY: TypedDocumentNode<
  FindInspectionsListQuery,
  FindInspectionsListQueryVariables
> = gql`
  query FindInspectionsListQuery {
    inspections: inspections {
      id
      site {
        name
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindInspectionsListQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  inspections,
}: CellSuccessProps<
  FindInspectionsListQuery,
  FindInspectionsListQueryVariables
>) => {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={inspections} />
    </div>
  )
}
