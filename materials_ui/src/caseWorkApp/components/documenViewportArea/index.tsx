import { useEffect, useState } from 'react';
import AreaIcon from '../../assetsCWA/svgs/areaIcon.svg?react';
import { DropdownButton } from '../dropDownButton/DropdownButton';
import { LinkButton } from '../LinkButton/LinkButton';
import Tooltip from '../tooltip';
import classes from './index.module.scss';

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
};

const dropDownItems: DropdownButtonItem[] = [
  {
    id: '1',
    label: 'Log an Under/Over redaction',
    ariaLabel: 'log an under or over redaction',
    disabled: false
  },
  {
    id: '2',
    label: 'Rotate document pages',
    ariaLabel: 'rotate document pages',
    disabled: false
  },
  {
    id: '3',
    label: true ? 'Hide delete page options' : 'Show dotate page options',
    ariaLabel: true ? 'hide delete page options' : 'show delete page options',
    disabled: false
  },
  { id: '4', label: 'Discard', ariaLabel: 'discard', disabled: false },
  { id: '5', label: 'Reclassify', ariaLabel: 'reclassify', disabled: false },
  { id: '6', label: 'Rename', ariaLabel: 'rename', disabled: false }
];

type DocumentViewportAreaProps = {
  items: DropdownButtonItem[];
  activeTabId: string;
  redactAreaState: boolean;
  onRedactAreaStateChange: (x: boolean) => void;
  currentActiveTabId?: string;
  onRotateModeButtonClick: () => void;
  onDeleteModeButtonClick: () => void;
};

export const DocumentViewportArea = ({
  items,
  activeTabId,
  redactAreaState,
  onRedactAreaStateChange,
  currentActiveTabId,
  onRotateModeButtonClick,
  onDeleteModeButtonClick
}: DocumentViewportAreaProps) => {
  const [name, setName] = useState<string>('');

  const handleRedactAreaToolButtonClick = () => {
    onRedactAreaStateChange(!redactAreaState);
  };

  const activeTabLabel = items.findIndex(
    (item) => item.id === activeTabId || item.id === currentActiveTabId
  );

  useEffect(() => {
    setName(items[activeTabLabel]?.label);
  }, [items, activeTabLabel]);

  return (
    <div className={classes.content}>
      <p style={{ color: '#ffffff' }}>{name}</p>
      <Tooltip
        text={redactAreaState ? 'Redact area tool On' : 'Redact area tool Off'}
      >
        <LinkButton
          className={
            redactAreaState
              ? `${classes.areaToolBtn} ${classes.areaToolBtnEnabled}`
              : `${classes.areaToolBtn}`
          }
          dataTestId={'btn-area-tool'}
          id={'btn-area-tool'}
          ariaLabel={
            redactAreaState
              ? 'disable area redaction mode'
              : 'enable area redaction mode'
          }
          onClick={handleRedactAreaToolButtonClick}
        >
          <AreaIcon />
        </LinkButton>
      </Tooltip>
      <DropdownButton
        name="Document actions"
        dropDownItems={dropDownItems}
        callBackFn={(id) => {
          if (id === '2') onRotateModeButtonClick();
          if (id === '3') onDeleteModeButtonClick();
        }}
        ariaLabel="document actions dropdown"
        dataTestId={`document-actions-dropdown`}
        showLastItemSeparator={true}
      />
    </div>
  );
};

