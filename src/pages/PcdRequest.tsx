import { Fragment, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Accordion,
  DefinitionList,
  LoadingSpinner,
  NavList,
  SectionBreak,
  TwoCol
} from '../components';
import { NavListItem } from '../components/NavList/NavList';
import { useAppRoute, usePCD, usePCDList } from '../hooks';
import { useCaseInfoStore } from '../stores';
import { formatDate } from '../utils/date';
import { cleanString } from '../utils/string';

export const PcdRequestPage = () => {
  const { pcdId } = useParams<{ pcdId?: string }>();
  const navigate = useNavigate();
  const { caseInfo } = useCaseInfoStore();
  const [pcdRequestRoute] = useAppRoute(['PCD_REQUEST']);
  const { data: pcdListData, isLoading: isPcdListLoading } = usePCDList(
    caseInfo?.id
  );

  if (!pcdId && pcdListData?.length) {
    navigate(`${pcdListData[0].id}`);
  }

  const { data: pcdDetailsData, isLoading: isPcdDetailsLoading } = usePCD({
    caseId: caseInfo?.id,
    pcdId: pcdId ? pcdId : pcdListData?.length ? pcdListData[0].id : undefined
  });

  const navLinks: NavListItem[] | undefined = pcdListData?.map(
    (pcd, index) => ({
      href: `${pcdRequestRoute}/${pcd.id}`,
      name:
        index === 0 ? 'Latest PCD request' : formatDate(pcd.decisionRequested)
    })
  );

  const renderSidebar = () => {
    if (isPcdListLoading) {
      return <LoadingSpinner />;
    }
    return (
      <>
        <h2 className="govuk-visually-hidden">PCD Request List</h2>
        <NavList items={navLinks || []} />
      </>
    );
  };

  const formatFullName = (
    surname: string,
    firstNames?: string | null
  ): string => {
    if (firstNames) return `${surname} ${firstNames}`;

    return surname;
  };

  const isLatestPcd =
    pcdDetailsData &&
    pcdListData?.length &&
    pcdDetailsData?.id === pcdListData[0]?.id;

  const suspectsAndCharges = useMemo(
    () =>
      pcdDetailsData?.suspects?.flatMap(({ proposedCharges, ...suspect }) => {
        return proposedCharges.flatMap((charge, index) => ({
          ...charge,
          suspect: index === 0 ? suspect : undefined,
          numberOfCharges: proposedCharges.length
        }));
      }),
    [pcdDetailsData]
  );

  return (
    //   converting '\n' to actual line breaks with CSS
    <div className="govuk-main-wrapper" style={{ whiteSpace: 'pre-wrap' }}>
      {navLinks?.length === 0 && (
        <p className="govuk-body">There are no PCD Requests to show.</p>
      )}
      <TwoCol sidebar={renderSidebar()}>
        {isPcdDetailsLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {pcdDetailsData && (
              <>
                <h1 className="govuk-heading-l">
                  {isLatestPcd
                    ? 'Latest PCD Request'
                    : `${formatDate(pcdDetailsData?.decisionRequested)} PCD Request`}
                </h1>
                <DefinitionList
                  items={[
                    {
                      title: 'Decision required by:',
                      description: [
                        formatDate(pcdDetailsData?.decisionRequiredBy)
                      ]
                    },
                    {
                      title: 'Decision requested:',
                      description: [
                        formatDate(pcdDetailsData?.decisionRequested)
                      ]
                    }
                  ]}
                />

                <SectionBreak size="xl" />

                <h2 className="govuk-heading-l">Police details</h2>
                <div className="table-container">
                  <table className="govuk-table govuk-table--width-fluid gov-table--pcd">
                    <thead className="govuk-table__head">
                      <tr className="govuk-table__row">
                        <th scope="col" className="govuk-table__header">
                          Role
                        </th>
                        <th scope="col" className="govuk-table__header">
                          Name
                        </th>
                        <th scope="col" className="govuk-table__header">
                          Number
                        </th>
                      </tr>
                    </thead>
                    <tbody className="govuk-table__body">
                      {pcdDetailsData?.policeContactDetails?.map(
                        ({ name, number, role }, index) => (
                          <tr className="govuk-table__row" key={index}>
                            <th scope="row" className="govuk-table__header">
                              {role}
                            </th>
                            <td className="govuk-table__cell">{name}</td>
                            <td className="govuk-table__cell">{number}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <SectionBreak size="xl" />

                <h2 className="govuk-heading-l">Case outline</h2>
                {pcdDetailsData?.caseOutline.map(
                  ({ heading, textWithCmsMarkup }, index) => (
                    <Fragment key={index}>
                      <h3 className="govuk-heading-m">{heading}</h3>
                      <p
                        className="govuk-body"
                        dangerouslySetInnerHTML={{
                          __html: cleanString(textWithCmsMarkup)
                        }}
                      />
                    </Fragment>
                  )
                )}

                <SectionBreak size="xl" />

                <h2 className="govuk-heading-l">
                  Supervising officer's comments
                </h2>
                <p className="govuk-body">
                  {pcdDetailsData?.comments.text || 'None'}
                </p>

                <SectionBreak size="xl" />

                <h2 className="govuk-heading-l">Proposed charges</h2>

                <div className="table-container">
                  <table className="govuk-table gov-table--pcd">
                    <thead className="govuk-table__head">
                      <tr className="govuk-table__row">
                        <th
                          scope="col"
                          className="govuk-table__header govuk-table__cell--md"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="govuk-table__header govuk-table__cell--sm"
                        >
                          Date of birth
                        </th>
                        <th scope="col" className="govuk-table__header">
                          Category
                        </th>
                        <th scope="col" className="govuk-table__header">
                          Proposed charge
                        </th>
                        <th
                          scope="col"
                          className="govuk-table__header govuk-table__cell--sm"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="govuk-table__header govuk-table__cell--sm"
                        >
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="govuk-table__body">
                      {suspectsAndCharges?.map(
                        (
                          {
                            suspect,
                            location,
                            charge,
                            earlyDate,
                            numberOfCharges,
                            category
                          },
                          index
                        ) => {
                          const rowSpan =
                            numberOfCharges > 1 ? numberOfCharges : undefined;

                          return (
                            <tr className="govuk-table__row" key={index}>
                              <>
                                {suspect && (
                                  <>
                                    <th
                                      scope="row"
                                      className="govuk-table__cell"
                                      rowSpan={rowSpan}
                                    >
                                      {formatFullName(
                                        suspect.surname,
                                        suspect.firstNames
                                      )}
                                    </th>
                                    <td
                                      className="govuk-table__cell"
                                      rowSpan={rowSpan}
                                    >
                                      {formatDate(suspect.dob)}
                                    </td>
                                    <td
                                      className="govuk-table__cell"
                                      rowSpan={rowSpan}
                                    >
                                      {category}
                                    </td>
                                  </>
                                )}

                                <td className="govuk-table__cell">{charge}</td>
                                <td className="govuk-table__cell">
                                  {location}
                                </td>
                                <td className="govuk-table__cell">
                                  {formatDate(earlyDate)}
                                </td>
                              </>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>

                <SectionBreak size="xl" />

                <h2 className="govuk-heading-l">Bail details</h2>

                <div className="table-container">
                  <table className="govuk-table gov-table--pcd">
                    <thead className="govuk-table__head">
                      <tr className="govuk-table__row">
                        <th
                          scope="col"
                          className="govuk-table__header govuk-table__cell--md"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="govuk-table__header govuk-table__cell--sm"
                        >
                          Bail date
                        </th>
                        <th
                          scope="col"
                          className="govuk-table__header govuk-table__cell--md"
                        >
                          Remand status
                        </th>
                        <th scope="col" className="govuk-table__header">
                          Bail conditions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="govuk-table__body">
                      {pcdDetailsData?.suspects.map((suspect, index) => (
                        <tr className="govuk-table__row" key={index}>
                          <th scope="row" className="govuk-table__cell">
                            {formatFullName(
                              suspect.surname,
                              suspect.firstNames
                            )}
                          </th>
                          <td className="govuk-table__cell">
                            {formatDate(suspect.bailDate)}
                          </td>
                          <td className="govuk-table__cell">
                            {suspect.remandStatus}
                          </td>
                          <td className="govuk-table__cell">
                            {suspect.bailConditions}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <SectionBreak size="xl" />

                <h2 className="govuk-heading-l">Materials provided</h2>
                {pcdDetailsData.materialProvided.length ? (
                  <Accordion
                    plain
                    items={[
                      {
                        title: {
                          expanded: 'Hide all materials provided',
                          collapsed: 'Show all materials provided'
                        },
                        content: (
                          <div className="table-container">
                            <table className="govuk-table govuk-table--width-fluid gov-table--pcd">
                              <thead className="govuk-table__head">
                                <tr className="govuk-table__row">
                                  <th
                                    scope="col"
                                    className="govuk-table__header"
                                  >
                                    Material name
                                  </th>
                                  <th
                                    scope="col"
                                    className="govuk-table__header"
                                  >
                                    Date
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="govuk-table__body">
                                {pcdDetailsData?.materialProvided.map(
                                  ({ subject, date }, index) => (
                                    <tr
                                      className="govuk-table__row"
                                      key={index}
                                    >
                                      <td className="govuk-table__header">
                                        {subject}
                                      </td>
                                      <td className="govuk-table__cell">
                                        {date}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        )
                      }
                    ]}
                  />
                ) : (
                  <p className="govuk-body">No materials to show.</p>
                )}
              </>
            )}
          </>
        )}
      </TwoCol>
    </div>
  );
};
