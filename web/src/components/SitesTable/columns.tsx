import React from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { navigate, routes } from '@cedarjs/router'

import { useAuth } from 'src/auth'
import { Button } from 'src/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'src/components/ui/DropdownMenu'

export type Site = {
  id: number
  name: string
  ownerName: string
  addressLine1: string
}

export const columns: ColumnDef<Site>[] = [
  {
    accessorKey: 'site.name',
    header: 'Site',
  },
  {
    accessorKey: 'name',
    header: 'Site Name',
  },
  {
    accessorKey: 'ownerName',
    header: 'Owner Name',
  },

  {
    accessorKey: 'addressLine1',
    header: 'Address',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const inspection = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(inspection.id.toString())
              }
            >
              Create New Inspection
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigate(
                  routes.viewInspection({
                    organizationId: useAuth().currentUser.defaultOrganizationId,
                    id: String(inspection.id),
                  })
                )
              }
            >
              View All Inspections
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                navigate(
                  routes.viewInspection({
                    organizationId: useAuth().currentUser.defaultOrganizationId,
                    id: String(inspection.id),
                  })
                )
              }
            >
              Edit Site
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
