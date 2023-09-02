// shows products



'use client'

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/primsadb";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";



interface ProductClientProps{
  formattedProducts: ProductColumn[]
}


const ProductClient: React.FC<ProductClientProps> = ({

  formattedProducts

}) => {


  const router = useRouter();
  const params = useParams();
  

  const goToPageToCreateProducts = () => {
    router.push(`/${params.storeId}/products/new`);
  }


  // visual
  return (
    <div>

      {/* title, number of products, create button */}
     <div className='flex items-center justify-between pb-4'>
      <Heading 
        title={`Products (${formattedProducts.length})`}
        description="manage products"
      />
      <Button onClick={goToPageToCreateProducts}>
        <Plus className='mr-2 h-4 w-4' />
        Add new
      </Button>
     </div>


     <Separator />


    {/* data table */}
    <div className='pt-4'>
      <DataTable filter="name" columns={columns} data={formattedProducts}/>
    </div>


    {/* api lists for products */}
    <ApiList entityName='products' entityIdName='productId' />

  </div>
  )
}


export default ProductClient