import { useEffect } from 'react';
// import { useParams } from 'react-router-dom';

import { useRequest } from '../../hooks/useRequest';

import { useParams } from 'react-router-dom';
import { BaseUrlParamsType } from '../../schemas/params';
import { CaseInfoType as PolarisCaseInfoType } from '../../schemas/polaris/caseinfo';
import { useCaseInfoStore } from '../../stores';

export const CaseInfo = () => {
  const { caseId } = useParams<BaseUrlParamsType>();

  const { caseInfo, setCaseInfo } = useCaseInfoStore();
  const request = useRequest();

  const fetchCaseInfoSummary = async () => {
    try {
      // TODO: Replace hardcoded URN
      const response = await request.get<PolarisCaseInfoType>(
        `/api/urns/06SC1234571/cases/${caseId}`
      );
      setCaseInfo({
        id: response.data.id,
        urn: response.data.uniqueReferenceNumber,
        leadDefendantFirstNames: response.data.leadDefendantDetails.firstNames,
        leadDefendantSurname: response.data.leadDefendantDetails.surname,
        numberOfDefendants: response.data.numberOfDefendants
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCaseInfoSummary();
  }, []);

  if (!caseInfo) {
    return null;
  }

  const surname = caseInfo?.leadDefendantSurname?.toString()?.toUpperCase();
  const firstNames = caseInfo?.leadDefendantFirstNames
    ? `, ${caseInfo?.leadDefendantFirstNames}`
    : '';
  const plusNumber =
    caseInfo?.numberOfDefendants > 1
      ? ` +${caseInfo?.numberOfDefendants - 1}`
      : '';

  const caseInfoName = `${surname}${firstNames}${plusNumber}`;

  return (
    <div className="case-info-details">
      <div className="">
        {caseInfo ? (
          <>
            <h2 className="govuk-heading-m case-info-name">{caseInfoName}</h2>
            <p className="govuk-body">{caseInfo?.urn}</p>
          </>
        ) : (
          <p className="govuk-body">Please wait...</p>
        )}
      </div>

      {/* <div className="case-info-links">
        <div className="action-buttons-container">
          <button
            type="submit"
            className="govuk-button reclassify-to-unused-button govuk-button--secondary"
            data-module="govuk-button"
            data-testid="reclassifyButton"
            onClick={() => null}
            disabled={true}
          >
            Update automatically
          </button>
        </div>
      </div> */}
    </div>
  );
};
