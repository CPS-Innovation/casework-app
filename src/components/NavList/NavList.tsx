import { NavLink, useLocation } from 'react-router-dom';
import { isPathCurrentUrl } from '../../utils/url';
import './NavList.scss';

export type NavListItem = { href: string; name: string };

export type Props = { items: NavListItem[] };

export const NavList = ({ items = [] }: Props) => {
  const { pathname } = useLocation();

  return (
    <nav
      className="moj-side-navigation cps-side-navigation"
      aria-label="Side navigation"
    >
      <ul className="moj-side-navigation__list">
        {items.map((item, index) => {
          const isCurrentPage = isPathCurrentUrl(pathname, item.href);

          return (
            <li
              key={index}
              className={`moj-side-navigation__item${isCurrentPage ? ' moj-side-navigation__item--active' : ''}`}
            >
              <NavLink to={item.href}>{item.name}</NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
