// formats billboards



"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"



export type BillboardColumn = {
  id: string
  label: string
  createdAt: string
}


export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "label",
  },
  {
    accessorKey: "createdAt",
    header: "date",
  },
  {
    id: 'actions',
    cell: ({row}) => <CellAction billboard={row.original} />
  }
]


