import { useLastFocus } from '../../hooks/useLastFocus';
import { useStoreCWA } from '../../store';
import TabButtons from './TabButtons';
import classes from './Tabs.module.scss';
import { CommonTabsProps } from './types';

export type TabsProps = CommonTabsProps & {
  activeTabId: string;
  handleTabSelection: (documentId: string) => void;
  handleClosePdf: (documentId: string, versionId: number) => void;
  dcfMode: string | undefined;
  handleCloseTab: (v: any) => void;
};

export const Tabs: React.FC<TabsProps> = ({
  className,
  id,
  idPrefix,
  items,
  title,
  activeTabId,
  handleTabSelection,
  handleClosePdf,
  dcfMode,
  handleCloseTab,
  ...attributes
}) => {

  useLastFocus('#case-details-search');

  const { tabsState } = useStoreCWA();

  const activeTabArrayPos = items.findIndex(
    (item) => item.id === activeTabId || item.id === tabsState?.activeTabId  
  );
  const activeTabIndex = activeTabArrayPos === -1 ? 0 : activeTabArrayPos;

  const localHandleClosePdf = () => {
    const thisItemIndex = activeTabIndex;
    const nextTabIndex =
      items.length === 1
        ? undefined // there is only item so next item is empty
        : thisItemIndex === 0 
          ? 1 // we are removing the first item, so we need the item to the right
          : thisItemIndex - 1; // otherwise, we need the item to the left

    const nextTabId = nextTabIndex === undefined ? '' : items[nextTabIndex].id;
    handleTabSelection(nextTabId);
    // getRemoveDocumentId?.('ale');
    // handleClosePdf(items[activeTabIndex].id, items[activeTabIndex].versionId);
  };

  const panels = items.map((item, index) => {
    const { id: itemId, panel } = item;
    const panelId = itemId;

    return (
      <div
        id={index === activeTabIndex ? 'active-tab-panel' : `panel-${index}`}
        aria-labelledby={
          index === activeTabIndex
            ? 'document-panel-region-label'
            : `tab_${index}`
        }
        key={panelId}
        role="tabpanel"
        tabIndex={0}
        data-testid={`tab-content-${itemId}`}
        className={`govuk-tabs__panel ${
          index !== activeTabIndex ? classes.hideTabDocument : ''
        }  ${classes.contentArea}`}
      >
        {index === activeTabIndex && (
          <span
            id="document-panel-region-label"
            className={classes.tabPanelRegionLabel}
          >
            Document view port
          </span>
        )}
        {panel?.children}
      </div>
    );
  });

  const tabItems = items.map((item) => ({
    id: item.id,
    label: item.label,
    ariaLabel: `Document ${item.label}`
  }));

  return (
    <>
      <div
        data-testid="tabs"
        className={`govuk-tabs ${classes.tabs} ${className || ''} `}
        {...attributes}
      >
        <TabButtons
          items={tabItems}
          activeTabIndex={activeTabIndex}
          handleTabSelection={handleTabSelection}
          handleCloseTab={handleCloseTab}
          dcfMode={dcfMode}
        />
        {panels}
      </div>
    </>
  );
};

