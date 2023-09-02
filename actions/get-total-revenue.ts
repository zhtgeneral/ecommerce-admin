// shows total revenue

import prismadb from "@/lib/primsadb"






export const getTotalRevenue = async (storeId: string) => {
  
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId: storeId,
      isPaid: true
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  })


  const totalRevenue = paidOrders.reduce((rsf, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.product.price.toNumber();
    }, 0)

    return rsf + orderTotal;
  }, 0)

  return totalRevenue
  
}
