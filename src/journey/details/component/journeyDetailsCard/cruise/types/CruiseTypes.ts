export interface CruiseApiData {
  shwPrcDiff: boolean;
  blkTxt: string;
  hId: number;
  srchO: {
    cnm: string;
    chkOut: string;
    chkIn: string;
    paxD: string;
    ntn: number;
    nts: number;
    paxes: {
      rooms: Array<{
        ad: number;
        ch: number;
        chAge: number[];
      }>;
    };
    cid: string;
    ntnD: string;
  };
  iBfstPf: boolean;
  rmA: Array<{
    roptA: Array<{
      cur: string;
      pr: number;
      prD: string;
      mp: string;
      mlD: string;
      splTxtA: string[];
      prId: string;
      mpN: string;
      prQ: string;
      absPrc: number;
      uId: string;
      rtcd: string;
      name: string;
      key: string[];
      xpDtlA?: string[];
      xpSmry?: string;
    }>;
    nm: string;
  }>;
  rmFltrsSlctd: {
    meal: string;
  };
  details: {
    hotelCity: string;
    rooms: any[];
    hotelImages: Array<{
      imageUrl: string;
    }>;
    hotelAddress: string;
    hotelDesc: string;
    guestRating: any;
    hotelName: string;
    policy: any;
  };
  rmPaxTxt: string[];
}

export interface TravelerInfo {
  id: string;
  type: 'Adult' | 'Child';
}

export interface RefundabilityStatus {
  isRefundable: boolean;
  text: string;
}

export interface CruiseDates {
  checkIn: string;
  checkOut: string;
  nights: number;
}
