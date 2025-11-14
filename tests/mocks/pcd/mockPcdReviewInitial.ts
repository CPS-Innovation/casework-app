import { PCDInitialReviewResponseType } from '../../../src/schemas/pcdReview';

const PcdReviewInitialDataResponse: PCDInitialReviewResponseType = {
  caseId: 2161796,
  allocation:
    'Make your recommendation for how the case should be allocated and describe your reasoning for it.',
  caseSummary:
    'Give a brief overview of the proposed charges by the police and the offences you are considering, potential legal issues and the current bail or remand status of the suspects. You should also outline your rationale for applying the Full Code Test.',
  disclosureActionsAndIssues:
    'Think about what steps to take regarding disclosing information now. Try to anticipate issues that might come up as the cases progresses.',
  europeanCourtOfHumanRights:
    'Human rights factors are not an issue in this case at this time',
  evidentialAssessment:
    'Explain if and how the evidence proves all elements of the offence or offences in accordance with the Full Code Test. Your assessment should anticipate any likely issues for trial and suggest ways to overcome potential challenges to the prosecution case.',
  id: 4380514,
  instructionsToOperationsDeliveryOrAdvocate:
    'Provide a summary of notes and actions for a prosecuting advocate and operational delivery staff.',
  publicInterestAssessment:
    'A prosecution will usually take place unless you are satisfied that there are public interest factors tending against it, which outweigh those tending in favour. Based on your analysis of the case, explain if and how a prosecution is in the public interest, referencing relevant parts of the Code to support your rationale.',
  consultationType: 'Full Code Test',
  trialStrategy:
    'Outline the trial strategy you’ve identified to best support a successful prosecution.',
  witnessOrVictimInformationAndActions:
    'Highlight key witness and victim information and actions to help them support the case.',
  historyEventType: 1,
  reviewSummary: 'PCD Case Analysis',
  prosecutorDeclaration:
    'I confirm that I have considered the impact of potentially disclosable material, on the decision to charge or continue with proceedings, including any unexamined material or material that could be obtained through further reasonable lines of inquiry',
  monitoringCodes: [
    {
      code: '',
      description: 'Domestic Violence',
      type: 0,
      disabled: false,
      isAssigned: true
    },
    {
      code: '',
      description: 'Pre-Charge Decision',
      type: 0,
      disabled: false,
      isAssigned: true
    },
    {
      code: '',
      description: 'Rape',
      type: 0,
      disabled: false,
      isAssigned: true
    },
    {
      code: '',
      description: 'Vulnerable/Intimidated victim',
      type: 0,
      disabled: false,
      isAssigned: true
    }
  ],
  isCompleted: true,
  eventDate: '19/05/2025',
  dgSummary: 'Yes',
  dgDetails: {
    assessmentApplicable: '',
    datePapersReceived: '1900-01-01T00:00:00',
    principalOffenceCategory: 'Not applicable',
    stageAssessmentCompleted: 'PCD',
    submissionDgComplaint: 'Yes',
    dgAssessmentItems: [
      { itemName: '', title: '', description: '', comment: '' },
      { itemName: '', title: '', description: '', comment: '' },
      { itemName: '', title: '', description: '', comment: '' },
      { itemName: '', title: '', description: '', comment: '' }
    ],
    policeResponse: ''
  },
  currentEvent: {
    id: 4380514,
    name: 'Initial Review',
    date: '19/05/2025',
    authorOrVenue: 'Erika Farrugia',
    type: 1
  },
  nextEventLink: [
    {
      id: 4380514,
      href: 'api/cases/2161796/history?caseId=4380514&historyType=1',
      rel: 'InitialReview',
      type: 'GET'
    }
  ]
};

export const mockPcdReviewInitialDataResponse = (
  overwrite?: Partial<PCDInitialReviewResponseType>
) => {
  return { ...PcdReviewInitialDataResponse, ...overwrite };
};
