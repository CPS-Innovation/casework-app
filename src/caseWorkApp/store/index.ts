import { create } from "zustand";

type StoreCWA = {
  activeTabId?: string;
  handleTabSelection: (documentId: string) => void;
};

export const useStoreCWA = create<StoreCWA>((set)=> ({
  handleTabSelection: (documentId: string) => set(() => ({ activeTabId: documentId}))
})) 