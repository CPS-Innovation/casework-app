import { Button } from '../Button';
import { Tabs } from '../tabs';
import { HIDE_CATEROGIES } from '../utils/constants';
import './styles.scss';

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
    id: 'CMS-8831863',
    versionId: 8072371,
    label: 'MG11 CARMINE Victim, 22/09/2024 #4',
    panel: <ExamplePanel />
  },
  {
    isDirty: false,
    id: 'CMS-88',
    versionId: 8072371,
    label: 'MG11 CARMINE Victim, 22/09/2024 #4',
    panel: <ExamplePanel />
  }
];

const tabSelectionHandler = (documentId: string): void => {
  console.log('TabSelectionHandler');
};

const closePdfHandler = (documentId: string): void => {
  console.log('TabSelectionHandler');
};

const unlockDocumentsHandler = (documentId: string[]): void => {
  console.log('TabSelectionHandler');
};



const DocumentArea = () => {
  return (
    <div className="govuk-main-wrapper mainWrapper">
      <Button>{HIDE_CATEROGIES}</Button>

      <Tabs
        idPrefix="idpref"
        title="Tabs title"
        items={items}
        activeTabId={undefined}
        handleTabSelection={tabSelectionHandler}
        handleClosePdf={closePdfHandler}
        handleUnLockDocuments={unlockDocumentsHandler}
        dcfMode={undefined}
      />
    </div>
  );
};

export { DocumentArea };

