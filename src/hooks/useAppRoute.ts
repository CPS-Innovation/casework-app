const APP_ROUTES = {
  ROOT: '/',
  COMMUNICATIONS: '/communications',
  MATERIALS: '/materials'
} as const;

type AppRouteKey = keyof typeof APP_ROUTES;

export const useAppRoute = () => {
  const getRoute = (routeName: AppRouteKey) => {
    return APP_ROUTES[routeName];
  };

  const getRoutes = (routeNames: AppRouteKey[]) => {
    return routeNames.map((routeName) => APP_ROUTES[routeName]);
  };

  return { getRoute, getRoutes };
};
