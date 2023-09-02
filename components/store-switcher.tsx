// store switcher component using popover and command



'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
import { Store as StoreIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Store } from '@prisma/client'
import { useStoreModal } from '@/hooks/use-store-modal'
import { useParams, useRouter } from 'next/navigation'



// we need the classNames, styles... inside of storeswitcher component
type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>


interface StoreSwitcherProps extends PopoverTriggerProps {
  stores: Store[]; 
};


// uses StoreSwitcherProps which inherits the props from popovertrigger
export function StoreSwitcher({

  className,
  stores = []

}: StoreSwitcherProps) {


  const StoreModal = useStoreModal(); 
  const params = useParams(); 
  const router = useRouter(); 
  const [open, setOpen] = React.useState(false);


  const formattedStores = stores.map((store) => ({
    label: store.name, 
    value: store.id,
  }))


  const currentStore = formattedStores.find((store) => store.value === params.storeId)

  
  // uses backend
  // sends us to a url with the storeId (need to create api endpoint)
  const onStoreSelect = (store: { value: string, label: string}) => {
    setOpen(false);
    router.push(`/${store.value}`);
  }


  // visual from shadcn documentation
  return (

    <Popover open={open} onOpenChange={setOpen}>


      {/* button */}
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          role='combobox'
          aria-expanded={open}
          aria-label={'select a store'}
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className='mr-2 h-4 w-4' />
          {currentStore?.label}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>


      {/* pop up content */}
      <PopoverContent className='w-[200px] p-0'>
        <Command>

          {/* top half */}
          <CommandList>
            <CommandInput placeholder="search store..." />

            <CommandEmpty>No store found.</CommandEmpty>

            {/* displays all stores */}
            <CommandGroup heading='Stores'>
              {formattedStores.map((store) => (

                // displays 1 store
                <CommandItem
                  key={store.value}
                  onSelect={() => {onStoreSelect(store)}}
                  className='text-sm'
                >  
                  <StoreIcon className='mr-2 w-4 h-4' />
                  {store.label}
                  <Check 
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentStore?.value  === store.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>


          <CommandSeparator />


          {/* bottom half */}
          <CommandList>

            {/* displays add store modal */}
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  StoreModal.onOpen();
                }}
              >
                <PlusCircle className='mr-2 h-5 w-5'/>
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>

        </Command>
      </PopoverContent>

      
    </Popover>
  )
}

