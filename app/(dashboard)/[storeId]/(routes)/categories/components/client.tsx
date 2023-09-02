// shows categories data table



'use client'

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/primsadb";
import axios from "axios";
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";



interface BillboardClientProps{
  formattedCategories: CategoryColumn[]
}


const CategoryClient: React.FC<BillboardClientProps> = ({

  formattedCategories

}) => {


  const router = useRouter();
  const params = useParams();
  

  const goToPageToCreateBillboard = () => {
    router.push(`/${params.storeId}/categories/new`);
  }


  // visual
  return (
    <div>

      {/* title, number of categories, create button */}
     <div className='flex items-center justify-between pb-4'>
      <Heading 
        title={`Categories (${formattedCategories.length})`}
        description="manage categories"
      />
      <Button onClick={goToPageToCreateBillboard}>
        <Plus className='mr-2 h-4 w-4' />
        Add new
      </Button>
     </div>


     <Separator />


    {/* data table + search bar*/}
    <div className='pt-4'>
      <DataTable filter="name" columns={columns} data={formattedCategories}/>
    </div>


    {/* api lists for categories */}
    <ApiList entityName='categories' entityIdName='categoryId' />

  </div>
  )
}


export default CategoryClient