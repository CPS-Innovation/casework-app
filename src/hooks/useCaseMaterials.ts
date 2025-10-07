import { useMemo } from 'react';
import useSWR from 'swr';
import { QUERY_KEYS } from '../constants/query';
import { POLARIS_GATEWAY_URL } from '../constants/url';
import { useLogger, useRequest } from '../hooks';
import {
  CaseMaterialDataType,
  CaseMaterialsResponseType,
  CaseMaterialsType
} from '../schemas';
import { useCaseInfoStore } from '../stores';

export const useCaseMaterials = (dataType: CaseMaterialDataType) => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();
  const { log } = useLogger();

  const getCaseMaterials = async () => {
    const response = await request.get<CaseMaterialsResponseType>(
      `${POLARIS_GATEWAY_URL}/api/urns/16123630825/cases/2167259/materials`
    );

    if (response.status === 422 || response.status !== 200) {
      throw new Error(
        `Validation error: Unable to process ${dataType} request`
      );
    }

    console.log('response.data: ', response.data);

    return response.data;
  };

  const { data, error, isLoading, mutate } = useSWR(
    QUERY_KEYS.CASE_MATERIAL,
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

  console.log('filteredData: ', filteredData);

  // useEffect(() => {
  //   log({
  //     logLevel: 0,
  //     message: `HK-UI-FE: caseId ${caseInfo?.id} with ${dataType} data length: ${data?.length}`,
  //     errorMessage: error?.message
  //   });
  // }, [log, caseInfo, dataType, error, data?.length]);

  return { data, loading: isLoading, error, filteredData, mutate };
};
