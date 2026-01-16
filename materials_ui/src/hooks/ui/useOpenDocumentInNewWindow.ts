import { useCaseInfoStore } from '../../stores';
import { useRequest } from './useRequest';

export const useOpenDocumentInNewWindow = () => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();

  const windowWidth = 1200;
  const windowHeight = 800;

  const getCenteredWindowPosition = () => {
    const left = (window.screen.width - windowWidth) / 2;
    const top = (window.screen.height - windowHeight) / 2;

    return `width=${windowWidth},height=${windowHeight},top=${top},left=${left},scrollbars=yes,resizable=yes`;
  };

  const openSinglePreview = async (materialId: number) => {
    if (!caseInfo) return;

    const win = window.open('', '_blank', getCenteredWindowPosition());

    if (!win) return;

    win.document.title = 'Loading material preview...';
    win.document.body.innerHTML =
      '<p style="font-family: Arial; text-align: center; padding: 16px; font-weight: bold;">Loading preview...</p>';

    try {
      const response = await request.get(
        `/urns/${caseInfo?.urn}/cases/${caseInfo?.id}/materials/${materialId}/preview`,
        { responseType: 'blob' }
      );

      const blob = response.data;
      const pdfUrl = URL.createObjectURL(blob);

      win.location.href = pdfUrl;

      win.addEventListener('load', () => {
        URL.revokeObjectURL(pdfUrl);
      });
    } catch (error) {
      win.document.body.innerHTML =
        '<p style="font-family: Arial; color: red; text-align: center;">Failed to load preview</p>';

      console.error('Error opening document preview:', error);
    }
  };

  const openPreview = async (materialId: number | number[]) => {
    if (!caseInfo) return;

    if (Array.isArray(materialId)) {
      materialId.forEach((id) => {
        openSinglePreview(id);
      });
    } else {
      await openSinglePreview(materialId);
    }
  };

  return { openPreview };
};
