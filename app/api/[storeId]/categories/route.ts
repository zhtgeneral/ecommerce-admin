// route for posting a category and getting all categories



import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



// creates a category
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
    const { name, billboardId } = body;


    // require category name
    if (!name) {
      return new NextResponse('category name is required', { status: 400 });
    }


    // require billboard id
    if (!billboardId) {
      return new NextResponse('category id is required', { status: 400 });
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


    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId
      },
    })
    return NextResponse.json(category);


  } catch (error) {

    console.log('[CATEGORIES_POST]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}


// gets all categories
export async function GET(
  
  req: Request,
  { params }: { params: { storeId: string } }

) {

  try {


    // require store id
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 })
    }


    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId
      },
    })
    return NextResponse.json(categories);


  } catch (error) {

    console.log('[CATEGORIES_GET]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}
