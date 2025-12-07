import React from 'react';
import { Button } from '../button';
import { Tabs } from '../tabs';
import './styles.scss';

type PanelProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type TabItem = {
  id: string;
  versionId: number;
  label: string;
  panel: PanelProps;
  isDirty: boolean;
};

type DocumentControlAreaProps = {
  activeTabId: string;
  items: TabItem[];
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
  handleCloseTab: (v?: string) => void;
  handleCurrentActiveTabId: (x?: string) => void;
  handleTabSelection: (documentId: string) => void;
  handleActiveTabIndex: (index: number) => void;
  currentActiveTabId?: string;
  activeTabIndex: number;
  children: React.ReactNode;
};

const DocumentControlArea = ({
  activeTabId,
  items,
  isSidebarVisible,
  onToggleSidebar,
  handleCloseTab,
  handleCurrentActiveTabId,
  handleActiveTabIndex,
  handleTabSelection,
  activeTabIndex,
  children
}: DocumentControlAreaProps) => {
  return (
    <>
      <>
        <Button onClick={() => onToggleSidebar?.()}>
          {isSidebarVisible ? 'Hide categories' : 'Show categories'}
        </Button>
        <Tabs
          idPrefix="tabs"
          title="Tabs title"
          items={items}
          activeTabId={activeTabId}
          handleTabSelection={handleTabSelection}
          handleCurrentActiveTabId={handleCurrentActiveTabId}
          handleCloseTab={handleCloseTab}
          handleActiveTabIndex={handleActiveTabIndex}
          activeTabIndex={activeTabIndex}
        />
        {children}
      </>
    </>
  );
};

export { DocumentControlArea };

