// formats billboards



"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"



export type ProductColumn = {
  id: string
  name: string
  price: string,
  category: string,
  color: string,
  size: string,
  isFeatured: boolean,
  isArchived: boolean,
  createdAt: string
}


export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "price",
    header: "price"
  },
  {
    accessorKey: "category",
    header: "category"
  },
  {
    accessorKey: "color",
    header: "color",
    cell: ({ row }) => (
      <div className='flex items-center gap-x-2'>
        {row.original.color}
        <div 
          className='h-6 w-6 rounded-full border'
          style={{backgroundColor: row.original.color}}
        />
      </div>
    )
  },
  {
    accessorKey: "size",
    header: "size"
  },
  {
    accessorKey: "isFeatured",
    header: "Featured"
  },
  {
    accessorKey: "isArchived",
    header: "Archived"
  },
  {
    accessorKey: "createdAt",
    header: "date",
  },
  {
    id: 'actions',
    cell: ({row}) => <CellAction product={row.original} />
  }
]
