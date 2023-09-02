// shows billboards



'use client'

import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";



interface OrderClientProps {
  formattedOrders: OrderColumn[]
}


const BillboardClient: React.FC<OrderClientProps> = ({
  formattedOrders
}) => {


  // visual
  return (
    <div>

      {/* title, number of orders, create button */}
     <div className='flex items-center justify-between pb-4'>
      <Heading 
        title={`Orders (${formattedOrders.length})`}
        description="manage orders"
      />
     </div>


     <Separator />


    {/* data table */}
    <div className='pt-4'>
      <DataTable filter="phone" columns={columns} data={formattedOrders}/>
    </div>

  </div>
  )
}


export default BillboardClient