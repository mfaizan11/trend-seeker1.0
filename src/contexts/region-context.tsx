
"use client";

import type { Dispatch, ReactNode, SetStateAction} from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Region {
  code: string;
  name: string;
  currency: string;
  symbol: string;
}

interface RegionContextType {
  selectedRegion: Region;
  setSelectedRegion: Dispatch<SetStateAction<Region>>;
  availableRegions: Region[];
}

const availableRegions: Region[] = [
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
  { code: 'EU', name: 'Eurozone', currency: 'EUR', symbol: '€' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥' },
  { code: 'PK', name: 'Pakistan', currency: 'PKR', symbol: '₨' },
];

const defaultRegion = availableRegions[0]; // USD

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRegion, setSelectedRegion] = useState<Region>(defaultRegion);

  useEffect(() => {
    const storedRegionCode = localStorage.getItem('selectedRegionCode');
    if (storedRegionCode) {
      const foundRegion = availableRegions.find(r => r.code === storedRegionCode);
      if (foundRegion) {
        setSelectedRegion(foundRegion);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedRegionCode', selectedRegion.code);
  }, [selectedRegion]);

  return (
    <RegionContext.Provider value={{ selectedRegion, setSelectedRegion, availableRegions }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = (): RegionContextType => {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};

