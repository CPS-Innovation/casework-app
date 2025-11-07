import { PropsWithChildren, useEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import { Banner, CaseInfo, LoadingSpinner, Tabs } from '../../components';
import { useAppRoute, useBanner, useCaseInfo } from '../../hooks';
import type { Tab } from '../Tabs/Tabs';

import { useCaseInfoStore } from '../../stores';

import { BaseUrlParamsType } from '../../schemas/params';
import './Layout.scss';

type Props = { plain?: boolean };

export const Layout = ({
  children,
  plain = false
}: PropsWithChildren<Props>) => {
  const { caseId, urn } = useParams<BaseUrlParamsType>();
  const location = useLocation();
  const { banners } = useBanner();
  const { caseInfo, loading: isCaseInfoLoading } = useCaseInfo({ caseId, urn });
  const { setCaseInfo } = useCaseInfoStore();

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

  useEffect(() => {
    if (caseInfo) {
      setCaseInfo(caseInfo);
    }
  }, [caseInfo]);

  return (
    <>
      <main className="main-container">
        <CaseInfo caseInfo={caseInfo} />

        <div role="status" aria-atomic="true">
          {banners &&
            banners.map((banner, index) => <Banner key={index} {...banner} />)}
        </div>

        {!plain ? (
          <>
            {!isCaseInfoLoading ? (
              <>
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
