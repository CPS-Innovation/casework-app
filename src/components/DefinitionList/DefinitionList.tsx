import './DefinitionList.scss';

type ListItem = { title: string; description: string[] };

type Props = { items: ListItem[] };

export const DefinitionList = ({ items }: Props) => {
  if (!items.length) return null;

  return (
    <dl className="definition-list">
      {items.map((item, index) => (
        <div key={index} className="definition-list__row">
          <dt className="definition-list__title">{item.title}</dt>
          {item.description.map((desc, descIndex) => (
            <dd key={descIndex} className="definition-list__description">
              {desc}
            </dd>
          ))}
        </div>
      ))}
    </dl>
  );
};
