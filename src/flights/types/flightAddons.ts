export interface FlightAddonOption {
  val: string;
  pr: number;
  prD: string;
  nm: string;
}

export interface FlightAddonSection {
  cd: string;
  sctK: string;
  osctK?: string;
  typ: string;
  optA: FlightAddonOption[];
  nm: string;
  sctN: string;
}

export interface FlightAddonsResponse {
  success: boolean;
  _data: {
    baggages: FlightAddonSection[];
    meals: FlightAddonSection[];
  };
}

// Constants for addon types
export const ADDON_TYPES = {
  BAGGAGE: "BAGGAGE",
  INFLIGHT_MEAL: "INFLIGHT_MEAL",
} as const;

export const SECTION_TYPES = {
  BAGGAGE: "baggage",
  MEAL: "meal",
} as const;

export const TRAVELLER_PREFIX = "T_ADULT_";