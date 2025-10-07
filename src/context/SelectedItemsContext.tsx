// @ts-nocheck
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { useLocation } from 'react-router-dom';
import { URL } from '../constants/url';
import { CaseMaterialsType } from '../schemas/caseMaterials';

export type SelectedItemsType = {
  selectedItems: CaseMaterialsType[];
  setSelectedItems: React.Dispatch<React.SetStateAction<CaseMaterialsType[]>>;
};

export const SelectedItemsContext = createContext<SelectedItemsType>({});

export const SelectedItemsProvider = ({ children }: PropsWithChildren) => {
  const [selectedItems, setSelectedItems] = useState<CaseMaterialsType[]>([]);
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (
      (location.pathname === URL.MATERIALS &&
        prevPath.current !== URL.MATERIALS) ||
      (location.pathname === URL.COMMUNICATIONS &&
        prevPath.current !== URL.COMMUNICATIONS)
    ) {
      setSelectedItems([]);
    }

    prevPath.current = location.pathname;
  }, [location.pathname, setSelectedItems]);

  return (
    <SelectedItemsContext.Provider value={{ selectedItems, setSelectedItems }}>
      {children}
    </SelectedItemsContext.Provider>
  );
};
