import { useEffect, useRef } from 'react';
import './ButtonMenu.scss';

// @ts-ignore
import { ButtonMenu } from '@ministryofjustice/frontend/moj/components/button-menu/button-menu.mjs';

type MenuItem = {
  label: string;
  onClick: () => void;
  className?: string;
  hide?: boolean;
};

type Props = { menuTitle: string; menuItems: MenuItem[]; isDisabled?: boolean };

export function ButtonMenuComponent({
  menuTitle,
  menuItems,
  isDisabled = false
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      menuRef.current &&
      !menuRef.current.hasAttribute('data-module-initialised')
    ) {
      new ButtonMenu(menuRef.current);
    }
  }, []);

  return (
    <div
      ref={menuRef}
      className="moj-button-menu"
      data-module="moj-button-menu"
      data-button-text={menuTitle}
      data-button-classes="govuk-button--secondary"
      data-button-disabled={isDisabled ? 'true' : 'false'}
      style={{
        opacity: isDisabled ? 0.5 : 1,
        pointerEvents: isDisabled ? 'none' : 'auto',
        cursor: isDisabled ? 'not-allowed' : 'pointer'
      }}
    >
      {menuItems?.length > 0 &&
        menuItems?.map((item, i) => {
          return (
            <button
              key={i}
              role="button"
              draggable="false"
              className={`govuk-button moj-button-menu__item govuk-button--secondary 
      ${item.className || ''} ${item.hide ? 'hidden-item' : ''}`}
              data-module="govuk-button"
              onClick={item.onClick}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              aria-hidden={item.hide ? 'true' : undefined}
              tabIndex={item.hide ? -1 : 0}
            >
              {item.label}
            </button>
          );
        })}
    </div>
  );
}
