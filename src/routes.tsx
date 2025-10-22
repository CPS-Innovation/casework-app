import { Route, Routes as Router } from 'react-router';

import { Layout } from './components';
import { useAppRoute } from './hooks';
import { NotFoundPage, PcdRequestPage } from './pages';
import { CommunicationsPage } from './pages/Communications';
import { MaterialsPage } from './pages/materials/Materials';
import { CaseDetailsWrapper as CaseDetailsPage} from './caseWorkApp/components/presentation/caseDetails';

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
        <Route
          path={reviewRoute}
          element={<CaseDetailsPage />}
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Router>
  );
};
