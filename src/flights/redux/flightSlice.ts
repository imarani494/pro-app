import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {isTravellerType, processFlightData} from '../lib/utils';
import {ContentCardType} from '../../contentCard/types/contentCard';
import {searchFlightsApi} from '../../common/api/flights/search-x/route';
import {airportSuggestApi} from '../../common/api/flights/airport-suggest/route';
import {checkFlightUpgradesApi} from '../../common/api/flights/check-upgrades/route';
import {saveUserTransportInfoApi} from '../../common/api/trip/save-user-transport-info/route';
import {packageManualFlightAddApi} from '../../common/api/package/package-manual-flight-add/route';
import {getFlightScheduleByFlightNumApi} from '../../common/api/flights/get-flight-schedule-by-flight-num/route';
import {importPnrApi} from '../../common/api/flights/import-pnr/route';
import {loadFlightAncillaryApi} from '../../common/api/package/load-flight-ancillary/route';
import {getFareRulesApi} from '../../common/api/flights/get-fare-rules/route';

interface FlightFilters {
  stops: Record<string, any>;
  airlines: Record<string, any>;
  time: Record<string, any>;
}

interface FareRules {
  loading: boolean;
  data?: any;
  error?: string;
}

interface flightScheduleDataType {
  dtml: string;
  txt: string;
  aarpt: string;
  darpt: string;
  darptnm: string;
  aarptnm: string;
  atm: string;
  dtm: string;
  atml: string;
}

interface LegSummary {
  index: number;
  route: string;
  date: string;
  src: string;
  dst: string;
  srcName: string;
  dstName: string;
  selected: boolean;
  flightData?: any;
}

const applyFiltersToFlightData = (state: FlightState, selectedData?: any) => {
  const filters = state.context.filters;

  const filteredData = selectedData.filter((flight: any) => {
    let matchesStops = false;
    const selectedStop = Object.keys(filters.stops).find(
      key => filters.stops[key].selected,
    );

    if (selectedStop === 'any') {
      matchesStops = true;
    } else if (selectedStop === '0') {
      matchesStops = flight.stops === 0;
    } else if (selectedStop && flight.stops <= parseInt(selectedStop)) {
      matchesStops = true;
    }

    let matchesAirlines = true;
    if (Object.values(filters.airlines).length > 0) {
      matchesAirlines = Object.values(filters.airlines).some(
        (airline: any) =>
          airline.selected && flight.arls.includes(airline.code),
      );
    }

    let matchesTime = filters.time['-1']?.selected || false;

    if (!matchesTime && flight.depTime) {
      const depTimeHour = parseInt(flight.depTime.split(':')[0]);

      for (const [key, filter] of Object.entries(filters.time)) {
        if (key !== '-1' && (filter as any).selected) {
          const [startHour, endHour] = key.split('_').map(h => parseInt(h));

          if (depTimeHour >= startHour && depTimeHour < endHour) {
            matchesTime = true;
            break;
          }
        }
      }
    }

    return matchesStops && matchesAirlines && matchesTime;
  });

  state.context.filteredFlightData = filteredData;

  state.context.sortedFlightData = [...filteredData];
  const sortedData = sortFlightData(
    filteredData,
    state.context.sortBy || 'recommended',
  );
  state.context.filteredFlightData = Array.isArray(sortedData)
    ? sortedData
    : filteredData;
};

const sortFlightData = (flightData: any[], sortBy: string): any[] => {
  const sortedData = [...flightData];

  if (sortBy === 'recommended' || !sortBy) {
    return sortedData.sort((a, b) => {
      const scoreA = parseFloat(a.scr || 0);
      const scoreB = parseFloat(b.scr || 0);
      return scoreB - scoreA;
    });
  }

  switch (sortBy) {
    case 'cheapest':
      return sortedData.sort((a, b) => {
        const priceA = parseFloat(a.prc || a.owPrc || 0);
        const priceB = parseFloat(b.prc || b.owPrc || 0);
        return priceA - priceB;
      });

    case 'highest':
      return sortedData.sort((a, b) => {
        const priceA = parseFloat(a.prc || a.owPrc || 0);
        const priceB = parseFloat(b.prc || b.owPrc || 0);
        return priceB - priceA;
      });

    case 'departure-early':
      return sortedData.sort((a, b) => {
        const timeA = a.depTime || '00:00';
        const timeB = b.depTime || '00:00';
        return timeA.localeCompare(timeB);
      });

    case 'departure-late':
      return sortedData.sort((a, b) => {
        const timeA = a.depTime || '00:00';
        const timeB = b.depTime || '00:00';
        return timeB.localeCompare(timeA);
      });

    case 'arrival-early':
      return sortedData.sort((a, b) => {
        const timeA = a.arrTime || '00:00';
        const timeB = b.arrTime || '00:00';
        return timeA.localeCompare(timeB);
      });

    case 'arrival-late':
      return sortedData.sort((a, b) => {
        const timeA = a.arrTime || '00:00';
        const timeB = b.arrTime || '00:00';
        return timeB.localeCompare(timeA);
      });

    case 'quickest':
      return sortedData.sort((a, b) => {
        const durA = parseFloat(a.dur || 0);
        const durB = parseFloat(b.dur || 0);
        return durA - durB;
      });

    case 'slowest':
      return sortedData.sort((a, b) => {
        const durA = parseFloat(a.dur || 0);
        const durB = parseFloat(b.dur || 0);
        return durB - durA;
      });

    default:
      return [...flightData];
  }
};
const updateFilteredFlightData = (state: FlightState) => {
  const {flightData, fltKeys, currentLegIndex, fltSelectedData, query} =
    state.context;

  if (!flightData || fltKeys.length === 0) {
    state.context.filteredFlightData = [];
    state.context.sortedFlightData = [];
    return;
  }

  let baseFlightData: any[] = [];

  if (query?.srchO?.sTyp === 'OPEN_JAW') {
    const key = fltKeys[currentLegIndex];
    baseFlightData = flightData[key] || [];
  } else {
    if (currentLegIndex === 0) {
      baseFlightData = flightData[fltKeys[0]] || [];
    } else {
      const prev = fltSelectedData[currentLegIndex - 1];
      if (
        prev &&
        flightData.flightKeyMap[prev.key] &&
        flightData.flightKeyMap[prev.key].nfmap
      ) {
        baseFlightData = flightData.flightKeyMap[prev.key].nfmap.map(
          (nf: any) => ({
            ...flightData.flightKeyMap[nf.k],
            prc: nf.p,
          }),
        );
      } else {
        const key = fltKeys[currentLegIndex];
        baseFlightData = flightData[key] || [];
      }
    }
  }

  applyFiltersToFlightData(state, baseFlightData);
};

