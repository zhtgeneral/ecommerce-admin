// gets categories and prepares data table



import prismadb from "@/lib/primsadb"
import { CategoryColumn } from "./components/columns"
import { format } from 'date-fns'
import CategoryClient from "./components/client"



const Billboard = async ({

  params

}: {

  params: { storeId: string }

}) => {


  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })


  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, 'MMMM do, yyyy')
  }))
  


  // visual
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryClient formattedCategories={formattedCategories}/>
      </div>
    </div>
  )
}

export default Billboard