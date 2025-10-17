import {
  CwaDefaultAccordionDocument,
  DefaultAccordion,
  DefaultAccordionSection
} from './DefaultAccordion';

const data = [
  { key: 'reviews', label: 'Reviews', documents: [1] },
  { key: 'case-overview', label: 'Case overview', documents: [1, 2] },
  { key: 'statements', label: 'Statements', documents: [1, 2, 3, 4, 5, 6] },
  { key: 'exhibits', label: 'Exhibits', documents: [1, 2, 3, 4, 5] },
  { key: 'forensics', label: 'Forensics', documents: [] },
  { key: 'unused material', label: 'Unused material', documents: [1, 2, 3, 4] },
  { key: 'defendant', label: 'Defendant', documents: [1] },
  { key: 'court-preparation', label: 'Court preparation', documents: [] },
  { key: 'communications', label: 'Communication', documents: [1, 2, 3, 4, 5] },
  { key: 'uncategorised', label: 'Uncategorised', documents: [1] }
];

export const DocumentSelectAccordion = () => {
  return (
    <div>
      <DefaultAccordion>
        {data.map((item) => (
          <DefaultAccordionSection
            key={item.key}
            title={`${item.label} (${item.documents.length})`}
          >
            {item.documents.map((j) => (
              <CwaDefaultAccordionDocument key={`${item.key}-${j}`} />
            ))}
          </DefaultAccordionSection>
        ))}
      </DefaultAccordion>
    </div>
  );
};
