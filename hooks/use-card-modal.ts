import { create } from 'zustand'

type CardModalStore = {
  id?: string
  isOpen: boolean
  onOpen: (id: string) => void
  onClose: () => void
}
// shorthand (() => ({})) for return obj -> like (() => { return {obj} })
export const useCardModal = create<CardModalStore>(set => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined })
}))
