const APP_ROUTES = {
  ROOT: '/',
  COMMUNICATIONS: 'communications',
  MATERIALS: 'materials',
  PCD_REQUEST: 'pcd-request',
  PCD_REVIEW: 'pcd-review',
  REVIEW_REDACT: 'review-and-redact'
} as const;

type AppRouteKey = keyof typeof APP_ROUTES;

export const useAppRoute = (routeNames: AppRouteKey[]) =>
  routeNames.map((routeName) => APP_ROUTES[routeName]);
