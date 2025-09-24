import { CaseInfoType } from '../schemas/caseinfo';
import { CASEWORK_APP_URL } from '../constants/url';

export const linkToRedact = (caseInfo: CaseInfoType, materialId: number) => {
  window.open(
    `${CASEWORK_APP_URL}/polaris-ui/case-details/${caseInfo?.urn}/${caseInfo?.id}/CMS-${materialId}`,
    '_newtab'
  );
};
