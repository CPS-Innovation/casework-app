import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useBanner } from '../../hooks';
import { useMaterialTags, useSelectedItemsStore } from '../../stores';

// this component is a non rendering component to perform actions when the user
// changes pages for example resetting banners, selected items, etc
// it's to save doing it in individual contexts
export const RouteChangeListener = () => {
  const { pathname } = useLocation();
  const { resetBanner } = useBanner();
  const { clearTags } = useMaterialTags();
  const { clear: clearSelectedItems } = useSelectedItemsStore();

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    clearTags();
    clearSelectedItems();
    resetBanner();
    scrollToTop();
  }, [pathname]);

  return null;
};

export default RouteChangeListener;
