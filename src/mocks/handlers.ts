import { http, HttpResponse } from 'msw';
import { API_ENDPOINTS, POLARIS_GATEWAY_URL } from '../constants/url.ts';
import { mockCaseMaterials } from './mockCaseMaterials.ts';
import {
  mockCaseInfoSummary,
  mockPcdCaseHistory,
  mockPcdInitialReviewResponse,
  mockPcdReview
} from './mockData.ts';

export const handlers = [
  http.get(API_ENDPOINTS.CASE_MATERIALS, () => {
    return HttpResponse.json(
      { message: 'Unprocessable Entity' },
      { status: 422 }
    );
  }),
  http.get(API_ENDPOINTS.CASE_INFO, () => {
    return HttpResponse.json(mockCaseInfoSummary, { status: 200 });
  }),

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
  }),

  http.get(
    `${POLARIS_GATEWAY_URL}/api/urns/16123630825/cases/2167259/materials`,
    () => {
      return HttpResponse.json(mockCaseMaterials(), { status: 200 });
    }
  )
];
