// src/journey/component/journeyDetailsCard/visa/types/VisaTypes.ts
export interface TvlG {
  tvlA: string[];
}

export interface VisaApiData {
  bid?: string;
  cdnm?: string;
  ttl?: string;
  title?: string;
  typ?: string;
  typD?: string;
  nm?: string;
  paxD?: string;
  tvlG?: TvlG;
  dsc?: string;
  description?: string;
  ntA?: string[];
  cdid?: string;
  drH?: string;
  tmD?: string;
  subType?: string;
  showBadge?: boolean;
  isVisa4?: boolean;  
  isInc?: boolean;    
}
