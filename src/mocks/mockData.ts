import { CaseInfoResponseType } from '../schemas/caseinfo';
import {
  CaseHistoryResponseType,
  PCDInitialReviewResponseType,
  PCDReviewResponseType
} from '../schemas/pcdReview';

export const mockCaseInfoSummary: CaseInfoResponseType = {
  id: 2147043,
  urn: '06SC1234572',
  leadDefendantFirstNames: 'James',
  leadDefendantSurname: 'Chapman',
  numberOfDefendants: 2
};

export const mockPcdReview: PCDReviewResponseType = {
  actionPlan: true,
  author: 'Author Name',
  cPSCOVIDUrgency: 'High',
  caseId: 2147043,
  currentEvent: {
    id: 1,
    name: 'Current Event',
    date: '2023-01-01',
    authorOrVenue: 'Author 1',
    type: 1
  },
  decisionMadeBy: 'Decision Maker',
  decisionMadeDateTime: '2023-01-02T10:00:00Z',
  decisionRequestedDate: '2023-01-01',
  defendantDecisions: [
    {
      decision: 1,
      decisionDescription: 'Decision Description',
      defendantName: 'Defendant 1',
      id: 1,
      keyFactor: 'Key Factor',
      natureOfDecision: 'Nature of Decision',
      pCDPrincipalOffenceCategory: 'Offence Category',
      proposedCharge: 'Proposed Charge',
      reason: 'Reason',
      returnBailDate: '2023-01-10',
      specifiedCharges: 'Specified Charges',
      reasonCode: 'Reason Code',
      publicInterestCode: 'Public Interest Code'
    }
  ],
  eventDate: '2023-01-01',
  historyEventType: 1,
  id: 1,
  investigationStage: 'Investigation Stage',
  isCompleted: true,
  method: 'In Person',
  nextEventLink: [{ id: 2, href: '/events/2', rel: 'next', type: 'GET' }],
  pcdHistoryActionPlan: [
    {
      actionDate: '2023-01-05',
      actionPoint: 'Action Point 1',
      actionType: 'Action Type 1',
      cpscovidUrgency: 'Low',
      entryDate: '2023-01-01',
      policeCovidUrgency: 'Medium',
      status: 'Open',
      suspect: 'Suspect 1'
    }
  ],
  policeCovidUrgency: 'Medium',
  urn: '06SC1234572'
};

export const mockPcdInitialReviewResponse: PCDInitialReviewResponseType = {
  allocation: 'STANDARD',
  caseId: 2147043,
  caseSummary: 'Case summary text',
  consultationType: 'Consultation type text',
  currentEvent: {
    authorOrVenue: 'Author or venue text',
    date: '2023-01-01',
    id: 1,
    name: 'Event name text',
    type: 1
  },
  dgDetails: {
    assessmentApplicable: 'Yes',
    datePapersReceived: '2023-01-01',
    dgAssessmentItems: [
      {
        itemName: 'Item 1',
        title: 'Title 1',
        description: 'Description for item 1',
        comment: 'Comment for item 1'
      }
    ],
    policeResponse: 'Police response text',
    principalOffenceCategory: 'Theft',
    stageAssessmentCompleted: 'Yes',
    submissionDgComplaint: 'Submission DG complaint text'
  },
  dgSummary: 'DG summary text',
  disclosureActionsAndIssues: 'Disclosure actions and issues text',
  europeanCourtOfHumanRights: 'European Court of Human Rights text',
  eventDate: '2023-01-01',
  evidentialAssessment: 'Evidential assessment text',
  historyEventType: 1,
  id: 1,
  instructionsToOperationsDeliveryOrAdvocate:
    'Instructions to operations delivery or advocate text',
  isCompleted: true,
  monitoringCodes: [
    {
      code: 'MC1',
      description: 'Monitoring code 1 description',
      type: 1,
      disabled: false,
      isAssigned: true
    }
  ],
  nextEventLink: [{ id: 2, href: '/events/2', rel: 'next', type: 'GET' }],
  prosecutorDeclaration: 'Prosecutor declaration text',
  publicInterestAssessment: 'Public interest assessment text',
  reviewSummary: 'Review summary text',
  trialStrategy: 'Trial strategy text',
  witnessOrVictimInformationAndActions:
    'Witness or victim information and actions text'
};

export const mockPcdCaseHistory: CaseHistoryResponseType[] = [
  {
    id: 4239409,
    name: 'Pre-charge Decision',
    date: '2023-01-01',
    type: 3,
    authorOrVenue: 'Author 1'
  }
];
