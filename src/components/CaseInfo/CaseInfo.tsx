import { useEffect } from 'react';
// import { useParams } from 'react-router-dom';

import { API_ENDPOINTS } from '../../constants/url';
import { useRequest } from '../../hooks/useRequest';
import { CaseInfoResponseType } from '../../schemas/caseinfo';
import { useCaseInfoStore } from '../../stores';

export const CaseInfo = () => {
  // we'll need this later
  // const { caseId } = useParams<BaseUrlParamsType>();

  const { caseInfo, setCaseInfo } = useCaseInfoStore();
  const request = useRequest();

  const fetchCaseInfoSummary = async () => {
    try {
      const response = await request.get<CaseInfoResponseType>(
        API_ENDPOINTS.CASE_INFO
      );
      setCaseInfo(response.data);
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

  console.log(caseInfo);

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

      <div className="case-info-links">
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
      </div>
    </div>
  );
};
