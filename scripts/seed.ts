import { db } from 'api/src/lib/db'
import { Action } from '@prisma/client'

type StandardRole = {
  name: string
  description: string
  isSystemDefined: boolean
  permissions: {
    subjects: string[]
    actions: Action[]
    excludeSubjects?: string[]
  }
}

const subjects = [
  'User',
  'Organization',
  'Membership',
  'Site',
  'Assignment',
  'Event',
  'Media',
  'Inspection',
  'InspectionEventDetails'
]

const systemRoles: StandardRole[] = [
  {
    name: 'OWNER',
    description: 'Full access to organization resources',
    isSystemDefined: true,
    permissions: {
      subjects: subjects,
      actions: ['CREATE', 'READ', 'WRITE', 'DELETE']
    }
  },
  {
    name: 'ADMIN',
    description: 'Manage organization settings and members',
    isSystemDefined: true,
    permissions: {
      subjects: subjects,
      actions: ['CREATE', 'READ', 'WRITE', 'DELETE'],
      excludeSubjects: ['Billing']
    }
  },
  {
    name: 'MEMBER',
    description: 'Standard member access',
    isSystemDefined: true,
    permissions: {
      subjects: subjects,
      actions: ['READ', 'WRITE'],
      excludeSubjects: ['Organization', 'Membership']
    }
  },
  {
    name: 'VIEWER',
    description: 'Read-only access to organization resources',
    isSystemDefined: true,
    permissions: {
      subjects: subjects,
      actions: ['READ'],
      excludeSubjects: ['Organization', 'Membership']
    }
  }
]

// Helper function to process items in batches
async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processFn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(processFn))
    results.push(...batchResults)
  }

  return results
}

export default async function seedRoles() {
  try {
    // Create or update the SYSTEM organization
    const systemOrg = await db.organization.upsert({
      where: { name: 'SYSTEM' },
      create: {
        name: 'SYSTEM',
        type: 'OTHER',
        status: 'ACTIVE'
      },
      update: {}
    })

    // Create permission operations array
    const permissionOps = systemRoles.flatMap(role =>
      role.permissions.subjects
        .filter(subject => !role.permissions.excludeSubjects?.includes(subject))
        .flatMap(subject =>
          role.permissions.actions.map(action => ({
            action,
            subject,
            organizationId: systemOrg.id
          }))
        )
    )

    // Process permissions in batches of 5
    const createdPermissions = await processBatch(
      permissionOps,
      5,
      async ({ action, subject, organizationId }) => {
        return db.permission.upsert({
          where: {
            action_subject_organizationId: {
              action,
              subject,
              organizationId
            }
          },
          create: {
            action,
            subject,
            organizationId,
            isSystemDefined: true,
            description: `${action} access to ${subject}`
          },
          update: {
            isSystemDefined: true,
            description: `${action} access to ${subject}`
          }
        })
      }
    )

    // Process roles one at a time
    for (const roleTemplate of systemRoles) {
      // Filter permissions for this role
      const rolePermissions = createdPermissions.filter(permission => {
        const isSubjectAllowed = roleTemplate.permissions.subjects.includes(permission.subject) &&
          !roleTemplate.permissions.excludeSubjects?.includes(permission.subject)
        const isActionAllowed = roleTemplate.permissions.actions.includes(permission.action)
        return isSubjectAllowed && isActionAllowed
      })

      // First, create or update the role without permissions
      const role = await db.membershipRole.upsert({
        where: {
          name_organizationId: {
            name: roleTemplate.name,
            organizationId: systemOrg.id
          }
        },
        create: {
          name: roleTemplate.name,
          organizationId: systemOrg.id,
          isSystemDefined: true,
        },
        update: {
          isSystemDefined: true,
        }
      })

      // Delete existing role permissions
      await db.rolePermission.deleteMany({
        where: {
          roleId: role.id
        }
      })

      // Create new role permissions in batches
      await processBatch(
        rolePermissions,
        5,
        async (permission) => {
          return db.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: permission.id
              }
            },
            create: {
              roleId: role.id,
              permissionId: permission.id,
              fields: ['*'],
              inverted: false
            },
            update: {
              fields: ['*'],
              inverted: false
            }
          })
        }
      )
    }

    console.log('Successfully seeded system roles and permissions')
  } catch (error) {
    console.error('Error seeding roles and permissions:', error)
    throw error
  }
}
