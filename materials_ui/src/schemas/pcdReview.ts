import { z } from 'zod';

import { PcdReviewCoreType } from '../constants/enum';

const PcdReviewCoreTypeSchema = z.union([
  z.literal(PcdReviewCoreType.EarlyAdvice),
  z.literal(PcdReviewCoreType.InitialReview),
  z.literal(PcdReviewCoreType.PreChargeDecisionAnalysis)
]);

const CurrentEventSchema = z.object({
  id: z.number(),
  name: z.string(),
  date: z.string(),
  authorOrVenue: z.string(),
  type: z.number()
});

const NextEventLinkSchema = z.array(
  z.object({
    id: z.number(),
    href: z.string(),
    rel: z.string(),
    type: z.string()
  })
);

const MonitoringCodesSchema = z.array(
  z.object({
    code: z.string(),
    description: z.string(),
    type: z.number(),
    disabled: z.boolean(),
    isAssigned: z.boolean()
  })
);

const DgAssessmentItemsSchema = z.array(
  z.object({
    itemName: z.string(),
    title: z.string(),
    description: z.string(),
    comment: z.string()
  })
);

const DgDetailsSchema = z.object({
  assessmentApplicable: z.boolean(),
  datePapersReceived: z.string(),
  dgAssessmentItems: DgAssessmentItemsSchema,
  policeResponse: z.string(),
  principalOffenceCategory: z.string(),
  stageAssessmentCompleted: z.string(),
  submissionDgCompliant: z.string()
});

const PCDInitialReviewSchema = z.object({
  allocation: z.string(),
  caseId: z.number(),
  caseSummary: z.string(),
  consultationType: z.string(),
  currentEvent: CurrentEventSchema,
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

const DefendantDecisionSchema = z.object({
  decision: z.number(),
  decisionDescription: z.string(),
  defendantName: z.string(),
  id: z.number(),
  keyFactor: z.string(),
  natureOfDecision: z.string(),
  pcdPrincipalOffenceCategory: z.string(),
  proposedCharge: z.string(),
  publicInterestCode: z.string(),
  reason: z.string(),
  reasonCode: z.string(),
  returnBailDate: z.string(),
  specifiedCharges: z.string()
});

const DefendantDecisionsSchema = z.array(DefendantDecisionSchema);

const PCDHistoryActionPlanSchema = z.array(
  z.object({
    actionDate: z.string(),
    actionPoint: z.string(),
    actionType: z.string(),
    cpsCovidUrgency: z.string(),
    entryDate: z.string(),
    policeCovidUrgency: z.string(),
    status: z.string(),
    suspect: z.string()
  })
);

const PCDReviewSchema = z.object({
  actionPlan: z.boolean(),
  author: z.string(),
  caseId: z.number(),
  cpsCovidUrgency: z.string(),
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

export const PCDReviewCoreSchema = z.array(
  z.object({
    date: z.string(),
    id: z.number(),
    type: PcdReviewCoreTypeSchema
  })
);

const ChargeDetailSchema = z.object({
  code: z.string(),
  description: z.string()
});

const PreChargeDefendantDecisionSchema = DefendantDecisionSchema.extend({
  chargeDetails: z.array(ChargeDetailSchema),
});

const LinkedCaseUrnSchema = z.object({
  urn: z.string(),
  asn: z.string(),
  pncId: z.string(),
  policeCC: z.string()
});

const PreChargeDecisionAnalysisOutcomeSchema =
  PCDInitialReviewSchema.extend({
    dppConsent: z.string(),
    linkedCaseUrns: z.array(LinkedCaseUrnSchema)
  });

const PreChargeDecisionOutcomeDetailSchema = PCDReviewSchema.extend({
  defendantDecisions: z.array(PreChargeDefendantDecisionSchema)
});

export const PCDReviewDetailsSchema = z.object({
  preChargeDecisionAnalysisOutcome: PreChargeDecisionAnalysisOutcomeSchema,
  preChargeDecisionOutcome: PreChargeDecisionOutcomeDetailSchema
});

export type PCDInitialReviewResponseType = z.infer<
  typeof PCDInitialReviewSchema
>;
export type PCDReviewResponseType = z.infer<typeof PCDReviewSchema>;
export type CaseHistoryResponseType = z.infer<typeof CurrentEventSchema>;
export type PCDReviewCoreResponseType = z.infer<typeof PCDReviewCoreSchema>;
export type PCDReviewDetailsResponseType = z.infer<typeof PCDReviewDetailsSchema>;
