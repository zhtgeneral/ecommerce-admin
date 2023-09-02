// gets sizes data and prepares data table



import prismadb from "@/lib/primsadb"
import SizeClient from "./components/client"
import { SizeColumn } from "./components/columns"
import { format } from 'date-fns'



const Size = async ({

  params

}: {

  params: { storeId: string }

}) => {


  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })


  const formattedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, 'MMMM do, yyyy')
  }))
  


  // visual
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeClient formattedSizes={formattedSizes}/>
      </div>
    </div>
  )
}

export default Size