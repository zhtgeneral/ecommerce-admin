// formats products



"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"



export type OrderColumn = {
  id: string
  phone: string
  address: string
  products: string
  isPaid: boolean
  createdAt: string
}


export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
]
