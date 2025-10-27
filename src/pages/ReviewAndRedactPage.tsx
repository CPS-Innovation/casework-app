import { Accordion } from '../components';
import { ExampleDocumentSelectAccordion } from '../packages/DocumentSelectAccordion/ExampleDocumentSelectAccordion';

export const ReviewAndRedactPage = () => {
  return (
    <div>
      <ExampleDocumentSelectAccordion />
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
    </div>
  );
};
