import { CaseHistoryResponseType } from '../../../src/schemas/pcdReview';
const PcdReviewHistoryDataResponse: CaseHistoryResponseType[] = [
  {
    id: 4378647,
    name: 'New Vic/Wit: Marge SIMPSON',
    date: '07/05/2025',
    authorOrVenue: 'CPS (Electronic)',
    type: 6
  },
  {
    id: 4380514,
    name: 'Initial Review',
    date: '19/05/2025',
    authorOrVenue: 'Erika Farrugia',
    type: 1
  },
  {
    id: 4380522,
    name: 'Pre-charge Decision',
    date: '19/05/2025',
    authorOrVenue: 'Erika Farrugia',
    type: 3
  }
];

export const mockPcdReviewHistoryDataResponse = (
  overwrite?: Partial<CaseHistoryResponseType>
) => {
  return PcdReviewHistoryDataResponse.map(
    (currentPcdReviewHistoryDataResponse) => ({
      ...currentPcdReviewHistoryDataResponse,
      ...overwrite
    })
  );
};
