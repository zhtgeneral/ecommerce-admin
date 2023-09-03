// shows billboardclient visual + security



import prismadb from "@/lib/primsadb"
import BillboardClient from "./components/client"
import { BillboardColumn } from './components/columns'
import { format } from 'date-fns'



const Billboard = async ({

  params

}: {

  params: { storeId: string }

}) => {


  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })


  const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, 'MMMM do, yyyy')
  }))
  


  // visual
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient formattedBillboards={formattedBillboards}/>
      </div>
    </div>
  )
}

export default Billboard