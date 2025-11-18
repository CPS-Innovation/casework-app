import { PCDReviewResponseType } from '../../../src/schemas/pcdReview';

const PcdReviewReviewDataResponse: PCDReviewResponseType = {
  author: 'Erika Farrugia',
  caseId: 2161796,
  decisionRequestedDate: '01/05/2025',
  decisionMadeDateTime: '19/05/2025 16:42',
  defendantDecisions: [
    {
      id: 2785312,
      defendantName: 'SIMPSON Homer',
      decisionDescription: 'K - No Prosecution - Evidential',
      decision: 15,
      reason: 'K - No Prosecution - Evidential',
      keyFactor: '',
      natureOfDecision: 'K - No Prosecution - Evidential',
      specifiedCharges: '',
      returnBailDate: '25/05/2025',
      proposedCharge: 'PL96002',
      pCDPrincipalOffenceCategory: '',
      reasonCode: 'K',
      publicInterestCode: ''
    },
    {
      id: 2785313,
      defendantName: 'SIMPSON Bart',
      decisionDescription: 'C - Simple Caution',
      decision: 3,
      reason: 'C - Simple Caution',
      keyFactor: '',
      natureOfDecision: 'K - No Prosecution - Evidential',
      specifiedCharges: '',
      returnBailDate: '25/05/2025',
      proposedCharge: 'PL96002',
      pCDPrincipalOffenceCategory: '',
      reasonCode: 'C',
      publicInterestCode: 'D77 - Public Interest Code'
    }
  ],
  eventDate: '19/05/2025',
  id: 4380522,
  isCompleted: true,
  historyEventType: 3,
  investigationStage: 'Post Arrest',
  method: 'Area',
  decisionMadeBy: 'Erika Farrugia',
  actionPlan: true,
  policeCovidUrgency: 'Unknown',
  cPSCOVIDUrgency: '',
  pcdHistoryActionPlan: [
    {
      actionType: 'Action Plan',
      entryDate: '19/05/2025',
      actionDate: '25/05/2025',
      suspect: 'SIMPSON Bart',
      status: 'Sent on PCD Response',
      actionPoint:
        'Requested:\n- Victim Personal Statement;\n(Please provide the witness personal statement as we can see what was actually said as this is missing from the files)',
      policeCovidUrgency: '',
      cpscovidUrgency: ''
    },
    {
      actionType: 'Action Plan',
      entryDate: '19/05/2025',
      actionDate: '26/05/2025',
      suspect: 'SIMPSON Homer',
      status: 'Sent on PCD Response',
      actionPoint:
        'Requested:\n- Medical Evidence;\n(Send us the medical evidence of the injuries incurred as a result of the assault)',
      policeCovidUrgency: '',
      cpscovidUrgency: ''
    },
    {
      actionType: 'Action Plan',
      entryDate: '19/05/2025',
      actionDate: '27/05/2025',
      suspect: 'All',
      status: 'Sent on PCD Response',
      actionPoint:
        'Requested:\n- Unused/Sensitive Material;\n(Any further Unused Material that may be needed for a further review)',
      policeCovidUrgency: '',
      cpscovidUrgency: ''
    }
  ],
  urn: '16XL9132025',
  currentEvent: {
    id: 4380522,
    name: 'Pre-charge Decision',
    date: '19/05/2025',
    authorOrVenue: 'Erika Farrugia',
    type: 3
  },
  nextEventLink: [
    {
      id: 4380522,
      href: 'api/cases/2161796/history?caseId=4380522&historyType=3',
      rel: 'PreChargeDecision',
      type: 'GET'
    }
  ]
};

export const mockPcdReviewReviewDataResponse = (
  overwrite?: Partial<PCDReviewResponseType>
) => {
  return { ...PcdReviewReviewDataResponse, ...overwrite };
};
