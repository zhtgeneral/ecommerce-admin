// shows recent revenue in a graph

import prismadb from "@/lib/primsadb"



interface GraphData {
  name: string,
  total: number
}


export const getGraphRevenue = async (storeId: string) => {
  
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


  // is a map/dictionary
  const monthlyRevenue: { [key: number]: number} = {}


  // every loop adds the revenue of a order to its corresponding value on the map
  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;

    for (const item of order.orderItems) {
      revenueForOrder += item.product.price.toNumber();
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder
  }



  // initialize array (kind of like a map)
  const graphData: GraphData[] = [
    { name: 'Jan', total: 0},
    { name: 'Feb', total: 0},
    { name: 'Mar', total: 0},
    { name: 'Apr', total: 0},
    { name: 'May', total: 0},
    { name: 'Jun', total: 0},
    { name: 'Jul', total: 0},
    { name: 'Aug', total: 0},
    { name: 'Sep', total: 0},
    { name: 'Oct', total: 0},
    { name: 'Nov', total: 0},
    { name: 'Dec', total: 0},
  ]

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return graphData
  
}
