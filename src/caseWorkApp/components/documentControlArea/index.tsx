import React from 'react';
import { useStoreCWA } from '../../store';
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
  items: TabItem[];
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
  handleCloseTab: (v?: any) => void;
};

const DocumentControlArea = ({
  items,
  isSidebarVisible = false,
  onToggleSidebar,
  handleCloseTab
}: DocumentControlAreaProps) => {
  const { handleTabSelection, handleClosePdf } = useStoreCWA();
  console.log('conreolarea: ', items);
  return (
    <>
      <Button onClick={() => onToggleSidebar?.()}>
        {isSidebarVisible ? 'Hide categories' : 'Show categories'}
      </Button>
      <Tabs
        idPrefix="idpref"
        title="Tabs title"
        items={items}
        handleTabSelection={handleTabSelection}
        handleClosePdf={handleClosePdf}
        handleCloseTab={handleCloseTab}
        dcfMode={undefined}
      />
    </>
  );
};

export { DocumentControlArea };

