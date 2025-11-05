import { Button } from '../button';
import { Tabs } from '../tabs';
import { HIDE_CATEROGIES } from '../utils/constants';
import { useStoreCWA } from '../../store';
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

const DocumentControlArea = ({ items }:any) => {

  const { handleTabSelection, handleClosePdf } = useStoreCWA();

  return (
    <>
     
      <Button>{HIDE_CATEROGIES}</Button>
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

