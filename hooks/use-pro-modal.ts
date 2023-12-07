import { create } from 'zustand'

type ProModalStore = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}
// shorthand (() => ({})) for return obj -> like (() => { return {obj} })
export const useProModal = create<ProModalStore>(set => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}))
