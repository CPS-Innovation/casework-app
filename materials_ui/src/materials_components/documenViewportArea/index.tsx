import { useState } from 'react';
import { Button } from '../../caseWorkApp/components/button';
import {
  DropdownButton2,
  DropdownListItem
} from '../../caseWorkApp/components/dropDownButton/DropdownButton';
import Tooltip from '../../caseWorkApp/components/tooltip';
import { AreaIcon } from '../PdfRedactor/icons/AreaIcon';
import { TMode } from '../PdfRedactor/utils/modeUtils';

const DROPDOWN_ACTIONS = {
  LOG_REDACTION: 'log-redaction',
  ROTATE: 'rotate',
  DELETE: 'delete',
  VIEW_NEW_WINDOW: 'view-new-window'
} as const;

type DocumentViewportAreaProps = {
  documentName: string;
  mode: TMode;
  onModeChange: (mode: TMode) => void;
  onViewInNewWindowButtonClick: () => void;
  onRedactionLogClick: () => void;
  numOfDocumentPages: number;
};

export const DocumentViewportArea = ({
  documentName,
  mode,
  onModeChange,
  onViewInNewWindowButtonClick,
  onRedactionLogClick,
  numOfDocumentPages
}: DocumentViewportAreaProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <div
      style={{
        padding: '.5rem 1rem',
        backgroundColor: '#1d70b8',
        borderBottom: '0.0625rem solid #b1b4b6'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span style={{ color: '#ffffff', fontWeight: 700, lineHeight: 1 }}>
          {documentName}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip
            text={
              mode === 'areaRedact' ? 'Redact area mode' : 'Redact text mode'
            }
          >
            <Button
              variant="inverse"
              id="btn-area-tool"
              aria-label={
                mode === 'areaRedact'
                  ? 'enable text redaction mode'
                  : 'enable area redaction mode'
              }
              onClick={() =>
                onModeChange(
                  mode === 'areaRedact' ? 'textRedact' : 'areaRedact'
                )
              }
            >
              <AreaIcon height={20} width={20} />
            </Button>
          </Tooltip>
          <DropdownButton2
            ariaLabel="document actions dropdown"
            ButtonContent={<span>Document Actions</span>}
            isOpen={isDropdownOpen}
            setIsOpen={(x) => setIsDropdownOpen(x)}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <DropdownListItem
                id={DROPDOWN_ACTIONS.LOG_REDACTION}
                onClick={() => {
                  onRedactionLogClick();
                  setIsDropdownOpen(false);
                }}
                borderBottom
              >
                Log an Under/Over redaction
              </DropdownListItem>
              <DropdownListItem
                id={DROPDOWN_ACTIONS.ROTATE}
                borderBottom
                onClick={() => {
                  onModeChange(mode === 'rotation' ? 'textRedact' : 'rotation');
                  setIsDropdownOpen(false);
                }}
              >
                {mode === 'rotation'
                  ? 'Hide rotate document pages'
                  : 'Rotate document pages'}
              </DropdownListItem>
              {numOfDocumentPages > 1 && (
                <DropdownListItem
                  id={DROPDOWN_ACTIONS.DELETE}
                  borderBottom
                  onClick={() => {
                    onModeChange(
                      mode === 'deletion' ? 'textRedact' : 'deletion'
                    );
                    setIsDropdownOpen(false);
                  }}
                >
                  {mode === 'deletion'
                    ? 'Hide delete page options'
                    : 'Show delete page options'}
                </DropdownListItem>
              )}
              <DropdownListItem
                id={DROPDOWN_ACTIONS.VIEW_NEW_WINDOW}
                borderBottom={false}
                onClick={() => {
                  onViewInNewWindowButtonClick();
                  setIsDropdownOpen(false);
                }}
              >
                View in new window
              </DropdownListItem>
            </div>
          </DropdownButton2>
        </div>
      </div>
    </div>
  );
};
