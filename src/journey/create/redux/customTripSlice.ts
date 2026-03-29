import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {journeyCreateApi} from '../../../common/api/journey/create/route';
import {ItinerarySuggestionsApi} from '../../../common/api/package/itinerary-suggestion/route';
import {hotelDestSuggestApi} from '../../../common/api/gen/msc/hotel-dest-suggest/route';
import {otbSuggestApi} from '../../../common/api/gen/msc/otb-suggest/route';
import {profileSaveApi} from '../../../common/api/customer/profile-save/route';
import {citySuggestApi} from '../../../common/api/gen/msc/city-suggest/route';
import {customerSearchXApi} from '../../../common/api/customer/search-x/route';
export interface IHotelSearchbyPropretyResponse {
  data: IHotelSearchbyProprety;
  id: number;
  value: string;
  nm: string;
}

export interface IHotelSearchbyProprety {
  st: number;
  id: number;
  url: string;
  nm: string;
}

// Types
export interface CitySuggestion {
  data: {
    id: number;
    rnm: string;
    nm: string;
  };
  value: string;
  _scr: number;
}

export interface HotelSuggestParams {
  q: string;
  _auth: string;
  __xreq__: boolean;
  incCStAr: boolean;
  flrHC: boolean;
  flrIF: boolean;
}

export interface CustomerSearchXParams {
  q: string;
  _auth: string;
  __xreq__: boolean;
  [key: string]: any;
}

export interface AgentSuggestion {
  data: {
    bnm: string;
    rnm: string;
    uid: number;
    unm: string;
    id: number;
    nm: string;
  };
  value: string;
}

export interface AgentSuggestParams {
  q: string;
  __xreq__: boolean;
  incDsp: boolean;
  incDsb: boolean;
  _auth: string;
  userId: number;
}

export interface ItinerarySuggestionsParams {
  destIds: string;
  __xreq__: boolean;
  duration: boolean;
  _auth: string;
  userId: number;
}

export interface ItinerarySuggestionsResponse {
  duration: string;
  ttlSgstnCnt: number;
  destName: string;
  destIds: string;
  itnSgts: {
    pct: number;
    scr: number;
    pkgName: string;
    tnt: number;
    itnVal: string;
    totalCount: number;
    destIds: number[];
    itnSgts: {
      cky: string;
      hi: number;
      cnm: string;
      nt: number;
      caid: number;
      cid: number;
    }[];
  }[];
}

interface CustomTripState {
  // Agent suggestions
  agentSuggestions: AgentSuggestion[];
  agentSuggestionsLoading: boolean;
  agentSuggestionsError: string | null;
  // Journey create
  journeyCreateLoading: boolean;
  journeyCreateError: string | null;
  journeyCreateResponse: any | null;
  // Hotel suggestions
  fetchHotelSuggestionsLoading: boolean;
  fetchHotelSuggestionsError: string | null;
  hotelSuggestions: IHotelSearchbyPropretyResponse[];

  // Itinerary suggestions
  createItinerarySuggestionRes: ItinerarySuggestionsResponse | null;
  createItinerarySuggestionLoading: boolean;
  createItinerarySuggestionError: string | null;

  // Journey modal
  journeyModal: {
    isOpen: boolean;
    mode: string;
  };

  // Profile save
  fetchProfileSaveLoading: boolean;
  fetchProfileSaveError: string | null;
  fetchProfileSaveRes: any | null;

  // City suggestions
  citySuggest: CitySuggestion[];
  citySuggestLoading: boolean;
  citySuggestError: string | null;

  // Customer search
  customerSearchX: any[];
  customerSearchXLoading: boolean;
  customerSearchXError: string | null;
}

export interface PassportVisaInfo {
  pn: string; // Passport number
  nt: string; // Nationality code
  doi: string; // Date of issue (YYYY-MM-DD)
  doe: string; // Date of expiry (YYYY-MM-DD)
}

export interface CpsnStr {
  pxpA: PassportVisaInfo[];
  ffA: any[]; // Flight info array (structure unknown, use any[] or define if known)
}

