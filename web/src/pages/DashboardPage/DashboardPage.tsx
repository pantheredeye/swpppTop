import { useAuth } from 'src/auth'
import QuickActionsCard from 'src/components/QuickActionsCard'
import RecentActivityCard from 'src/components/RecentActivityCard'
import StatisticsCard from 'src/components/StatisticsCard'
import WelcomeCard from 'src/components/WelcomeCard'

const DashboardPage = () => {
  const { currentUser } = useAuth()
  const activities = [
    'Inspection #12 completed at Pinewood',
    'Site: Pinewood added by Barrett',
    // Add more activities as needed
  ]

  return (
    <div className="grid grid-cols-1 md:gap-8 gap-3 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
      <WelcomeCard user={currentUser} />
      <QuickActionsCard />
      <RecentActivityCard activities={activities} />
      <StatisticsCard />
    </div>
  )
}

export default DashboardPage
