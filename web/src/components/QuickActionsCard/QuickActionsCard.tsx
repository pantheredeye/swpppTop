import { Link, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

// const GET_QUICK_ACTIONS = gql`
//   query GetQuickActions {
//     standardBmps {
//       id
//     }
//   }
// `

const QuickActionsCard = () => {
  // const { data, loading, error } = useQuery(GET_QUICK_ACTIONS)

  // if (loading) return <div>Loading...</div>
  // if (error) return <div>Error loading data</div>

  // const hasStandardBmps = data.standardBmps.length > 0

  return (
    <div className="rounded-xl bg-gray-800 p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-semibold text-gray-200">
        Quick Actions
      </h3>
      <div className="space-y-2">
        <Link
          to={routes.newInspection()}
          className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white shadow-lg hover:bg-indigo-500 focus:outline-none"
        >
          New Inspection
        </Link>

        <Link
          to={routes.newSite()}
          className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white shadow-lg hover:bg-indigo-500 focus:outline-none"
        >
          Add Site
        </Link>
      </div>
    </div>
  )
}

export default QuickActionsCard
