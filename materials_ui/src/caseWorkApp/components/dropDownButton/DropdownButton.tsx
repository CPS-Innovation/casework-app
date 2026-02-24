import { useCallback, useEffect, useRef, useState } from 'react';
import { LinkButton } from '../LinkButton/LinkButton';

import { DownArrowIcon } from '../../assetsCWA/svgs/DownArrowIcon';
import { useGlobalDropdownClose } from '../../hooks/useGlobalDropdownClose';
import { Button } from '../button';
import classes from './DropdownButton.module.scss';

export const DropdownListItem2 = (
  initProps: React.ComponentPropsWithoutRef<typeof Button> & {
    borderBottom: boolean;
  }
) => {
  const { style, ...props } = initProps;
  return (
    <div style={{ whiteSpace: 'nowrap', borderBottom: 'solid 2px black' }}>
      <Button style={{ width: '100%', textAlign: 'right' }} {...props} />
    </div>
  );
};
export const DropdownButton2 = (p: {
  ButtonContent: React.ReactNode;
  children: React.ReactNode;
  ariaLabel: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);
  const dropDownBtnRef = useRef<HTMLButtonElement>(null);
  const dropDownPanelRef = useRef<HTMLDivElement>(null);

  const closeDropdownOnEscapePress = useCallback((event: KeyboardEvent) => {
    if (event.code !== 'Escape' || isOpenRef.current === false) return;

    setIsOpen(false);
    dropDownBtnRef.current?.focus();
  }, []);

  const closeDropdownOnOutsideClick = useCallback((event: MouseEvent) => {
    if (isOpenRef.current === false) return;

    const isClickInsideBtn =
      event.target === dropDownBtnRef.current ||
      dropDownBtnRef.current?.contains(event.target as Node);

    const isClickInsidePanel =
      event.target === dropDownPanelRef.current ||
      dropDownPanelRef.current?.contains(event.target as Node);

    if (isClickInsideBtn || isClickInsidePanel) return;

    setIsOpen(false);
    event.stopPropagation();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', closeDropdownOnEscapePress);
    window.addEventListener('mousedown', closeDropdownOnOutsideClick);
    return () => {
      window.removeEventListener('keydown', closeDropdownOnEscapePress);
      window.removeEventListener('mousedown', closeDropdownOnOutsideClick);
    };
  }, []);

  return (
    <span style={{ position: 'relative' }}>
      <Button
        ariaLabel={p.ariaLabel}
        ref={dropDownBtnRef}
        variant="inverse"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <div>{p.ButtonContent}</div>
          <DownArrowIcon
            color="#1d70b8"
            rotateDegrees={isOpen ? 180 : 0}
            scale={0.75}
          />
        </div>
      </Button>
      {isOpen && (
        <div
          ref={dropDownPanelRef}
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            zIndex: 1007
          }}
        >
          <div
            style={{
              background: '#fff',
              filter: 'drop-shadow(0 1px 0.15rem #000)'
            }}
          >
            {p.children}
          </div>
        </div>
      )}
    </span>
  );
};

export type DropdownButtonItem = {
  id: string;
  label: string;
  ariaLabel: string;
  disabled: boolean;
};
export type DropdownButtonProps = {
  name?: string;
  dropDownItems: DropdownButtonItem[];
  callBackFn: (id: string) => void;
  ariaLabel?: string;
  dataTestId?: string;
  disabled?: boolean;
  showLastItemSeparator?: boolean;
  icon?: React.ReactElement;
  iconScale?: number;
};

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  dropDownItems,
  callBackFn,
  name,
  dataTestId = 'dropdown-btn',
  ariaLabel = 'dropdown',
  disabled = false,
  iconScale = 1
}) => {
  const dropDownBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [buttonOpen, setButtonOpen] = useState(false);

  useGlobalDropdownClose(
    dropDownBtnRef,
    panelRef,
    setButtonOpen,
    '#dropdown-panel'
  );

  const handleBtnClick = (id: string) => {
    setButtonOpen(false);
    callBackFn(id);
  };

  return (
    <div className={classes.dropDownButtonWrapper}>
      <LinkButton
        id={dataTestId}
        dataTestId={dataTestId}
        ref={dropDownBtnRef}
        ariaLabel={ariaLabel}
        ariaExpanded={buttonOpen}
        className={`${classes.dropDownButton} ${buttonOpen && classes.upArrow}`}
        disabled={disabled}
        onClick={() => {
          setButtonOpen((buttonOpen) => !buttonOpen);
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
          {name && (
            <span
              style={{ fontWeight: '700' }}
              className={classes.dropdownBtnName}
            >
              {name}
            </span>
          )}
          <DownArrowIcon
            color="#1d70b8"
            rotateDegrees={buttonOpen ? 180 : 0}
            scale={iconScale}
          />
        </div>
      </LinkButton>

      {buttonOpen && (
        <div
          className={classes.panel}
          ref={panelRef}
          id="dropdown-panel"
          data-testid={`dropdown-panel`}
        >
          <ul className={classes.panelList}>
            {dropDownItems.map((item) => (
              <li key={item.id} className={classes.panelListItem}>
                <LinkButton
                  ariaLabel={item.ariaLabel}
                  disabled={item.disabled}
                  onClick={() => {
                    handleBtnClick(item.id);
                  }}
                >
                  {item.label}
                </LinkButton>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
