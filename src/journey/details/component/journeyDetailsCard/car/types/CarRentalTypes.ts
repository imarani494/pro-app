// types/CarRentalTypes.ts
export interface CarRentalLocation {
  loc: string;
  locTm?: string;
}

export interface VehicleDetails {
  vnm: string;
  nst: number;
  vtyp?: string;
  ndr?: number;
  ftA?: string[];
  hasAC?: boolean;
  isAWD?: boolean;
  isAutoTx?: boolean;
  img?: string;
}

export interface InclusionItem {
  nm: string;
  q: number;
  Iply?: boolean;  // ✅ Changed from iPyL to Iply (capital I)
}

export interface CarRentalOptions {
  vd: VehicleDetails;
  optr?: {
    nm?: string;
    lg?: string;
  };
  pkLoc: CarRentalLocation;
  dpLoc: CarRentalLocation;
  pkTm: string;
  dpTm: string;
  days: number;
  incA: InclusionItem[];
  mpl?: string;
  fpl?: string;
  prcD?: string;
  prcPyLD?: number;  // ✅ Added - Pay at pickup price
  cur?: string;
  asts?: string;
}

export interface CarRentalApiData {
  success?: boolean;
  response_ref?: string;
  _data?: {
    srchO?: {
      pkTm: string;
      cat: string;
      pkLoc: CarRentalLocation;
      dpTm: string;
    };
    dtlH?: string;
    carO?: CarRentalOptions;
    tvlG?: { tvlA: any[] };
    paxD?: string;
    invBkupA?: Array<{
      cur: string;
      sell: number;
      sellInUSD: number;
    }>;
  };
  carO?: CarRentalOptions;
  tvlG?: { tvlA: any[] };
  paxD?: string;
  invBkupA?: Array<{
    cur: string;
    sell: number;
    sellInUSD: number;
  }>;
}

export interface JourneyTraveler {
  id: string;
  type: 'Adult' | 'Child';
  name?: string;
}

export interface JourneyCarData {
  name: string;
  seats: number;
  features: string[];
  transmission: string;
  passengerInfo: string;
  travelers: JourneyTraveler[];
  image?: string;
  logoImage?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  pickupDate?: string;
  dropoffDate?: string;
  pickupTime?: string;
  dropoffTime?: string;
  pickupDateTimeFormatted?: string;      // ✅ Added
  dropoffDateTimeFormatted?: string;     // ✅ Added
  days?: number;
  inclusions?: string[];
  exclusions?: string[];
  price?: string;
  currency?: string;
  priceInUSD?: number;                   // ✅ Added
  mileage?: string;
  fuelPolicy?: string;
  availability?: string;
  airConditioning?: boolean;             // ✅ Added
  provider?: {                           // ✅ Added
    nm?: string;
    lg?: string;
  };
}
