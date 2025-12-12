import { useEffect, useMemo, useRef } from 'react';
import CloseIcon from '../../assetsCWA/svgs/closeIconBold.svg?react';
import DownArrow from '../../assetsCWA/svgs/down.svg?react';
import { LinkButton } from '../LinkButton/LinkButton';
import { DropdownButton } from '../dropDownButton/DropdownButton';
import classes from './Tabs.module.scss';

export type TabButtonProps = {
  items: { id: string; label: string; ariaLabel: string }[];
  activeTabIndex: number;
  handleTabSelection: (documentId: string) => void;
  handleCloseTab: (v?: string) => void;
  onDeleteModeButtonClick?: () => void;
  toggleDeleteButton: boolean;
};

const TabButtons: React.FC<TabButtonProps> = ({
  items,
  activeTabIndex,
  handleTabSelection,
  handleCloseTab,
  onDeleteModeButtonClick,
  toggleDeleteButton
}) => {
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeTabRef.current?.focus();
    activeTabRef.current?.parentElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }, [activeTabIndex, items.length]);

  type ArrowKeyCodes = 'ArrowLeft' | 'ArrowRight';

  const ARROW_KEY_SHIFTS: Record<ArrowKeyCodes, number> = {
    ArrowLeft: -1,
    ArrowRight: 1
  };

  const handleKeyPressOnTab: React.KeyboardEventHandler<HTMLButtonElement> = (
    ev
  ) => {
    if (ev.code in ARROW_KEY_SHIFTS) {
      const thisShift = ARROW_KEY_SHIFTS[ev.code as ArrowKeyCodes]; // -1, 1, or undefined
      moveToNextOrPreviousTab(thisShift);
      if (ev.code === 'ArrowRight' || ev.code === 'ArrowLeft') {
        ev.preventDefault();
      }
    }
  };

  const moveToNextOrPreviousTab = (thisShift: number) => {
    const shouldNavigate =
      // must be a left or right key press command
      !!thisShift &&
      // can't go left on the first tab
      !(activeTabIndex === 0 && thisShift === -1) &&
      // can't go right on the last tab
      !(activeTabIndex === items.length - 1 && thisShift === 1);

    if (!shouldNavigate) {
      return;
    }

    const nextTabIndex = activeTabIndex + thisShift;
    const nextTabId = items[nextTabIndex].id;
    handleTabSelection(nextTabId);
  };

  const tabDropdownItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      disabled: item.id === items[activeTabIndex].id
    }));
  }, [items, activeTabIndex]);

  if (!items.length) {
    return null;
  }
  return (
    <div
      role="region"
      aria-labelledby="document-tabs-region-label"
      tabIndex={0}
      id="document-tabs"
      className={`${classes.tabsWrapper} ${classes.contentArea}`}
    >
      <span id="document-tabs-region-label" className={classes.tabsRegionLabel}>
        Document control area
      </span>
      <div className={`${classes.arrowBtnsWrapper}`}>
        <LinkButton
          disabled={activeTabIndex === 0}
          className={classes.tabPreviousButton}
          data-test-id="btn-tab-previous"
          aria-label="tab previous"
          onClick={() => {
            moveToNextOrPreviousTab(-1);
          }}
        >
          <DownArrow />
        </LinkButton>
        <LinkButton
          disabled={activeTabIndex === items.length - 1}
          className={classes.tabNextButton}
          data-test-id="btn-tab-next"
          aria-label="tab next"
          onClick={() => {
            moveToNextOrPreviousTab(1);
          }}
        >
          <DownArrow />
        </LinkButton>
      </div>

      <ul className={`${classes.tabsList}`} role="tablist">
        {items.map((item, index) => {
          const { id, label, ariaLabel } = item;

          return (
            <li
              className={`${
                activeTabIndex === index
                  ? classes.activeTab
                  : classes.inactiveTab
              } ${classes.tabListItem}`}
              key={id}
              data-testid={`tab-${index}`}
              role="presentation"
            >
              <button
                id={`tab_${index}`}
                aria-controls={
                  index === activeTabIndex
                    ? 'active-tab-panel'
                    : `panel-${index}`
                }
                aria-label={ariaLabel}
                role="tab"
                className={`${classes.tabButton} ${index === activeTabIndex ? 'tabButtonFocused' : ''}`}
                data-testid={
                  index === activeTabIndex ? 'tab-active' : `btn-tab-${index}`
                }
                onClick={() => {
                  if (id !== items[activeTabIndex].id) {
                    handleTabSelection(id);
                  }
                }}
                onKeyDown={handleKeyPressOnTab}
                tabIndex={index === activeTabIndex ? 0 : -1}
                ref={index === activeTabIndex ? activeTabRef : undefined}
              >
                <span className={classes.tabLabel}>{label}</span>
              </button>
              {activeTabIndex === index && (
                <button
                  role="tab"
                  className={classes.tabCloseButton}
                  onClick={() => {
                    handleCloseTab(items[activeTabIndex]?.id);
                  }}
                  onKeyDown={handleKeyPressOnTab}
                  data-testid="tab-remove"
                  aria-label="close tab"
                >
                  <CloseIcon />
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <div className={classes.tabsDropDownWrapper}>
        <DropdownButton
          dropDownItems={tabDropdownItems}
          callBackFn={handleTabSelection}
          ariaLabel="tabs dropdown"
          dataTestId="tabs-dropdown"
          disabled={items.length < 2}
          onDeleteModeButtonClick={onDeleteModeButtonClick}
          toggleDeleteButton={toggleDeleteButton}
        />
      </div>
    </div>
  );
};

export default TabButtons;

