export interface ActionMiscData {
  date: string;
  blockId: string | null;
  cityId: string;
  nationality: string;
  tvlrKeys: string;
  jid: string;
  rmTvlG?: any;
  tvlG?: any;
  dayNum?: number;
  cityName?: string;
  srchO?: any;
  checkinDate?: string;
  checkoutDate?: string;
  hotel_slug?: string;
  bid?: string | null;
  mealType?: string;
  fltSA?: any;
  aCtyId?: number;
  dCtyId?: number;
  ctyA?: any[];
  fltO?: any;
  cdid?: number; // Content detail ID for activities/content cards
  uTxptO?: any;
  cityKey?: string; // City key for self-booked tour removal
  isSelfBookedTourBlock?: boolean; // Flag to identify self-booked tour blocks
  dayNumD?: number;
  selectedTourId?: number;
  pkTm?: string;
  dpTm?: string;
  pkLoc?: string;
  dpLoc?: string;
}
