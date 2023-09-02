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
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";



interface ColorClientProps{
  formattedColors: ColorColumn[]
}


const ColorClient: React.FC<ColorClientProps> = ({

  formattedColors

}) => {


  const router = useRouter();
  const params = useParams();
  

  const goToPageToCreateColors = () => {
    router.push(`/${params.storeId}/colors/new`);
  }


  // visual
  return (
    <div>

      {/* title, number of billboards, create button */}
     <div className='flex items-center justify-between pb-4'>
      <Heading 
        title={`Colors (${formattedColors.length})`}
        description="manage colors"
      />
      <Button onClick={goToPageToCreateColors}>
        <Plus className='mr-2 h-4 w-4' />
        Add new
      </Button>
     </div>


     <Separator />


    {/* data table */}
    <div className='pt-4'>
      <DataTable filter="name" columns={columns} data={formattedColors}/>
    </div>


    {/* api lists for sizes */}
    <ApiList entityName='sizes' entityIdName='sizeId' />

  </div>
  )
}


export default ColorClient