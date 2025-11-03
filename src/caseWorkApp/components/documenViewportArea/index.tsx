import AreaIcon from '../../assetsCWA/svgs/areaIcon.svg?react';
import { DropdownButton } from '../dropDownButton/DropdownButton';
import { LinkButton } from '../LinkButton/LinkButton';
import Tooltip from '../tooltip';
import classes from './documentViewportArea.module.scss';

type TItems = { items: any };

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

const DocumentViewportArea = ({ items }: TItems) => {
  const dropDownItems: DropdownButtonItem[] = [
    {
      id: '1',
      label: 'Log an Under/Over redaction',
      ariaLabel: 'log an under or over redaction',
      disabled: false
    },
    {
      id: '2',
      label: "Rotate document pages",
      ariaLabel: 'rotate document pages',
      disabled: false
    },
   {
      id: '3',
      label: true ? 'Hide delete page options' : 'Show dotate page options',
      ariaLabel: true ? 'hide delete page options' : 'hide delete page options',
      disabled: false
    },
    {
      id: '4',
      label: "Discard",
      ariaLabel: 'discard',
      disabled: false
    },        
    {
      id: '5',
      label: "Reclaffify",
      ariaLabel: 'reclassify',
      disabled: false
    },  
    {
      id: '6',
      label: 'Rename',
      ariaLabel: 'rename',
      disabled: false
    }
  ];

  return (
    <div className={classes.content}>
      <p>MG1 CARMINE Victim</p>
      <Tooltip
        text={
          // contextData.areaOnlyRedactionMode
          //   ? "Redact area tool Off"
          //   :
          'Redact area tool On'
        }
      >
        <LinkButton
          className={
            // contextData.areaOnlyRedactionMode
            //   ? `${classes.areaToolBtn} ${classes.areaToolBtnEnabled}`
            //   :
            classes.areaToolBtn
          }
          // dataTestId={`btn-area-tool-${contextData.tabIndex}`}
          // id={`btn-area-tool-${contextData.tabIndex}`}
          // ariaLabel={
          //   contextData.areaOnlyRedactionMode
          //     ? "disable area redaction mode"
          //     : "enable area redaction mode"
          // }
          // onClick={handleRedactAreaToolButtonClick}
          onClick={() => {}}
        >
          <AreaIcon />
        </LinkButton>
      </Tooltip>
      <DropdownButton
        name="Document actions"
        dropDownItems={dropDownItems}
        callBackFn={() => {}}
        ariaLabel="document actions dropdown"
        // dataTestId={`document-actions-dropdown-${contextData.tabIndex}`}
        dataTestId={`document-actions-dropdown`}
        showLastItemSeparator={true}
      />
    </div>
  );
};

export { DocumentViewportArea };

