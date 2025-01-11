import { useParams, navigate, routes } from '@redwoodjs/router'
import { useOrganization } from 'src/context/OrganizationContext'
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/Card"
import { Tabs, TabsList, TabsTrigger } from "src/components/ui/Tabs"
import { Separator } from "src/components/ui/Separator"

type OrganizationSettingLayoutProps = {
  children?: React.ReactNode
}

const OrganizationSettingLayout = ({
  children,
}: OrganizationSettingLayoutProps) => {
  const { organizationId, tab = 'general' } = useParams()
  const { currentOrganization } = useOrganization()

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'roles', label: 'Roles & Permissions' },
    { id: 'members', label: 'Members' },
    { id: 'delete', label: 'Delete Organization' },
  ]

  const handleTabChange = (value: string) => {
    navigate(
      routes.organizationSettings({
        organizationId,
        tab: value,
      })
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {currentOrganization?.name} Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your organization's preferences and settings
          </p>
        </div>

        <Separator />

        <Card className="mt-6">
          <CardHeader className="pb-0">
            <Tabs
              defaultValue={tab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                {tabs.map((tabItem) => (
                  <TabsTrigger
                    key={tabItem.id}
                    value={tabItem.id}
                    className="data-[state=active]:bg-primary/5"
                  >
                    {tabItem.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OrganizationSettingLayout
