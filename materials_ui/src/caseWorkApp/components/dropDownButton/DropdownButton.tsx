import { useRef, useState } from 'react';
import DownArrow from '../../assetsCWA/svgs/down.svg?react';
import { LinkButton } from '../LinkButton/LinkButton';

import { useGlobalDropdownClose } from '../../hooks/useGlobalDropdownClose';
import classes from './DropdownButton.module.scss';

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
  onDeleteModeButtonClick?: () => void;
  toggleDeleteButton?: boolean;
};

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  dropDownItems,
  callBackFn,
  name,
  dataTestId = 'dropdown-btn',
  ariaLabel = 'dropdown',
  disabled = false,
  onDeleteModeButtonClick
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
    onDeleteModeButtonClick && id === '3' && onDeleteModeButtonClick();
  };

  return (
    <div className={classes.dropDownButtonWrapper}>
      <LinkButton
        id={dataTestId}
        dataTestId={dataTestId}
        ref={dropDownBtnRef}
        ariaLabel={ariaLabel}
        ariaExpanded={buttonOpen}
        className={`${classes.dropDownButton} ${
          buttonOpen && classes.upArrow
        } ${name && classes.btnWithText}`}
        disabled={disabled}
        onClick={() => {
          setButtonOpen((buttonOpen) => !buttonOpen);
        }}
      >
        {name && <span className={classes.dropdownBtnName}>{name}</span>}
        <DownArrow />
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

