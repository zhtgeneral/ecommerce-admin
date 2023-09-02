// product edit/create form visual (the child part)



'use client'

import { Product, Image, Category, Color, Size } from "@prisma/client";
import { Trash } from "lucide-react";
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, usePathname, useRouter } from "next/navigation";
import axios from "axios";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUploader from "@/components/ui/image-uploader";
import { Checkbox } from "@/components/ui/checkbox";



// create type for form (front end validation)
const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Product name must be at least 1 character'
  }),
  images: z.object( { imageUrl: z.string() }).array(),
  price: z.coerce.number().min(1, {
    message: 'Product price must be at least 1 number'
  }),
  categoryId: z.string().min(1, {
    message: 'Product category must be a valid category'
  }),
  colorId: z.string().min(1, {
    message: 'Product color must be a valid color'
  }),
  sizeId: z.string().min(1, {
    message: 'Product size must be a valid size'
  }),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional()
  

})
type ProductFormValues = z.infer<typeof formSchema>;


// allows ProductsForm component to accept parameters
interface ProductFormProps {
  product: Product & {
    images: Image[]
  } | null;
  categories: Category[],
  colors: Color[],
  sizes: Size[] 
}


// component
const ProductForm: React.FC<ProductFormProps> = ({

  product,
  categories,
  colors,
  sizes

}) => {


  // having no product is possible, so display different messages
  const editOrCreateTitle = product ? 'Edit product' : 'Create product'
  const editOrCreatedescription = product ? 'Edit a product' : 'Create a product'
  const updatedOrCreatedMessage = product ? 'product updated' : 'product created'
  const saveChangeOrCreateOfButton = product ? 'Save changes' : 'Create'


  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();


  // create form (using shadcn documentation)
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: product ? {
      ...product,
      price: parseFloat(String(product?.price)),
    } : {
      name: '',
      images: [],
      price: 0,
      categoryId: '',
      colorId: '',
      sizeId: '',
      isFeatured: false,
      isArchived: false,
    },
  })


  // uses api
  // update changes to product
  const updateOrCreateProduct = async (data: ProductFormValues) => {
    
    try {

      setLoading(true);

      if (product) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);  
      } 

      if (!product) {
        await axios.post(`/api/${params.storeId}/products`, data)
      }
      
      router.refresh();
      router.push(`/${params.storeId}/products`)
      toast.success(`${updatedOrCreatedMessage}`);

    } catch (error) {

      toast.error('something went wrong')
    } finally {

      setLoading(false);
    }
  }


  // use api
  // deletes product
  const deleteProduct = async () => {

    try {

      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      toast.success('product successfully deleted');
      router.push(`/${params.storeId}/products`)

    } catch (error) {
      toast.error('something went wrong');
    } finally {
      setLoading(false);
    }
  }


  // display
  return (
    <>

    {/* are you sure to delete product */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteProduct}
        loading={false}      
      />


      {/* Edit/create, desc, delete button */}
      <div className='flex items-center justify-between'>
        
          <Heading 
            title={editOrCreateTitle}
            description={editOrCreatedescription}
          />

          {product && (
            <Button
              disabled={loading}
              variant='destructive'
              size='icon'
              onClick={() => setOpen(true)} 
            >
              <Trash className='h-4 w-4' />
            </Button>
            )
          }
      </div>


      {/* form from shadcn documentation */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(updateOrCreateProduct)} className='space-y-8 w-full'>


            {/* Image and upload image widget */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>

                  <FormControl>
                    <ImageUploader 
                      urls={field.value.map((image) => image.imageUrl)}
                      disabled={loading}
                      onChange={(imageUrl) => field.onChange([...field.value, { imageUrl }])}
                      onRemove={(imageUrl) => field.onChange([...field.value.filter((current) => current.imageUrl !== imageUrl)])}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}  
            />


          {/* custom */}
          {/* allows for multiple inputs */}
          <div className='grid grid-cols-3 sm-grid-cols-2 gap-8'>


            {/* edit name */}
            <FormField
              control={form.control}

              name='name'
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Product name</FormLabel>

                  <FormControl>
                    <Input disabled={loading} placeholder="Product name" {...field} />
                  </FormControl>

                  <FormMessage>
                  </FormMessage>

                </FormItem>
              )}  
            />


            {/* edit price */}
            <FormField
              control={form.control}

              name='price'
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Product price</FormLabel>

                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="0.00" {...field} />
                  </FormControl>

                  <FormMessage>
                  </FormMessage>

                </FormItem>
              )}  
            />


            {/* select a category */}
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Category</FormLabel>
                  
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue 
                          placeholder="Select a category" 
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage>
                  </FormMessage>

                </FormItem>
              )}  
            />


            {/* select a color */}
            <FormField
              control={form.control}
              name='colorId'
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Color</FormLabel>
                  
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue 
                          placeholder="Select a color" 
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem
                          key={color.id}
                          value={color.id}
                        >
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage>
                  </FormMessage>

                </FormItem>
              )}  
            />


            {/* select a size */}
            <FormField
              control={form.control}
              name='sizeId'
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Size</FormLabel>
                  
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue 
                          placeholder="Select a size" 
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem
                          key={size.id}
                          value={size.id}
                        >
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage>
                  </FormMessage>

                </FormItem>
              )}  
            />


            {/* select is featured */}
            <FormField
              control={form.control}
              name='isFeatured'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>

                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>This product will appear on the home page</FormDescription>
                  </div>

                  <FormMessage />

                </FormItem>
              )}  
            />


            {/* select is archived */}
            <FormField
              control={form.control}
              name='isArchived'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>

                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>This product will not be visible to users</FormDescription>
                  </div>

                  <FormMessage />

                </FormItem>
              )}  
            />



          </div>

          <Button disabled={loading} type='submit'>{saveChangeOrCreateOfButton}</Button>

        </form>
      </Form>

    </>
  )
}

export default ProductForm;