const resetFiltersToDefault = (state: FlightState) => {
  state.context.filters = {
    stops: {
      any: {text: 'Any number of stops', val: 'any', selected: true},
      '0': {text: 'Non-stop', val: '0', selected: false},
      '1': {text: '1 stop or fewer', val: '1', selected: false},
      '2': {text: 'Two stops or fewer', val: '2', selected: false},
    },
    airlines: {},
    time: {
      '-1': {text: 'anytime', val: '-1', selected: true},
      '00_04': {text: '12 AM - 04 AM', val: '00_04', selected: false},
      '04_08': {text: '04 AM - 08 AM', val: '04_08', selected: false},
      '08_12': {text: '08 AM - 12 PM', val: '08_12', selected: false},
      '12_16': {text: '12 PM - 04 PM', val: '12_16', selected: false},
      '16_20': {text: '04 PM - 08 PM', val: '16_20', selected: false},
      '20_24': {text: '08 PM - 12 AM', val: '20_24', selected: false},
    },
  };
};

const calculateComboPrice = (
  fltSelectedData: any[],
): {isCombo: boolean; comboPrice: number | null} => {
  if (!fltSelectedData || fltSelectedData.length < 2) {
    return {isCombo: false, comboPrice: null};
  }

  let bestComboPrice: number = 0;
  let canUseCombo: boolean = true;

  for (let i = 1; i < fltSelectedData.length; i++) {
    const prevFlight = fltSelectedData[i - 1];
    const currentFlight = fltSelectedData[i];

    if (prevFlight.nfmap) {
      const nfmapEntry = prevFlight.nfmap.find(
        (nf: any) => nf.k === currentFlight.key,
      );
      if (nfmapEntry) {
        bestComboPrice =
          nfmapEntry.p <= currentFlight.prc ? nfmapEntry.p : currentFlight.prc;
      } else {
        canUseCombo = false;
        break;
      }
    } else {
      canUseCombo = false;
      break;
    }
  }

  return {
    isCombo: canUseCombo,
    comboPrice: bestComboPrice,
  };
};

export type flightHotelTimeAlignmentOption = {
  msg: string;
  opts: Array<{
    msg: string;
    fnECkin?: boolean;
    extLstDyCO?: boolean;
    sltd?: boolean;
  }>;
};

