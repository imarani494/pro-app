import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { carCitiesSuggestApi } from '../../common/api/car/cities-suggest/route';
import { carSearchXApi } from '../../common/api/car/search-x/route';
import { fetchCarDetailsApi } from '../../common/api/car/details/route';
import { saveCarQuoteDetailsApi } from '../../common/api/car/quote-details-save/route';

// Types
interface CarLocation {
  data: {
    id: number;
    pnm: string;
    nm: string;
  };
  value: string;
  _scr: number;
}

// Car Details API Response Types
interface CarDetailsResponse {
  srchO: {
    pkTm: string;
    cat: string;
    pkLoc: {
      cid: number;
      nm: string;
    };
    dpTm: string;
  };
  dtlH: string;
  carO: {
    pkTm: string;
    prc: number;
    dpLoc: { loc: string };
    cur: string;
    fpl: string;
    mpl: string;
    dpTm: string;
    optr: {
      lg?: string;
      nm: string;
    };
    fpT: string;
    vd: {
      ftA: string[];
      vtyp: string;
      img: string;
      vnm: string;
      vcd: string;
      cat: string;
      isAutoTx: boolean;
      mlg: number;
      hasAC: boolean;
      ndr: number;
      nst: number;
      slg: number;
    };
    incA: Array<{
      iPrcInc?: boolean;
      q?: number;
      nm: string;
    }>;
    prcD: string;
    pkLoc: { loc: string };
    days: number;
    asts: string;
    optGA?: Array<{
      incA: Array<{
        prc: number;
        prcQ: string;
        prcD: string;
        mxq: number;
        iPyL?: boolean;
        id: string;
        nm: string;
      }>;
      typ: string;
    }>;
    key: string;
  };
}

// Car Quote Details Save API Response Types
interface CarQuoteDetailsSaveResponse {
  carO: {
    pkTm: string;
    dpLoc: { loc: string };
    fpl: string;
    mpl: string;
    hsTerms: boolean;
    dpTm: string;
    optr: { nm: string };
    fpT: string;
    vd: {
      ftA: string[];
      vtyp: string;
      img: string;
      vnm: string;
      vcd: string;
      cat: string;
      isAutoTx: boolean;
      mlg: number;
      hasAC: boolean;
      ndr: number;
      nst: number;
    };
    incA: Array<{
      q?: number;
      nm: string;
      id?: string;
      iPyL?: boolean;
    }>;
    pkLoc: { loc: string };
    days: number;
    prcPyLD: string;
    asts: string;
    key: string;
  };
}

interface CarQuoteDetailsSaveParams {
  jid: string | number;
  // _auth: string;
  // userId: string | number;
  // request: string;
  __xreq__: boolean;
  prCar: boolean;
  carkey: string;
  carupdstr: string; // JSON stringified updCarO
  tvlG: {
    tvlA: string[];
  };
  jdid: string;
}

// Car update object structure (matches JSP updCarO)
export interface CarUpdateObject {
  incA: Array<{
    id: string;
    q: number;
  }>;
}

interface CarDetailsParams {
  carkey?: string;
  [key: string]: string | number | boolean | undefined; // Allow additional params
}

interface Car {
  id: string;
  name: string;
  type: string;
  seats: number;
  doors: number;
  transmission: string;
  price: number;
  currency: string;
  imageUrl: string;
  features: string[];
}

interface CarPickupSearchParams {
  q: string;
  __xreq__: boolean;
  incArp: boolean;
}

interface CarSearchResult {
  prc: number;
  dpLoc?: { loc?: string; isApt?: boolean };
  pkLoc?: { loc?: string; isApt?: boolean };
  fpl?: string;
  gk?: string;
  mpl?: string;
  prD?: string;
  optr?: { nm?: string; lg?: string };
  vd?: {
    vnm?: string;
    img?: string;
    vtyp?: string;
    isAutoTx?: boolean;
    hasAC?: boolean;
    ndr?: number;
    nst?: number;
    slg?: number;
    ftA?: string[];
  };
}

interface CarSearchParams {
  carCat: string;
  pkupLoc: string;
  dropLoc: string;
  pkupDate: string;
  dropDate: string;
  prCar: boolean;
  __xreq__: boolean;
  isPkgCfgMode?: boolean;
  journeyId?: string | number;
  dCityExId?: string | number;
}

