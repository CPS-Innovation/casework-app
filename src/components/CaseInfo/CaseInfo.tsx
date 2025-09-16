import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { BaseUrlParamsType } from '../../schemas/params';
import { useCaseInfoStore } from '../../stores';

export const CaseInfo = () => {
  const { caseId } = useParams<BaseUrlParamsType>();
  const { caseInfo, setCaseInfo } = useCaseInfoStore();

  const fakeDelayedAPIResponse = () => {
    setTimeout(() => {
      setCaseInfo({
        id: parseInt(caseId as string),
        urn: 'EXAMPLE_URN',
        leadDefendantFirstNames: 'Joe',
        leadDefendantSurname: 'Bloggs,',
        numberOfDefendants: 2
      });
    }, 2000);
  };

  useEffect(() => {
    fakeDelayedAPIResponse();
  }, []);

  if (!caseInfo) {
    return <p className="govuk-body">CASE INFO LOADING...</p>;
  }

  return <>{JSON.stringify(caseInfo, null, 2)}</>;
};
