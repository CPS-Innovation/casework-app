import { useEffect, useState } from 'react';
import '../../App.scss';
import {
  ButtonMenuComponent,
  CaseMaterialsTable,
  LoadingSpinner,
  MaterialsFilters,
  RenameDrawer,
  TableActions,
  TwoCol
} from '../../components';

import {
  useBanner,
  useCaseMaterial,
  useCaseMaterials,
  useFeatureFlag,
  useTableActions
} from '../../hooks';
import { useCaseInfoStore, useSelectedItemsStore } from '../../stores';

import { URL } from '../../constants/url';

export const MaterialsPage = () => {
  const [showFilter, setShowFilter] = useState(true);
  const { mutate: refreshCaseMaterials, loading: caseMaterialsLoading } =
    useCaseMaterials('materials');
  const { items: selectedItems, clear: clearSelectedItems } = useSelectedItemsStore();
  const [isRenameDrawerOpen, setIsRenameDrawerOpen] = useState(false);
  const { setBanner, resetBanner } = useBanner();
  const { deselectMaterial } = useCaseMaterial();
  const [renamedMaterialId, setRenamedMaterialId] = useState<number | null>(null);
  const { caseInfo } = useCaseInfoStore();
  const hasAccess = useFeatureFlag();

  const {
    handleRenameClick,
    handleReclassifyClick,
    handleReadStatusClick,
    handleDiscardClick,
    handleRedactClick,
    handleUnusedClick,
    determineReadStatusLabel,
    isReadStatusUpdating
  } = useTableActions({
    selectedItems: selectedItems.materials,
    refreshData: refreshCaseMaterials,
    setBanner,
    deselectItem: deselectMaterial,
    caseInfoData: caseInfo || undefined,
    resetBanner,
    setIsRenameDrawerOpen,
    setRenamedMaterialId
  });

  const row = selectedItems.materials?.[0];

  const menuItems = [
    {
      label: 'Rename',
      onClick: handleRenameClick,
      hide:
        (row && [1031, 1059].includes(row?.documentTypeId)) || selectedItems.materials?.length > 1
    },
    {
      label: 'Reclassify',
      onClick: () => handleReclassifyClick(),
      hide: !hasAccess([5]) || selectedItems.materials?.length > 1 || !row?.isReclassifiable
    },
    {
      label: 'Redact',
      onClick: () => {
        if (row) handleRedactClick(row?.materialId);
      },
      hide: !hasAccess([2, 3, 4, 5]) || selectedItems.materials?.length > 1
    },
    {
      label: 'Discard',
      onClick: () => handleDiscardClick(URL.MATERIALS),
      disabled: selectedItems.materials?.length > 1,
      hide: !hasAccess([2, 3, 4, 5]) || selectedItems.materials?.length > 1
    },
    {
      label: determineReadStatusLabel(selectedItems.materials),
      onClick: () => handleReadStatusClick(selectedItems.materials),
      hide: !hasAccess([2, 3, 4, 5])
    },
    {
      label: 'Mark as unused',
      onClick: () => handleUnusedClick(URL.MATERIALS),
      hide: selectedItems.materials?.some((item) => item.status === 'Unused')
    }
  ];

  useEffect(() => {
    if (isReadStatusUpdating || caseMaterialsLoading) {
      window.scrollTo(0, 0);
    }
  }, [caseMaterialsLoading, isReadStatusUpdating]);

  useEffect(() => {
    clearSelectedItems('materials');
  }, []);

  return (
    <div
      className={`govuk-main-wrapper ${
        selectedItems.materials?.length > 1 ? 'multiple-selected' : ''
      }`}
    >
      {isRenameDrawerOpen && selectedItems.materials[0] && (
        <RenameDrawer
          material={selectedItems.materials[0]}
          onCancel={() => {
            setIsRenameDrawerOpen(false);
          }}
          onSuccess={async () => {
            await refreshCaseMaterials();

            deselectMaterial();
            setRenamedMaterialId(selectedItems.materials[0]?.id || null);
            clearSelectedItems('materials');

            setIsRenameDrawerOpen(false);
            setBanner({
              type: 'success',
              header: 'Renaming successful',
              content: 'Material successfully renamed.'
            });
          }}
        />
      )}

      <TwoCol sidebar={showFilter ? <MaterialsFilters /> : undefined}>
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
              selectedItems={selectedItems.materials}
            />

            <CaseMaterialsTable
              selectedMaterial={selectedItems.materials?.[0] || null}
              renamedMaterialId={renamedMaterialId}
              setRenamedMaterialId={setRenamedMaterialId}
            />

            <div className="action-on-selection-container">
              <ButtonMenuComponent
                menuTitle="Action on selection"
                menuItems={menuItems}
                isDisabled={selectedItems.materials?.length === 0}
              />
            </div>
          </>
        )}
      </TwoCol>
    </div>
  );
};
