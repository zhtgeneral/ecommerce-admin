// route for posting a size and getting all colors



import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



// creates a color and adds to colors
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


    // require color name
    if (!name) {
      return new NextResponse('color name is required', { status: 400 });
    }


    // require color value
    if (!value) {
      return new NextResponse('color value is required', { status: 400 });
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


    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId
      },
    })
    return NextResponse.json(color);


  } catch (error) {

    console.log('[COLORS_POST]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}


// gets all colors from colors
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


    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId
      },
    })
    return NextResponse.json(colors);


  } catch (error) {

    console.log('[COLORS_GET]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}
