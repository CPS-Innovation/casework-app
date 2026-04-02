import { TDeletion } from '../../PdfRedactor/utils/deletionUtils';

export type TRedactionDetail = { redactionId: string; randomId: string };
export type TDeletionDetail = { deletionId: string; randomId: string };

export const combineDeletionsWithDeletionDetails = (p: {
  deletions: TDeletion[];
  deletionDetails: TDeletionDetail[];
}) => {
  const deletionsWithDetails = p.deletions
    .map((x) => {
      const thisDetails = p.deletionDetails.find((y) => y.deletionId === x.id);
      if (!thisDetails) return undefined;
      return { ...x, ...thisDetails };
    })
    .filter((x) => !!x);
  return deletionsWithDetails;
};
