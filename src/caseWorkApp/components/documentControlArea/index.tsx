import React from 'react';
import { useStoreCWA } from '../../store';
import { Button } from '../button';
import { Tabs } from '../tabs';
import { HIDE_CATEROGIES } from '../utils/constants';
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

type DocumentControlAreaProps = { items: TabItem[] };

const DocumentControlArea: React.FC<DocumentControlAreaProps> = ({ items }) => {
  const { handleTabSelection, handleClosePdf } = useStoreCWA();

  return (
    <>
      <Button>{HIDE_CATEROGIES}</Button>
      <Tabs
        idPrefix="idpref"
        title="Tabs title"
        items={items}
        handleTabSelection={handleTabSelection}
        handleClosePdf={handleClosePdf}
        dcfMode={undefined}
      />
    </>
  );
};

export { DocumentControlArea };

