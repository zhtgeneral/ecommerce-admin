// gets sizes data and prepares data table



import prismadb from "@/lib/primsadb"
import ColorClient from "./components/client"
import { ColorColumn } from "./components/columns"
import { format } from 'date-fns'



const Color = async ({

  params

}: {

  params: { storeId: string }

}) => {


  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })


  const formattedColors: ColorColumn[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, 'MMMM do, yyyy')
  }))
  


  // visual
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorClient formattedColors={formattedColors}/>
      </div>
    </div>
  )
}

export default Color