// sizes form visual (the child part)



'use client'

import { Size } from "@prisma/client";
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
    message: 'Size name must be at least 1 character'
  }),
  value: z.string().min(1, {
    message: 'Size Value must be at least 1 character'
  }),
})
type SettingsFormValues = z.infer<typeof formSchema>;


// allows SettingsForm component to accept size as a parameter
interface SettingsFormProps {
  size: Size | null;
}


// component
const SizeForm: React.FC<SettingsFormProps> = ({

  size

}) => {


  // having no billboard is possible, so display different messages
  const editOrCreateTitle = size ? 'Edit Size' : 'Create Size'
  const editOrCreatedescription = size ? 'Edit a Size' : 'Create a Size'
  const updatedOrCreatedMessage = size ? 'Size updated' : 'Size created'
  const saveChangeOrCreateOfButton = size ? 'Save changes' : 'Create'


  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();


  // create form (using shadcn documentation)
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: size || {
      name: '',
      value: ''
    },
  })


  // uses api
  // update changes to billboard
  const updateOrCreateSize = async (data: SettingsFormValues) => {
    
    try {

      setLoading(true);


      if (size) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);  
      } 

      if (!size) {
        await axios.post(`/api/${params.storeId}/sizes`, data)
      }
      
      router.refresh();
      router.push(`/${params.storeId}/sizes`)
      toast.success(`${updatedOrCreatedMessage}`);

    } catch (error) {

      toast.error('something went wrong')
    } finally {

      setLoading(false);
    }
  }


  // use api
  // deletes billboard
  const deleteSize = async () => {

    try {

      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      toast.success('size successfully deleted');
      router.push(`/${params.storeId}/sizes`)

    } catch (error) {

      toast.error('make sure all products are deleted first');
    } finally {

      setLoading(false);
    }
  }


  // display
  return (
    <>

    {/* are you sure to delete size */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteSize}
        loading={false}      
      />


      {/* Edit/create, desc, delete button */}
      <div className='flex items-center justify-between'>
        
          <Heading 
            title={editOrCreateTitle}
            description={editOrCreatedescription}
          />

          {size && (
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


            {/* edit size name */}
            <FormField
              control={form.control}

              name='name'
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Size name</FormLabel>

                  <FormControl>
                    <Input disabled={loading} placeholder="Size name" {...field} />
                  </FormControl>

                  <FormMessage>
                  </FormMessage>

                </FormItem>
              )}  
            />

            {/* edit size value */}
            <FormField
            control={form.control}

            name='value'
            render={({ field }) => (
              <FormItem>

                <FormLabel>Size value</FormLabel>

                <FormControl>
                  <Input disabled={loading} placeholder="Size value" {...field} />
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

export default SizeForm;