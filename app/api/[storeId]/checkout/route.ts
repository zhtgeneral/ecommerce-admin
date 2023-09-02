// route for checking out cart

import prismadb from "@/lib/primsadb";
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"; // contains secret key and version
import Stripe from 'stripe'


// allows any website to access our api
const corsHeaders = {
  'Access-Control-Allow-Origin' : "*",
  'Access-Control-Allow-Methods': "GET, POST, PUT, DELETE, OPTIONS",
  'Access-Control-Allow-Headers': 'Content-type, Authorization'
}


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}


export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {


  const { productIds } = await req.json();

  
  if (!productIds || productIds.length === 0) {
    return new NextResponse('productIds is required', { status: 400 })
  }


  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  })


  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];


  products.forEach((product) => {

    // .push appends an object to the array
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100
      }
    })
  })


  const order = await prismadb.order.create({
    data: {
       
      // check prisma for schema of order
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId
            }
          }
        }))
      },
    }
  })


  const session = await stripe.checkout.sessions.create({
    line_items: line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true
    },

    // redirect us at end of checkout (changes search params of front end)
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
    metadata: {
      orderId: order.id,
    }
  })

  return NextResponse.json({ url: session.url }, {
    headers: corsHeaders
  })


}