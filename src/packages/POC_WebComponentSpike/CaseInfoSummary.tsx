import { useEffect, useRef, useState } from 'react';

const eventName = 'cwm-unauthorised';

type Props = { urn: string; caseId: string };

export const CaseInfoSummary = ({ caseId, urn }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await fetch(
          `https://polaris-dev-cmsproxy.azurewebsites.net/api/urns/${urn}/cases/${caseId}`,
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer abc',
              'Content-Type': 'application/json',
              'Correlation-Id': crypto.randomUUID()
            },
            credentials: 'include'
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        setIsError(true);

        const unauthorisedEvent = new CustomEvent(eventName, {
          detail: { error }
        });

        window.dispatchEvent(unauthorisedEvent);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [caseId, urn]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>There was an error.</p>;
  }

  return (
    <div ref={containerRef}>
      <h2>Case INFO OK</h2>
    </div>
  );

  // const surname = caseInfo?.leadDefendantSurname?.toString()?.toUpperCase();
  // const firstNames = caseInfo?.leadDefendantFirstNames
  //   ? `, ${caseInfo?.leadDefendantFirstNames}`
  //   : '';
  // const plusNumber =
  //   caseInfo?.numberOfDefendants > 1
  //     ? ` +${caseInfo?.numberOfDefendants - 1}`
  //     : '';
  //
  // const caseInfoName = `${surname}${firstNames}${plusNumber}`;
  //
  // return (
  //   <div className="case-info-details">
  //     <div className="">
  //       {caseInfo ? (
  //         <>
  //           <h2 className="govuk-heading-m case-info-name">{caseInfoName}</h2>
  //           <p className="govuk-body">{caseInfo?.urn}</p>
  //         </>
  //       ) : (
  //         <p className="govuk-body">Please wait...</p>
  //       )}
  //     </div>
  //   </div>
  // );
};
