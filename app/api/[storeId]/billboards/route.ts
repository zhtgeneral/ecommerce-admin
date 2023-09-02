// route for posting a billboard and getting all billboards



import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



// creates a billboard
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


    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId
      },
    })
    return NextResponse.json(billboard);


  } catch (error) {

    console.log('[BILLBOARDS_POST]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}


// gets all billboards
export async function GET(
  
  req: Request,
  { params }: { params: { storeId: string } }

) {

  try {


    // require store id
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 })
    }


    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId
      },
    })
    return NextResponse.json(billboards);


  } catch (error) {

    console.log('[BILLBOARDS_GET]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}
