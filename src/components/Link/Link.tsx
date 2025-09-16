import type { LinkProps } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';

import type { BaseUrlParamsType } from '../../schemas/params';

export const CPSLink = ({ children, to, ...props }: LinkProps) => {
  const { caseId } = useParams<BaseUrlParamsType>();

  const prefixedTo = `/${caseId}/${to !== '/' ? to : ''}`;

  return (
    <Link {...props} to={prefixedTo}>
      {children}
    </Link>
  );
};
