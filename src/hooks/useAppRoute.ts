import { useMatch } from 'react-router-dom';

const APP_ROUTES = {
  ROOT: '/',
  COMMUNICATIONS: 'communications',
  DISCARD: 'discard-material',
  MATERIALS: 'materials',
  NOT_FOUND: 'not-found',
  PCD_REQUEST: 'pcd-request',
  PCD_REVIEW: 'pcd-review',
  RECLASSIFICATION: 'reclassify',
  RECLASSIFY_TO_UNUSED: 'reclassify-to-unused',
  REVIEW_REDACT: 'review-and-redact',
  SERVER_ERROR: 'service-down',
  UNAUTHORISED: 'unauthorized'
} as const;

type AppRouteKey = keyof typeof APP_ROUTES;

export const useAppRoute = () => {
  const match = useMatch('/:urn/:caseId/*');
  const urn = match?.params.urn;
  const caseId = match?.params.caseId;

  const getRoute = (routeName: AppRouteKey, prefix: boolean = true) => {
    const routePrefix = urn && caseId && prefix ? `/${urn}/${caseId}/` : '';

    return `${routePrefix}${APP_ROUTES[routeName]}`;
  };

  return { getRoute };
};
