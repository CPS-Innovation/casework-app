import { useEffect } from 'react';

import { useCaseInfoStore } from '../../stores';

export const CaseInfo = () => {
  const { caseInfo, setCaseInfo } = useCaseInfoStore();

  const fakeDelayedAPIResponse = () => {
    setTimeout(() => {
      setCaseInfo({
        id: 12345,
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
