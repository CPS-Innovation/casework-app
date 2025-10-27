const tagStyleColorMap = {
  none: '',
  grey: 'govuk-tag--grey',
  green: 'govuk-tag--green',
  turquoise: 'govuk-tag--turquoise',
  blue: 'govuk-tag--blue',
  lightBlue: 'govuk-tag--light-blue',
  purple: 'govuk-tag--purple',
  pink: 'govuk-tag--pink',
  red: 'govuk-tag--red',
  orange: 'govuk-tag--orange',
  yellow: 'govuk-tag--yellow'
} as const;
type TTagStyleColor = keyof typeof tagStyleColorMap;

const DefaultTag = (p: {
  color?: TTagStyleColor;
  children: React.ReactNode;
}) => {
  const colorKey = p.color ?? 'none';

  return (
    <strong className={`govuk-tag ${tagStyleColorMap[colorKey]}`}>
      {p.children}
    </strong>
  );
};

const documentSelectTagNameToTagPropMap = {
  ActiveDocument: { children: 'Active Document', color: 'blue' },
  NewVersion: { children: 'New Version', color: 'green' },
  New: { children: 'New', color: 'green' },
  Reclassified: { children: 'Reclassified', color: 'purple' },
  Updated: { children: 'Updated', color: 'orange' }
} satisfies { [key: string]: { children: string; color: TTagStyleColor } };

export type TDocumentSelectTagName =
  keyof typeof documentSelectTagNameToTagPropMap;

export const DocumentSelectTag = (p: { tagName: TDocumentSelectTagName }) => {
  const props = documentSelectTagNameToTagPropMap[p.tagName];

  return <DefaultTag {...props} />;
};
