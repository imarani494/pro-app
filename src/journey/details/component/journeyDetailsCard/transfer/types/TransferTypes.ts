export interface TvlG {
  tvlA: string[];
}

export interface InvBkupA {
  cur: string;
  cost: number;
  costInUSD: number;
  sell: number;
  sellInUSD: number;
  spNm: string;
  mkupShId: number;
  details: string;
  lnkA: Array<{v: string; k: string}>;
}

export interface TxpL {
  st: string;
  nm: string;
}

export interface Action {
  name: string;
  type: string;
  ctype?: string;
  qt?: string;
  tvlG?: TvlG;
}

export interface TransferApiData {
  date: string;
  slotD?: string;
  bggN: string;
  grpNm: string;
  paxD: string;
  dcty: string;
  typ: 'TRANSFERS';
  tvlG: TvlG;
  ttl: string;
  cdnm: string;
  dctyD: string;
  typD: 'Transfer';
  bggC: number;
  cky: string;
  cdid: number;
  invBkupA?: InvBkupA[];
  dsc: string;
  txpL: TxpL;
  dayNum: number;
  subType: string;
  ntA: string[];
  drH: number;
  bid: string;
  actions: Action[];
  txpT: string;
  txptA: {
    txt: string;
    typ: string;
  }[];
  slot?: {
    s: number;
    e: number;
  };
  tmD?: string;
}

export interface JourneyTransferData {
  transferType: string;
  title: string;
  cdnm: string;
  description: string;
  cityName: string;
  passengerInfo: string;
  baggageInfo: string;
  transportLabel: string;
  transportType: string;
  transportStatus: string;
  date: string;
  duration: number;
  subType: string;
  features: string[];
  notes: string[];
  travelers: Array<{
    id: string;
    type: 'Adult' | 'Child';
    name?: string;
  }>;
  pricing: {
    currency: string;
    totalCost: number;
    totalSell: number;
    totalCostInUSD: number;
    totalSellInUSD: number;
    breakdown: Array<{
      details: string;
      cost: number;
      sell: number;
      currency: string;
    }>;
  };
  pickupInfo?: {
    label: string;
    details: string;
  };
}
