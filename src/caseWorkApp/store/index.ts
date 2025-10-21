import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ClientLockedState =
  | 'unlocked'
  | 'locking'
  | 'locked'
  | 'unlocking'
  | 'locked-by-other-user';

export type CaseDocumentViewModel = {
  documentId: string;
  saveStatus:
    | { type: 'redaction' | 'rotation'; status: 'saving' | 'saved' | 'error' }
    | { type: 'none'; status: 'initial' };
  isDeleted: boolean;
  url: string | undefined;
  areaOnlyRedactionMode: boolean;
  redactionHighlights: any[];
  pageDeleteRedactions: any[];
  pageRotations: any[];
  rotatePageMode: boolean;
  deletePageMode: boolean;
  clientLockedState: // note: unlocked is just the state where the client doesn't know yet
  //  (might be locked on the server, we haven't interacted yet)
  ClientLockedState;
} & (
  | { mode: 'read' }
  | {
      mode: 'search';
      searchTerm: string;
      occurrencesInDocumentCount: number;
      searchHighlights: any[];
    }
);

type StoreCWA = {
  documentId?: string;
  activeTabId?: string;
  tabsState: {
    items: CaseDocumentViewModel[];
    headers: HeadersInit;
    activeTabId?: string;
  };
  handleTabSelection: (documentId: string) => void;
  handleClosePdf: (documentId: string, versionId: number, pdfId?: string) => void;
};



export const useStoreCWA = create<StoreCWA>(
  // @ts-ignore-next-line
  devtools((set) => ({
    handleTabSelection: (documentId: string) => set((state) => ({
      tabsState:
      {...state.tabsState,activeTabId: documentId}
    })),
    handleClosePdf: (documentId: string, versionId: number, pdfId?: string) => set((state) => ({
        tabsState: {
          ...state.tabsState,  
          items: state.tabsState.items.filter(
            (item) => item.documentId !== pdfId
          ),
        },
    }))
  }))
);