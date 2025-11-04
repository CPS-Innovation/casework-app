import { useState } from 'react';
import '../App.scss';
import {
  ButtonMenuComponent,
  CaseMaterialsTable,
  LoadingSpinner,
  MaterialsFilters,
  RenameDrawer,
  TableActions,
  TwoCol
} from '../components';

import {
  useBanner,
  useCaseMaterial,
  useCaseMaterials,
  useFeatureFlag,
  useTableActions
} from '../hooks';
import {
  useCaseInfoStore,
  useMaterialTags,
  useSelectedItemsStore
} from '../stores';

import { URL } from '../constants/url';
import { CaseMaterialsType } from '../schemas';

export const MaterialsPage = () => {
  const [showFilter, setShowFilter] = useState(true);
  const [selectedMaterial, setSelectedMaterial] =
    useState<CaseMaterialsType | null>(null);

  const { mutate: refreshCaseMaterials, loading: caseMaterialsLoading } =
    useCaseMaterials('materials');
  const hasAccess = useFeatureFlag();
  const { setBanner, resetBanner } = useBanner();
  const { deselectMaterial } = useCaseMaterial();

  const { items: selectedItems, clear: clearSelectedItems } =
    useSelectedItemsStore();
  const { caseInfo } = useCaseInfoStore();
  const { setTags } = useMaterialTags();

  const {
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
    resetBanner
  });

  const handleRenameClick = () => {
    if (selectedItems.materials.length) {
      setSelectedMaterial(selectedItems.materials[0]);
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

    await refreshCaseMaterials();
  };

  const row = selectedItems.materials?.[0];

  const menuItems = [
    {
      label: 'Rename',
      onClick: handleRenameClick,
      hide:
        [1031, 1059].includes(row?.documentTypeId) ||
        selectedItems.materials?.length > 1
    },
    {
      label: 'Reclassify',
      onClick: handleReclassifyClick,
      hide:
        !hasAccess([5]) ||
        selectedItems.materials?.length > 1 ||
        !row?.isReclassifiable
    },
    {
      label: 'Redact',
      onClick: () => handleRedactClick(row?.materialId),
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

  return (
    <div className="govuk-main-wrapper">
      <RenameDrawer
        material={selectedMaterial}
        onCancel={handleCancelRename}
        onSuccess={handleSuccessfulRename}
      />

      <TwoCol sidebar={showFilter ? <MaterialsFilters /> : undefined}>
        {caseMaterialsLoading || isReadStatusUpdating ? (
          <LoadingSpinner textContent="Loading materials" />
        ) : (
          <>
            <TableActions
              showFilter={showFilter}
              onSetShowFilter={setShowFilter}
              menuItems={menuItems}
              selectedItems={selectedItems.materials}
            />

            {caseInfo && (
              <cps-materials-table
                caseid={caseInfo.id}
                urn={caseInfo.urn}
              ></cps-materials-table>
            )}

            <CaseMaterialsTable />

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
