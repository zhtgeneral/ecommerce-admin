// route for posting store to prisma



import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/primsadb';



// creates a new store
export async function POST(

  req: Request,

) {
  
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    // require user login
    if (!userId) {
      return new NextResponse("Unauthorized", {status:401});
    }

    // server side validation
    if (!name) {
      return new NextResponse("Name is required", {status:400});
    }

    // sends a store to prismadb
    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      }
    });

    // sends response to user
    return NextResponse.json(store);



  } catch (error) {

    // optional displays the location of error
    console.log('[STORES_POST]', error)

    // sends response to user
    return new NextResponse('Internal error', {status:500})

  }
}