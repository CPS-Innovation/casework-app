import { useEffect, useState } from 'react';
import '../App.scss';
import {
  ButtonMenuComponent,
  CommsFilters,
  CommunicationsTable,
  LoadingSpinner,
  RenameDrawer,
  TableActions,
  TwoCol
} from '../components';

import { URL } from '../constants/url';
import {
  useBanner,
  useCaseMaterial,
  useCaseMaterials,
  useTableActions
} from '../hooks';
import { CaseMaterialsType } from '../schemas';
import {
  useCaseInfoStore,
  useMaterialTags,
  useSelectedItemsStore
} from '../stores';

export const CommunicationsPage = () => {
  const [selectedMaterial, setSelectedMaterial] =
    useState<CaseMaterialsType | null>(null);
  const { setBanner, resetBanner } = useBanner();
  const { loading: caseMaterialsLoading, mutate: refreshCommunications } =
    useCaseMaterials({ dataType: 'communications' });
  const { deselectMaterial } = useCaseMaterial();

  const { caseInfo } = useCaseInfoStore();
  const { setTags } = useMaterialTags();

  const [showFilter, setShowFilter] = useState(true);
  const { items: selectedItems, clear: clearSelectedItems } =
    useSelectedItemsStore();

  const {
    handleReclassifyClick,
    handleRedactClick,
    handleDiscardClick,
    handleReadStatusClick,
    handleUnusedClick,
    determineReadStatusLabel,
    isReadStatusUpdating
  } = useTableActions({
    selectedItems: selectedItems.communications,
    refreshData: refreshCommunications,
    setBanner,
    deselectItem: deselectMaterial,
    caseInfoData: caseInfo || undefined,
    resetBanner
  });

  const handleRenameClick = () => {
    if (selectedItems.communications.length) {
      setSelectedMaterial(selectedItems.communications[0]);
    }
  };

  const handleCancelRename = () => {
    setSelectedMaterial(null);
    clearSelectedItems();
  };

  const handleSuccessfulRename = async () => {
    setTags([
      { materialId: selectedMaterial?.materialId as number, tagName: 'Renamed' }
    ]);

    setSelectedMaterial(null);
    deselectMaterial();
    clearSelectedItems('materials');

    setBanner({
      type: 'success',
      header: 'Renaming successful',
      content: 'Material successfully renamed.'
    });

    await refreshCommunications();
  };

  const row = selectedItems.communications?.[0];

  const menuItems = [
    {
      label: 'Rename',
      onClick: handleRenameClick,
      hide:
        [1031, 1059].includes(row?.documentTypeId) ||
        selectedItems.communications.length > 1
    },
    {
      label: 'Reclassify',
      onClick: handleReclassifyClick,
      hide: !row?.isReclassifiable || selectedItems.communications.length > 1
    },
    {
      label: 'Redact',
      onClick: () => handleRedactClick(row.materialId),
      hide: selectedItems.communications.length > 1
    },
    {
      label: 'Discard',
      onClick: () => handleDiscardClick(URL.COMMUNICATIONS),
      hide: selectedItems.communications.length > 1
    },
    {
      label: determineReadStatusLabel(selectedItems.communications),
      onClick: () => handleReadStatusClick(selectedItems.communications)
    },
    {
      label: 'Mark as unused',
      onClick: () => handleUnusedClick(URL.COMMUNICATIONS)
    }
  ];

  useEffect(() => {
    if (isReadStatusUpdating || caseMaterialsLoading) {
      window.scrollTo(0, 0);
    }
  }, [caseMaterialsLoading, isReadStatusUpdating]);

  useEffect(() => {
    clearSelectedItems('communications');
  }, []);

  return (
    <div className="govuk-main-wrapper">
      <RenameDrawer
        material={selectedMaterial}
        onCancel={handleCancelRename}
        onSuccess={handleSuccessfulRename}
      />

      <TwoCol sidebar={showFilter ? <CommsFilters /> : undefined}>
        {caseMaterialsLoading || isReadStatusUpdating ? (
          <LoadingSpinner textContent="Loading communications" />
        ) : (
          <>
            <TableActions
              showFilter={showFilter}
              onSetShowFilter={setShowFilter}
              menuItems={menuItems}
              selectedItems={selectedItems.communications}
            />

            <CommunicationsTable />

            <div className="action-on-selection-container">
              <ButtonMenuComponent
                menuTitle="Action on selection"
                menuItems={menuItems}
                isDisabled={selectedItems.communications?.length === 0}
              />
            </div>
          </>
        )}
      </TwoCol>
    </div>
  );
};
