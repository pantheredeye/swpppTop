import { useState } from 'react'

import gql from 'graphql-tag'
import { Building2, User, Bell, CreditCard } from 'lucide-react'

import { useQuery, useMutation } from '@cedarjs/web'

import { Button } from 'src/components/ui/Button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from 'src/components/ui/Card'
import { Input } from 'src/components/ui/Input'
import { Label } from 'src/components/ui/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/Select'
import { Skeleton } from 'src/components/ui/Skeleton'
import { Switch } from 'src/components/ui/Switch'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'src/components/ui/Tabs'
import { useToast } from 'src/components/ui/UseToast'
import { useStripe } from 'src/utils/useStripe'

const GET_ORGANIZATION = gql`
  query GetOrganization($id: String!) {
    organization(id: $id) {
      id
      name
      type
      status
      billingEmail
      stripeCustomerId
      subscriptionStatus
      subscriptionPeriodEnd
      timezone
      primaryLanguage
      fiscalYearStart
      logoUrl
      contactEmail
      contactPhone
    }
  }
`

const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: String!, $input: UpdateOrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
      id
      name
      type
      status
      billingEmail
      timezone
      primaryLanguage
      fiscalYearStart
      logoUrl
      contactEmail
      contactPhone
    }
  }
`
const GeneralSettings = ({ organizationId }) => {
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState({})
  const { toast } = useToast()
  const { redirectToBillingPortal } = useStripe()
  const { data, loading } = useQuery(GET_ORGANIZATION, {
    variables: { id: organizationId },
  })
  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION)

  const organization = data?.organization

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateOrganization = async () => {
    try {
      await updateOrganization({
        variables: {
          id: organizationId,
          input: formData,
        },
      })
      toast({
        title: 'Settings saved',
        description: 'Organization details updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  if (loading) return <SettingsSkeleton />

  return (
    <div className="space-y-8 max-w-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="flex w-full overflow-x-auto pb-2 md:grid md:grid-cols-4">
          <TabsTrigger value="basic" className="flex gap-2 min-w-[120px]">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">Basic</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex gap-2 min-w-[120px]">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex gap-2 min-w-[120px]">
            <CreditCard className="h-4 w-4 shrink-0" />
            <span className="truncate">Billing</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex gap-2 min-w-[120px]"
          >
            <Bell className="h-4 w-4 shrink-0" />
            <span className="truncate">Notifications</span>
          </TabsTrigger>
        </TabsList>
        {/* Basic Information Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={organization.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Organization Type</Label>
                  <Select
                    name="type"
                    defaultValue={organization.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERSONAL">Personal</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                      <SelectItem value="NON_PROFIT">Non-profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    name="timezone"
                    defaultValue={organization.timezone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    name="logoUrl"
                    defaultValue={organization.logoUrl}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryLanguage">Primary Language</Label>
                  <Input
                    id="primaryLanguage"
                    name="primaryLanguage"
                    defaultValue={organization.primaryLanguage}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fiscalYearStart">Fiscal Year Start</Label>
                  <Input
                    type="date"
                    id="fiscalYearStart"
                    name="fiscalYearStart"
                    defaultValue={organization.fiscalYearStart}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    defaultValue={organization.contactEmail}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    defaultValue={organization.contactPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Current Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      {organization.subscriptionStatus || 'Free Plan'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => redirectToBillingPortal(organizationId)}
                  >
                    Manage Subscription
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingEmail">Billing Email</Label>
                  <Input
                    id="billingEmail"
                    name="billingEmail"
                    type="email"
                    defaultValue={organization.billingEmail}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="billingNotifications">
                      Billing Updates
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important billing notifications
                    </p>
                  </div>
                  <Switch id="billingNotifications" />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="productUpdates">Product Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new features
                    </p>
                  </div>
                  <Switch id="productUpdates" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 bg-background/90 py-4 border-t -mx-4 px-4 sm:mx-0 sm:px-0 backdrop-blur-sm">
        <Button size="lg" onClick={handleUpdateOrganization} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  )
}

const SettingsSkeleton = () => (
  <div className="space-y-8">
    <div className="space-y-4">
      <Skeleton className="h-9 w-[200px]" />
      <Skeleton className="h-5 w-[300px]" />
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-[70px]" />
      ))}
    </div>
  </div>
)

export default GeneralSettings