export interface CarRentalState {
  loading: boolean;
  cars: Car[];
  carDetails: Record<string, Car>;
  carDetailsLoading: boolean;
  carDetailsError: null | string;
  searchResults: Car[];
  searchLoading: boolean;
  searchError: null | string;
  // Car Search Results
  carSearchResults: CarSearchResult[];
  carSearchLoading: boolean;
  carSearchError: null | string;
  selectedCar: Car | null;
  bookingStatus: boolean;
  // Car Details API
  carDetailsData: CarDetailsResponse | null;
  carDetailsApiLoading: boolean;
  carDetailsApiError: null | string;
  // Car Quote Details Save API
  carQuoteDetailsSaveData: CarQuoteDetailsSaveResponse | null;
  carQuoteDetailsSaveLoading: boolean;
  carQuoteDetailsSaveError: null | string;
  // Pickup locations
  pickupLocations: CarLocation[];
  pickupLocationsLoading: boolean;
  pickupSearchError: null | string;
  // Dropoff locations  
  dropoffLocations: CarLocation[];
  dropoffLocationsLoading: boolean;
  dropoffSearchError: null | string;
  // Legacy - keeping for backward compatibility
  locations: CarLocation[];
  locationsLoading: boolean;
  carRentalsOpen: boolean;
  actionData: object;
  defaultPayload: CarSearchParams;
  filters: {
    searchQuery: string;
    filterMap: Record<string, Array<string | number>>;
  };
}

const initialState: CarRentalState = {
  loading: false,
  cars: [],
  carDetailsLoading: false,
  carDetails: {},
  carDetailsError: null,
  searchResults: [],
  searchLoading: false,
  searchError: null,
  // Car Search Results
  carSearchResults: [],
  carSearchLoading: false,
  carSearchError: null,
  selectedCar: null,
  bookingStatus: false,
  // Car Details API
  carDetailsData: null,
  carDetailsApiLoading: false,
  carDetailsApiError: null,
  // Car Quote Details Save API
  carQuoteDetailsSaveData: null,
  carQuoteDetailsSaveLoading: false,
  carQuoteDetailsSaveError: null,
  // Pickup locations
  pickupLocations: [],
  pickupLocationsLoading: false,
  carRentalsOpen: false,
  actionData: {},
  pickupSearchError: null,
  // Dropoff locations
  dropoffLocations: [],
  dropoffLocationsLoading: false,
  dropoffSearchError: null,
  // Legacy - keeping for backward compatibility
  locations: [],
  locationsLoading: false,
  defaultPayload: {
      carCat: "",
      pkupLoc: "",
      dropLoc: "",
      pkupDate: "",
      dropDate: "",
      prCar: false,
      __xreq__: false
  },
  filters: {
    searchQuery: "",
    filterMap: {},
  },
};

export const carPickupSearch = createAsyncThunk(
  "carRental/carPickupSearch",
  async (params: CarPickupSearchParams) => {
    return await carCitiesSuggestApi(params || {});
  }
);

export const carDropoffSearch = createAsyncThunk(
  "carRental/carDropoffSearch", 
  async (params: CarPickupSearchParams) => {
    return await carCitiesSuggestApi(params || {});
  }
);

export const carSearch = createAsyncThunk(
  "carRental/carSearch",
  async (params: CarSearchParams) => {
    return await carSearchXApi(params || {});
  }
);

export const fetchCarDetails = createAsyncThunk(
  "carRental/fetchCarDetails",
  async (params: CarDetailsParams) => {
    return await fetchCarDetailsApi(params || {});
  }
);

export const saveCarQuoteDetails = createAsyncThunk(
  "carRental/saveCarQuoteDetails",
  async (params: CarQuoteDetailsSaveParams) => {
    return await saveCarQuoteDetailsApi(params || {});
  }
);