export interface ProfileSaveParams {
  userId: number;
  cid: string;
  cpsnStr: CpsnStr;
  idStr: any[]; // Array of IDs (structure unknown, use any[] or define if known)
  isRtnJSON: boolean;
  title: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  mobile: string;
  spReq: string;
  notes: string;
  notifPref: string;
  isMktAllwd: boolean;
  gender: string;
  seatPref: string;
  mealPref: string;
  mealReq: string;
  allergies: string;
  hstPref: string;
  custdayBirth: number;
  custmonthBirth: number;
  custyearBirth: number;
  custdayAnnv: number;
  custmonthAnnv: number;
  custyearAnnv: number;
  ppNum: string;
  ppNat: number;
  ppDoi: string;
  ppDoe: string;
  addr1: string;
  addr2: string;
  cityId: number;
  city: string;
  pincode: string;
  __xreq__: boolean;
  _auth: string;
}

// Initial state
const initialState: CustomTripState = {
  agentSuggestions: [],
  agentSuggestionsLoading: false,
  agentSuggestionsError: null,
  journeyCreateLoading: false,
  journeyCreateError: null,
  journeyCreateResponse: null,
  fetchHotelSuggestionsLoading: false,
  fetchHotelSuggestionsError: null,
  hotelSuggestions: [],
  // Itinerary suggestions
  createItinerarySuggestionRes: {
    duration: '',
    ttlSgstnCnt: 0,
    destName: '',
    destIds: '',
    itnSgts: [],
  },
  createItinerarySuggestionLoading: false,
  createItinerarySuggestionError: null,
  // Journey modal
  journeyModal: {
    isOpen: false,
    mode: 'CREATE',
  },
  fetchProfileSaveLoading: false,
  fetchProfileSaveError: null,
  fetchProfileSaveRes: null,
  // City suggestions
  citySuggest: [],
  citySuggestLoading: false,
  citySuggestError: null,
  // Customer search
  customerSearchX: [],
  customerSearchXLoading: false,
  customerSearchXError: null,
};

// Thunk for /journey/create
export const createJourney = createAsyncThunk(
  'customTrip/createJourney',
  async (params: any) => {
    return await journeyCreateApi(params || {});
  },
);
ItinerarySuggestionsApi;

// Thunk for /journey/itinerary-suggestion
export const createItinerarySuggestion = createAsyncThunk(
  'package/itinerary-suggestion',
  async (params: ItinerarySuggestionsParams) => {
    return await ItinerarySuggestionsApi(params || {});
  },
);

export const citySuggest = createAsyncThunk(
  'gen/msc/city-suggest',
  async (params: any) => {
    return await citySuggestApi(params || {});
  },
);

export const fetchHotelSuggestions = createAsyncThunk(
  'gen/msc/hotel-dest-suggest',
  async (params: HotelSuggestParams) => {
    return await hotelDestSuggestApi(params || {});
  },
);

export const fetchCustomerSearchX = createAsyncThunk(
  'customer/search-x',
  async (params: CustomerSearchXParams) => {
    return await customerSearchXApi(params || {});
  },
);

export const fetchAgentSuggestions = createAsyncThunk(
  'customTrip/otb-suggest',
  async (params: AgentSuggestParams) => {
    return await otbSuggestApi(params || {});
  },
);

export const fetchProfileSave = createAsyncThunk(
  'customTrip/profile-save',
  async (params: ProfileSaveParams) => {
    return await profileSaveApi(params || {});
  },
);

