import { Router, Route, Set, PrivateSet } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout/MainLayout'

import { useAuth } from './auth'
import { OrganizationProvider } from './context/OrganizationContext'
import AuthenticatedLayout from './layouts/AuthenticatedLayout/AuthenticatedLayout'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={MainLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Route path="/login" page={LoginPage} name="login" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
        <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      </Set>
      <PrivateSet unauthenticated="login" wrap={[OrganizationProvider, AuthenticatedLayout]}>
        <Route path="/org/{organizationId}/dashboard" page={DashboardPage} name="dashboard" />
        <Route path="/org/{organizationId}/profile/{id}" page={ProfilePage} name="profile" />
        <Route path="/org/{organizationId}/view-inspection/{id}" page={ViewInspectionPage} name="viewInspection" />
        <Route path="/org/{organizationId}/inspections" page={InspectionsPage} name="inspections" />
        <Route path="/org/{organizationId}/sites" page={SitesPage} name="sites" />
        <Route path="/org/{organizationId}/bmps" page={StandardBMPSettingsPage} name="bmps" />
        <Route path="/org/{organizationId}/new-inspection" page={NewInspectionPage} name="newInspection" />
        <Route path="/org/{organizationId}/new-site" page={NewSitePage} name="newSite" />
        <Route path="/org/{organizationId}/standard-bmp-settings" page={StandardBMPSettingsPage} name="standardBmpSettings" />

        <Route path="/org/{organizationId}/create-organization" page={CreateOrganizationPage} name="createOrganization" />
        <Route path="/org/{organizationId}/request-invite" page={RequestInvitePage} name="requestInvite" />
        <Route path="/org/{organizationId}/switch" page={SwitchPage} name="switch" />
      </PrivateSet>

      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
