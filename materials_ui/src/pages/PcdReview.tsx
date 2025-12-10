import {
  DefinitionList,
  Layout,
  LoadingSpinner,
  NavList,
  NavListItem,
  SectionBreak,
  TwoCol
} from '../components';

import { PcdReviewCaseHistoryType } from '../constants/enum.ts';
import {
  usePCDInitialReview,
  usePCDReview,
  usePCDReviewCaseHistory
} from '../hooks/';

export const PcdReviewPage = () => {
  const { data: historyData, isLoading: historyDataLoading } =
    usePCDReviewCaseHistory();

  const { data: initialReviewData, isLoading: initialReviewDataLoading } =
    usePCDInitialReview();

  const pcdEntry = historyData?.find(
    (item) => item.type === PcdReviewCaseHistoryType.PreChargeDecision
  );

  const { data, isLoading } = usePCDReview(pcdEntry?.id);

  const caseHeadlineCodeTests = [
    {
      header: 'Evidential Assessment',
      body: initialReviewData?.evidentialAssessment
    },
    {
      header: 'Public Interest Assessment',
      body: initialReviewData?.publicInterestAssessment
    },
    { header: 'Allocation', body: initialReviewData?.allocation },
    { header: 'ECHR', body: initialReviewData?.europeanCourtOfHumanRights },
    {
      header: 'Disclosure Actions and Issues',
      body: initialReviewData?.disclosureActionsAndIssues
    },
    { header: 'Trial Strategy', body: initialReviewData?.trialStrategy },
    {
      header: 'Witness / Victim Information and Actions',
      body: initialReviewData?.witnessOrVictimInformationAndActions
    },
    {
      header: 'Instructions to Op Delivery / Advocate',
      body: initialReviewData?.instructionsToOperationsDeliveryOrAdvocate
    }
  ];

  const renderSidebar = () => {
    if (isLoading || historyDataLoading || initialReviewDataLoading) {
      return <LoadingSpinner />;
    }

    const navLinks: NavListItem[] | undefined = [
      { href: '/pcd-review', name: 'Initial Review' }
    ];

    return (
      <>
        <h2 className="govuk-visually-hidden">PCD Review List</h2>
        <NavList items={navLinks} />
      </>
    );
  };

  const decisions = data?.defendantDecisions.map((decision) => {
    const [chargingCode, advice] =
      decision?.decisionDescription?.split('-') ?? [];
    const reason = decision?.reason.split('-')[1]?.trim() ?? [];

    return {
      defendantName: decision?.defendantName,
      chargingCode: chargingCode?.trim(),
      advice: advice?.trim(),
      reason: reason,
      reasonCode: decision?.reasonCode,
      publicInterestCode: decision?.publicInterestCode
    };
  });

  const chargingDecisionAndAdviceTableHeadings = [
    'Suspect',
    'Charging code',
    'Advice',
    'Evidential Reason Code (if ‘K’)',
    'Public Interest Code (if C, D, D2, D5, E, F or L)'
  ];

  if (
    !isLoading &&
    !historyDataLoading &&
    !initialReviewDataLoading &&
    (!data || !initialReviewData)
  ) {
    return (
      <div className="govuk-main-wrapper">
        <p className="govuk-body">
          A Review has not yet been completed for this case.
        </p>
      </div>
    );
  }

  return (
    <Layout title="PCD Review">
      <div className="govuk-main-wrapper" style={{ whiteSpace: 'pre-wrap' }}>
        <TwoCol sidebar={renderSidebar()}>
          {data && initialReviewData ? (
            <>
              <h1 className="govuk-heading-l">Initial Review</h1>
              <DefinitionList
                items={[
                  {
                    title: 'Review type: ',
                    description: [`${initialReviewData?.consultationType}`]
                  },
                  {
                    title: 'Prosecutor name: ',
                    description: [data?.decisionMadeBy]
                  },
                  {
                    title: 'Review date: ',
                    description: [`${data?.pcdHistoryActionPlan[0]?.entryDate}`]
                  }
                ]}
              />
              <SectionBreak size="xl" />

              <h1 className="govuk-heading-l">Case Headline / Code Test</h1>
              <p className="govuk-body">{initialReviewData?.caseSummary}</p>
              <>
                {caseHeadlineCodeTests.map((c, index) => (
                  <div key={index}>
                    <h3 className="govuk-heading-m">{c.header}</h3>
                    <p className="govuk-body">{c.body}</p>
                  </div>
                ))}
              </>

              <SectionBreak size="xl" />

              <h1 className="govuk-heading-l">Charging Decision & Advice</h1>

              <table className="govuk-table">
                <caption className="govuk-table__caption govuk-visually-hidden">
                  Charging Decision & Advice Table
                </caption>

                <thead className="govuk-table__head">
                  <tr className="govuk-table__row">
                    {chargingDecisionAndAdviceTableHeadings.map(
                      (heading, index) => (
                        <th
                          scope={'col'}
                          className={'govuk-table__header'}
                          key={index}
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className={'govuk-table__body'}>
                  {decisions?.map((decision, index) => (
                    <tr className={'govuk-table__row'} key={index}>
                      <th scope={'col'} className={'govuk-table__header'}>
                        {decision.defendantName}
                      </th>
                      <td scope={'col'} className={'govuk-table__cell'}>
                        {decision.chargingCode}
                      </td>
                      <td scope={'col'} className={'govuk-table__cell'}>
                        {decision.advice}
                      </td>
                      <td scope={'col'} className={'govuk-table__cell'}>
                        {decision.chargingCode === 'K' ? decision.reason : '-'}
                      </td>
                      <td scope="col" className="govuk-table__cell">
                        {['C', 'D', 'D2', 'D5', 'E', 'F', 'L'].includes(
                          decision.reasonCode
                        )
                          ? decision.publicInterestCode
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <SectionBreak size="xl" />

              <h1 className="govuk-heading-l">
                Further action agreed for codes A, B, B2, H, I, J
              </h1>
              <DefinitionList
                items={[
                  {
                    title: 'Action type:',
                    description: [
                      `${data?.pcdHistoryActionPlan[0]?.actionType}`
                    ]
                  },
                  {
                    title: 'Action date:',
                    description: [
                      `${data?.pcdHistoryActionPlan[0]?.actionDate}`
                    ]
                  },
                  {
                    title: '',
                    description: [
                      `${data?.pcdHistoryActionPlan[0]?.actionPoint}`
                    ]
                  },
                  {
                    title: 'Return bail date:',
                    description: [
                      `${data?.defendantDecisions[0]?.returnBailDate}`
                    ]
                  },
                  {
                    title: 'Investigation stage at which advice sought:',
                    description: [data?.investigationStage]
                  },
                  {
                    title: 'How advice delivered:',
                    description: [`${data?.method}`]
                  }
                ]}
              />

              <SectionBreak size="xl" />
            </>
          ) : (
            <h1 className="govuk-heading-l">No PCD Review has been made</h1>
          )}
        </TwoCol>
      </div>
    </Layout>
  );
};
