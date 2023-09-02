// route for updating, deleting, and getting a size



import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



// gets a specific size from sizes
export async function GET(
  
  req: Request,
  { params }: { params: { sizeId: string } }

) {

  try {


    // don't require user login


    // require size id 
    if (!params.sizeId) {
      return new NextResponse('size id is required', { status: 400 })
    }


    const sizes = await prismadb.size.findFirst({
      where: {
        id: params.sizeId
      },
    })
    return NextResponse.json(sizes);


  } catch (error) {

    console.log('[SIZE_GET]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}


// creates a billboard
export async function PATCH(
  
  req: Request,
  { params }: { params: { storeId: string, sizeId: string } }

) {

  try {


    // require user login
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('authenticated', { status: 401 });
    }


    const body = await req.json();
    const { name, value } = body;


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


    // require size id
    if (!params.sizeId) {
      return new NextResponse('billboard id is required', { status: 400 })
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


    const updatedSize = await prismadb.size.updateMany({
      where: {
        storeId: params.storeId,
        id: params.sizeId
      },
      data: {
        name,
        value
      },
    })
    return NextResponse.json(updatedSize);


  } catch (error) {

    console.log('[SIZE_UPDATE]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}


// gets all billboards
export async function DELETE(
  
  req: Request,
  { params }: { params: { storeId: string, sizeId: string } }

) {

  try {


    // require user login
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('authenticated', { status: 401 });
    }


    // require size id
    if (!params.sizeId) {
      return new NextResponse('size id is required ', { status: 400})
    }


    // require store id
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 })
    }


    // prevent wrong user from deleting size
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('unauthorized', { status: 403 })
    }


    const deletedSize = await prismadb.size.delete({
      where: {
        id: params.sizeId
      },
    })
    return NextResponse.json(deletedSize);


  } catch (error) {

    console.log('[SIZE_DELETE]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}