export interface FlightState {
  loading: boolean;
  uploading: boolean;
  dateChangeLoading: boolean; // Separate loading for date changes
  success?: boolean;
  errorMessage?: undefined | string;
  context: {
    open: boolean;
    notFireSearch?: boolean;
    restrictDate?: boolean;
    fareRules?: FareRules;
    flow:
      | 'BOOKING'
      | 'SELF_BOOKING'
      | 'EARLY_CHECKIN_OPTIONS'
      | 'LATE_CHECKOUT_OPTIONS'
      | 'ADD_MANUAL_FLIGHT'
      | 'TRANSPORT_ADD_ONS'
      | 'FLIGHT_DETAILS';
    searchData: any;
    serverSearchData?: any;
    rstTvlG: any | null;
    query: {
      type: ContentCardType;
      srchO: any | null;
      blockId: string | null;
      onDate: string | null;
      tvlG: any | null;
      dayNum: number | null;
    };
    flightData: any;
    filteredFlightData: any[];
    journeyFlow: boolean;
    incPrc: boolean;
    fltKeys: string[];
    fltSelectedData: any[];
    nxtDtA: any[];
    filters: FlightFilters;
    upgData?: any;
    selUpg: any[];
    selfBookConfigData?: any;
    selfBookData?: any;
    flightScheduleData?: flightScheduleDataType | null;
    flightScheduleLoading?: boolean;
    savedUserTransportInfo?: any;
    flightHotelTimeAlignmentOption?: flightHotelTimeAlignmentOption | null;
    importPnrRes?: any[];
    manualFlightAddRes?: any;
    flightAddons?: any;
    addonsLoading?: boolean;
    addonActionData?: any;
    selectedAddons?: Array<{
      sectionType: 'baggage' | 'meal';
      sectionKey: string;
      sectionName?: string;
      travellerIdx: number;
      option: any; // FlightAddonOption
    }>;
    addonsInitialized?: boolean;
    // New multi-leg properties
    currentLegIndex: number;
    totalLegs: number;
    isMultiLegFlow: boolean;
    legSummaries: LegSummary[];
    isAllLegsSelected: boolean;
    flightDataCache: Record<string, any>; // key: "F-src-dst-date", value: flight data
    cachedFltKeys: Record<string, string[]>; // Cache of fltKeys per date
    cachedLegSummaries: Record<string, LegSummary[]>;
    dateSelected: boolean; // Track if user has selected a date for next leg
    flightDetailsData?: any; // Flight details data for viewing
    sortedFlightData: any[];
    sortBy: string;
    // Simple boolean to control visibility below date card
    showResultsBelowDateCard: boolean;
    // Combo pricing information
    comboPricing: {
      isCombo: boolean;
      comboPrice: number | null;
    };
  };
  cabinList: any[];
  searchTypeList: any[];
}

const initialState: FlightState = {
  loading: false,
  uploading: false,
  dateChangeLoading: false, // Separate loading for date changes
  success: true,
  errorMessage: undefined,
  context: {
    dateSelected: false,
    open: false,
    notFireSearch: false, // Do not fire initial search
    restrictDate: false, // Restrict date selection
    fareRules: {
      loading: false,
      data: {},
      error: undefined,
    },
    flow: 'BOOKING',
    searchData: {},
    serverSearchData: null,
    rstTvlG: null,
    query: {
      type: ContentCardType.FLIGHT,
      srchO: {},
      blockId: null,
      onDate: null,
      tvlG: null,
      dayNum: null,
    },
    flightData: null,
    filteredFlightData: [],
    journeyFlow: true,
    incPrc: true,
    fltKeys: [],
    fltSelectedData: [],
    nxtDtA: [],
    filters: {
      stops: {
        any: {text: 'Any number of stops', val: 'any', selected: true},
        '0': {text: 'Non-stop', val: '0', selected: false},
        '1': {text: '1 stop or fewer', val: '1', selected: false},
        '2': {text: 'Two stops or fewer', val: '2', selected: false},
      },
      airlines: {},
      time: {
        '-1': {text: 'anytime', val: '-1', selected: true},
        '00_04': {text: '12 AM - 04 AM', val: '00_04', selected: false},
        '04_08': {text: '04 AM - 08 AM', val: '04_08', selected: false},
        '08_12': {text: '08 AM - 12 PM', val: '08_12', selected: false},
        '12_16': {text: '12 PM - 04 PM', val: '12_16', selected: false},
        '16_20': {text: '04 PM - 08 PM', val: '16_20', selected: false},
        '20_24': {text: '08 PM - 12 AM', val: '20_24', selected: false},
      },
    },
    upgData: null,
    selUpg: [],
    selfBookConfigData: null,
    selfBookData: null,
    flightScheduleData: null,
    flightScheduleLoading: false,
    savedUserTransportInfo: null,
    flightHotelTimeAlignmentOption: null,
    importPnrRes: [],
    manualFlightAddRes: null,
    flightAddons: null,
    addonsLoading: false,
    addonActionData: null,
    selectedAddons: [],
    addonsInitialized: false,
    currentLegIndex: 0,
    totalLegs: 0,
    isMultiLegFlow: false,
    legSummaries: [],
    isAllLegsSelected: false,
    flightDataCache: {}, // NEW
    cachedFltKeys: {}, // NEW
    cachedLegSummaries: {}, // NEW
    flightDetailsData: null,
    sortedFlightData: [],
    sortBy: 'recommended', // Default sort option
    showResultsBelowDateCard: true, // Show results below date card by default
    comboPricing: {
      isCombo: false,
      comboPrice: null,
    },
  },
  cabinList: [
    {name: 'Economy', val: 'A'},
    {name: 'Business', val: 'B'},
    {name: 'First Class', val: 'C'},
    {name: 'Premium Economy', val: 'P'},
  ],
  searchTypeList: [
    {name: 'One Way', val: 'ONE_WAY'},
    {name: 'Return', val: 'RETURN'},
    {name: 'Open Jaw', val: 'OPEN_JAW'},
    {name: 'Multi-City', val: 'MULTI_CITY'},
  ],
};

// export const searchFlights = createAsyncThunk(
//   "flights/search-x",
//   async (params: any) => {
//     return await apiClient.post<any>(`/flights/search-x`, {
//       ...params,
//     });
//   }
// );

