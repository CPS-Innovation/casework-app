import { Route, Routes as Router } from 'react-router';

import { ReviewAndRedactPage } from './caseWorkApp/pages/ReviewAndRedactPage';
import { Layout } from './components';
import { useAppRoute } from './hooks';
import {
  CommunicationsPage,
  DiscardMaterialPage,
  MaterialsPage,
  NotAuthorisedPage,
  NotFoundPage,
  PcdRequestPage,
  ServerErrorPage
} from './pages';

export const Routes = () => {
  const [
    communicationsRoute,
    discardRoute,
    materialsRoute,
    pcdRequestRoute,
    reviewRoute,
    serviceDownRoute,
    unauthorisedRoute
  ] = useAppRoute([
    'COMMUNICATIONS',
    'DISCARD',
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
      <Route
        path={`/:urn/:caseId/${discardRoute}`}
        element={<DiscardMaterialPage />}
      />

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
