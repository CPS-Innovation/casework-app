import type { LinkProps } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';

import type { BaseUrlParamsType } from '../../schemas/params';

export const CPSLink = ({ children, to, ...props }: LinkProps) => {
  const { caseId, urn } = useParams<BaseUrlParamsType>();

  const prefixedTo = `/${urn}/${caseId}/${to !== '/' ? to : ''}`;

  return (
    <Link {...props} to={prefixedTo}>
      {children}
    </Link>
  );
};
