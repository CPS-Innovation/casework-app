import { useState } from 'react';
import { ExampleDocumentSelectAccordion } from '../packages/DocumentSelectAccordion/ExampleDocumentSelectAccordion';

export const ReviewAndRedactPage = () => {
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([
    'CMS-8884800'
  ]);

  return (
    <div>
      <ExampleDocumentSelectAccordion
        urn="54KR7689125"
        caseId={2160797}
        openDocumentIds={openDocumentIds}
        onSetDocumentOpenIds={(docIds) => {
          setOpenDocumentIds(docIds);
        }}
      />
      {/*
      <br />
       <Accordion
        items={[
          {
            title: { expanded: 'asd', collapsed: 'dsa' },
            content: <div>asd</div>
          },
          {
            title: { expanded: 'asd', collapsed: 'dsa' },
            content: <div>asd</div>
          },
          {
            title: { expanded: 'asd', collapsed: 'dsa' },
            content: <div>asd</div>
          }
        ]}
      /> 
      <p className="govuk-heading-xl">Review &amp; Redact</p>
      */}
    </div>
  );
};