export const customTripSlice = createSlice({
  name: 'customTrip',
  initialState,
  reducers: {
    clearAgentSuggestions: state => {
      state.agentSuggestions = [];
      state.agentSuggestionsError = null;
    },
    clearItinerarySuggestion: state => {
      state.createItinerarySuggestionRes = {
        duration: '',
        ttlSgstnCnt: 0,
        destName: '',
        destIds: '',
        itnSgts: [],
      };
      state.createItinerarySuggestionLoading = false;
      state.createItinerarySuggestionError = null;
    },
    setJourneyModalOpen: (state, action) => {
      state.journeyModal = action.payload;
    },
    clearCustomerSearchX: state => {
      state.customerSearchX = [];
      state.customerSearchXError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAgentSuggestions.pending, state => {
        state.agentSuggestionsLoading = true;
        state.agentSuggestionsError = null;
      })
      .addCase(fetchAgentSuggestions.fulfilled, (state, action) => {
        state.agentSuggestionsLoading = false;
        state.agentSuggestions = action.payload || [];
      })
      .addCase(fetchAgentSuggestions.rejected, (state, action) => {
        state.agentSuggestionsLoading = false;
        state.agentSuggestionsError =
          action.error.message || 'Failed to fetch agent suggestions';
        state.agentSuggestions = [];
      })
      // Add journey create handlers
      .addCase(createJourney.pending, state => {
        state.journeyCreateLoading = true;
        state.journeyCreateError = null;
        state.journeyCreateResponse = null;
      })
      .addCase(createJourney.fulfilled, (state, action) => {
        state.journeyCreateLoading = false;
        state.journeyCreateResponse = action.payload;
      })
      .addCase(createJourney.rejected, (state, action) => {
        state.journeyCreateLoading = false;
        state.journeyCreateError =
          action.error.message || 'Failed to create journey';
        state.journeyCreateResponse = null;
      })
      // Itinerary suggestion handlers
      .addCase(createItinerarySuggestion.pending, state => {
        state.createItinerarySuggestionLoading = true;
        state.createItinerarySuggestionError = null;
        state.createItinerarySuggestionRes = null;
      })
      .addCase(createItinerarySuggestion.fulfilled, (state, action) => {
        state.createItinerarySuggestionLoading = false;
        state.createItinerarySuggestionRes = action.payload;
      })
      .addCase(createItinerarySuggestion.rejected, (state, action) => {
        state.createItinerarySuggestionLoading = false;
        state.createItinerarySuggestionError =
          action.error.message || 'Failed to create itinerary suggestion';
        state.createItinerarySuggestionRes = null;
      })

      // Hotel suggestions handlers
      .addCase(fetchHotelSuggestions.pending, state => {
        state.fetchHotelSuggestionsLoading = true;
        state.fetchHotelSuggestionsError = null;
      })
      .addCase(fetchHotelSuggestions.fulfilled, (state, action) => {
        state.fetchHotelSuggestionsLoading = false;
        state.hotelSuggestions = action.payload || [];
      })
      .addCase(fetchHotelSuggestions.rejected, (state, action) => {
        state.fetchHotelSuggestionsLoading = false;
        state.fetchHotelSuggestionsError =
          action.error.message || 'Failed to fetch hotel suggestions';
        state.hotelSuggestions = [];
      })
      // city suggest handlers can be added here similarly if needed
      .addCase(citySuggest.pending, state => {
        state.citySuggestLoading = true;
        state.citySuggestError = null;
      })
      .addCase(citySuggest.fulfilled, (state, action) => {
        state.citySuggestLoading = false;
        state.citySuggest = action.payload || [];
      })
      .addCase(citySuggest.rejected, (state, action) => {
        state.citySuggestLoading = false;
        state.citySuggestError =
          action.error.message || 'Failed to fetch city suggestions';
        state.citySuggest = [];
      })

      // Profile save handlers can be added here similarly if needed
      .addCase(fetchProfileSave.pending, state => {
        state.fetchProfileSaveLoading = true;
        state.fetchProfileSaveError = null;
        state.fetchProfileSaveRes = null;
      })
      .addCase(fetchProfileSave.fulfilled, (state, action) => {
        state.fetchProfileSaveLoading = false;
        state.fetchProfileSaveRes = action.payload;
      })
      .addCase(fetchProfileSave.rejected, (state, action) => {
        state.fetchProfileSaveLoading = false;
        state.fetchProfileSaveError =
          action.error.message || 'Failed to fetch profile save';
        state.fetchProfileSaveRes = null;
      })

      // Customer search handlers
      .addCase(fetchCustomerSearchX.pending, state => {
        state.customerSearchXLoading = true;
        state.customerSearchXError = null;
      })
      .addCase(fetchCustomerSearchX.fulfilled, (state, action) => {
        state.customerSearchXLoading = false;
        state.customerSearchX = action.payload || [];
      })
      .addCase(fetchCustomerSearchX.rejected, (state, action) => {
        state.customerSearchXLoading = false;
        state.customerSearchXError =
          action.error.message || 'Failed to fetch customer search';
        state.customerSearchX = [];
      });
  },
});

export const {
  clearAgentSuggestions,
  clearItinerarySuggestion,
  setJourneyModalOpen,
  clearCustomerSearchX,
} = customTripSlice.actions;

export default customTripSlice.reducer;
