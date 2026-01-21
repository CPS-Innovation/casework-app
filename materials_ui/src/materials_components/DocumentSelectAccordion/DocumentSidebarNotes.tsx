import { useState } from 'react';
import { LoadingSpinner } from '../../components';
import { TickCircleIcon } from '../PdfRedactor/icons/TickCircleIcon';
import { DocumentSidebarWrapper } from './DocumentSidebarWrapper';
import { useAxiosInstance } from './getters/getAxiosInstance';
import {
  postDocumentNotesFromAxiosInstance,
  useGetDocumentNotes
} from './getters/getDocumentNotes';
import { CloseIconButton } from './templates/CloseIconButton';
import { GovUkButton } from './templates/GovUkButton';
import { GovUkLink } from './templates/GovUkLink';
import { GovUkTextarea } from './templates/GovUkTextarea';
import { formatDate } from './utils/dateUtils';

const StatusBar = () => {
  return (
    <div
      style={{
        backgroundColor: '#0d6e4f',
        color: 'white',
        padding: '16px',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <TickCircleIcon height={28} width={28} color="white" />
        Document note successfully saved to CMS
      </div>
    </div>
  );
};

export const DocumentSidebarNotes = (p: {
  urn: string;
  caseId: number;
  documentId: string;
  onBackButtonClick: () => void;
}) => {
  const [text, setText] = useState('');
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  const axiosInstance = useAxiosInstance();
  const documentNotes = useGetDocumentNotes({
    urn: p.urn,
    caseId: p.caseId,
    documentId: p.documentId
  });

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
      {savedSuccessfully && (
        <div
          style={{
            backgroundColor: '#0d6e4f',
            color: 'white',
            padding: '16px',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TickCircleIcon height={28} width={28} color="white" />
            Document note successfully saved to CMS
          </div>
        </div>
      )}
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
            initFocus
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
                setSavedSuccessfully(true);
                await documentNotes.mutate();

                p.onBackButtonClick();
              }}
            >
              Save and close
            </GovUkButton>
            <GovUkLink onClick={() => p.onBackButtonClick()}>Cancel</GovUkLink>
          </div>
        </div>
        <br />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {documentNotes.data === undefined && (
            <div>
              <LoadingSpinner />
            </div>
          )}
          {documentNotes.data === null && <div>error</div>}
          {documentNotes.data && (
            <div
              style={{
                borderLeft: 'solid 4px #0066cc',
                display: 'flex',
                gap: '10px',
                flexDirection: 'column'
              }}
            >
              {documentNotes.data.map((note) => (
                <div
                  style={{ display: 'flex', gap: '10px' }}
                  key={`${note.date}-${note.text}`}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '6px',
                      borderBottom: 'solid 4px #0066cc'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{note.createdByName}</div>
                    <div>{formatDate(note.date)}</div>
                    <div>{note.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {documentNotes.data?.length === 0 && <div>No notes to display</div>}
        </div>
      </div>
    </DocumentSidebarWrapper>
  );
};
