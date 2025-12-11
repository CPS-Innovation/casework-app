import { KeyboardEvent, MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isPathCurrentUrl } from '../../utils/url';
import './Tabs.scss';

export type Tab = { id: string; name: string; href: string; active?: boolean };

type Props = { tabs: Tab[] };

export const Tabs = ({ tabs }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  if (tabs.length <= 1) {
    return null;
  }

  const handleTabClick = (event: MouseEvent, tab: Tab) => {
    event.preventDefault();

    navigate(tab.href, { state: { anchor: 'main-content' } });
  };

  const handleKeyboardPress = (event: KeyboardEvent, index: number) => {
    const key = event.key;

    if (key === 'ArrowLeft') {
      if (index === 0) {
        return document?.getElementById(`tab-${tabs.length - 1}`)?.focus();
      } else {
        return document?.getElementById(`tab-${index - 1}`)?.focus();
      }
    }

    if (key === 'ArrowRight') {
      if (index === tabs.length - 1) {
        return document?.getElementById(`tab-0`)?.focus();
      } else {
        return document?.getElementById(`tab-${index + 1}`)?.focus();
      }
    }
  };

  return (
    <div className="govuk-tabs" data-module="govuk-tabs">
      <h2 className="govuk-tabs__title">Contents</h2>
      <div className="govuk-tabs__list" role="tablist">
        {tabs.map((tab: Tab, index: number) => {
          const isCurrentPage = isPathCurrentUrl(pathname, tab.href);
          const isActiveAndCurrent = tab.active || isCurrentPage;

          return (
            <button
              key={index}
              aria-selected={isActiveAndCurrent}
              className={
                isActiveAndCurrent
                  ? `govuk-tabs__list-item govuk-tabs__list-item--selected`
                  : `govuk-tabs__list-item`
              }
              onClick={(event) => handleTabClick(event, tab)}
              onKeyDown={(event) => handleKeyboardPress(event, index)}
              role="tab"
              id={`tab-${index}`}
            >
              <span className="govuk-tabs__tab">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