export const searchFlights = createAsyncThunk(
  'flights/search-x',
  async (params: any) => {
    return await searchFlightsApi(params || {});
  },
);

export const airportSuggest = createAsyncThunk(
  'flights/airport-suggest',
  async (params: any) => {
    return await airportSuggestApi(params || {});
  },
);

export const checkUpgrades = createAsyncThunk(
  'flights/check-upgrades',
  async (params: any) => {
    return await checkFlightUpgradesApi(params || {});
  },
);

export const saveUserTransportInfo = createAsyncThunk(
  'flights/save-user-transport-info',
  async (params: any) => {
    return await saveUserTransportInfoApi(params || {});
  },
);

export const packageManualFlightAdd = createAsyncThunk(
  'package/package-manual-flight-add',
  async (params: any) => {
    return await packageManualFlightAddApi(params || {});
  },
);

export const getFlightScheduleByFlightNum = createAsyncThunk(
  'flights/get-flight-schedule-by-flight-num',
  async (params: any) => {
    return await getFlightScheduleByFlightNumApi(params || {});
  },
);

export const importPNR = createAsyncThunk(
  'flights/import-pnr',
  async (params: any) => {
    return await importPnrApi(params || {});
  },
);

export const getFlightAddons = createAsyncThunk(
  'package/load-flight-ancillary',
  async (params: any) => {
    return await loadFlightAncillaryApi(params || {});
  },
);

export const getFareRules = createAsyncThunk(
  'flights/get-fare-rules',
  async (params: any) => {
    return await getFareRulesApi(params || {});
  },
);

const resetStateForNewSearch = (
  state: FlightState,
  preserveSelections: boolean = false,
) => {
  // If preserving selections, only reset the new leg's data
  if (preserveSelections) {
    // Only clear data for legs AFTER the current selection
    const currentSelectedCount =
      state.context.fltSelectedData.filter(Boolean).length;

    // Keep selected flights up to current selected count
    const preservedSelections = state.context.fltSelectedData.slice(
      0,
      currentSelectedCount,
    );
    state.context.fltSelectedData = preservedSelections;

    // Keep leg summaries up to current selected count
    const preservedSummaries = state.context.legSummaries.slice(
      0,
      currentSelectedCount,
    );
    state.context.legSummaries = preservedSummaries;

    // Clear next date adjustments for future legs
    state.context.nxtDtA = [];

    // Mark that date has been selected (user clicked on a date)
    state.context.dateSelected = true;

    // Reset filters for the new leg only
    resetFiltersToDefault(state);

    return;
  }

  // Original reset logic (for brand new searches)
  state.context.fltSelectedData = [];
  state.context.fltKeys = [];
  state.context.legSummaries = [];
  state.context.nxtDtA = [];
  state.context.isAllLegsSelected = false;
  state.context.currentLegIndex = 0;
  state.context.totalLegs = 0;
  state.context.upgData = null;
  state.context.selUpg = [];
  state.context.flightData = null;
  state.context.filteredFlightData = [];
  state.context.sortedFlightData = [];
  state.context.dateSelected = false;
  state.context.flightDataCache = {};
  state.context.sortBy = 'recommended';
  state.context.comboPricing = {
    isCombo: false,
    comboPrice: null,
  };
  resetFiltersToDefault(state);
};

