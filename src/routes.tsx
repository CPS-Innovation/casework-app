import { Route, Routes as Router } from 'react-router';

import { useAppRoute } from './hooks';

export const Routes = () => {
  const { getRoutes } = useAppRoute();

  const [communicationsRoute, materialsRoute] = getRoutes([
    'COMMUNICATIONS',
    'MATERIALS'
  ]);

  return (
    <Router>
      <Route index element={<p>HOME PAGE</p>} />
      <Route path={materialsRoute} element={<p>MATERIALS</p>} />
      <Route path={communicationsRoute} element={<p>COMMUNICATIONS</p>} />
    </Router>
  );
};
