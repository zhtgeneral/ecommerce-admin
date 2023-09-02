// shows are you sure (cancel, delete) by reusing modal (just a dialog) from @/components/ui/modal



import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";



interface AlterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}


export const AlertModal: React.FC<AlterModalProps> = ({

  isOpen,
  onClose,
  onConfirm,
  loading

}) => {


  // always keep the backend and the front end in sync
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, [])
  if (!isMounted) {
    return null;
  }


  // visual
  return (
    <Modal 
      title="Are you sure?"
      description='This action cannot be undone' 
      isOpen={isOpen}
      onClose={onClose}      
    >
      <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
        <Button variant="outline" disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button variant='destructive' disabled={loading} onClick={onConfirm} >
          Continue
        </Button>
      </div>
    </Modal>
  )


}