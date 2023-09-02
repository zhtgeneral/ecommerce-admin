// settings form visual (the child part)



'use client'

import { Billboard, Store } from "@prisma/client";
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
  label: z.string().min(1, {
    message: 'Billboard name must be at least 1 character'
  }),
  imageUrl: z.string().min(1, {
    message: 'Must have image url'
  }),
})
type SettingsFormValues = z.infer<typeof formSchema>;


// allows SettingsForm component to accept billboard as a parameter
interface SettingsFormProps {
  billboard: Billboard | null;
}


// component
const BillboardForm: React.FC<SettingsFormProps> = ({

  billboard

}) => {


  // having no billboard is possible, so display different messages
  const editOrCreateTitle = billboard ? 'Edit billboard' : 'Create billboard'
  const editOrCreatedescription = billboard ? 'Edit a billboard' : 'Create a billboard'
  const updatedOrCreatedMessage = billboard ? 'Billboard updated' : 'Billboard created'
  const saveChangeOrCreateOfButton = billboard ? 'Save changes' : 'Create'


  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();


  // create form (using shadcn documentation)
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: billboard || {
      label: '',
      imageUrl: ''
    },
  })


  // uses api
  // update changes to billboard
  const updateBillboard = async (data: SettingsFormValues) => {
    
    try {

      setLoading(true);


      if (billboard) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);  
      } 

      if (!billboard) {
        await axios.post(`/api/${params.storeId}/billboards`, data)
      }
      
      router.refresh();
      router.push(`/${params.storeId}/billboards`)
      toast.success(`${updatedOrCreatedMessage}`);

    } catch (error) {

      toast.error('something went wrong')
    } finally {

      setLoading(false);
    }
  }


  // use api
  // deletes billboard
  const deleteBillboard = async () => {

    try {

      setLoading(true);
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      router.refresh();
      toast.success('billboard successfully deleted');
      router.push(`/${params.storeId}/billboards`)

    } catch (error) {

      toast.error('make sure all categories are deleted first');
    } finally {

      setLoading(false);
    }
  }


  // display
  return (
    <>

    {/* are you sure to delete billboard */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteBillboard}
        loading={false}      
      />


      {/* Edit/create, desc, delete button */}
      <div className='flex items-center justify-between'>
        
          <Heading 
            title={editOrCreateTitle}
            description={editOrCreatedescription}
          />

          {billboard && (
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
        <form onSubmit={form.handleSubmit(updateBillboard)} className='space-y-8 w-full'>


            {/* Image and upload image widget */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard image</FormLabel>

                  <FormControl>
                    <ImageUploader 
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                      urls={field.value ? [field.value] : []}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}  
            />


          {/* custom */}
          {/* allows for multiple inputs */}
          <div className='grid grid-cols-3 gap-8'>


            {/* edit name */}
            <FormField
              control={form.control}

              name='label'
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Billboard Label</FormLabel>

                  <FormControl>
                    <Input disabled={loading} placeholder="Billboard name" {...field} />
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

export default BillboardForm;