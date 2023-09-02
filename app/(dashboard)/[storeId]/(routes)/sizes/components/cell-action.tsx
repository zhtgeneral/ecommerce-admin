// cell action for a data table



import { Button } from "@/components/ui/button"
import { SizeColumn } from "./columns"

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
  size: SizeColumn
}


export const CellAction: React.FC<CellActionProps> = ({

  size

}) => {


  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);


  const copyIdToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('size id copied to clipboard')
  }


  const deleteSize = async (id: string) => {

    try {

      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${size.id}`);
      router.refresh();
      toast.success('size successfully deleted');

    } catch (error) {
      toast.error('make sure all products are deleted first');
    } finally {
      setLoading(false);
    }
  }


  // visual
  return (
    <>
      {/* are you sure to delete billboard */}
      <AlertModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={() => deleteSize(size.id)}
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

          <DropdownMenuItem onClick={() => copyIdToClipboard(size.id)}>
            <Copy className='mr-2 h-4 w-4' />
            Copy id
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/sizes/${size.id}`)}>
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
