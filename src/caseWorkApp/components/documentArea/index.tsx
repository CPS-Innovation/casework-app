import { Button } from '../Button';
import { HIDE_CATEROGIES } from '../utils/constants';
import { Tabs } from '../tabs';


const ExamplePanel = () => (
  <div>
    <h3>MG11 CARMINE Victim, 22/09/2024 #4</h3>
    <p>Document ID: CMS-8831863</p>
    <p>Status: New</p>
    {/* Add more fields as needed */}
  </div>
);

const items = [
  {
    isDirty: false,
    id: "CMS-8831863",
    versionId: 8072371,
    label: "MG11 CARMINE Victim, 22/09/2024 #4",
    panel: <ExamplePanel />
  }
];

const DocumentArea = () => {
  return (
    <div style={{ display: 'flex' }}>
      
      <Button>{HIDE_CATEROGIES}</Button>
      

      <Tabs idPrefix='idpref' title='tiele tabs' items={items} activeTabId={undefined} 
      handleTabSelection={ (documentId: string): void => {
        throw new Error('Function not implemented.');
      } } 
      handleClosePdf={ (documentId: string, versionId: number): void => {
        throw new Error('Function not implemented.');
      } } 
      handleUnLockDocuments={ (documentIds: string[]): void => {
        throw new Error('Function not implemented.');
      } } 
      dcfMode={undefined}
      />

    </div>
  );
};

export { DocumentArea };

