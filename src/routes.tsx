import { Route, Routes as Router } from 'react-router';

import { Layout } from './components';
import { NotFoundPage, PcdRequestPage } from './pages';
import { CommunicationsPage } from './pages/Communications';
import { MaterialsPage } from './pages/materials/Materials';
import { ReviewAndRedactPage } from './pages/ReviewAndRedactPage';

export const APP_ROUTES_MAP = {
  rootRoute: '/',
  communicationsRoute: 'communications',
  materialsRoute: 'materials',
  notFoundRoute: 'not-found',
  pcdRequestRoute: 'pcd-request',
  pcdReviewRoute: 'pcd-review',
  reviewRoute: 'review-and-redact'
} as const;

export const Routes = () => {
  const { communicationsRoute, materialsRoute, pcdRequestRoute, reviewRoute } =
    APP_ROUTES_MAP;

  return (
    <Router>
      <Route path="/:urn/:caseId" element={<Layout />}>
        <Route path={pcdRequestRoute} element={<PcdRequestPage />}>
          <Route path=":pcdId" element={<PcdRequestPage />} />
        </Route>
        <Route path={materialsRoute} element={<MaterialsPage />} />
        <Route path={communicationsRoute} element={<CommunicationsPage />} />
        <Route path={reviewRoute} element={<ReviewAndRedactPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Router>
  );
};
