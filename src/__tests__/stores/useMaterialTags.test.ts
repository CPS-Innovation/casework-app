import { describe } from 'vitest';
import { useMaterialTags } from '../../stores';

describe('useMaterialTags Store', () => {
  it('should initialize with an empty materialTags array', () => {
    const store = useMaterialTags.getState();
    expect(store.materialTags).toEqual([]);
  });

  it('should set new tags correctly and avoid duplicates', () => {
    const newTags = [
      { materialId: 1, tagName: 'tag1' },
      { materialId: 2, tagName: 'tag2' }
    ];

    useMaterialTags.getState().setTags(newTags);

    const store = useMaterialTags.getState();
    expect(store.materialTags).toEqual(newTags);
  });

  it('should prevent duplicate tags when setting new tags', () => {
    const newTags = [
      { materialId: 1, tagName: 'tag1' },
      { materialId: 2, tagName: 'tag2' }
    ];

    useMaterialTags.getState().setTags(newTags);

    const duplicateTags = [
      { materialId: 1, tagName: 'tag3' },
      { materialId: 3, tagName: 'tag3' }
    ];

    useMaterialTags.getState().setTags(duplicateTags);

    const store = useMaterialTags.getState();
    expect(store.materialTags).toEqual([
      { materialId: 1, tagName: 'tag1' },
      { materialId: 2, tagName: 'tag2' },
      { materialId: 3, tagName: 'tag3' }
    ]);
  });

  it('should clear all tags when clearTags is called with no materialIdsToRemove', () => {
    const newTags = [
      { materialId: 1, tagName: 'tag1' },
      { materialId: 2, tagName: 'tag2' }
    ];

    useMaterialTags.getState().setTags(newTags);
    useMaterialTags.getState().clearTags();

    const store = useMaterialTags.getState();
    expect(store.materialTags).toEqual([]);
  });

  it('should remove specific tags when clearTags is called with materialIdsToRemove', () => {
    const newTags = [
      { materialId: 1, tagName: 'tag1' },
      { materialId: 2, tagName: 'tag2' },
      { materialId: 3, tagName: 'tag3' }
    ];

    useMaterialTags.getState().setTags(newTags);

    useMaterialTags.getState().clearTags([1, 2]);

    const store = useMaterialTags.getState();
    expect(store.materialTags).toEqual([{ materialId: 3, tagName: 'tag3' }]);
  });

  it('should not modify tags when clearTags is called with an empty array', () => {
    const newTags = [
      { materialId: 1, tagName: 'tag1' },
      { materialId: 2, tagName: 'tag2' }
    ];

    useMaterialTags.getState().setTags(newTags);
    useMaterialTags.getState().clearTags();

    const store = useMaterialTags.getState();
    expect(store.materialTags).toEqual([]);
  });
});
