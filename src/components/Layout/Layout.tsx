import { Outlet, useLocation } from 'react-router-dom';

import { PropsWithChildren } from 'react';
import { useParams } from 'react-router-dom';
import { Banner, LoadingSpinner, Tabs } from '../../components';
import { useAppRoute, useBanner } from '../../hooks';
import { BaseUrlParamsType } from '../../schemas/params';
import type { Tab } from '../Tabs/Tabs.tsx';

import { useCaseInfoStore } from '../../stores';

import './Layout.scss';

export const Layout = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const { banners } = useBanner();
  const { caseId, urn } = useParams<BaseUrlParamsType>();

  const [communicationsRoute, materialsRoute, pcdRequestRoute, reviewRoute] =
    useAppRoute([
      'COMMUNICATIONS',
      'MATERIALS',
      'PCD_REQUEST',
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
    }
  ];

  const { caseInfo } = useCaseInfoStore();

  return (
    <>
      <main className="main-container">
        <div role="status" aria-atomic="true">
          {banners &&
            banners.map((banner, index) => <Banner key={index} {...banner} />)}
        </div>

        <case-info-summary urn={urn} caseid={caseId} />

        {caseInfo ? (
          <>
            <Tabs tabs={tabs} />
            <div id="main-content">
              <Outlet />
              {children}
            </div>
          </>
        ) : (
          <LoadingSpinner textContent="Loading..." />
        )}
      </main>
    </>
  );
};
