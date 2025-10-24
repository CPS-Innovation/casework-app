import { useEffect, useState } from 'react';
import '../App.scss';
import {
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
  useCaseInfoStore,
  useCaseMaterial,
  useCaseMaterials,
  useFeatureFlag,
  useTableActions
} from '../hooks';
import { useSelectedItemsStore } from '../stores';

export const CommunicationsPage = () => {
  const hasAccess = useFeatureFlag();
  const { setBanner, resetBanner } = useBanner();
  const { loading: caseMaterialsLoading, mutate: refreshCommunications } =
    useCaseMaterials('communications');
  const { deselectMaterial } = useCaseMaterial();

  const { caseInfo } = useCaseInfoStore();

  const [showFilter, setShowFilter] = useState(true);
  const { items: selectedItems, clear: clearSelectedItems } = useSelectedItemsStore();

  const [isRenameDrawerOpen, setIsRenameDrawerOpen] = useState(false);
  const [renamedMaterialId, setRenamedMaterialId] = useState<number | null>(null);

  const {
    handleRenameClick,
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
    resetBanner,
    setIsRenameDrawerOpen,
    setRenamedMaterialId
  });

  const row = selectedItems.communications?.[0];

  const menuItems = [
    {
      label: 'Rename',
      onClick: () => handleRenameClick(),
      hide:
        (row?.documentTypeId && [1031, 1059].includes(row?.documentTypeId)) ||
        selectedItems.communications.length > 1
    },
    {
      label: 'Reclassify',
      onClick: () => handleReclassifyClick(),
      hide: !hasAccess([5]) || !row?.isReclassifiable || selectedItems.communications.length > 1
    },
    {
      label: 'Redact',
      onClick: () => {
        if (row) handleRedactClick(row.materialId);
      },
      hide: !hasAccess([2, 3, 4, 5]) || selectedItems.communications.length > 1
    },
    {
      label: 'Discard',
      onClick: () => handleDiscardClick(URL.COMMUNICATIONS),
      hide: !hasAccess([2, 3, 4, 5]) || selectedItems.communications.length > 1
    },
    {
      label: determineReadStatusLabel(selectedItems.communications),
      onClick: () => handleReadStatusClick(selectedItems.communications),
      hide: !hasAccess([2, 3, 4, 5])
    },
    { label: 'Mark as unused', onClick: () => handleUnusedClick(URL.COMMUNICATIONS) }
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
      {isRenameDrawerOpen && row && (
        <RenameDrawer
          material={row}
          onCancel={() => {
            setIsRenameDrawerOpen(false);
          }}
          onSuccess={async () => {
            await refreshCommunications();

            setRenamedMaterialId(row.id);
            setIsRenameDrawerOpen(false);
            deselectMaterial();
            setBanner({
              type: 'success',
              header: 'Renaming successful',
              content: 'Material successfully renamed.'
            });
          }}
        />
      )}

      <TwoCol sidebar={showFilter ? <CommsFilters /> : undefined}>
        {caseMaterialsLoading ? (
          <LoadingSpinner />
        ) : isReadStatusUpdating ? (
          <LoadingSpinner textContent="Updating read status..." />
        ) : (
          <>
            <TableActions
              showFilter={showFilter}
              onSetShowFilter={setShowFilter}
              menuItems={menuItems}
              selectedItems={selectedItems.communications}
            />
            <CommunicationsTable
              renamedMaterialId={renamedMaterialId}
              setRenamedMaterialId={setRenamedMaterialId}
            />

            {/* <div className="action-on-selection-container">
              <ButtonMenuComponent
                menuTitle="Action on selection"
                menuItems={menuItems}
                isDisabled={selectedItems.communications?.length === 0}
              />
            </div> */}
          </>
        )}
      </TwoCol>
    </div>
  );
};
