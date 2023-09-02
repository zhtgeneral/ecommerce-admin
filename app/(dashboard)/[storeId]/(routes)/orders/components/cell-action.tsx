// cell action for a data table



import { Button } from "@/components/ui/button"
import { BillboardColumn } from "./columns"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import axios from "axios"
import { useState } from "react"
import { AlertModal } from "@/components/modals/alert-modal"




interface CellActionProps {
  billboard: BillboardColumn
}


export const CellAction: React.FC<CellActionProps> = ({

  billboard

}) => {


  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);


  const copyIdToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('billboard id copied to clipboard')
  }


  const deleteBillboard = async (id: string) => {

    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/billboards/${id}`);
      router.refresh();
      toast.success('billboard successfully deleted');

    } catch (error) {

      toast.error('make sure all categories are deleted first');
    }
  }


  // visual
  return (
    <>
      {/* are you sure to delete billboard */}
      <AlertModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={() => deleteBillboard(billboard.id)}
        loading={loading}        
      />


      <DropdownMenu>

        {/* dropdown button */}
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='w-8 h-8 p-0'>
            <span className='sr-only'>open menu</span>
            <MoreHorizontal className='w-4 h-4' />
          </ Button>
        </DropdownMenuTrigger>

        {/* dropdown content */}
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => copyIdToClipboard(billboard.id)}>
            <Copy className='mr-2 h-4 w-4' />
            Copy id
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/billboards/${billboard.id}`)}>
            <Edit className='mr-2 h-4 w-4'/>
            Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setDeleteModalOpen(true)}>
            <Trash className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
