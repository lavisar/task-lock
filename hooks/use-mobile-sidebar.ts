import { create } from "zustand";

type MobileSidebarStore = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
};
// shorthand (() => ({})) for return obj -> like (() => { return {obj} })
export const useMobileSidebar = create<MobileSidebarStore>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));

