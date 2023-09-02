// route for updating, deleting, and getting a category



import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



// gets a category from all categories
export async function GET(
  
  req: Request,
  { params }: { params: { categoryId: string } }

) {

  try {

    // require category id 
    if (!params.categoryId) {
      return new NextResponse('category id is required', { status: 400 })
    }


    const category = await prismadb.category.findFirst({
      where: {
        id: params.categoryId
      },
      include: {
        billboard: true
      }
    })
    return NextResponse.json(category);


  } catch (error) {

    console.log('[CATEGORY_GET]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}


// updates a category from all categories
export async function PATCH(
  
  req: Request,
  { params }: { params: { storeId: string, categoryId: string } }

) {

  try {


    // require user login
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('authenticated', { status: 401 });
    }


    const body = await req.json();
    const { name, billboardId } = body;


    // require category name
    if (!name) {
      return new NextResponse('category name is required', { status: 400 });
    }


    // require billboard id
    if (!billboardId) {
      return new NextResponse('billboard id is required', { status: 400 });
    }


    // require store id
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 })
    }


    // require category id
    if (!params.categoryId) {
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


    const updatedCategory = await prismadb.category.updateMany({
      where: {
        storeId: params.storeId,
        id: params.categoryId
      },
      data: {
        name,
        billboardId
      },
    })
    return NextResponse.json(updatedCategory);


  } catch (error) {

    console.log('[CATEGORY_UPDATE]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}


// deletes a category from all categories
export async function DELETE(
  
  req: Request,
  { params }: { params: { storeId: string, categoryId: string } }

) {

  try {


    // require user login
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('authenticated', { status: 401 });
    }


    // require store id
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 })
    }


    // require category id
    if (!params.categoryId) {
      return new NextResponse('category id is required', { status: 400})
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


    const deletedCategories = await prismadb.category.delete({
      where: {
        id: params.categoryId
      },
    })
    return NextResponse.json(deletedCategories);


  } catch (error) {

    console.log('[CATEGORY_DELETE]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}
