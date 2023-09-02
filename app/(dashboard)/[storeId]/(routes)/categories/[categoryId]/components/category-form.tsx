// create/ update /edit category form



'use client'

import { Billboard, Category, Store } from "@prisma/client";
import { Trash } from "lucide-react";
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"




// create type for form (front end validation)
const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Category name must be at least 1 character'
  }),
  billboardId: z.string().min(1, {
    message: 'Billboard id must be at least 1 character'
  }),
})
type SettingsFormValues = z.infer<typeof formSchema>;


// allows CategoryForm component to accept billboard as a parameter
interface CategoryFormProps {
  category: Category | null;
  billboards: Billboard[]
}


// component
const CategoryForm: React.FC<CategoryFormProps> = ({

  category,
  billboards

}) => {


  // having no billboard is possible, so display different messages
  const editOrCreateTitle = category ? 'Edit category' : 'Create category'
  const editOrCreatedescription = category ? 'Edit a category' : 'Create a category'
  const updatedOrCreatedMessage = category ? 'Category updated' : 'category created'
  const saveChangeOrCreateOfButton = category ? 'Save changes' : 'Create'


  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();


  // create form (using shadcn documentation)
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: category || {
      name: '',
      billboardId: ''
    },
  })


  // uses api
  // update changes to billboard
  const updateOrCreateCategory = async (data: SettingsFormValues) => {
    
    try {

      setLoading(true);


      if (category) {
        await axios.patch(`/api/${params.storeId}/categories/${params.billboardId}`, data);  
      } 

      if (!category) {
        await axios.post(`/api/${params.storeId}/categories`, data)
      }
      
      router.refresh();
      router.push(`/${params.storeId}/categories`)
      toast.success(`${updatedOrCreatedMessage}`);

    } catch (error) {

      toast.error('something went wrong')
    } finally {

      setLoading(false);
    }
  }


  // use api
  // deletes billboard
  const deleteCategory = async () => {

    try {

      setLoading(true);
      await axios.delete(`/api/${params.storeId}/categories/${params.billboardId}`);
      router.refresh();
      toast.success('category successfully deleted');
      router.push(`/${params.storeId}/categories`)

    } catch (error) {

      toast.error('make sure billboard id is deleted first');
    } finally {

      setLoading(false);
    }
  }


  // display
  return (
    <>

    {/* are you sure to delete category */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteCategory}
        loading={false}      
      />


      {/* Edit/create, desc, delete button */}
      <div className='flex items-center justify-between'>
        
          <Heading 
            title={editOrCreateTitle}
            description={editOrCreatedescription}
          />

          {category && (
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
        <form onSubmit={form.handleSubmit(updateOrCreateCategory)} className='space-y-8 w-full'>


          {/* custom */}
          {/* allows for multiple inputs */}
          <div className='grid grid-cols-3 gap-8'>


            {/* edit name */}
            <FormField
              control={form.control}

              name='name'
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Category name</FormLabel>

                  <FormControl>
                    <Input disabled={loading} placeholder="Category name" {...field} />
                  </FormControl>

                  <FormMessage>
                  </FormMessage>

                </FormItem>
              )}  
            />

            {/* select billboard for category*/}
            <FormField
              control={form.control}

              name='billboardId'
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Billboard</FormLabel>

                  <FormControl>
                    <Select
                      disabled={loading}  
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a billboard" defaultValue={field.value} />
                      </SelectTrigger>

                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem 
                            value={billboard.id}
                             key={billboard.id}
                          >
                            <div className='m-y-2'>
                              {billboard.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                  </FormControl>

                  <FormMessage>
                  </FormMessage>

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

export default CategoryForm;