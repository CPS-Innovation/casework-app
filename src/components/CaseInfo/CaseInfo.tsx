import { CaseInfoType } from '../../schemas';

type Props = { caseInfo: CaseInfoType | null };

export const CaseInfo = ({ caseInfo }: Props) => {
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
    </div>
  );
};
