import { useMemo } from 'react';
import useSWR from 'swr';
import { QUERY_KEYS } from '../constants/query';
import { useCaseInfoStore, useRequest } from '../hooks';
import {
  CaseMaterialDataType,
  CaseMaterialsResponseType,
  CaseMaterialsType
} from '../schemas';

type UseCaseMaterialsProps = { dataType: CaseMaterialDataType };

export const useCaseMaterials = ({ dataType }: UseCaseMaterialsProps) => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();

  // TODO: revisit this and add logging
  // const { log } = useLogger();

  const getCaseMaterials = async () => {
    const response = await request.get<CaseMaterialsResponseType>(
      `/urns/${caseInfo?.urn}/cases/${caseInfo?.id}/case-materials`
    );

    if (response.status === 422 || response.status !== 200) {
      throw new Error(
        `Validation error: Unable to process ${dataType} request`
      );
    }

    return response.data;
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    caseInfo ? QUERY_KEYS.CASE_MATERIAL : null,
    getCaseMaterials
  );

  const filteredData = useMemo(() => {
    const filterFn =
      dataType == 'communications'
        ? (material: CaseMaterialsType) => material.category === 'Communication'
        : (material: CaseMaterialsType) =>
            material.category !== 'Communication';

    return data?.filter(filterFn);
  }, [data, dataType]);

  // useEffect(() => {
  //   log({
  //     logLevel: 0,
  //     message: `HK-UI-FE: caseId ${caseInfo?.id} with ${dataType} data length: ${data?.length}`,
  //     errorMessage: error?.message
  //   });
  // }, [log, caseInfo, dataType, error, data?.length]);

  return {
    data,
    loading: isLoading || isValidating,
    error,
    filteredData,
    mutate
  };
};
