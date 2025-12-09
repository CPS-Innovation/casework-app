import { PropsWithChildren, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Banner, CaseInfo, LoadingSpinner, Tabs } from '..';
import { useAppRoute, useBanner } from '../../hooks';
import type { Tab } from '../Tabs/Tabs';

import { useCaseInfoStore } from '../../stores';

import './Layout.scss';

type Props = { plain?: boolean; title?: string };

export const Layout = ({
  children,
  plain = false,
  title
}: PropsWithChildren<Props>) => {
  const { banners } = useBanner();
  const { caseInfo } = useCaseInfoStore();
  const location = useLocation();
  const { getRoute } = useAppRoute();

  const tabs: Tab[] = [
    {
      id: 'pcd-request',
      name: 'PCD Request',
      href: getRoute('PCD_REQUEST'),
      active:
        location.pathname === '/' ||
        location.pathname.includes(getRoute('PCD_REQUEST'))
    },
    {
      id: 'materials',
      name: 'Materials',
      href: getRoute('MATERIALS'),
      active: location.pathname === getRoute('MATERIALS')
    },
    {
      id: 'review-redact',
      name: 'Review and Redact',
      href: getRoute('REVIEW_REDACT'),
      active: location.pathname === getRoute('REVIEW_REDACT')
    },
    {
      id: 'communications',
      name: 'Communications',
      href: getRoute('COMMUNICATIONS'),
      active: location.pathname === getRoute('COMMUNICATIONS')
    }
  ];

  useEffect(() => {
    if (title) {
      document.title = title + ' - Casework App';
    }
  }, [location, title]);

  return (
    <>
      <main className="main-container">
        <div role="status" aria-atomic="true">
          {banners &&
            banners.map((banner, index) => <Banner key={index} {...banner} />)}
        </div>

        {!plain ? (
          <>
            {caseInfo ? (
              <>
                <CaseInfo caseInfo={caseInfo} />
                <Tabs tabs={tabs} />
                <div id="main-content">
                  <Outlet />
                  {children}
                </div>
              </>
            ) : (
              <LoadingSpinner textContent="Loading case" />
            )}
          </>
        ) : (
          children
        )}
      </main>
    </>
  );
};
