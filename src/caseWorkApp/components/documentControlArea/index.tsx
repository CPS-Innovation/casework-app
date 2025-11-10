import { useStoreCWA } from '../../store';
import { Button } from '../button';
import { Tabs } from '../tabs';
import { HIDE_CATEROGIES, SHOW_CATEROGIES } from '../utils/constants';
import './styles.scss';

// const items = [
//   {
//     isDirty: false,
//     id: 'CMS-MG1',
//     versionId: 1,
//     label: 'MG1 CARMINE Victim',
//     panel: <></>
//   },
//   {
//     isDirty: false,
//     id: 'CMS-MG2',
//     versionId: 2,
//     label: 'MG2 CARMINE Victim',
//     panel: <></>
//   }
// ];

// const tabSelectionHandler = (documentId: string): void => {
//   console.log('TabSelectionHandler');
// };

// const closePdfHandler = (documentId: string): void => {
//   console.log('close pgf handler');
// };

const unlockDocumentsHandler = (): void => {
  console.log('unlockDocumentsHandler');
};

type DocumentControlAreaProps = {
  items: any;
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
};

const DocumentControlArea = ({
  items,
  isSidebarVisible = false,
  onToggleSidebar
}: DocumentControlAreaProps) => {
  console.log('isSidebarvisible: ', isSidebarVisible);
  const { handleTabSelection, handleClosePdf } = useStoreCWA();
  return (
    <>
      <Button onClick={() => onToggleSidebar?.()}>
        {isSidebarVisible ? HIDE_CATEROGIES : SHOW_CATEROGIES}
      </Button>
      <Tabs
        idPrefix="idpref"
        title="Tabs title"
        items={items}
        // activeTabId={undefined}
        handleTabSelection={handleTabSelection}
        handleClosePdf={handleClosePdf}
        handleUnLockDocuments={unlockDocumentsHandler}
        dcfMode={undefined}
      />
    </>
  );
};

export { DocumentControlArea };

