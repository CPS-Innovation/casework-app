import { z } from 'zod';

export const NextEventLinkSchema = z.array(
  z.object({
    id: z.number(),
    href: z.string(),
    rel: z.string(),
    type: z.string()
  })
);

export const MonitoringCodesSchema = z.array(
  z.object({
    code: z.string(),
    description: z.string(),
    type: z.number(),
    disabled: z.boolean(),
    isAssigned: z.boolean()
  })
);

export const DgAssessmentItemsSchema = z.array(
  z.object({
    itemName: z.string(),
    title: z.string(),
    description: z.string(),
    comment: z.string()
  })
);

export const DgDetailsSchema = z.object({
  assessmentApplicable: z.string(),
  datePapersReceived: z.string(),
  dgAssessmentItems: DgAssessmentItemsSchema,
  policeResponse: z.string(),
  principalOffenceCategory: z.string(),
  stageAssessmentCompleted: z.string(),
  submissionDgComplaint: z.string()
});

export const PCDInitialReviewSchema = z.object({
  allocation: z.string(),
  caseId: z.number(),
  caseSummary: z.string(),
  consultationType: z.string(),
  currentEvent: z.object({
    authorOrVenue: z.string(),
    date: z.string(),
    id: z.number(),
    name: z.string(),
    type: z.number()
  }),
  dgDetails: DgDetailsSchema,
  dgSummary: z.string(),
  disclosureActionsAndIssues: z.string(),
  europeanCourtOfHumanRights: z.string(),
  eventDate: z.string(),
  evidentialAssessment: z.string(),
  historyEventType: z.number(),
  id: z.number(),
  instructionsToOperationsDeliveryOrAdvocate: z.string(),
  isCompleted: z.boolean(),
  monitoringCodes: MonitoringCodesSchema,
  nextEventLink: NextEventLinkSchema,
  prosecutorDeclaration: z.string(),
  publicInterestAssessment: z.string(),
  reviewSummary: z.string(),
  trialStrategy: z.string(),
  witnessOrVictimInformationAndActions: z.string()
});

export const DefendantDecisionsSchema = z.array(
  z.object({
    decision: z.number(),
    decisionDescription: z.string(),
    defendantName: z.string(),
    id: z.number(),
    keyFactor: z.string(),
    natureOfDecision: z.string(),
    pCDPrincipalOffenceCategory: z.string(),
    proposedCharge: z.string(),
    reason: z.string(),
    returnBailDate: z.string(),
    specifiedCharges: z.string(),
    reasonCode: z.string(),
    publicInterestCode: z.string()
  })
);

export const PCDHistoryActionPlanSchema = z.array(
  z.object({
    actionDate: z.string(),
    actionPoint: z.string(),
    actionType: z.string(),
    cpscovidUrgency: z.string(),
    entryDate: z.string(),
    policeCovidUrgency: z.string(),
    status: z.string(),
    suspect: z.string()
  })
);

const CurrentEventSchema = z.object({
  id: z.number(),
  name: z.string(),
  date: z.string(),
  authorOrVenue: z.string(),
  type: z.number()
});

export const PCDReviewSchema = z.object({
  actionPlan: z.boolean(),
  author: z.string(),
  cPSCOVIDUrgency: z.string(),
  caseId: z.number(),
  currentEvent: CurrentEventSchema,
  decisionMadeBy: z.string(),
  decisionMadeDateTime: z.string(),
  decisionRequestedDate: z.string(),
  defendantDecisions: DefendantDecisionsSchema,
  eventDate: z.string(),
  historyEventType: z.number(),
  id: z.number(),
  investigationStage: z.string(),
  isCompleted: z.boolean(),
  method: z.string(),
  nextEventLink: NextEventLinkSchema,
  pcdHistoryActionPlan: PCDHistoryActionPlanSchema,
  policeCovidUrgency: z.string(),
  urn: z.string()
});

export type PCDInitialReviewResponseType = z.infer<
  typeof PCDInitialReviewSchema
>;
export type PCDReviewResponseType = z.infer<typeof PCDReviewSchema>;
export type CaseHistoryResponseType = z.infer<typeof CurrentEventSchema>;
