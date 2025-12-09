import { create } from 'zustand';

import { CaseInfoType } from '../schemas/caseinfo';

type CaseStore = {
  caseInfo: CaseInfoType | null;
  setCaseInfo: (info: CaseInfoType) => void;
  clearCaseInfo: () => void;
};

export const useCaseInfoStore = create<CaseStore>((set) => ({
  caseInfo: null,

  setCaseInfo: (info) => set(() => ({ caseInfo: info })),

  clearCaseInfo: () => set(() => ({ caseInfo: null }))
}));
