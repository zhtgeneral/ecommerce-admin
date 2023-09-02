// settings form visual (the child part)



'use client'

import { Store } from "@prisma/client";
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



// create type for form
const formSchema = z.object({
  name: z.string().min(1, {
    message: 'New store name must be at least 1 character'
  }),
})
type SettingsFormValues = z.infer<typeof formSchema>;


// allows SettingsForm component to accept store as a parameter
interface SettingsFormProps {
  store: Store;
}


// component
const SettingsForm: React.FC<SettingsFormProps> = ({

  store

}) => {


  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();


  // create form (using shadcn documentation)
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: store,
  })


  // uses api
  // update changes to store
  const onSubmit = async (data: SettingsFormValues) => {

    try {

      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("store updated");

    } catch (error) {

      toast.error('something went wrong')
    } finally {

      setLoading(false);
    }
  }


  // use api
  // deletes store
  const onDelete = async () => {

    try {

      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      toast.success('store successfully deleted');

    } catch (error) {

      toast.error('All products and categories need to be deleted first');
    } finally {

      setLoading(false);
    }
  }


  // display
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={false}      
      />


      {/* Settings, desc, delete button */}
      <div className='flex items-center justify-between'>
        
          <Heading 
            title="Settings"
            description="change preferences of store"
          />

          <Button
            disabled={loading}
            variant='destructive'
            size='icon'
            onClick={() => setOpen(true)} 
          >
            <Trash className='h-4 w-4' />
          </Button>
      </div>


      <Separator />


      {/* form from shadcn documentation */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>

          {/* custom */}
          {/* allows for multiple inputs */}
          <div className='grid grid-cols-3 gap-8'>

            {/* 1 field */}
            <FormField
              control={form.control}

              // takes control of formSchema.name and autofills it
              name='name'
              
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Store Name</FormLabel>

                  <FormControl>
                    <Input disabled={loading} placeholder="Store name" {...field} />
                  </FormControl>

                  <FormMessage>
                  </FormMessage>

                </FormItem>
              )}  
            />
          </div>

          <Button disabled={loading} type='submit'>Submit</Button>

        </form>
      </Form>


      <Separator />


      {/* shows api routes */}
      <ApiAlert 
        title="NEXT_PUBLIC_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />

    </>
  )
}

export default SettingsForm;