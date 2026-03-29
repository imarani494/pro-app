export interface GroupTourApiData {
  date: string;
  frmCityId: number;
  hgh: string[];
  paxD: string;
  typ: string;
  tvlG: {
    tvlA: string[];
  };
  typD: string;
  toCityId: number;
  cky: string;
  startAtDay: number;
  pkgDescription: string;
  invBkupA: Array<{
    cur: string;
    cost: number;
    costInUSD: number;
    sell: number;
    sellInUSD: number;
    spNm: string;
    details: string;
    lnkA: any[];
  }>;
  pkgName: string;
  dayNum: number;
  pkgId: number;
  numOfNights: number;
  bid: string;
  itnDsp: string;
  actions: any[];
  startDate: string;
  rmTvlsG: string[][];
  pkgDstSmry: {
    cts: number;
    cntry: number;
    dys: number;
  };
}

export interface TravelerInfo {
  id: string;
  type: 'Adult' | 'Child';
}
