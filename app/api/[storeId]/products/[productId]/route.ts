// route for updating, deleting, and getting a product



import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



// gets a product from all products
export async function GET(
  
  req: Request,
  { params }: { params: { productId: string } }

) {

  try {

    // require product id 
    if (!params.productId) {
      return new NextResponse('product id is required', { status: 400 })
    }


    const product = await prismadb.product.findFirst({
      where: {
        id: params.productId
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    })
    return NextResponse.json(product);


  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse('internal error', { status: 500 });
  }
}


// updates a product
export async function PATCH(
  
  req: Request,
  { params }: { params: { storeId: string, productId: string } }

) {

  try {


    // require user login
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('authenticated', { status: 403 });
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

    if (images.length == 0) {
      return new NextResponse('product images are required', { status: 400 });
    }

    // require store id
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 })
    }


    // require product id
    if (!params.productId) {
      return new NextResponse('product id is required', { status: 400 })
    }


    // prevent wrong user from creating billboard
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('unauthorized', { status: 405 })
    }


    await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived
      }
    });
    const updatedProduct = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { imageUrl: string }) => image),
            ],
          },
        },
      },
    });
    return NextResponse.json(updatedProduct);


  } catch (error) {
    console.log('[PRODUCTS_UPDATE]', error);
    return new NextResponse('internal error', { status: 500 });
  }
}


// gets all billboards
export async function DELETE(
  
  req: Request,
  { params }: { params: { storeId: string, productId: string } }

) {

  try {


    // require user login
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('authenticated', { status: 401 });
    }

    

    if (!params.productId) {
      return new NextResponse('product id is required', { status: 400})
    }

    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 })
    }


    // prevent wrong user from deleting product
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('unauthorized', { status: 403 })
    }


    const deletedProduct = await prismadb.product.delete({
      where: {
        id: params.productId
      },
    })
    return NextResponse.json(deletedProduct);


  } catch (error) {

    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse('internal error', { status: 500 });
  
  }
}
