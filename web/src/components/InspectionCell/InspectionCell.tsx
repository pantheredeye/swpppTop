import type {
  FindInspectionQuery,
  FindInspectionQueryVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import { Card } from 'src/components/ui/Card'

type QueryInspection = NonNullable<FindInspectionQuery['inspection']>

export const QUERY: TypedDocumentNode<
  FindInspectionQuery,
  FindInspectionQueryVariables
> = gql`
  query FindInspectionQuery($id: String!) {
    inspection: inspection(id: $id) {
      id
      site {
        name
      }
      # inspector {
      #   id
      # }
      # date
      # startTime
      # endTime
      # permitOnSite
      # swpppOnSite
      # bmpsInstalledPerSwppp
      # siteInspectionReports
      # inspectionType
      # title
      # description
      # severity
      # violationsNotes
      # whomToContact
      # newStormEvent
      # stormDateTime
      # stormDuration
      # approximatePrecipitation
      # weatherAtTime
      # temperature
      # previousDischarge
      # newDischarges
      # dischargeAtThisTime
      # currentDischarges
      # createdAt
      # updatedAt
      # bmpData {
      #   id
      # }
      # media {
      #   id
      #   url
      # }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindInspectionQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  inspection,
  onSuccess,
}: CellSuccessProps<FindInspectionQuery, FindInspectionQueryVariables> & {
  onSuccess?: (data: QueryInspection) => void
}) => {
  React.useEffect(() => {
    if (onSuccess) {
      onSuccess(inspection)
    }
  }, [inspection, onSuccess])

  return (
    <Card className="p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-semibold">{inspection.title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <strong>Site:</strong> {inspection.site.name}
        </div>
        <div>
          <strong>Inspector:</strong> {inspection.inspector.id}
        </div>
        <div>
          <strong>Date:</strong>{' '}
          {new Date(inspection.date).toLocaleDateString()}
        </div>
        <div>
          <strong>Start Time:</strong>{' '}
          {new Date(inspection.startTime).toLocaleTimeString()}
        </div>
        <div>
          <strong>End Time:</strong>{' '}
          {new Date(inspection.endTime).toLocaleTimeString()}
        </div>
        <div>
          <strong>Whom to Contact:</strong> {inspection.whomToContact || 'N/A'}
        </div>
        <div>
          <strong>Severity:</strong> {inspection.severity}
        </div>
        <div>
          <strong>Inspection Type:</strong> {inspection.inspectionType}
        </div>
        <div>
          <strong>Permit on Site:</strong>{' '}
          {inspection.permitOnSite ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>SWPPP on Site:</strong>{' '}
          {inspection.swpppOnSite ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>BMPs Installed Per SWPPP:</strong>{' '}
          {inspection.bmpsInstalledPerSwppp ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Site Inspection Reports:</strong>{' '}
          {inspection.siteInspectionReports ? 'Yes' : 'No'}
        </div>
        <div className="col-span-3">
          <strong>Description:</strong>
          <p>{inspection.description}</p>
        </div>
        <div className="col-span-3">
          <strong>Violations/Notes:</strong>
          <p>{inspection.violationsNotes || 'N/A'}</p>
        </div>
        <div className="col-span-3">
          <strong>Weather at Time:</strong>
          <p>{inspection.weatherAtTime}</p>
        </div>
        <div className="col-span-1">
          <strong>Temperature:</strong>
          <p>{inspection.temperature || 'N/A'}°F</p>
        </div>
        <div className="col-span-1">
          <strong>New Storm Event:</strong>
          <p>{inspection.newStormEvent ? 'Yes' : 'No'}</p>
        </div>
        <div className="col-span-3">
          <strong>Storm Date-Time:</strong>
          <p>
            {inspection.stormDateTime
              ? new Date(inspection.stormDateTime).toLocaleString()
              : 'N/A'}
          </p>
        </div>
        <div className="col-span-1">
          <strong>Storm Duration:</strong>
          <p>{inspection.stormDuration || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <strong>Approx. Precipitation:</strong>
          <p>{inspection.approximatePrecipitation || 'N/A'} in</p>
        </div>
        <div className="col-span-1">
          <strong>Previous Discharge:</strong>
          <p>{inspection.previousDischarge ? 'Yes' : 'No'}</p>
        </div>
        <div className="col-span-1">
          <strong>New Discharges:</strong>
          <p>{inspection.newDischarges ? 'Yes' : 'No'}</p>
        </div>
        <div className="col-span-1">
          <strong>Discharge at This Time:</strong>
          <p>{inspection.dischargeAtThisTime ? 'Yes' : 'No'}</p>
        </div>
        <div className="col-span-1">
          <strong>Current Discharges:</strong>
          <p>{inspection.currentDischarges ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </Card>
  )
}
