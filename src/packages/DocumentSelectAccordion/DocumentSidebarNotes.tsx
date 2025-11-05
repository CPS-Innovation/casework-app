import { DocumentSidebarWrapper } from './DocumentSidebarWrapper';

export const DocumentSidebarNotes = (p: {
  documentId: string;
  onBackButtonClick: () => void;
}) => {
  return (
    <DocumentSidebarWrapper>
      <div style={{ padding: '10px' }}>
        <a className="govuk-link" onClick={() => p.onBackButtonClick()}>
          go back
        </a>
        {p.documentId}
      </div>
    </DocumentSidebarWrapper>
  );
};
