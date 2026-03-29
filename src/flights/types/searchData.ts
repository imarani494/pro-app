import { FlightLeg } from "./flightLeg";

export interface SearchData {
  chkInDt?: string;
  chkOutDt?: string;
  pkgId: number;
  srchQ: {
    legs: FlightLeg[];
    sTyp: string;
    cabin: string;
    sftyp: string;
    isStpAl: boolean;
    isRet: string;
    pfCar: string[];
    nAdt: number;
    nChd: number;
    nInf: number;
  };
  incPrc: boolean;
  fphFlow: boolean;
  prdFlow?: boolean;
  prFlt: boolean;
  __xreq__: boolean;
}
