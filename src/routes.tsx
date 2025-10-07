import { Route, Routes as Router } from 'react-router';

import { Layout } from './components';
import { useAppRoute } from './hooks';
import { NotFoundPage } from './pages/NotFoundPage';
import { MaterialsPage } from './pages/materials/Materials';

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
        <Route
          path={pcdRequestRoute}
          element={<p className="govuk-heading-xl">PCD Request</p>}
        />
        <Route path={materialsRoute} element={<MaterialsPage />} />
        <Route
          path={communicationsRoute}
          element={<p className="govuk-heading-xl">Communications</p>}
        />
        <Route
          path={reviewRoute}
          element={<p className="govuk-heading-xl">Review &amp; Redact</p>}
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Router>
  );
};
