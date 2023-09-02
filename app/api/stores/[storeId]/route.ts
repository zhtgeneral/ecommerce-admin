// api route that handles the request for patching and deleting store 



import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



// handles updating store name
export async function PATCH (

  req: Request,
  { params }: { params: { storeId: string } }

) {

  try {


    // backend
    // require user be logged in
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('unauthenticated', { status: 401 });
    }


    // backend
    // require request to contain name
    const body = await req.json();
    const { name } = body;
    if (!name) {
      return new NextResponse('name is required', { status: 400 });
    }

    
    // backend
    // require store id
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 });
    }


    // backend
    // prevent other users from updating billboards
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('unauthorized', { status: 403} )
    }


    // update stare in database and return it 
    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId: userId
      },
      data: {
        name
      }
    });
    return NextResponse.json(store);


  } catch (error) {
    
    console.log('[STORE_PATCH]', error);

    return new NextResponse('internal error', { status: 500});
  }
}

// hdnales deleting store from db
export async function DELETE (

  req: Request,
  { params }: { params: { storeId: string } }

) {

  try {


    // backend
    // require user be logged in
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('unauthenticated', { status: 401 });
    }


    // backend
    // require store id to be on url
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 });
    }


    // delete stare from database and return it 
    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId: userId
      }
    })
    return NextResponse.json(store);


  } catch (error) {
    
    console.log('[STORE_DELETE]', error);

    return new NextResponse('internal error', { status: 500});
  }
}