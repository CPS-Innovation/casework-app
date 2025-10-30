import { create } from 'zustand';

import { StatusTag } from '../schemas';

type MaterialTagItem = { materialId: number; tagName: StatusTag };

type MaterialTagsStore = {
  materialTags: MaterialTagItem[];
  setTags: (newMaterialTags: MaterialTagItem[]) => void;
  clearTags: (materialIdsToRemove?: number[]) => void;
};

export const useMaterialTags = create<MaterialTagsStore>((set) => ({
  materialTags: [],

  setTags: (newMaterialTags) =>
    set((state) => {
      const combinedTags = [...state.materialTags, ...newMaterialTags];

      const uniqueMaterialIds = Array.from(
        new Set(combinedTags.map((item) => item.materialId))
      );

      const uniqueMaterialTags = uniqueMaterialIds.map(
        (materialId) =>
          combinedTags.find((item) => item.materialId === materialId)!
      );

      return { materialTags: uniqueMaterialTags };
    }),

  clearTags: (materialIdsToRemove) =>
    set((state) => ({
      materialTags:
        materialIdsToRemove && materialIdsToRemove.length > 0
          ? state.materialTags.filter(
              (item) => !materialIdsToRemove.includes(item.materialId)
            )
          : []
    }))
}));
