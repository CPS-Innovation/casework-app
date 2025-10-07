import { create } from 'zustand';

import { CaseMaterialsType } from '../schemas/caseMaterials';

type SelectedItemsDefaultState = {
  communications: CaseMaterialsType[];
  materials: CaseMaterialsType[];
};

type SelectedItemKeys = keyof SelectedItemsDefaultState;

type SelectedItemsStore = {
  items: SelectedItemsDefaultState;
  addItems: (items: CaseMaterialsType[], type: SelectedItemKeys) => void;
  removeItems: (items: CaseMaterialsType[], type: SelectedItemKeys) => void;
  clear: (type?: SelectedItemKeys) => void;
};

const defaultState: SelectedItemsDefaultState = {
  communications: [],
  materials: []
};

export const useSelectedItemsStore = create<SelectedItemsStore>((set) => ({
  items: { ...defaultState },

  addItems: (items, type) =>
    set((state) => ({
      items: { ...state.items, [type]: [...state.items[type], ...items] }
    })),

  removeItems: (itemsToRemove, type) =>
    set((state) => {
      const idsToRemove = new Set(itemsToRemove.map((item) => item.id));

      return {
        items: {
          ...state.items,
          [type]: state.items[type].filter((item) => !idsToRemove.has(item.id))
        }
      };
    }),

  clear: (type) => {
    if (type) {
      set((state) => ({ items: { ...state.items, [type]: [] } }));
    } else {
      set(() => ({ items: { ...defaultState } }));
    }
  }
}));
