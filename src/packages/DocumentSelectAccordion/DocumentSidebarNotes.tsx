import { DocumentSidebarWrapper } from './DocumentSidebarWrapper';
import { CloseButton } from './templates/CloseButton';

export const DocumentSidebarNotes = (p: {
  documentId: string;
  onBackButtonClick: () => void;
}) => {
  return (
    <DocumentSidebarWrapper>
      <div
        style={{
          borderBottom: 'solid 1px #b1b4b6',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: 700, padding: '10px' }}>
          Notes
        </div>
        <CloseButton onClick={() => p.onBackButtonClick()} />
      </div>
      <div style={{ padding: '10px' }}>{p.documentId}</div>
    </DocumentSidebarWrapper>
  );
};
