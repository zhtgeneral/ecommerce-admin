// route for updating, deleting, and getting a billboard



import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



// gets a billboard
export async function GET(
  
  req: Request,
  { params }: { params: { billboardId: string } }

) {

  try {

    // require billboard id 
    if (!params.billboardId) {
      return new NextResponse('billboard id is required', { status: 400 })
    }


    const billboards = await prismadb.billboard.findFirst({
      where: {
        id: params.billboardId
      },
    })
    return NextResponse.json(billboards);


  } catch (error) {

    console.log('[BILLBOARDS_GET]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}


// creates a billboard
export async function PATCH(
  
  req: Request,
  { params }: { params: { storeId: string, billboardId: string } }

) {

  try {


    // require user login
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('authenticated', { status: 401 });
    }


    const body = await req.json();
    const { label, imageUrl } = body;


    // require billboard label
    if (!label) {
      return new NextResponse('billboard label is required', { status: 400 });
    }


    // require billboard image url
    if (!imageUrl) {
      return new NextResponse('image url is required', { status: 400 });
    }


    // require store id
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 })
    }


    // require billboard id
    if (!params.billboardId) {
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


    const billboard = await prismadb.billboard.updateMany({
      where: {
        storeId: params.storeId,
        id: params.billboardId
      },
      data: {
        label,
        imageUrl
      },
    })
    return NextResponse.json(billboard);


  } catch (error) {

    console.log('[BILLBOARDS_UPDATE]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}


// gets all billboards
export async function DELETE(
  
  req: Request,
  { params }: { params: { storeId: string, billboardId: string } }

) {

  try {


    // require user login
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('authenticated', { status: 401 });
    }

    
    // require billboard id
    if (!params.billboardId) {
      return new NextResponse('billboard id is required', { status: 400})
    }


    // require store id
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 })
    }


    // prevent wrong user from deleting billboard
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('unauthorized', { status: 403 })
    }


    const billboards = await prismadb.billboard.delete({
      where: {
        id: params.billboardId
      },
    })
    return NextResponse.json(billboards);


  } catch (error) {

    console.log('[BILLBOARDS_DELETE]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}
