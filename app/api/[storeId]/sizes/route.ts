// route for posting a size and getting all sizes



import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



// creates a size and adds to sizes
export async function POST(
  
  req: Request,
  { params }: { params: { storeId: string } }

) {

  try {


    // require user login
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('unauthenticated', { status: 401 });
    }


    const body = await req.json();
    const { value, name } = body;


    // require size name
    if (!name) {
      return new NextResponse('size name is required', { status: 400 });
    }


    // require size value
    if (!value) {
      return new NextResponse('size value is required', { status: 400 });
    }


    // require store id
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 })
    }


    // prevent wrong user from creating billboard
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('unauthorized', { status: 403 })
    }


    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: params.storeId
      },
    })
    return NextResponse.json(size);


  } catch (error) {

    console.log('[SIZES_POST]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}


// gets all sizes from sizes
export async function GET(
  
  req: Request,
  { params }: { params: { storeId: string } }

) {

  try {


    // no user validation


    // require store id
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 })
    }


    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId
      },
    })
    return NextResponse.json(sizes);


  } catch (error) {

    console.log('[SIZES_GET]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}
