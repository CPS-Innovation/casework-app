import { http, HttpResponse } from 'msw';
import { API_ENDPOINTS } from '../constants/url.ts';
import { CaseInfoResponseType } from '../schemas/caseinfo.ts';

export const handlers = [
  http.get(API_ENDPOINTS.CASE_MATERIALS, () => {
    return HttpResponse.json(
      { message: 'Unprocessable Entity' },
      { status: 422 }
    );
  }),
  http.get(API_ENDPOINTS.CASE_INFO, () => {
    const caseInfoSummary: CaseInfoResponseType = {
      id: 1,
      urn: '06SC1234572',
      leadDefendantFirstNames: 'James',
      leadDefendantSurname: 'Chapman',
      numberOfDefendants: 2
    };
    return HttpResponse.json(caseInfoSummary, { status: 200 });
  })
];
