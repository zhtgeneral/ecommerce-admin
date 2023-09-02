// sets logic for store-modal (the visual component)



import { create } from 'zustand'



interface useStoreModalStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}


export const useStoreModal = create<useStoreModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false}),
}))