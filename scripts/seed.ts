import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

type Action = 'CREATE' | 'READ' | 'WRITE' | 'DELETE'
const subjects = [
  'User', 'Organization', 'Membership', 'Site', 'Assignment',
  'Event', 'Media', 'Inspection', 'InspectionEventDetails'
]
const actions: Action[] = ['CREATE', 'READ', 'WRITE', 'DELETE']


const standardRoles = [
  {
    name: 'OWNER',
    description: 'Full access to organization',
    allPermissions: true
  },
  {
    name: 'ADMIN',
    description: 'Manage organization settings and members',
    excludeSubjects: ['Billing']
  },
  {
    name: 'USER',
    description: 'Standard user access',
    allowedActions: ['READ', 'WRITE'],
    excludeSubjects: ['Organization', 'Membership']
  },
  {
    name: 'VIEWER',
    description: 'Read-only access',
    allowedActions: ['READ']
  }
]

export default async () => {
  try {
    // Create global permissions
    const permissions = await Promise.all(
      subjects.flatMap(subject =>
        Object.values(actions).map(action =>
          db.permission.upsert({
            where: {
              action_subject_organizationId_scope: {
                action,
                subject,
                organizationId: null,
                scope: 'GLOBAL'
              }
            },
            create: {
              action,
              subject,
              scope: 'GLOBAL',
              description: `${action} access to ${subject}`
            },
            update: {}
          })
        )
      )
    )

    // Create standard roles
    await Promise.all(
      standardRoles.map(async role => {
        const rolePermissions = permissions.filter(permission => {
          if (role.allPermissions) return true
          if (role.excludeSubjects?.includes(permission.subject)) return false
          return role.allowedActions?.includes(permission.action) ?? true
        })

        await db.membershipRole.upsert({
          where: {
            name_organizationId: {
              name: role.name,
              organizationId: null
            }
          },
          create: {
            name: role.name,
            scope: 'GLOBAL',
            organizationId: null,
            permissions: {
              create: rolePermissions.map(permission => ({
                permission: { connect: { id: permission.id } },
                fields: ['*'],
                inverted: false
              }))
            }
          },
          update: {}
        })
      })
    )
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}
    //     // Seed data for Standard BMPs
    //     const standardBMPs: Prisma.BmpCreateInput[] = [
    //       {
    //         name: 'Slope Stability',
    //         description:
    //           'Are all slopes and disturbed areas not actively being worked properly stabilized?',
    //         isStandard: true,
    //       },
    //       {
    //         name: 'Natural Resource Protection',
    //         description:
    //           'Are natural resource areas (streams, wetlands, mature trees, etc.) protected with barriers or similar BMPs?',
    //         isStandard: true,
    //       },
    //       {
    //         name: 'Perimeter Controls',
    //         description:
    //           'Are perimeter controls and sediment barriers adequately installed (keyed into substrate) and maintained?',
    //         isStandard: true,
    //       },
    //       {
    //         name: 'Discharge Points',
    //         description:
    //           'Are discharge points and receiving waters free of any sediment deposits?',
    //         isStandard: true,
    //       },
    //       {
    //         name: 'Storm Drain Inlets',
    //         description: 'Are storm drain inlets properly protected?',
    //         isStandard: true,
    //       },
    //       {
    //         name: 'Construction Exit',
    //         description:
    //           'Is the construction exit preventing sediment from being tracked into the street?',
    //         isStandard: true,
    //       },
    //       {
    //         name: 'Trash and Litter',
    //         description:
    //           'Is trash/litter from work areas collected and placed into covered dumpsters?',
    //         isStandard: true,
    //       },
    //       {
    //         name: 'Washout Facilities',
    //         description:
    //           'Are washout facilities (e.g., paint, stucco, concrete) available, clearly marked, and maintained?',
    //         isStandard: true,
    //       },
    //       {
    //         name: 'Vehicle and Equipment Areas',
    //         description:
    //           'Are vehicle and equipment fueling, cleaning, and maintenance areas free of spills, leaks, or any other deleterious material?',
    //         isStandard: true,
    //       },
    //       {
    //         name: 'Material Storage',
    //         description:
    //           'Are materials that are potential stormwater contaminants stored inside or under cover?',
    //         isStandard: true,
    //       },
    //       {
    //         name: 'Non-Stormwater Discharges',
    //         description:
    //           'Are non-stormwater discharges (e.g., wash water, dewatering) properly controlled?',
    //         isStandard: true,
    //       },
    //     ]
    //     await Promise.all(
    //       standardBMPs.map((standardBMP) => db.bmp.create({ data: standardBMP }))
    //     )

    //     // Seed data for site types
    //     const siteTypes: Prisma.SiteTypeCreateInput[] = [
    //       { name: 'RESIDENTIAL' },
    //       { name: 'LARGE' },
    //     ]
    //     const createdSiteTypes = await Promise.all(
    //       siteTypes.map((siteType) => db.siteType.create({ data: siteType }))
    //     )

    //     // Seed data for users
    //     const users: Array<
    //       Omit<Prisma.UserCreateInput, 'hashedPassword' | 'salt'> & {
    //         password: string
    //       }
    //     > = [
    //       {
    //         email: 'admin@example.com',
    //         password: 'adminpassword',
    //         roles: 'admin',
    //       },
    //       {
    //         email: 'siteowner@example.com',
    //         password: 'siteownerpassword',
    //         roles: 'user',
    //       },
    //       {
    //         email: 'inspector@example.com',
    //         password: 'inspectorpassword',
    //         roles: 'user',
    //       },
    //     ]

    //     for (const user of users) {
    //       const [hashedPassword, salt] = hashPassword(user.password)
    //       await db.user.create({
    //         data: {
    //           email: user.email,
    //           hashedPassword,
    //           salt,
    //           roles: user.roles,
    //         },
    //       })
    //     }

    //     // Seed data for sites
    //     const sites: Prisma.SiteCreateInput[] = [
    //       {
    //         name: 'Site 1',
    //         addressLine1: '123 Main St',
    //         addressLine2: 'Suite 100',
    //         city: 'City 1',
    //         state: 'State 1',
    //         postalCode: '12345',
    //         country: 'Country 1',
    //         npdesTrackingNo: 'NPDES123',
    //         siteType: {
    //           connect: {
    //             id: createdSiteTypes.find(
    //               (siteType) => siteType.name === 'RESIDENTIAL'
    //             )?.id,
    //           },
    //         },
    //         siteInspector: 'Inspector 1',
    //         siteMap: 'site1-map.pdf',
    //         ownerName: 'Owner 1',
    //       },
    //       {
    //         name: 'Site 2',
    //         addressLine1: '456 Elm St',
    //         addressLine2: 'Apt 202',
    //         city: 'City 2',
    //         state: 'State 2',
    //         postalCode: '67890',
    //         country: 'Country 2',
    //         npdesTrackingNo: 'NPDES456',
    //         siteType: {
    //           connect: {
    //             id: createdSiteTypes.find((siteType) => siteType.name === 'LARGE')
    //               ?.id,
    //           },
    //         },
    //         siteInspector: 'Inspector 2',
    //         siteMap: 'site2-map.jpeg',
    //         ownerName: 'Owner 2',
    //       },
    //     ]

    //     await Promise.all(sites.map((site) => db.site.create({ data: site })))

