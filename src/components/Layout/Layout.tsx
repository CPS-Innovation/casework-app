import { Outlet } from 'react-router-dom';

import { PropsWithChildren } from 'react';
import { CaseInfo, CPSLink } from '../';
import { useAppRoute } from '../../hooks';
import { useCaseInfoStore } from '../../stores';

export const Layout = ({ children }: PropsWithChildren) => {
  const [
    communicationsRoute,
    materialsRoute,
    pcdRequestRoute,
    pcdReviewRoute,
    reviewRoute
  ] = useAppRoute([
    'COMMUNICATIONS',
    'MATERIALS',
    'PCD_REQUEST',
    'PCD_REVIEW',
    'REVIEW_REDACT'
  ]);

  const { caseInfo } = useCaseInfoStore();

  return (
    <main>
      <CaseInfo />

      {/* TEMP NAV FOR DEV PURPOSES */}
      <ul>
        <li>
          <CPSLink to={pcdRequestRoute}>PCD Request</CPSLink>
        </li>
        <li>
          <CPSLink to={materialsRoute}>Materials</CPSLink>
        </li>
        <li>
          <CPSLink to={reviewRoute}>Review &amp; Redact</CPSLink>
        </li>
        <li>
          <CPSLink to={communicationsRoute}>Communications</CPSLink>
        </li>
        <li>
          <CPSLink to={pcdReviewRoute}>PCD Review</CPSLink>
        </li>
      </ul>
      {/* /END TEMP NAV FOR DEV PURPOSES */}

      {caseInfo ? (
        <div id="main-content">
          <Outlet />
          {children}
        </div>
      ) : (
        <p className="govuk-body">Loading...</p>
      )}
    </main>
  );
};
