import type {
  QueryResolvers,
  MutationResolvers,
  OrganizationRelationResolvers,
} from 'types/graphql'

import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const organizations: QueryResolvers['organizations'] = () => {
  return db.organization.findMany()
}

export const organization: QueryResolvers['organization'] = ({ id }) => {
  return db.organization.findUnique({
    where: { id },
  })
}

export const userOrganizations: QueryResolvers['userOrganizations'] =
  async () => {
    const currentUser = context.currentUser
    if (!currentUser) {
      throw new AuthenticationError('You must be logged in')
    }

    const userWithOrgs = await db.user.findUnique({
      where: {
        id: currentUser.id,
        isActive: true,
        deletedAt: null,
      },
      select: {
        memberships: {
          where: {
            status: 'ACTIVE',
            deletedAt: null,
            organization: {
              status: 'ACTIVE',
              deletedAt: null,
            },
          },
          select: {
            organization: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    })

    console.log('userWithOrgs:', JSON.stringify(userWithOrgs, null, 2))
    return (
      userWithOrgs?.memberships?.map((membership) => membership.organization) ||
      []
    )
  }

export const createOrganization: MutationResolvers['createOrganization'] =
  async ({ input }) => {
    const { currentUser } = context

    const organization = await db.$transaction(async (tx) => {
      // Create the organization
      const org = await tx.organization.create({
        data: {
          name: input.name,
          status: 'ACTIVE',
          settings: input.settings || {},
          type: input.type || 'PERSONAL',
        },
      })

      // Get the FULL_ACCESS permission
      const fullAccessPermission = await tx.permission.findFirst({
        where: {
          name: 'FULL_ACCESS',
          scope: 'ORGANIZATION',
        },
      })

      if (!fullAccessPermission) {
        throw new Error('Required FULL_ACCESS permission not found')
      }

      // Create owner role
      const ownerRole = await tx.membershipRole.create({
        data: {
          name: 'OWNER',
          organizationId: org.id,
          permissionId: fullAccessPermission.id,
        },
      })

      // Create membership
      await tx.membership.create({
        data: {
          userId: currentUser.id,
          organizationId: org.id,
          roles: {
            connect: { id: ownerRole.id },
          },
          status: 'ACTIVE',
          invitationChannel: 'INTERNAL',
          joinedAt: new Date(),
        },
      })

      // Return the complete organization with relationships
      return await tx.organization.findUnique({
        where: { id: org.id },
        include: {
          membershipRole: true,
          users: {
            include: {
              roles: true,
            },
          },
        },
      })
    })

    if (!organization) {
      throw new Error('Failed to create organization')
    }

    return organization
  }

export const updateOrganization: MutationResolvers['updateOrganization'] = ({
  id,
  input,
}) => {
  return db.organization.update({
    data: input,
    where: { id },
  })
}

export const deleteOrganization: MutationResolvers['deleteOrganization'] = async ({
  id,
}) => {
  const { currentUser } = context

  // Check if user has permission to delete the organization
  const membership = await db.membership.findFirst({
    where: {
      organizationId: id,
      userId: currentUser.id,
      roles: {
        some: {
          name: 'OWNER'
        }
      },
      status: 'ACTIVE',
      deletedAt: null
    },
    include: {
      organization: true
    }
  })

  if (!membership) {
    throw new Error('You must be an owner to delete this organization')
  }

  // Check if this is the user's personal organization
  if (membership.organization.type === 'PERSONAL') {
    throw new Error('Personal organizations cannot be deleted')
  }

  return await db.$transaction(async (tx) => {
    // Delete the organization
    const deletedOrg = await tx.organization.delete({
      where: { id },
    })

    // If this was the user's default organization, set their personal org as default
    if (currentUser.defaultOrganizationId === id) {
      const personalOrg = await tx.organization.findFirst({
        where: {
          users: {
            some: {
              id: currentUser.id
            }
          },
          type: 'PERSONAL'
        }
      })

      if (personalOrg) {
        await tx.user.update({
          where: { id: currentUser.id },
          data: { defaultOrganizationId: personalOrg.id }
        })
      }
    }

    return deletedOrg
  })
}
export const setDefaultOrganization: MutationResolvers['setDefaultOrganization'] =
  async ({ id }) => {
    const { currentUser } = context
    return db.user.update({
      where: { id: currentUser.id },
      data: { defaultOrganizationId: id },
    })
  }

export const Organization: OrganizationRelationResolvers = {
  users: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).users()
  },
  sites: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).sites()
  },
  inspection: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).inspection()
  },
  event: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).event()
  },
  membershipRole: (_obj, { root }) => {
    return db.organization
      .findUnique({ where: { id: root?.id } })
      .membershipRole()
  },
  media: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).media()
  },
  inspectionEventDetails: (_obj, { root }) => {
    return db.organization
      .findUnique({ where: { id: root?.id } })
      .inspectionEventDetails()
  },
  assignment: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).assignment()
  },
  permission: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).permission()
  },
}