export const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    openFlightSlider(state, action: any) {
      state.context.open = action.payload.open;
      state.context.notFireSearch = action.payload?.notFireSearch || false;
      state.context.restrictDate = action.payload?.restrictDate || false;
      if (action.payload.open) {
        const flow = action.payload.flow || 'BOOKING';
        state.context.flow = flow;
        state.context.query = action.payload.query;
        if (flow === 'BOOKING') {
          state.context.searchData = action.payload?.searchData || {};
          state.context.query.srchO = action.payload?.searchData || {};
        }
        if (action.payload.flow === 'SELF_BOOKING') {
          state.context.selfBookConfigData = action.payload.selfBookConfigData;
          state.context.flightScheduleData = null;
          state.context.savedUserTransportInfo = null;
        }
        if (
          action.payload.flow === 'EARLY_CHECKIN_OPTIONS' ||
          action.payload.flow === 'LATE_CHECKOUT_OPTIONS'
        ) {
          state.context.flightHotelTimeAlignmentOption =
            action.payload.checkInNcheckOutOpts;
        }
        if (action.payload.flow === 'TRANSPORT_ADD_ONS') {
          state.context.addonActionData = action.payload.addonActionData;
        }
        if (action.payload.flow === 'FLIGHT_DETAILS') {
          state.context.flightDetailsData = action.payload.flightDetailsData;
        }
      }
    },
    resetState: state => {
      state.context.selfBookConfigData = null;
      state.context.nxtDtA = [];
      state.context.filteredFlightData = [];
      state.context.sortedFlightData = [];
      state.context.fltSelectedData = [];
      state.context.flightData = null;
      state.context.fltKeys = [];
      state.context.filters = initialState.context.filters;
      state.context.selUpg = [];
      state.context.upgData = null;
      state.context.query = {
        type: ContentCardType.FLIGHT,
        srchO: {},
        blockId: null,
        onDate: null,
        tvlG: null,
        dayNum: null,
      };
      state.context.searchData = {};
      state.context.savedUserTransportInfo = null;
      state.context.flightScheduleData = null;
      state.context.flightHotelTimeAlignmentOption = null;
      state.context.flightDetailsData = null;
      state.context.currentLegIndex = 0;
      state.context.totalLegs = 0;
      state.context.isMultiLegFlow = false;
      state.context.legSummaries = [];
      state.context.isAllLegsSelected = false;
      state.context.sortBy = 'recommended';
      state.context.comboPricing = {
        isCombo: false,
        comboPrice: null,
      };
    },
    closeFlightSlider(state) {
      state.context.open = false;
      state.context.notFireSearch = false;
      // Clear addons state when closing so it refetches on next open
      state.context.selectedAddons = [];
      state.context.addonsInitialized = false;
      state.context.flightAddons = null;
    },
    resetManualFlightAddRes(state) {
      state.context.manualFlightAddRes = null;
      state.context.importPnrRes = [];
      state.context.open = false;
    },
    setNotFireSearch(state) {
      state.context.notFireSearch = false;
    },
    setSearchData: (state, action) => {
      state.context.searchData = action.payload;
    },
    setQuerySearchData: (state, action) => {
      const parsed = JSON.parse(action.payload);
      state.context.query = {
        ...state.context.query,
        srchO: parsed,
      };
      state.context.searchData = parsed;
    },
    setTravellerGroup: (state, action) => {
      state.context.query.tvlG = action.payload;
    },
    setFlightSelectedData: (state, action) => {
      const currentIndex = state.context.currentLegIndex;

      // Store selection at current leg index
      state.context.fltSelectedData[currentIndex] = action.payload;

      // Update leg summary
      if (state.context.legSummaries[currentIndex]) {
        state.context.legSummaries[currentIndex] = {
          ...state.context.legSummaries[currentIndex],
          selected: true,
          flightData: action.payload,
        };
      }

      state.context.nxtDtA = JSON.parse(action.payload.nxtDtA);

      // Reset dateSelected flag when a flight is selected (new date options may appear)
      if (state.context.nxtDtA.length > 0) {
        state.context.dateSelected = false;
        // Hide results below date card when date selection bar appears
        state.context.showResultsBelowDateCard = false;
      } else {
        // Show results when date selection bar disappears
        state.context.showResultsBelowDateCard = true;
      }

      // Check if all legs are selected
      state.context.isAllLegsSelected =
        state.context.fltSelectedData.filter(Boolean).length ===
        state.context.totalLegs;

      // Update combo pricing
      state.context.comboPricing = calculateComboPrice(
        state.context.fltSelectedData,
      );

      updateFilteredFlightData(state);
    },
    goToNextLeg: state => {
      if (state.context.currentLegIndex < state.context.totalLegs - 1) {
        state.context.currentLegIndex += 1;

        // Reset filters for new leg
        resetFiltersToDefault(state);

        // Update filtered flight data for next leg
        updateFilteredFlightData(state);
      }
    },
    goToPreviousLeg: state => {
      if (state.context.currentLegIndex > 0) {
        state.context.currentLegIndex -= 1;

        // Reset filters
        resetFiltersToDefault(state);

        // Update filtered flight data
        updateFilteredFlightData(state);
      }
    },
    setCurrentLegIndex: (state, action) => {
      const newIndex = action.payload;
      if (newIndex >= 0 && newIndex < state.context.totalLegs) {
        state.context.currentLegIndex = newIndex;

        // Reset filters
        resetFiltersToDefault(state);

        // Update filtered flight data
        updateFilteredFlightData(state);
      }
    },
    resetDateSelectedFlag: state => {
      state.context.dateSelected = false;
    },
    changeSelectedFlight: (state, action) => {
      state.context.selUpg = [];
      state.context.upgData = null;
      const {legIndex} = action.payload;
      const {totalLegs} = state.context;

      if (legIndex < 0 || legIndex >= totalLegs) return;

      // Move editing focus to the requested leg
      state.context.currentLegIndex = legIndex;

      // We're definitely not "all selected" anymore
      state.context.isAllLegsSelected = false;

      // Truncate selected flights from this leg onward (removes the clicked leg and everything after)
      state.context.fltSelectedData = state.context.fltSelectedData.slice(
        0,
        legIndex,
      );

      // Clear leg summaries from this leg onward
      for (let i = legIndex; i < totalLegs; i++) {
        if (state.context.legSummaries[i]) {
          state.context.legSummaries[i] = {
            ...state.context.legSummaries[i],
            selected: false,
            flightData: null,
          };
        }
      }

      // Reset any next-date adjustments that depended on later selections
      state.context.nxtDtA = [];

      // Reset filters to default before rebuilding the list
      resetFiltersToDefault(state);

      // Reset combo pricing when flights change
      state.context.comboPricing = calculateComboPrice(
        state.context.fltSelectedData,
      );

      // Rebuild filtered data for the (now active) leg
      updateFilteredFlightData(state);
    },
    setFilteredFlightByChange: (state, action) => {
      const legIndex = parseInt(action.payload.legIndex);
      state.context.fltSelectedData = state.context.fltSelectedData.slice(
        0,
        legIndex,
      );
      state.context.nxtDtA = [];
      // Update combo pricing when flights change
      state.context.comboPricing = calculateComboPrice(
        state.context.fltSelectedData,
      );
      updateFilteredFlightData(state);
    },
    resetNextFlightDates: state => {
      state.context.nxtDtA = [];
    },
    createFlightFilters: state => {
      state.context.filteredFlightData.forEach(flight => {
        flight?.legs?.forEach((leg: any) => {
          if (!state.context.filters.airlines[leg.car]) {
            state.context.filters.airlines[leg.car] = {
              selected: true,
              code: leg.car,
              name: leg.crn,
              logo: flight.airlineLogo,
            };
          }
        });
      });
    },
    updateFlightFilters: (state, action) => {
      if (action.payload.type === 'stops') {
        state.context.filters.stops = Object.keys(
          state.context.filters.stops,
        ).reduce((acc: any, key) => {
          acc[key] = {
            ...state.context.filters.stops[key],
            selected:
              action.payload.name === key ? action.payload.value : false,
          };
          return acc;
        }, {});
      } else if (action.payload.type === 'airlines') {
        state.context.filters.airlines = Object.keys(
          state.context.filters.airlines,
        ).reduce((acc: any, key) => {
          let selected = state.context.filters.airlines[key].selected;
          if (action.payload.name === key || action.payload.name === 'all') {
            selected = action.payload.value;
          }
          acc[key] = {
            ...state.context.filters.airlines[key],
            selected,
          };
          return acc;
        }, {});
      } else if (action.payload.type === 'time') {
        state.context.filters.time = Object.keys(
          state.context.filters.time,
        ).reduce((acc: any, key) => {
          acc[key] = {
            ...state.context.filters.time[key],
            selected:
              action.payload.name === key ? action.payload.value : false,
          };
          return acc;
        }, {});
      }

      updateFilteredFlightData(state);
    },
    updateSelectedUpgrades: (state, action) => {
      const {flightKey, upgradeIndex, upgradeData} = action.payload;
      const existingIndex = state.context.selUpg.findIndex(
        (item: any) => item.flightKey === flightKey,
      );

      const selectionData = {
        flightKey,
        upgradeIndex,
        upgradeData,
        selectedAt: new Date().toISOString(),
      };

      if (existingIndex !== -1) {
        state.context.selUpg[existingIndex] = selectionData;
      } else {
        state.context.selUpg.push(selectionData);
      }
    },
    setSortBy: (state, action) => {
      state.context.sortBy = action.payload;
      // Re-apply sorting to original filtered data (stored in sortedFlightData)
      // If sortedFlightData is empty, use filteredFlightData as fallback
      const dataToSort =
        state.context.sortedFlightData.length > 0
          ? state.context.sortedFlightData
          : state.context.filteredFlightData;

      if (dataToSort && dataToSort.length > 0) {
        const sortedData = sortFlightData(dataToSort, action.payload);
        state.context.filteredFlightData = sortedData;
      }
    },
    setShowResultsBelowDateCard: (state, action) => {
      state.context.showResultsBelowDateCard = action.payload;
    },
    setSelectedAddons: (state, action) => {
      state.context.selectedAddons = action.payload;
    },
    addSelectedAddon: (state, action) => {
      const newAddon = action.payload;
      const existing = state.context.selectedAddons || [];
      // Remove any existing selection for same section/traveller
      const filtered = existing.filter(
        (a: any) =>
          !(
            a.sectionType === newAddon.sectionType &&
            a.sectionKey === newAddon.sectionKey &&
            a.travellerIdx === newAddon.travellerIdx
          ),
      );
      state.context.selectedAddons = [...filtered, newAddon];
    },
    removeSelectedAddon: (state, action) => {
      const {sectionType, sectionKey, travellerIdx} = action.payload;
      state.context.selectedAddons = (
        state.context.selectedAddons || []
      ).filter(
        (a: any) =>
          !(
            a.sectionType === sectionType &&
            a.sectionKey === sectionKey &&
            a.travellerIdx === travellerIdx
          ),
      );
    },
    clearSelectedAddons: state => {
      state.context.selectedAddons = [];
      state.context.addonsInitialized = false;
    },
    setAddonsInitialized: (state, action) => {
      state.context.addonsInitialized = action.payload;
    },
    // Filter and set the travellers based on pnr results considering the age of children
    filterTravellersByPaxO: (state, action) => {
      const trvlrA = action.payload;
      const paxO = state.context.importPnrRes?.[0]?.paxO || [];

      const allAdultA = trvlrA
        ?.filter((t: any) => isTravellerType(t, 'ADULT'))
        .map((t: any) => t.id);
      const allChildA = trvlrA
        ?.filter((t: any) => isTravellerType(t, 'CHILD'))
        .map((t: any) => t.id);
      const allInfantA = trvlrA
        ?.filter((t: any) => isTravellerType(t, 'INFANT'))
        .map((t: any) => t.id);

      const filteredAdultA = allAdultA?.slice(0, paxO?.nadt) || [];
      const filteredChildA = allChildA?.slice(0, paxO?.nchd) || [];
      const filteredInfantA = allInfantA?.slice(0, paxO?.ninf) || [];

      state.context.query.tvlG = {
        tvlA: [...filteredAdultA, ...filteredChildA, ...filteredInfantA],
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchFlights.pending, (state: FlightState, action) => {
        const preserveSelections =
          action.meta?.arg?.preserveSelections || false;

        // If preserving selections (date change), use dateChangeLoading
        // Otherwise, use regular loading (full page refresh)
        if (preserveSelections) {
          state.dateChangeLoading = true;
        } else {
          state.loading = true;
        }

        resetStateForNewSearch(state, preserveSelections);
      })
      .addCase(searchFlights.fulfilled, (state: FlightState, action) => {
        if (action.payload.success && action.payload?.success_msg) {
          const success_msg = JSON.parse(action.payload.success_msg);
          const apiSearch = success_msg?.search;
          const processedData = processFlightData(success_msg);

          const preserveSelections =
            action.meta?.arg?.preserveSelections || false;

          // Merge new flight data with existing (don't overwrite)
          if (preserveSelections && state.context.flightData) {
            state.context.flightData = {
              ...state.context.flightData,
              ...processedData,
              flightKeyMap: {
                ...(state.context.flightData?.flightKeyMap || {}),
                ...(processedData?.flightKeyMap || {}),
              },
            };

            state.context.fltSelectedData.forEach((selectedFlight, index) => {
              if (selectedFlight && selectedFlight.key) {
                const updatedFlightData =
                  state.context.flightData.flightKeyMap[selectedFlight.key];
                if (updatedFlightData) {
                  state.context.fltSelectedData[index] = {
                    ...selectedFlight,
                    ...updatedFlightData,
                    key: selectedFlight.key,
                    nxtDtA: updatedFlightData.nxtDtA || selectedFlight.nxtDtA,
                  };
                }
              }
            });
          } else {
            state.context.flightData = processedData;
          }

          state.context.serverSearchData = apiSearch;

          const originalQuery = state.context.query?.srchO;
          const originalLegs = originalQuery?.legs;
          const legsSource =
            Array.isArray(originalLegs) && originalLegs.length > 0
              ? originalLegs
              : apiSearch?.legs || [];

          // Build fltKeys - merge with existing if preserving
          const newFltKeys = legsSource.map((leg: any) => {
            const depStr = (leg.dep || '').replaceAll('/', '');
            return `F-${leg.src}-${leg.dst}-${depStr}`;
          });

          if (preserveSelections) {
            // Merge new keys with existing, preserving selected legs
            newFltKeys.forEach((key: any, index: any) => {
              const existingKey = state.context.fltKeys[index];
              if (existingKey && existingKey === key) {
              } else if (state.context.fltKeys[index] !== key) {
                state.context.fltKeys[index] = key;

                // Cache this data
                state.context.flightDataCache[key] =
                  processedData[key] || processedData;
              }
            });

            // Ensure fltKeys array is long enough
            if (newFltKeys.length > state.context.fltKeys.length) {
              state.context.fltKeys = [
                ...state.context.fltKeys,
                ...newFltKeys.slice(state.context.fltKeys.length),
              ];
            }
          } else {
            state.context.fltKeys = newFltKeys;
            // Cache all data
            state.context.flightDataCache = {};
            newFltKeys.forEach((key: any) => {
              state.context.flightDataCache[key] =
                processedData[key] || processedData;
            });
          }

          // Preserve original query
          if (originalQuery) {
            state.context.searchData = originalQuery;
          } else if (apiSearch) {
            state.context.searchData = apiSearch;
            state.context.query.srchO = apiSearch;
          }

          // Initialize/update multi-leg flow
          const legs = legsSource;
          const newTotalLegs = state.context.fltKeys.length;

          if (preserveSelections) {
            // Update total legs if increased
            if (newTotalLegs > state.context.totalLegs) {
              state.context.totalLegs = newTotalLegs;
            }
          } else {
            state.context.totalLegs = newTotalLegs;
            state.context.currentLegIndex = 0;
          }

          state.context.isMultiLegFlow = state.context.totalLegs > 1;
          state.context.isAllLegsSelected = false;

          // Build/update leg summaries - merge with existing
          const newLegSummaries = legs.map((leg: any, index: number) => ({
            index,
            route: `${leg.src} → ${leg.dst}`,
            date: leg.dep,
            src: leg.src,
            dst: leg.dst,
            srcName: leg.sArNm || leg.src,
            dstName: leg.dArNm || leg.dst,
            selected: state.context.fltSelectedData[index] ? true : false,
            flightData: state.context.fltSelectedData[index] || null,
          }));

          if (preserveSelections) {
            // Merge summaries, keeping existing selections
            newLegSummaries.forEach((summary: any, index: any) => {
              if (state.context.legSummaries[index]) {
                // Keep existing summary if it has selection
                const existing = state.context.legSummaries[index];
                state.context.legSummaries[index] = {
                  ...existing,
                  ...summary,
                  // Preserve selection status
                  selected: existing.selected || summary.selected,
                  flightData: existing.flightData || summary.flightData,
                };
              } else {
                state.context.legSummaries[index] = summary;
              }
            });
          } else {
            state.context.legSummaries = newLegSummaries;
          }

          // Update filtered data for current leg
          updateFilteredFlightData(state);
        } else {
          state.success = action.payload?.success;
          state.errorMessage = action.payload?.error_msg;
        }
        // Reset both loading states
        state.loading = false;
        state.dateChangeLoading = false;

        // Show results below date card after loading completes
        // (Only if it was a date change, not initial search)
        const preserveSelections =
          action.meta?.arg?.preserveSelections || false;
        if (preserveSelections) {
          state.context.showResultsBelowDateCard = true;
          state.context.nxtDtA = [];
        }
      })
      .addCase(searchFlights.rejected, (state: FlightState, action) => {
        console.error('[searchFlights.rejected] Search failed:', action.error);
        // Reset both loading states
        state.loading = false;
        state.dateChangeLoading = false;
      })
      .addCase(checkUpgrades.pending, (state: FlightState) => {
        state.uploading = true;
        state.context.upgData = null;
      })
      .addCase(checkUpgrades.fulfilled, (state: FlightState, action) => {
        if (action.payload.success && action.payload?._data) {
          state.context.upgData = action.payload?._data;
        }
        state.uploading = false;
      })
      .addCase(getFlightScheduleByFlightNum.pending, (state: FlightState) => {
        state.context.flightScheduleLoading = true;
        state.context.flightScheduleData = null;
      })
      .addCase(
        getFlightScheduleByFlightNum.fulfilled,
        (state: FlightState, action) => {
          if (action.payload.success && action.payload?._data) {
            state.context.flightScheduleData = action.payload?._data;
          }
          state.context.flightScheduleLoading = false;
        },
      )
      .addCase(getFlightScheduleByFlightNum.rejected, (state: FlightState) => {
        state.context.flightScheduleLoading = false;
        state.context.flightScheduleData = null;
      })
      .addCase(
        saveUserTransportInfo.fulfilled,
        (state: FlightState, action) => {
          if (action.payload.success && action.payload?._data) {
            state.context.savedUserTransportInfo = action.payload?._data.tA[0];
          }
        },
      )
      .addCase(importPNR.fulfilled, (state: FlightState, action) => {
        if (action.payload.success && action.payload?._data?.importPnrRes) {
          state.context.importPnrRes = action.payload?._data?.importPnrRes;
        }
      })
      .addCase(
        packageManualFlightAdd.fulfilled,
        (state: FlightState, action) => {
          if (action.payload.success && action.payload?._data) {
            state.context.manualFlightAddRes = action.payload?._data;
          }
        },
      )
      .addCase(getFlightAddons.pending, (state: FlightState) => {
        state.context.addonsLoading = true;
        state.context.flightAddons = null;
      })
      .addCase(getFlightAddons.fulfilled, (state: FlightState, action) => {
        state.context.addonsLoading = false;
        if (action.payload.success) {
          state.context.flightAddons = action.payload;
        }
      })
      .addCase(getFlightAddons.rejected, (state: FlightState) => {
        state.context.addonsLoading = false;
        state.context.flightAddons = null;
      })
      // fare rules
      .addCase(getFareRules.pending, (state: FlightState) => {
        state.context.fareRules!.loading = true;
        state.context.fareRules!.data = state.context.fareRules!.data || {};
        state.context.fareRules!.error = undefined;
      })
      .addCase(getFareRules.fulfilled, (state: FlightState, action) => {
        state.context.fareRules!.loading = false;
        if (action.payload && action.payload.success) {
          if (!state.context.fareRules!.data![action.meta.arg.finfo]) {
            state.context.fareRules!.data![action.meta.arg.finfo] = {};
          }
          state.context.fareRules!.data![action.meta.arg.finfo] =
            action.payload._data;
          state.context.fareRules!.error = undefined;
        }
      })
      .addCase(getFareRules.rejected, (state: FlightState, action) => {
        state.context.fareRules!.loading = false;
        state.context.fareRules!.error = action.error.message;
      });
  },
});

export const {
  openFlightSlider,
  closeFlightSlider,
  resetManualFlightAddRes,
  setSearchData,
  setNotFireSearch,
  setFlightSelectedData,
  resetDateSelectedFlag,
  resetNextFlightDates,
  setTravellerGroup,
  setQuerySearchData,
  setFilteredFlightByChange,
  updateFlightFilters,
  createFlightFilters,
  updateSelectedUpgrades,
  resetState,
  goToNextLeg,
  goToPreviousLeg,
  setCurrentLegIndex,
  changeSelectedFlight,
  setSortBy,
  setShowResultsBelowDateCard,
  setSelectedAddons,
  addSelectedAddon,
  removeSelectedAddon,
  clearSelectedAddons,
  setAddonsInitialized,
  filterTravellersByPaxO,
} = flightSlice.actions;

export default flightSlice.reducer;
