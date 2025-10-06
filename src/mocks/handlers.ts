import { http, HttpResponse } from 'msw';
import { API_ENDPOINTS } from '../constants/url.ts';

import { PCDListingType } from '../schemas/pcd.ts';
import { mockPcdListResponse, mockPcdRequestResponse } from './data/pcdRequest';
import {
  mockPcdCaseHistory,
  mockPcdInitialReviewResponse,
  mockPcdReview
} from './data/pcdReview';

export const handlers = [
  http.get(API_ENDPOINTS.CASE_MATERIALS, () => {
    return HttpResponse.json(
      { message: 'Unprocessable Entity' },
      { status: 422 }
    );
  }),

  http.get(
    'https://polaris-dev-cmsproxy.azurewebsites.net/case/:caseId/pcd-requests/core',
    () => {
      return HttpResponse.json(mockPcdListResponse, { status: 200 });
    }
  ),

  http.get(
    'https://polaris-dev-cmsproxy.azurewebsites.net/case/:caseId/pcd-request/:pcdId',
    (req) => {
      const { pcdId } = req.params;
      const pcdListItem = mockPcdListResponse.find(
        (item) => item.id.toString() === pcdId?.toString()
      ) as PCDListingType;

      return HttpResponse.json(
        mockPcdRequestResponse({
          id: pcdListItem.id,
          decisionRequested: pcdListItem.decisionRequested,
          decisionRequiredBy: pcdListItem.decisionRequiredBy
        }),
        { status: 200 }
      );
    }
  ),

  http.get(
    'http://localhost:3000/cases/:caseId/history/pre-charge-decision',
    () => {
      return HttpResponse.json(mockPcdReview, { status: 200 });
    }
  ),

  http.get('http://localhost:3000/cases/:caseId/history/initial-review', () => {
    return HttpResponse.json(mockPcdInitialReviewResponse, { status: 200 });
  }),

  http.get('http://localhost:3000/cases/:caseId/history', () => {
    return HttpResponse.json(mockPcdCaseHistory, { status: 200 });
  })
];
