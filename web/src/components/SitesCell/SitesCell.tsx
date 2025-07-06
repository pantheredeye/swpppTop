import type { SitesQuery, SitesQueryVariables } from 'types/graphql'

import { SelectField } from '@cedarjs/forms'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@cedarjs/web'

export const QUERY: TypedDocumentNode<SitesQuery, SitesQueryVariables> = gql`
  query SitesQuery {
    sites {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ sites }: CellSuccessProps<SitesQuery>) => {
  return (
    <SelectField
      name="siteId"
      validation={{ required: true }}
      className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-1.5 text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
    >
      {sites.map((site) => (
        <option key={site.id} value={site.id}>
          {site.name}
        </option>
      ))}
    </SelectField>
  )
}
