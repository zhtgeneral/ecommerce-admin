// shows billboards



'use client'

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/primsadb";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";



interface BillboardClientProps{
  formattedBillboards: BillboardColumn[]
}


const BillboardClient: React.FC<BillboardClientProps> = ({

  formattedBillboards

}) => {


  const router = useRouter();
  const params = useParams();
  

  const goToPageToCreateBillboard = () => {
    router.push(`/${params.storeId}/billboards/new`);
  }


  // visual
  return (
    <div>

      {/* title, number of billboards, create button */}
     <div className='flex items-center justify-between pb-4'>
      <Heading 
        title={`Billboards (${formattedBillboards.length})`}
        description="manage billboards"
      />
      <Button onClick={goToPageToCreateBillboard}>
        <Plus className='mr-2 h-4 w-4' />
        Add new
      </Button>
     </div>


     <Separator />


    {/* data table */}
    <div className='pt-4'>
      <DataTable filter="label" columns={columns} data={formattedBillboards}/>
    </div>


    {/* api lists for billboard */}
    <ApiList entityName='billboards' entityIdName='billboardId' />

  </div>
  )
}


export default BillboardClient