import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { READ_STATUS } from '../constants';
import { URL } from '../constants/url';
import { SelectedItemsContext } from '../context/SelectedItemsContext';
import { useReadStatus } from '../hooks';
import { CaseInfoType, CaseMaterialsType } from '../schemas/';
import { linkToRedact } from '../utils/materials';

type TableActionsProps = {
  selectedItems: CaseMaterialsType[];
  refreshData: () => void;
  setBanner: (banner: {
    type: 'success' | 'error' | 'important';
    header: string;
    content: string;
  }) => void;
  deselectItem: () => void;
  caseInfoData?: CaseInfoType;
  resetBanner: () => void;
  setIsRenameDrawerOpen: (isOpen: boolean) => void;
  setRenamedMaterialId: (id: number | null) => void;
};

export const useTableActions = ({
  selectedItems,
  refreshData,
  setBanner,
  deselectItem,
  caseInfoData,
  resetBanner,
  setIsRenameDrawerOpen,
  setRenamedMaterialId
}: TableActionsProps) => {
  const navigate = useNavigate();
  const { trigger } = useReadStatus();
  const { setSelectedItems } = useContext(SelectedItemsContext);
  const [isReadStatusUpdating, setIsReadStatusUpdating] = useState(false);

  const handleRenameClick = () => {
    setIsRenameDrawerOpen(true);
    setRenamedMaterialId(null);
  };

  const handleReclassifyClick = () => {
    navigate(URL.RECLASSIFY, { state: { row: selectedItems[0] } });
  };

  const handleDiscardClick = (returnToUrl: string) => {
    navigate(URL.DISCARD_MATERIAL, {
      state: { row: selectedItems[0], returnTo: returnToUrl }
    });
  };

  const handleRedactClick = (materialId: number) => {
    if (caseInfoData) {
      linkToRedact(caseInfoData, materialId);
    }
  };

  const handleUnusedClick = (returnTo: string) => {
    resetBanner();
    navigate(URL.CHECK_YOUR_SELECTION, { state: { returnTo } });
  };

  const determineReadStatusLabel = (items: CaseMaterialsType[]) => {
    if (items?.every((item) => item.readStatus === READ_STATUS.READ)) {
      return 'Mark as unread';
    } else if (items?.every((item) => item.readStatus === READ_STATUS.UNREAD)) {
      return 'Mark as read';
    } else {
      return 'Mark as read/unread';
    }
  };

  const handleReadStatusClick = async (rows: CaseMaterialsType[]) => {
    setIsReadStatusUpdating(true);

    try {
      for (const row of rows) {
        await trigger({
          materialId: row.materialId,
          state: row.readStatus === READ_STATUS.READ ? 'unread' : 'read',
          correspondenceId: uuidv4()
        });
      }

      await refreshData();
      deselectItem();
      setSelectedItems([]);
      setBanner({
        type: 'success',
        header: 'Read status updated',
        content: 'Selected items have been updated.'
      });
    } catch (error) {
      console.error('Error updating read status:', error);
      setBanner({
        type: 'error',
        header: 'Error updating read status',
        content:
          'There was an error updating the read status of the selected items.'
      });
    } finally {
      setIsReadStatusUpdating(false);
    }
  };

  return {
    handleRenameClick,
    handleReclassifyClick,
    handleDiscardClick,
    handleRedactClick,
    handleUnusedClick,
    determineReadStatusLabel,
    handleReadStatusClick,
    isReadStatusUpdating
  };
};
