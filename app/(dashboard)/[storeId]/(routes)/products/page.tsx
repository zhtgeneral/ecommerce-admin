// shows product client visual + security



import prismadb from "@/lib/primsadb"
import ProductClient from "./components/client"
import { ProductColumn } from "./components/columns"
import { format } from 'date-fns'
import { formatter } from "@/lib/utils"



const Product = async ({

  params

}: {

  params: { storeId: string }

}) => {


  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })


  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatter.format(product.price.toNumber()),
    category: product.category.name,
    color: product.color.value,
    size: product.size.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    createdAt: format(product.createdAt, 'MMMM do, yyyy')
  }))
  


  // visual
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductClient formattedProducts={formattedProducts}/>
      </div>
    </div>
  )
}

export default Product