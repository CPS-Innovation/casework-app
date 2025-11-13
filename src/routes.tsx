import { useEffect } from 'react';
import { Route, Routes as Router } from 'react-router';
import { useMatch } from 'react-router-dom';

import { ReviewAndRedactPage } from './caseWorkApp/pages/ReviewAndRedactPage';
import { useAppRoute, useCaseInfo, useCaseInfoStore } from './hooks';
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
  const { getRoute } = useAppRoute();
  const match = useMatch('/:urn/:caseId/*');
  const { caseId, urn } = match?.params || {};

  const { caseInfo } = useCaseInfo({ caseId, urn });
  const { setCaseInfo } = useCaseInfoStore();

  useEffect(() => {
    if (caseInfo) {
      setCaseInfo(caseInfo);
    }
  }, [caseInfo]);

  return (
    <Router>
      <Route
        path={getRoute('UNAUTHORISED', false)}
        element={<NotAuthorisedPage />}
      />
      <Route
        path={getRoute('SERVER_ERROR', false)}
        element={<ServerErrorPage />}
      />

      <Route path={`:urn/:caseId`}>
        <Route
          path={getRoute('DISCARD', false)}
          element={<DiscardMaterialPage />}
        />
        <Route
          path={`${getRoute('PCD_REQUEST', false)}/:pcdId?`}
          element={<PcdRequestPage />}
        />
        <Route
          path={getRoute('MATERIALS', false)}
          element={<MaterialsPage />}
        />
        <Route
          path={getRoute('COMMUNICATIONS', false)}
          element={<CommunicationsPage />}
        />
        <Route
          path={getRoute('REVIEW_REDACT', false)}
          element={<ReviewAndRedactPage />}
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Router>
  );
};
