// route for posting a product and getting all products



import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



// creates a product
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
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
      images
    } = body;


    // require product name
    if (!name) {
      return new NextResponse('product name is required', { status: 400 });
    }

    if (!price) {
      return new NextResponse('product price is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('product category is required', { status: 400 });
    }

    if (!colorId) {
      return new NextResponse('product color is required', { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse('product size is required', { status: 400 });
    }

    if (images.length === 0) {
      return new NextResponse('product images are required', { status: 400 });
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


    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: params.storeId
      },
    })
    return NextResponse.json(product);


  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}


// gets all products
export async function GET(
  
  req: Request,
  { params }: { params: { storeId: string } }

) {

  try {

    // make filtering predoucts possible
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    // require store id
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 })
    }


    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    return NextResponse.json(products);


  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}
