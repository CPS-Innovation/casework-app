import { useState } from 'react';
import { DocumentSidebarWrapper } from './DocumentSidebarWrapper';
import { useAxiosInstance } from './getters/getAxiosInstance';
import {
  postDocumentNotesFromAxiosInstance,
  TDocumentNotes
} from './getters/getDocumentNotes';
import { CloseIconButton } from './templates/CloseIconButton';
import { GovUkButton } from './templates/GovUkButton';
import { GovUkLink } from './templates/GovUkLink';
import { GovUkTextarea } from './templates/GovUkTextarea';
import { formatDate } from './utils/dateUtils';

export const DocumentSidebarNotes = (p: {
  urn: string;
  caseId: number;
  documentId: string;
  documentNotes: TDocumentNotes | null | undefined;
  onBackButtonClick: () => void;
}) => {
  const [text, setText] = useState('');

  const axiosInstance = useAxiosInstance();

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
        <CloseIconButton onClick={() => p.onBackButtonClick()} />
      </div>
      <div style={{ padding: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            htmlFor="notes-textarea"
            className="govuk-label"
            style={{ fontWeight: 700 }}
          >
            Add a note to the document
          </label>
          <GovUkTextarea
            id="notes-textarea"
            value={text}
            onInput={(x) => setText(x)}
            maxLength={500}
            rows={5}
          />
          <div>You have {500 - text.length} characters remaining</div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <GovUkButton
              onClick={async () => {
                await postDocumentNotesFromAxiosInstance({
                  axiosInstance,
                  urn: p.urn,
                  documentId: p.documentId,
                  caseId: p.caseId,
                  text
                });
                p.onBackButtonClick();
              }}
            >
              Save and close
            </GovUkButton>
            <GovUkLink onClick={() => p.onBackButtonClick()}>Cancel</GovUkLink>
          </div>
        </div>
        <br />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {p.documentNotes === undefined && <div>loading</div>}
          {p.documentNotes === null && <div>error</div>}
          {p.documentNotes?.map((note) => (
            <div>
              <div style={{ fontWeight: 700 }}>{note.createdByName}</div>
              <div>{formatDate(note.date)}</div>
              <div>{note.text}</div>
            </div>
          ))}
          {p.documentNotes?.length === 0 && <div>No notes to display</div>}
        </div>
      </div>
    </DocumentSidebarWrapper>
  );
};
