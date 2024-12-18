import { useCallback } from 'react'

import { gql, useQuery } from '@apollo/client'

// export const FETCH_INSPECTION_QUERY = gql`
//   query FetchInspectionQuery($id: Int!) {
//     inspection: inspection(id: $id) {
//       id
//       site {
//         name
//       }
//       inspector {
//         firstName
//         lastName
//       }
//       date
//       startTime
//       endTime
//       permitOnSite
//       swpppOnSite
//       bmpsInstalledPerSwppp
//       siteInspectionReports
//       inspectionType
//       title
//       description
//       severity
//       violationsNotes
//       whomToContact
//       newStormEvent
//       stormDateTime
//       stormDuration
//       approximatePrecipitation
//       weatherAtTime
//       temperature
//       previousDischarge
//       newDischarges
//       dischargeAtThisTime
//       currentDischarges
//       createdAt
//       updatedAt
//       bmpData {
//         id
//         implemented
//         maintenanceRequired
//         repeatOccurrence
//         correctiveActionNeeded
//         notes
//         bmp {
//           id
//           name
//           description
//         }
//       }
//       media {
//         id
//         url
//         description
//       }
//     }
//   }
// `

// export type InspectionData = {
//   id: number
//   site: {
//     name: string
//   }
//   inspector: {
//     id: number
//   }
//   date: string
//   startTime: string
//   endTime: string
//   permitOnSite: boolean
//   swpppOnSite: boolean
//   bmpsInstalledPerSwppp: boolean
//   siteInspectionReports: string
//   inspectionType: string
//   title: string
//   description: string
//   severity: string
//   violationsNotes: string
//   whomToContact: string
//   newStormEvent: boolean
//   stormDateTime: string
//   stormDuration: string
//   approximatePrecipitation: string
//   weatherAtTime: string
//   temperature: string
//   previousDischarge: string
//   newDischarges: string
//   dischargeAtThisTime: string
//   currentDischarges: string
//   createdAt: string
//   updatedAt: string
//   bmpData: { id: number }[]
//   media: { id: number; url: string }[]
// }

// export const useFetchInspection = () => {
//   const { loading, error, refetch } = useQuery(FETCH_INSPECTION_QUERY, {
//     skip: true, // This prevents the query from running automatically
//   })
//   const fetchInspection = useCallback(
//     async (id: number): Promise<InspectionData> => {
//       const { data } = await refetch({ id })
//       if (error) {
//         throw error
//       }
//       return data.inspection
//     },
//     [refetch, error]
//   )

//   return { fetchInspection, loading, error }
// }
