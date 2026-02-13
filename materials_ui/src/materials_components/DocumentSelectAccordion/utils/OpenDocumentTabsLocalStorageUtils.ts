import { z } from 'zod';
import { safeJsonParse } from './generalUtils';

const openTabsSchema = z.object({
  openDocumentIds: z.array(z.string()),
  activeDocumentId: z.string()
});

type OpenTabsState = z.infer<typeof openTabsSchema>;

export const createOpenDocumentTabsKey = (caseId: number) =>
  `openDocumentTabs-${caseId}`;

export const safeGetOpenDocumentTabsFromLocalStorage = (
  caseId: number
): OpenTabsState | null => {
  const key = createOpenDocumentTabsKey(caseId);
  const parsed = safeJsonParse(window.localStorage.getItem(key));
  const validated = openTabsSchema.safeParse(parsed.data);
  return validated.success ? validated.data : null;
};

export const safeSetOpenDocumentTabsFromLocalStorage = (p: {
  caseId: number;
  openDocumentIds: string[];
  activeDocumentId: string;
}) => {
  const key = createOpenDocumentTabsKey(p.caseId);
  window.localStorage.setItem(
    key,
    JSON.stringify({
      openDocumentIds: p.openDocumentIds,
      activeDocumentId: p.activeDocumentId
    })
  );
};

export const clearOpenDocumentTabsFromLocalStorage = (caseId: number) => {
  const key = createOpenDocumentTabsKey(caseId);
  window.localStorage.removeItem(key);
};
