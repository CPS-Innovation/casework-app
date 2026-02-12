import { useLastFocus } from '../../hooks/useLastFocus';
import TabButtons from './TabButtons';
import classes from './Tabs.module.scss';
import { CommonTabsProps } from './types';

export type TabsProps = CommonTabsProps & {
  activeTabId: string;
  handleTabSelection: (documentId: string) => void;
  handleCloseTab: (v?: string) => void;
  noMargin?: boolean;
};

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTabId,
  handleTabSelection,
  handleCloseTab,
  noMargin,
  idPrefix: _idPrefix,
  title: _title,
  ...attributes
}) => {
  useLastFocus('#case-details-search');

  const activeTabArrayPos = items.findIndex((item) => item.id === activeTabId);
  const activeTabIndex = activeTabArrayPos === -1 ? 0 : activeTabArrayPos;

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
        className={`govuk-tabs ${classes.tabs}${noMargin ? ` ${classes.noMargin}` : ''}`}
        {...attributes}
      >
        <TabButtons
          items={tabItems}
          activeTabIndex={activeTabIndex}
          handleTabSelection={handleTabSelection}
          handleCloseTab={handleCloseTab}
        />
        {panels}
      </div>
    </>
  );
};
