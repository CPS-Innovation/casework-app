import { DropdownButton } from '../../caseWorkApp/components/dropDownButton/DropdownButton';
import Tooltip from '../../caseWorkApp/components/tooltip';
import { LinkButton } from '../../caseWorkApp/components/LinkButton/LinkButton';
import { AreaIcon } from '../PdfRedactor/icons/AreaIcon';
import { TMode } from '../PdfRedactor/utils/modeUtils';
import classes from './index.module.scss';

export type DropdownButtonItem = {
  id: string;
  label: string;
  ariaLabel: string;
  disabled: boolean;
};

const DROPDOWN_ACTIONS = {
  LOG_REDACTION: 'log-redaction',
  ROTATE: 'rotate',
  DELETE: 'delete',
  VIEW_NEW_WINDOW: 'view-new-window'
} as const;

const getDropDownActionItems = (mode: TMode): DropdownButtonItem[] => [
  {
    id: DROPDOWN_ACTIONS.LOG_REDACTION,
    label: 'Log an Under/Over redaction',
    ariaLabel: 'log an under or over redaction',
    disabled: true
  },
  {
    id: DROPDOWN_ACTIONS.ROTATE,
    label: mode === 'rotation' ? 'Hide rotate document pages' : 'Rotate document pages',
    ariaLabel: mode === 'rotation' ? 'hide rotate document pages' : 'rotate document pages',
    disabled: false
  },
  {
    id: DROPDOWN_ACTIONS.DELETE,
    label: mode === 'deletion' ? 'Hide delete page options' : 'Show delete page options',
    ariaLabel: mode === 'deletion' ? 'hide delete page options' : 'show delete page options',
    disabled: false
  },
  {
    id: DROPDOWN_ACTIONS.VIEW_NEW_WINDOW,
    label: 'View in new window',
    ariaLabel: 'view in new window',
    disabled: false
  }
];

type DocumentViewportAreaProps = {
  documentName: string;
  mode: TMode;
  onModeChange: (mode: TMode) => void;
  onViewInNewWindowButtonClick: () => void;
};

export const DocumentViewportArea = ({
  documentName,
  mode,
  onModeChange,
  onViewInNewWindowButtonClick
}: DocumentViewportAreaProps) => {
  const isAreaRedactMode = mode === 'areaRedact';

  const handleAreaToolClick = () => {
    onModeChange(mode === 'areaRedact' ? 'textRedact' : 'areaRedact');
  };

  const handleDropdownAction = (id: string) => {
    switch (id) {
      case DROPDOWN_ACTIONS.ROTATE:
        onModeChange(mode === 'rotation' ? 'areaRedact' : 'rotation');
        break;
      case DROPDOWN_ACTIONS.DELETE:
        onModeChange(mode === 'deletion' ? 'areaRedact' : 'deletion');
        break;
      case DROPDOWN_ACTIONS.VIEW_NEW_WINDOW:
        onViewInNewWindowButtonClick();
        break;
    }
  };

  return (
    <div className={classes.content}>
      <p style={{ color: '#ffffff' }}>{documentName}</p>
      <Tooltip text={isAreaRedactMode ? 'Redact area tool On' : 'Redact area tool Off'}>
        <LinkButton
          className={
            isAreaRedactMode
              ? `${classes.areaToolBtn} ${classes.areaToolBtnEnabled}`
              : classes.areaToolBtn
          }
          dataTestId="btn-area-tool"
          id="btn-area-tool"
          ariaLabel={isAreaRedactMode ? 'disable area redaction mode' : 'enable area redaction mode'}
          onClick={handleAreaToolClick}
        >
          <AreaIcon height={20} width={20} />
        </LinkButton>
      </Tooltip>
      <DropdownButton
        name="Document actions"
        dropDownItems={getDropDownActionItems(mode)}
        callBackFn={handleDropdownAction}
        ariaLabel="document actions dropdown"
        dataTestId="document-actions-dropdown"
        showLastItemSeparator={true}
      />
    </div>
  );
};
