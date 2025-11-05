import { DocumentSelectTag } from './DocumentSelectTag';
import './templates/GovUkAccordion.scss';
import { NotesIcon } from './templates/NotesIcon';

export const DocumentSelectAccordionDocumentTemplate = (p: {
  documentName: string;
  documentDate: string;
  ActiveDocumentTag?: boolean;
  NewVersionTag?: boolean;
  NewTag?: boolean;
  ReclassifiedTag?: boolean;
  UpdatedTag?: boolean;
  notesStatus: 'disabled' | 'newNotes' | 'none';
  showLeftBorder?: boolean;
  onDocumentClick: () => void;
  onNotesClick: () => void;
}) => {
  return (
    <div
      className={`document-select-accordion-document ${p.showLeftBorder ? 'show-left-border' : ''}`}
    >
      <div className="document-select-accordion-document--inner-wrapper">
        <div className="document-select-accordion-document--tag-wrapper">
          {p.ActiveDocumentTag && (
            <DocumentSelectTag tagName="ActiveDocument" />
          )}
          {p.NewTag && <DocumentSelectTag tagName="New" />}
          {p.NewVersionTag && <DocumentSelectTag tagName="NewVersion" />}
          {p.ReclassifiedTag && <DocumentSelectTag tagName="Reclassified" />}
          {p.UpdatedTag && <DocumentSelectTag tagName="Updated" />}
        </div>
        <div>
          <a className="govuk-link" onClick={() => p.onDocumentClick()}>
            {p.documentName}
          </a>
        </div>
        <div>Date: {p.documentDate}</div>
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'end' }}
      >
        <a className="govuk-link" onClick={() => p.onNotesClick()}>
          <NotesIcon width={20} notesStatus={p.notesStatus} />
        </a>
      </div>
    </div>
  );
};
