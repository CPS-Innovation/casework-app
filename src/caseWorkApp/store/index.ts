import { create } from "zustand";

type StoreCWA = {
  activetabId?: string | number;
  handleTabSelection: (documentId: string) => void;
};

export const useStoreCWA = create<StoreCWA>((set)=> ({
  handleTabSelection: (documentId: string) => set(() => ({ activetabId: documentId}))
})) 