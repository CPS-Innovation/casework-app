import { http, HttpResponse } from 'msw';
import { API_ENDPOINTS } from '../constants/url.ts';
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

  http.get('cases/2147043/history/pre-charge-decision', () => {
    return HttpResponse.json(mockPcdReview, { status: 200 });
  }),

  http.get('cases/2147043/history/initial-review', () => {
    return HttpResponse.json(mockPcdInitialReviewResponse, { status: 200 });
  }),

  http.get('cases/2147043/history', () => {
    return HttpResponse.json(mockPcdCaseHistory, { status: 200 });
  })
];
