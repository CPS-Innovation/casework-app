import { http, HttpResponse } from 'msw';
import { API_ENDPOINTS, POLARIS_GATEWAY_URL } from '../constants/url.ts';
import { mockCaseMaterials } from './data/caseMaterials';

import { PCDListingType } from '../schemas/pcd';
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

  http.get(`${POLARIS_GATEWAY_URL}/case/:caseId/pcd-requests/core`, () => {
    return HttpResponse.json(mockPcdListResponse, { status: 200 });
  }),

  http.get(`${POLARIS_GATEWAY_URL}/case/:caseId/pcd-request/:pcdId`, (req) => {
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
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return HttpResponse.json(mockCaseMaterials(), { status: 200 });
    }
  ),

  http.patch(`${POLARIS_GATEWAY_URL}/material/rename`, async ({ request }) => {
    const body = (await request.json()) as {
      materialId: number;
      subject: string;
    };

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return HttpResponse.json(
      { updateCommunication: { id: body.materialId } },
      { status: 200 }
    );
  }),

  http.post(`${POLARIS_GATEWAY_URL}/hk-logger`, async ({ request }) => {
    const body = (await request.json()) as {
      logLevel: number;
      message: string;
    };

    console.log('HK Logger mocked');
    console.table(body);

    return HttpResponse.json({}, { status: 200 });
  })
];
