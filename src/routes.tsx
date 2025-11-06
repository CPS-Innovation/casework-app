import { Route, Routes as Router } from 'react-router';

import { Layout } from './components';
import { useAppRoute } from './hooks';
import {
  CommunicationsPage,
  MaterialsPage,
  NotFoundPage,
  PcdRequestPage
} from './pages';
import { ReviewAndRedactPage } from './pages/ReviewAndRedactPage';


export const Routes = () => {
  const [communicationsRoute, materialsRoute, pcdRequestRoute, reviewRoute] =
    useAppRoute([
      'COMMUNICATIONS',
      'MATERIALS',
      'PCD_REQUEST',
      'REVIEW_REDACT'
    ]);

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
