import { useState } from 'react'
import { Card, CardContent } from 'src/components/ui/Card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'src/components/ui/Accordion'
import { Button } from 'src/components/ui/Button'
import { Input } from 'src/components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/Select'
import { Switch } from 'src/components/ui/Switch'
import { Building2, User, Bell, CreditCard, HelpCircle } from 'lucide-react'
// import { useStripe } from '@stripe/stripe-js'
import { toast } from 'react-hot-toast'

import { useStripe } from 'src/utils/useStripe'

const GeneralSettings = ({
  organization,
  currentUser,
  stripeCustomerId,
  onUpdateOrganization,
  onUpdateUser,
}) => {
  const stripe = useStripe()
  const [isLoading, setIsLoading] = useState(false)

  const { redirectToBillingPortal } = useStripe()

  const handleManageSubscription = async () => {
    redirectToBillingPortal(organization.id)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {/* Organization Settings */}
        <AccordionItem value="organization">
          <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Organization Settings</span>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-medium">Organization Name</label>
                    <Input defaultValue={organization?.name} />
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium">Organization Type</label>
                    <Select defaultValue={organization?.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERSONAL">Personal</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium">Status</label>
                    <Select defaultValue={organization?.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Profile Settings */}
        <AccordionItem value="profile">
          <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5 text-primary" />
            <span>Profile Settings</span>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="font-medium">First Name</label>
                    <Input defaultValue={currentUser?.firstName} />
                  </div>
                  <div className="space-y-2">
                    <label className="font-medium">Last Name</label>
                    <Input defaultValue={currentUser?.lastName} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Phone Number</label>
                  <Input type="tel" defaultValue={currentUser?.phoneNumber} />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Notification Settings */}
        <AccordionItem value="notifications">
          <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
            <Bell className="h-5 w-5 text-primary" />
            <span>Notification Settings</span>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Site Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Changes to your assigned sites
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Billing & Subscription */}
        <AccordionItem value="billing">
          <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>Billing & Subscription</span>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="shadow-sm">
              <CardContent className="pt-6 space-y-6">
                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Current Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your subscription
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleManageSubscription}
                      disabled={isLoading || !stripeCustomerId}
                    >
                      {isLoading ? 'Loading...' : 'Manage Subscription'}
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Billing Email</h3>
                  <Input
                    type="email"
                    defaultValue={organization?.billingEmail}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default GeneralSettings
