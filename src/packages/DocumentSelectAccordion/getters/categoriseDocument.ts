import { TDocumentList } from './useGetCaseDocumentList';

export const categoryDetails = [
  { label: 'Reviews', categoryName: 'review' },
  { label: 'Case overview', categoryName: 'caseOverview' },
  { label: 'Statements', categoryName: 'statement' },
  { label: 'Exhibits', categoryName: 'exhibit' },
  { label: 'Forensics', categoryName: 'forensic' },
  { label: 'Unused material', categoryName: 'unusedMaterial' },
  { label: 'Defendant', categoryName: 'defendant' },
  { label: 'Court preparation', categoryName: 'courtPreparation' },
  { label: 'Communication', categoryName: 'communication' },
  { label: 'Uncategorised', categoryName: 'uncategorised' }
] as const;

type TCategoryName = (typeof categoryDetails)[number]['categoryName'];

export const initDocsOnDocCategoryNamesMap = (): {
  [k in TCategoryName]: TDocumentList;
} => ({
  review: [],
  caseOverview: [],
  statement: [],
  exhibit: [],
  forensic: [],
  unusedMaterial: [],
  defendant: [],
  courtPreparation: [],
  communication: [],
  uncategorised: []
});
