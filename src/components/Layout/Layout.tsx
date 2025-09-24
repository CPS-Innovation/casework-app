import { Outlet, useLocation } from 'react-router-dom';

import { PropsWithChildren } from 'react';
import { CaseInfo } from '../';
import { Tabs } from '../../components';
import type { Tab } from '../../components/Tabs/Tabs';
import { useAppRoute } from '../../hooks';
import './Layout.scss';

export const Layout = ({ children }: PropsWithChildren) => {
  const location = useLocation();

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

  const tabs: Tab[] = [
    {
      id: 'pcd-request',
      name: 'PCD Request',
      href: pcdRequestRoute,
      active:
        location.pathname === '/' || location.pathname.includes(pcdRequestRoute)
    },
    {
      id: 'materials',
      name: 'Materials',
      href: materialsRoute,
      active: location.pathname === materialsRoute
    },
    {
      id: 'review-redact',
      name: 'Review and Redact',
      href: reviewRoute,
      active: location.pathname === reviewRoute
    },
    {
      id: 'communications',
      name: 'Communications',
      href: communicationsRoute,
      active: location.pathname === communicationsRoute
    },
    {
      id: 'pcd-review',
      name: 'PCD Review',
      href: pcdReviewRoute,
      active: location.pathname === pcdReviewRoute
    }
  ];

  return (
    <main className="main-container">
      <CaseInfo />

      <Tabs tabs={tabs} />

      <div id="main-content">
        <Outlet />
        {children}
      </div>
    </main>
  );
};
