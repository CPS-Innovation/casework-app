import { Accordion } from '../components';

export const ReviewAndRedactPage = () => {
  return (
    <div>
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
