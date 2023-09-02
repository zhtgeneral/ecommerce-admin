// formats billboards



"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"



export type SizeColumn = {
  id: string,
  name: string,
  value: string,
  createdAt: string
}


export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: 'name',
    header: 'name'
  },
  {
    accessorKey: "value",
    header: "value",
  },
  {
    accessorKey: "createdAt",
    header: "date",
  },
  {
    id: 'actions',
    cell: ({row}) => <CellAction size={row.original} />
  }
]
