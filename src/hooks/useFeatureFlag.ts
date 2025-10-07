import { useContext } from 'react';
import { PRIVATE_BETA_FEATURE_USER_GROUPS } from '../constants';
import { GroupDataContext } from '../context/';

type UseFeatureFlag = (
  allowedGroups: number[],
  groupsOverride?: unknown[]
) => boolean;

export const useFeatureFlag = (): UseFeatureFlag => {
  const { groups = [] } = useContext(GroupDataContext);

  return (allowedGroups: number[], groupsOverride?: unknown[]) => {
    if (!groups?.length && !groupsOverride?.length) {
      return false;
    }

    return (groupsOverride || groups).some((group: unknown) =>
      allowedGroups
        .map((groupId) => {
          return PRIVATE_BETA_FEATURE_USER_GROUPS[groupId];
        })
        // @ts-ignore
        .includes(group?.id)
    );
  };
};
