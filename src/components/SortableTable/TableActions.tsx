import { useEffect, useRef, useState } from 'react';
import { useCaseInfoStore, useFeatureFlag, useLogger } from '../../hooks';

type MenuItem = { label: string; onClick: () => void; hide?: boolean };

type Props = {
  showFilter: boolean;
  onSetShowFilter: (prev: boolean) => void;
  menuItems?: MenuItem[];
};

export function TableActions({ showFilter, onSetShowFilter }: Props) {
  const hasAccess = useFeatureFlag();
  const { caseInfo } = useCaseInfoStore();
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { log } = useLogger();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const filterStatus = showFilter ? 'showing' : 'hidden';

  return (
    <>
      <div ref={ref} style={{ height: 1 }}></div>
      <div
        className={`govuk-grid-row search-input-container ${isSticky ? 'is-sticky' : ''}`}
      >
        <div className="search-input-row">
          {!isSticky && hasAccess([2, 3, 4, 5]) && (
            <div className="filter-button">
              <button
                className="govuk-button govuk-button--secondary filter-toggle-button"
                onClick={() => {
                  onSetShowFilter(!showFilter);
                  log({
                    logLevel: 1,
                    message: `HK-UI-FE: caseId [${caseInfo?.id}] - filter panel is now ${filterStatus}.`
                  });
                }}
              >
                {showFilter ? 'Hide' : 'Show'} filters
              </button>
            </div>
          )}

          {/* <div className="action-buttons-container">
            <ButtonMenuComponent
              menuTitle="Action on selection"
              menuItems={menuItems}
            />
          </div> */}
        </div>
      </div>
    </>
  );
}
