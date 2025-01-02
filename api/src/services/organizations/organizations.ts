import type {
  QueryResolvers,
  MutationResolvers,
  OrganizationRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { AuthenticationError } from '@redwoodjs/graphql-server'
import { assignSystemRoleToMembership } from '../membershipRoles/membershipRoles'

export const organizations: QueryResolvers['organizations'] = () => {
  return db.organization.findMany()
}

export const organization: QueryResolvers['organization'] = ({ id }) => {
  return db.organization.findUnique({
    where: { id },
  })
}

/**
 * Retrieves the organizations associated with the current authenticated user.
 *
 * Fetches the organizations for which the user has active memberships.
 * Only organizations and memberships that are not marked as deleted
 * and have an 'ACTIVE' status are included in the result.
 *
 * @throws {AuthenticationError} If the user is not logged in.
 *
 * @returns {Promise<Array<{ id: string, name: string, status: string, type: string }>>}
 * An array of organizations with their basic details.
 */

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
                type: true,
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
      // 1. Create the organization
      const org = await tx.organization.create({
        data: {
          name: input.name,
          type: input.type,
          status: input.status,
          settings: { creationType: 'USER_CREATION'}
        }
      })

      // 2. Create membership
      const membership = await tx.membership.create({
        data: {
          userId: currentUser.id,
          organizationId: org.id,
          status: 'ACTIVE',
          invitationChannel: 'INTERNAL',
          joinedAt: new Date()
        }
      })

      // 3. Link the system OWNER role
      await assignSystemRoleToMembership(membership.id, 'OWNER', tx)

      return org
    })

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


export const deleteOrganization: MutationResolvers['deleteOrganization'] =
  async ({ id }) => {
    const { currentUser } = context

    // Check if user has permission to delete the organization
    const membership = await db.membership.findFirst({
      where: {
        organizationId: id,
        userId: currentUser.id,
        roles: {
          some: {
            name: 'OWNER',
          },
        },
        status: 'ACTIVE',
        deletedAt: null,
      },
      include: {
        organization: true,
      },
    })

    if (!membership) {
      throw new Error('You must be an owner to delete this organization')
    }

    // Check if this is the user's personal organization
    if (membership.organization.type === 'PERSONAL') {
      throw new Error('Personal organizations cannot be deleted')
    }

    return await db.$transaction(async (db) => {
      // Delete the organization
      const deletedOrg = await db.organization.delete({
        where: { id },
      })

      // If this was the user's default organization, set their personal org as default
      if (currentUser.defaultOrganizationId === id) {
        const personalOrg = await db.organization.findFirst({
          where: {
            users: {
              some: {
                id: currentUser.id,
              },
            },
            type: 'PERSONAL',
          },
        })

        if (personalOrg) {
          await db.user.update({
            where: { id: currentUser.id },
            data: { defaultOrganizationId: personalOrg.id },
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
  membershipRoles: (_obj, { root }) => {
    return db.organization
      .findUnique({ where: { id: root?.id } })
      .membershipRoles()
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
  User: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).User()
  },
}
