import {
  DocumentSelectAccordion,
  DocumentSelectAccordionSection
} from './DocumentSelectAccordion';
import { DocumentSelectAccordionDocument } from './DocumentSelectAccordionDocument';
import { TDocumentSelectTagName } from './Tag';

const data = [
  {
    key: 'reviews',
    label: 'Reviews',
    documents: [
      {
        documentName: 'hi',
        documentDate: 'hi',
        tagNames: ['ActiveDocument', 'New'],
        showLeftBorder: true,
        showUnreadNotesIndicator: true
      }
    ]
  },
  {
    key: 'case-overview',
    label: 'Case overview',
    documents: [
      {
        documentName: 'hi',
        documentDate: 'hi',
        tagNames: ['ActiveDocument', 'New']
      },
      {
        documentName: 'hi2',
        documentDate: 'hi2',
        tagNames: ['ActiveDocument', 'New']
      }
    ]
  },
  {
    key: 'statements',
    label: 'Statements',
    documents: [
      {
        documentName: 'hi1',
        documentDate: 'hi1',
        tagNames: ['ActiveDocument']
      },
      {
        documentName: 'hi2',
        documentDate: 'hi2',
        tagNames: ['ActiveDocument']
      },
      {
        documentName: 'hi3',
        documentDate: 'hi3',
        tagNames: ['ActiveDocument']
      },
      {
        documentName: 'hi4',
        documentDate: 'hi4',
        tagNames: ['ActiveDocument']
      },
      {
        documentName: 'hi5',
        documentDate: 'hi5',
        tagNames: ['ActiveDocument']
      },
      { documentName: 'hi6', documentDate: 'hi6', tagNames: ['ActiveDocument'] }
    ]
  },
  {
    key: 'exhibits',
    label: 'Exhibits',
    documents: [
      {
        documentName: 'hi1',
        documentDate: 'hi1',
        tagNames: ['ActiveDocument']
      },
      {
        documentName: 'hi2',
        documentDate: 'hi2',
        tagNames: ['ActiveDocument']
      },
      {
        documentName: 'hi3',
        documentDate: 'hi3',
        tagNames: ['ActiveDocument']
      },
      {
        documentName: 'hi4',
        documentDate: 'hi4',
        tagNames: ['ActiveDocument']
      },
      {
        documentName: 'hi5',
        documentDate: 'hi5',
        tagNames: ['ActiveDocument']
      },
      { documentName: 'hi6', documentDate: 'hi6', tagNames: ['ActiveDocument'] }
    ]
  },
  { key: 'forensics', label: 'Forensics', documents: [] },
  {
    key: 'unused material',
    label: 'Unused material',
    documents: [
      {
        documentName: 'hi1',
        documentDate: 'hi1',
        tagNames: ['ActiveDocument']
      },
      {
        documentName: 'hi2',
        documentDate: 'hi2',
        tagNames: ['ActiveDocument']
      },
      {
        documentName: 'hi3',
        documentDate: 'hi3',
        tagNames: ['ActiveDocument']
      },
      { documentName: 'hi4', documentDate: 'hi4', tagNames: ['ActiveDocument'] }
    ]
  },
  {
    key: 'defendant',
    label: 'Defendant',
    documents: [
      { documentName: 'hi1', documentDate: 'hi1', tagNames: ['ActiveDocument'] }
    ]
  },
  { key: 'court-preparation', label: 'Court preparation', documents: [] },
  {
    key: 'communications',
    label: 'Communication',
    documents: [
      {
        documentName: 'hi1',
        documentDate: 'hi1',
        tagNames: ['ActiveDocument']
      },
      {
        documentName: 'hi2',
        documentDate: 'hi2',
        tagNames: ['ActiveDocument']
      },
      {
        documentName: 'hi3',
        documentDate: 'hi3',
        tagNames: ['ActiveDocument']
      },
      {
        documentName: 'hi4',
        documentDate: 'hi4',
        tagNames: ['ActiveDocument']
      },
      { documentName: 'hi5', documentDate: 'hi5', tagNames: ['ActiveDocument'] }
    ]
  },
  {
    key: 'uncategorised',
    label: 'Uncategorised',
    documents: [
      { documentName: 'hi1', documentDate: 'hi1', tagNames: ['ActiveDocument'] }
    ]
  }
] as {
  key: string;
  label: string;
  documents: {
    documentName: string;
    documentDate: string;
    tagNames: TDocumentSelectTagName[];
    showLeftBorder?: boolean;
    showUnreadNotesIndicator?: boolean;
  }[];
}[];

export const ExampleDocumentSelectAccordion = () => {
  return (
    <div>
      <DocumentSelectAccordion>
        {data.map((item) => (
          <DocumentSelectAccordionSection
            key={item.key}
            title={`${item.label} (${item.documents.length})`}
          >
            {item.documents.length === 0 ? (
              <div style={{ height: '60px', padding: '12px' }}>
                There are no documents available.
              </div>
            ) : (
              item.documents.map((document) => (
                <DocumentSelectAccordionDocument
                  documentName={document.documentName}
                  documentDate={document.documentDate}
                  tagNames={document.tagNames}
                  key={`${item.key}-${document.documentName}`}
                  showLeftBorder={document.showLeftBorder}
                  showUnreadNotesIndicator={document.showUnreadNotesIndicator}
                />
              ))
            )}
          </DocumentSelectAccordionSection>
        ))}
      </DocumentSelectAccordion>
    </div>
  );
};
