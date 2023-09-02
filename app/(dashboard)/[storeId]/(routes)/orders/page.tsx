// shows orderclient visual + security



import prismadb from "@/lib/primsadb"
import BillboardClient from "./components/client"
import { OrderColumn } from "./components/columns"
import { format } from 'date-fns'
import { formatter } from "@/lib/utils"
import { Decimal } from "@prisma/client/runtime/library"



const Billboard = async ({
  params
}: {
  params: { storeId: string }
}) => {


  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })


  const formattedProducts: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: formatter.format(order.orderItems.reduce((total, order) => {
      return total + Number(order.product.price)
    }, 0)),
    isPaid: order.isPaid,
    createdAt: format(order.createdAt, 'MMMM do, yyyy')
  }))
  


  // visual
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient formattedOrders={formattedProducts}/>
      </div>
    </div>
  )
}

export default Billboard