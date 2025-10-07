import { useContext, useEffect, useState } from 'react';
import '../../App.scss';
import {
  CaseMaterialsTable,
  LoadingSpinner,
  MaterialsFilters,
  RenameDrawer,
  TableActions,
  TwoCol
} from '../../components';

import { SelectedItemsContext } from '../../context';
import {
  useBanner,
  useCaseMaterial,
  useCaseMaterials,
  useFeatureFlag,
  useTableActions
} from '../../hooks';

import { URL } from '../../constants/url.ts';
import { useCaseInfoStore } from '../../stores/useCaseInfo.ts';

export const MaterialsPage = () => {
  const [showFilter, setShowFilter] = useState(true);
  const { mutate: refreshCaseMaterials, loading: caseMaterialsLoading } =
    useCaseMaterials('materials');
  const { selectedItems, setSelectedItems } = useContext(SelectedItemsContext);
  const [isRenameDrawerOpen, setIsRenameDrawerOpen] = useState(false);
  const { setBanner, resetBanner } = useBanner();
  const { deselectMaterial } = useCaseMaterial();
  const [renamedMaterialId, setRenamedMaterialId] = useState<number | null>(
    null
  );
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
    selectedItems,
    refreshData: refreshCaseMaterials,
    setBanner,
    deselectItem: deselectMaterial,
    caseInfoData: caseInfo || undefined,
    resetBanner,
    setIsRenameDrawerOpen,
    setRenamedMaterialId
  });

  const row = selectedItems?.[0];

  const menuItems = [
    {
      label: 'Rename',
      onClick: handleRenameClick,
      hide:
        [1031, 1059].includes(row?.documentTypeId) || selectedItems?.length > 1
    },
    {
      label: 'Reclassify',
      onClick: () => handleReclassifyClick(),
      hide:
        !hasAccess([5]) || selectedItems?.length > 1 || !row?.isReclassifiable
    },
    {
      label: 'Redact',
      onClick: () => handleRedactClick(row?.materialId),
      hide: !hasAccess([2, 3, 4, 5]) || selectedItems?.length > 1
    },
    {
      label: 'Discard',
      onClick: () => handleDiscardClick(URL.MATERIALS),
      disabled: selectedItems?.length > 1,
      hide: !hasAccess([2, 3, 4, 5]) || selectedItems?.length > 1
    },
    {
      label: determineReadStatusLabel(selectedItems),
      onClick: () => handleReadStatusClick(selectedItems),
      hide: !hasAccess([2, 3, 4, 5])
    },
    {
      label: 'Mark as unused',
      onClick: () => handleUnusedClick(URL.MATERIALS),
      hide: selectedItems?.some((item) => item.status === 'Unused')
    }
  ];

  useEffect(() => {
    if (isReadStatusUpdating || caseMaterialsLoading) {
      window.scrollTo(0, 0);
    }
  }, [caseMaterialsLoading, isReadStatusUpdating]);

  return (
    <div
      className={`govuk-main-wrapper ${
        selectedItems?.length > 1 ? 'multiple-selected' : ''
      }`}
    >
      {isRenameDrawerOpen && (
        <RenameDrawer
          material={selectedItems[0]}
          onCancel={() => {
            setIsRenameDrawerOpen(false);
          }}
          onSuccess={async () => {
            await refreshCaseMaterials();

            deselectMaterial();
            setRenamedMaterialId(selectedItems[0].id || null);
            setSelectedItems([]);

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
            />
            <CaseMaterialsTable
              selectedMaterial={selectedItems?.[0]}
              renamedMaterialId={renamedMaterialId}
              setRenamedMaterialId={setRenamedMaterialId}
            />
          </>
        )}
      </TwoCol>
    </div>
  );
};
