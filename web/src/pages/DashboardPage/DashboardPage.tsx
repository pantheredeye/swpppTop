import { useAuth } from 'src/auth'
import QuickActionsCard from 'src/components/QuickActionsCard'
import RecentActivityCard from 'src/components/RecentActivityCard'
import StatisticsCard from 'src/components/StatisticsCard'
import WelcomeCard from 'src/components/WelcomeCard'
import { useParams } from '@redwoodjs/router'
import { useOrganization } from 'src/context/OrganizationContext'


const DashboardPage = () => {
  const { currentUser } = useAuth()

  const { organizationId } = useParams()

  // EXAMPLE: how to get currentOrg

  const { currentOrganization } = useOrganization()

  const activeOrg = organizationId || currentOrganization

  // TODO: use activeOrg properly

  const activities = [
    'Inspection #123 completed at Site A',
    'Site B added by User X',
    // Add more activities as needed
  ]

  return (
    <div className="grid grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
      <WelcomeCard user={currentUser} />
      <QuickActionsCard />
      <RecentActivityCard activities={activities} />
      <StatisticsCard />
    </div>
  )
}

export default DashboardPage
