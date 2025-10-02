import { Route, Routes as Router } from 'react-router';

import { Layout } from './components';
import { useAppRoute } from './hooks';
import { NotFoundPage } from './pages/NotFoundPage';

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
      <Route path=":caseId" element={<Layout />}>
        <Route
          path={pcdRequestRoute}
          element={<p className="govuk-heading-xl">PCD Request</p>}
        />
        <Route
          path={materialsRoute}
          element={<p className="govuk-heading-xl">Materials</p>}
        />
        <Route
          path={communicationsRoute}
          element={<p className="govuk-heading-xl">Communications</p>}
        />
        <Route
          path={reviewRoute}
          element={<p className="govuk-heading-xl">Review &amp; Redact</p>}
        />
      </Route>

      <Route
        path="*"
        element={
          <Layout>
            <NotFoundPage />
          </Layout>
        }
      />
    </Router>
  );
};
