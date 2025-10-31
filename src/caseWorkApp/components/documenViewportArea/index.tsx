import { useState } from 'react';
import classes from './documentViewportArea.module.scss';
import Tooltip from '../tooltip';
import AreaIcon from '../../assetsCWA/svgs/areaIcon.svg?react';
import { LinkButton } from '../LinkButton/LinkButton';

type TItems = { items: any };

const DocumentViewportArea = ({ items }: TItems) => {
  return (
    <div className={classes.content}>      
      <p>MG1 CARMINE Victim</p>      
      <Tooltip
      text={
          // contextData.areaOnlyRedactionMode
          //   ? "Redact area tool Off"
          //   : 
            "Redact area tool On"
        }>
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
          onClick={()=>{}}
        >
          <AreaIcon />
        </LinkButton>
      </Tooltip>

    </div>
  );
};

export { DocumentViewportArea };
