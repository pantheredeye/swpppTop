import { useOrganization } from 'src/context/OrganizationContext'

const OrganizationSwitcher = () => {
  const { currentOrganization, availableOrganizations, switchOrganization } =
    useOrganization()

  return (
    <select
      value={currentOrganization?.id}
      onChange={(e) => switchOrganization(e.target.value)}
      className="rounded-md border-gray-300"
    >
      {availableOrganizations.map((org) => (
        <option key={org.id} value={org.id}>
          {org.name}
        </option>
      ))}
    </select>
  )
}

export default OrganizationSwitcher
