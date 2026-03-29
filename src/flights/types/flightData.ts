export interface FlightData {
  dur: number; // Duration in minutes
  prc: number; // Price
  scr: number; // Score
  legs: any[]; // Flight legs
  stl: number; // Stops
  nfmap: Array<{
    p: number; // Price
    r: boolean;
    of: number;
    ri: string;
    oi: string;
    k: string;
    ok: string;
  }>;
  srl: string; // Serialized flight data containing all details
  key: string;
  spl: boolean;
  isOHF: boolean;
  zrf: boolean;
}