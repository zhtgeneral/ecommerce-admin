// color form visual (the child part)



'use client'

import { Color } from "@prisma/client";
import { Trash } from "lucide-react";
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
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
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, usePathname, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUploader from "@/components/ui/image-uploader";



// create type for form (front end validation)
const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Color name must be at least 1 character'
  }),
  value: z.string().min(4, {
    message: 'Color Value must be at least 4 characters'
  }).regex(/^#/, {
    message: 'Color value must be a valid hex'
  }),
})
type ColorFormValues = z.infer<typeof formSchema>;


// allows ColorForm component to accept color as a parameter
interface ColorFormProps {
  color: Color | null;
}


// component
const ColorForm: React.FC<ColorFormProps> = ({

  color

}) => {


  // having no billboard is possible, so display different messages
  const editOrCreateTitle = color ? 'Edit Color' : 'Create Color'
  const editOrCreatedescription = color ? 'Edit a Color' : 'Create a Color'
  const updatedOrCreatedMessage = color ? 'Color updated' : 'Color created'
  const saveChangeOrCreateOfButton = color ? 'Save changes' : 'Create'


  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();


  // create form (using shadcn documentation)
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: color || {
      name: '',
      value: ''
    },
  })


  // uses api
  // update changes to color
  const updateOrCreateSize = async (data: ColorFormValues) => {
    
    try {

      setLoading(true);


      if (color) {
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);  
      } 

      if (!color) {
        await axios.post(`/api/${params.storeId}/colors`, data)
      }
      
      router.refresh();
      router.push(`/${params.storeId}/colors`)
      toast.success(`${updatedOrCreatedMessage}`);

    } catch (error) {

      toast.error('something went wrong')
    } finally {

      setLoading(false);
    }
  }


  // use api
  // deletes color
  const deleteColor = async () => {

    try {

      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      toast.success('color successfully deleted');
      router.push(`/${params.storeId}/colors`)

    } catch (error) {

      toast.error('make sure all products are deleted first');
    } finally {

      setLoading(false);
    }
  }


  // display
  return (
    <>

    {/* are you sure to delete color */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteColor}
        loading={false}      
      />


      {/* Edit/create, desc, delete button */}
      <div className='flex items-center justify-between'>
        
          <Heading 
            title={editOrCreateTitle}
            description={editOrCreatedescription}
          />

          {color && (
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
        <form onSubmit={form.handleSubmit(updateOrCreateSize)} className='space-y-8 w-full'>


          {/* custom */}
          {/* allows for multiple inputs */}
          <div className='grid grid-cols-3 gap-8'>


            {/* edit color name */}
            <FormField
              control={form.control}

              name='name'
              render={({ field }) => (
                <FormItem>

                  <FormLabel>name</FormLabel>

                  <FormControl>
                    <Input disabled={loading} placeholder="Color name" {...field} />
                  </FormControl>

                  <FormMessage>
                  </FormMessage>

                </FormItem>
              )}  
            />

            {/* edit color value */}
            <FormField
            control={form.control}

            name='value'
            render={({ field }) => (
              <FormItem>

                <FormLabel>value</FormLabel>

                <FormControl>
                  <div className='flex items-center gap-x-4'>
                    <Input disabled={loading} placeholder="Color value" {...field} />

                    <div 
                      className='border p-4 rounded-full'
                      style={{ backgroundColor: field.value}}
                    />
                  </div>
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

export default ColorForm;