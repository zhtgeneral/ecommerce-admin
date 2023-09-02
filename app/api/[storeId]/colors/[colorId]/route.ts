// route for updating, deleting, and getting a color



import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



// gets a specific color from clors
export async function GET(
  
  req: Request,
  { params }: { params: { colorId: string } }

) {

  try {


    // don't require user login


    // require size id 
    if (!params.colorId) {
      return new NextResponse('color id is required', { status: 400 })
    }


    const colors = await prismadb.color.findFirst({
      where: {
        id: params.colorId
      },
    })
    return NextResponse.json(colors);


  } catch (error) {

    console.log('[SIZE_GET]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}


// updates a color and adds it back to all colors
export async function PATCH(
  
  req: Request,
  { params }: { params: { storeId: string, colorId: string } }

) {

  try {


    // require user login
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('authenticated', { status: 401 });
    }


    const body = await req.json();
    const { name, value } = body;


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


    // require color id
    if (!params.colorId) {
      return new NextResponse('color id is required', { status: 400 })
    }


    // prevent wrong user from creating color
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('unauthorized', { status: 403 })
    }


    const updatedColor = await prismadb.color.updateMany({
      where: {
        storeId: params.storeId,
        id: params.colorId
      },
      data: {
        name,
        value
      },
    })
    return NextResponse.json(updatedColor);


  } catch (error) {

    console.log('[COLOR_UPDATE]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}


// deletes a color from all colors
export async function DELETE(
  
  req: Request,
  { params }: { params: { storeId: string, colorId: string } }

) {

  try {


    // require user login
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('authenticated', { status: 401 });
    }


    // require color id
    if (!params.colorId) {
      return new NextResponse('size id is required ', { status: 400})
    }


    // require color id
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


    const deletedColor = await prismadb.color.delete({
      where: {
        id: params.colorId
      },
    })
    return NextResponse.json(deletedColor);


  } catch (error) {

    console.log('[COLOR_DELETE]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}
