import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { create } from "zustand";

type StoreCWA = {
  documentId?: string;
  activeTabId?: string;
  tabsState: {
    items: CaseDocumentViewModel[];
    headers: HeadersInit;
    activeTabId?: string;
  };
  handleTabSelection: (documentId: string) => void;
  // handleClosePdf: (documentId: string, versionId: number, pdfId?: string) => void;
};



export const useStoreCWA = create<StoreCWA>(
  // @ts-ignore-next-line
  devtools((set) => ({
    handleTabSelection: (documentId: string) => set((state) => ({
      tabsState:
      {...state.tabsState,activeTabId: documentId}
    }))
  }))
);
