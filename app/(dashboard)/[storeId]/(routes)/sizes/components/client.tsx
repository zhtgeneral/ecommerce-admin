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
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";



interface BillboardClientProps{
  formattedSizes: SizeColumn[]
}


const BillboardClient: React.FC<BillboardClientProps> = ({

  formattedSizes

}) => {


  const router = useRouter();
  const params = useParams();
  

  const goToPageToCreateSize = () => {
    router.push(`/${params.storeId}/sizes/new`);
  }


  // visual
  return (
    <div>

      {/* title, number of billboards, create button */}
     <div className='flex items-center justify-between pb-4'>
      <Heading 
        title={`Sizes (${formattedSizes.length})`}
        description="manage sizes"
      />
      <Button onClick={goToPageToCreateSize}>
        <Plus className='mr-2 h-4 w-4' />
        Add new
      </Button>
     </div>


     <Separator />


    {/* data table */}
    <div className='pt-4'>
      <DataTable filter="name" columns={columns} data={formattedSizes}/>
    </div>


    {/* api lists for sizes */}
    <ApiList entityName='sizes' entityIdName='sizeId' />

  </div>
  )
}


export default BillboardClient