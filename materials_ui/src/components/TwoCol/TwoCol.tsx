import { PropsWithChildren, ReactElement } from 'react';
import './TwoCol.scss';

type Props = { sidebar?: ReactElement };

export const TwoCol = ({ children, sidebar }: PropsWithChildren<Props>) => {
  return (
    <div className="two-col">
      {sidebar && <div className="two-col__sidebar">{sidebar}</div>}
      <div className="two-col__content">{children}</div>
    </div>
  );
};
