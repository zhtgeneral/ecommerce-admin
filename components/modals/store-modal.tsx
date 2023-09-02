// shows create a store in a dialog form (a modal)



"use client"

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input' 
import { useStoreModal } from '@/hooks/use-store-modal'
import { Modal } from '@/components/ui/modal'



// form validation
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Store name must be at least 1 character"
  }).max(50, {
    message: "Store name must be maximum 50 characters"
  })
})


export const StoreModal = () => {


  // require logic for displaying which store
  const storeModal = useStoreModal();


  const [loading, setLoading] = useState(false);


  // from shadcn documentation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    }
  })


  // handle submit
  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    try {


      setLoading(true);


      // require backend
      const response = await axios.post('/api/stores', values);
      

      console.log(response.data);
      window.location.assign(`/${response.data.id}`);

    } catch (error) {

      toast.error("Something went wrong");

      console.log(error)
    } finally {

      setLoading(false);
    }
  }


  // visual from shadcn documentation
  return (


    // create store popup 
    <Modal 
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {... form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter a name"
                        {... field}
                        disabled={loading} />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />


              {/* cancel and continur buttons */}
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button 
                  type="reset"
                  variant="outline"
                  onClick={storeModal.onClose}
                  disabled={loading}
                >
                Cancel
                </Button>

                <Button type="submit" disabled={loading}>Continue</Button>
              </div>

            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};