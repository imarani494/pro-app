// types/SightseeingTypes.ts

export interface SightseeingApiData {
  date: string;
  slotD?: string;
  img?: string;
  paxD?: string;
  typ: string;
  slot?: {
    s: number;
    e: number;
  };
  cdnm?: string;
  exTA?: string[];
  cky?: string;
  cdid?: number;
  invBkupA?: Array<{
    cur: string;
    cost: number;
    costInUSD: number;
    sell: number;
    sellInUSD: number;
    spNm: string;
    mkupShId?: number;
    details: string;
    lnkA: Array<{
      v: string;
      k: string;
    }>;
  }>;
  txpL?: {
    st?: string;
    nm?: string;
  };
  txpT?: string;
  inTA?: string[];
  mlT?: {
    nm?: string;
  };
  grpNm?: string;
  dcty?: string;
  tmD?: string;
  tvlG: {
    tvlA: string[];
  };
  numVariants?: number;
  ttl?: string;
  url?: string;
  dctyD?: string;
  typD?: string;
  dsc?: string;
  dayNum?: number;
  subType?: string;
  ntA?: string[];
  drH?: number;
  bid?: string;
  actions?: Array<{
    name: string;
    type: string;
    ctype?: string;
    tvlG?: {
      tvlA: string[];
    };
  }>;
  addOnA?: Array<{
    id?: string;
    cdnm?: string;
    bid?: string;
    actions?: Array<{
      type: string;
      name: string;
    }>;
  }>;
}

export interface TravelerInfo {
  id: string;
  type: 'Adult' | 'Child';
  name?: string;
}

export interface JourneySightseeingData {
  title: string;
  cityName: string;
  passengerInfo: string;
  description: string;
  image: string;
  duration: string;
  timeSlot: string;
  inclusions: string[];
  exclusions: string[];
  transportType: string;
  transportStatus: string;
  travelers: TravelerInfo[];
  hasPrivateTransfer: boolean;
  hasMealsIncluded: boolean;
  notes: string[];
  pricing?: {
    currency: string;
    cost: number;
    sell: number;
  };
  transferDisplayText: string;
  mealTypeName?: string;
}
