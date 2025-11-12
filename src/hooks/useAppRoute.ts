import { useCaseInfoStore } from '../stores';

const APP_ROUTES = {
  ROOT: '/',
  COMMUNICATIONS: 'communications',
  MATERIALS: 'materials',
  NOT_FOUND: 'not-found',
  PCD_REQUEST: 'pcd-request',
  PCD_REVIEW: 'pcd-review',
  RECLASSIFY_TO_UNUSED: 'reclassify-to-unused',
  REVIEW_REDACT: 'review-and-redact',
  SERVER_ERROR: 'service-down',
  UNAUTHORISED: 'unauthorized'
} as const;

type AppRouteKey = keyof typeof APP_ROUTES;

export const useAppRoute = (
  routeNames: AppRouteKey[],
  prefixWithCaseId?: boolean
) => {
  const { caseInfo } = useCaseInfoStore();
  const prefix =
    caseInfo && prefixWithCaseId ? `${caseInfo?.urn}/${caseInfo?.id}/` : '';

  return routeNames.map((routeName) => `/${prefix}${APP_ROUTES[routeName]}`);
};