export const carRentalSlice = createSlice({
  name: "carRental",
  initialState,
  reducers: {
    setCarRentalsDetails(state, action: PayloadAction<{open: boolean, actionData: object, isPackageFlow?: boolean, dayNum?: number, blockId?: string | null, date?: string | null, pkTm?: string, dpTm?: string, pkLoc?: string, dpLoc?: string}>) {
      state.carRentalsOpen = action.payload.open;
      state.actionData = action.payload.actionData;
      if (action.payload.isPackageFlow !== undefined) {
        // You can store isPackageFlow in actionData or create a separate state field
        state.actionData = { ...state.actionData, isPackageFlow: action.payload.isPackageFlow };
      }
      if (action.payload.dayNum !== undefined) {
        state.actionData = { ...state.actionData, dayNum: action.payload.dayNum };
      }
      if (action.payload.blockId !== undefined) {
        state.actionData = { ...state.actionData, blockId: action.payload.blockId };
      }
      if (action.payload.date !== undefined) {
        state.actionData = { ...state.actionData, date: action.payload.date };
      }
      if(action.payload.pkTm  && action.payload.dpTm) {
        state.actionData = { 
          ...state.actionData, 
          pkTm: action.payload.pkTm, 
          dpTm: action.payload.dpTm, 
          pkLoc: action.payload.pkLoc,
          dpLoc: action.payload.dpLoc
        };
      }
    },
    setCarFilters(
      state,
      action: PayloadAction<Partial<CarRentalState["filters"]>>
    ) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    resetCarFilters(state) {
      state.filters = {
        searchQuery: "",
        filterMap: {},
      };
    },
    setDefaultCarPayload(state, action: PayloadAction<Partial<CarRentalState["defaultPayload"]>>) {
      state.defaultPayload = {
        ...state.defaultPayload,
        ...action.payload,
      };
    },
    clearCarPickupSearchResults: (state: CarRentalState) => {
      state.pickupLocations = [];
      state.pickupSearchError = null;
      // Legacy support
      state.locations = [];
      state.searchError = null;
    },
    clearCarDropoffSearchResults: (state: CarRentalState) => {
      state.dropoffLocations = [];
      state.dropoffSearchError = null;
    },
    clearCarSearchResults: (state: CarRentalState) => {
      state.carSearchResults = [];
      state.carSearchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Car Pickup Search (City Suggestions)
      .addCase(carPickupSearch.pending, (state: CarRentalState) => {
        state.pickupLocationsLoading = true;
        state.pickupSearchError = null;
        // Legacy support
        state.locationsLoading = true;
        state.searchError = null;
      })
      .addCase(carPickupSearch.fulfilled, (state: CarRentalState, action) => {          
        if (action.payload) {
          state.pickupLocations = action.payload || [];
          // Legacy support
          state.locations = action.payload || [];
        } else {
          state.pickupSearchError = "Failed to fetch pickup city suggestions";
          state.searchError = "Failed to fetch city suggestions";
        }
        state.pickupLocationsLoading = false;
        state.locationsLoading = false;
      })
      .addCase(carPickupSearch.rejected, (state: CarRentalState, action) => {
        state.pickupLocationsLoading = false;
        state.pickupSearchError = action.error.message || "Failed to fetch pickup city suggestions";
        // Legacy support
        state.locationsLoading = false;
        state.searchError = action.error.message || "Failed to fetch city suggestions";
      })
      
      // Car Dropoff Search (City Suggestions)
      .addCase(carDropoffSearch.pending, (state: CarRentalState) => {
        state.dropoffLocationsLoading = true;
        state.dropoffSearchError = null;
      })
      .addCase(carDropoffSearch.fulfilled, (state: CarRentalState, action) => {          
        if (action.payload) {
          state.dropoffLocations = action.payload || [];
        } else {
          state.dropoffSearchError = "Failed to fetch dropoff city suggestions";
        }
        state.dropoffLocationsLoading = false;
      })
      .addCase(carDropoffSearch.rejected, (state: CarRentalState, action) => {
        state.dropoffLocationsLoading = false;
        state.dropoffSearchError = action.error.message || "Failed to fetch dropoff city suggestions";
      })
      
      // Car Search Results
      .addCase(carSearch.pending, (state: CarRentalState) => {
        state.carSearchLoading = true;
        state.carSearchError = null;
      })
      .addCase(carSearch.fulfilled, (state: CarRentalState, action) => {          
        if (action.payload?._data?.rsltA) {
          state.carSearchResults = action.payload._data.rsltA;
        } else {
          state.carSearchError = "Failed to fetch car search results";
        }
        state.carSearchLoading = false;
      })
      .addCase(carSearch.rejected, (state: CarRentalState, action) => {
        state.carSearchLoading = false;
        state.carSearchError = action.error.message || "Failed to fetch car search results";
      })
      
      // Car Details API
      .addCase(fetchCarDetails.pending, (state: CarRentalState) => {
        state.carDetailsApiLoading = true;
        state.carDetailsApiError = null;
      })
      .addCase(fetchCarDetails.fulfilled, (state: CarRentalState, action) => {          
        if (action.payload) {
          state.carDetailsData = action.payload;
        } else {
          state.carDetailsApiError = "Failed to fetch car details";
        }
        state.carDetailsApiLoading = false;
      })
      .addCase(fetchCarDetails.rejected, (state: CarRentalState, action) => {
        state.carDetailsApiLoading = false;
        state.carDetailsApiError = action.error.message || "Failed to fetch car details";
      })
      
      // Car Quote Details Save API
      .addCase(saveCarQuoteDetails.pending, (state: CarRentalState) => {
        state.carQuoteDetailsSaveLoading = true;
        state.carQuoteDetailsSaveError = null;
      })
      .addCase(saveCarQuoteDetails.fulfilled, (state: CarRentalState, action) => {          
        if (action.payload) {
          state.carQuoteDetailsSaveData = action.payload;
        } else {
          state.carQuoteDetailsSaveError = "Failed to save car quote details";
        }
        state.carQuoteDetailsSaveLoading = false;
      })
      .addCase(saveCarQuoteDetails.rejected, (state: CarRentalState, action) => {
        state.carQuoteDetailsSaveLoading = false;
        state.carQuoteDetailsSaveError = action.error.message || "Failed to save car quote details";
      });
  },
});

export const { 
  clearCarPickupSearchResults,
  clearCarDropoffSearchResults,
  clearCarSearchResults,
  setCarRentalsDetails,
  setDefaultCarPayload,
  setCarFilters,
  resetCarFilters,
} = carRentalSlice.actions;

export default carRentalSlice.reducer;
