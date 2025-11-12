const APP_ROUTES = {
  ROOT: '/',
  COMMUNICATIONS: 'communications',
  DISCARD: 'discard-material',
  MATERIALS: 'materials',
  NOT_FOUND: 'not-found',
  PCD_REQUEST: 'pcd-request',
  PCD_REVIEW: 'pcd-review',
  SERVER_ERROR: 'service-down',
  REVIEW_REDACT: 'review-and-redact',
  UNAUTHORISED: 'unauthorized'
} as const;

type AppRouteKey = keyof typeof APP_ROUTES;

export const useAppRoute = (routeNames: AppRouteKey[]) =>
  routeNames.map((routeName) => APP_ROUTES[routeName]);
