import { Route, Routes as Router } from 'react-router';

import { Layout } from './components';
import { useAppRoute } from './hooks';
import {
  CommunicationsPage,
  MaterialsPage,
  NotAuthorisedPage,
  NotFoundPage,
  PcdRequestPage,
  ServerErrorPage
} from './pages';
import { ReviewAndRedactPage } from './pages/ReviewAndRedactPage';

export const Routes = () => {
  const [
    communicationsRoute,
    materialsRoute,
    pcdRequestRoute,
    reviewRoute,
    serviceDownRoute,
    unauthorisedRoute
  ] = useAppRoute([
    'COMMUNICATIONS',
    'MATERIALS',
    'PCD_REQUEST',
    'REVIEW_REDACT',
    'SERVER_ERROR',
    'UNAUTHORISED'
  ]);

  return (
    <Router>
      <Route path={unauthorisedRoute} element={<NotAuthorisedPage />} />
      <Route path={serviceDownRoute} element={<ServerErrorPage />} />

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
