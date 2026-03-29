import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import {HotelSearchListingResponse} from '../actions/hotelSearhListings';
import {IHotelDetailsResponse, IhotelListingParams} from '../types/detailsType';
import {ILocationSuggestResponse} from '../actions/locationSuggest';
import {IHotelSearchbyPropretyResponse} from '../actions/hotelSearchbyProprety';
import {fetchHotelDetailsApi} from '../../common/api/hotels/hotel-details/route';
import {RequestManager} from '../../utils/RequestManager';

// Add interface for currency
export interface ICurrency {
  code: string;
  symbol: string;
  name: string;
}

export interface ILocationDetailsRes {
  success: boolean;
  _data: {
    dt: string;
    cnm: string;
    lt: number;
    id: string;
    lg: number;
    pnm: string;
    ad1: string;
    cid: number;
  };
}

export interface IHotelSuggestResponse {
  data: {
    rnm: string;
    st: number;
    id: number;
    url: string;
  };
  id: number;
  value: string;
  nm: string;
  _scr: number;
}
export interface IRoomSuggestResponse {
  room: {
    id: number;
    nm: string;
  };
}
export interface ManualHotelData {
  // Existing fields
  hotelName: string;
  address: string;
  city: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  roomType: string;
  supplier: string;
  totalPrice: string;
  currency: string;
  validTill: string;
  validTillTime: string;
  cancellationPolicy: string; // JSON string of CancellationPolicyJSON
  otherInclusions: string;

  // NEW: External API fields
  hotelId?: number;
  roomId?: number;
  supplierId?: number;
  pkgId?: number;
  qid?: string;
  leadId?: string;
  uid?: string;
}
export interface HotelState {
  hotelAlternativesOpen: boolean;
  hotels: HotelSearchListingResponse | null;
  selectedHotelDetails: IHotelDetailsResponse | null;
  detailsHotel: string | null;
  loading: boolean;
  error?: string;
  hotelSearchParams: IhotelListingParams | undefined;
  selectedRooms: string[];
  selectedRoomsTotalPrice: number;
  roomFilter: {
    search: string;
    breadandBreakfast: boolean;
    roomOnly: boolean;
    refundable: boolean;
    selectedMealPlanCodes: string[];
  };
  layoutSetting: string;
  blkTravellersInfo:
    | {
        rmTvlG: string[][];
        tvlG: string[];
      }
    | undefined;
  bid: string;
  propretyData: IHotelSearchbyPropretyResponse[];
  propretyDataLoading: boolean;
  locationSuggestions: ILocationSuggestResponse[];
  locationDataLoading: boolean;
  locationDetailsData: ILocationDetailsRes | undefined;

  // Add Manual Hotel states
  manualHotelModalOpen: boolean;
  manualHotelLoading: boolean;
  manualHotelData: ManualHotelData | null;

  hotelSuggestions: IHotelSuggestResponse[];
  hotelSuggestionsLoading: boolean;
  roomSuggestions: IRoomSuggestResponse[];
  roomSuggestionsLoading: boolean;
  addManualHotelRoomData: any;
  selfBookedStayActionData: any;
  viewDetailsOnly: boolean;
  viewCommission: boolean;
  hotelLookUpDialogOpen: boolean;
  hotelLookUpData: any;
  selfBookedStayActionDataOpen: boolean;
  paxD: string | undefined;
  prD: string | undefined;
}

const initialState: HotelState = {
  hotelAlternativesOpen: false,
  hotels: null,
  detailsHotel: null,
  selectedHotelDetails: null,
  loading: false,
  error: undefined,
  hotelSearchParams: undefined,
  selectedRooms: [],
  roomFilter: {
    search: '',
    breadandBreakfast: false,
    roomOnly: false,
    refundable: false,
    selectedMealPlanCodes: [],
  },
  layoutSetting: '',
  blkTravellersInfo: undefined,
  bid: '',
  propretyData: [],
  propretyDataLoading: false,
  locationSuggestions: [],
  locationDataLoading: false,
  locationDetailsData: undefined,

  // Add Manual Hotel initial states
  manualHotelModalOpen: false,
  manualHotelLoading: false,
  manualHotelData: null,

  hotelSuggestions: [],
  hotelSuggestionsLoading: false,
  roomSuggestions: [],
  roomSuggestionsLoading: false,
  addManualHotelRoomData: null,
  selectedRoomsTotalPrice: 0,
  selfBookedStayActionData: {
    openSelfBookedStayModal: false,
  },
  viewDetailsOnly: false,
  viewCommission: false,
  hotelLookUpDialogOpen: false,
  hotelLookUpData: null,
  selfBookedStayActionDataOpen: false,
  paxD: '',
  prD: '',
};

// export const fetchHotels = createAsyncThunk(
//   "fetchHotels/list",
//   async (params: IhotelListingParams) => {
//     const res = await apiClient.post<HotelSearchListingResponse>(
//       `/hotels/search-x`,
//       {
//         ...params,
//         // srhotels: true,
//       }
//     );
//     return res;
//   }
// );

export const fetchHotelDetails = createAsyncThunk(
  'hotels/fetchHotelDetails',
  async (params: IhotelListingParams) => {
    return await fetchHotelDetailsApi(params || {});
  },
);

export const fetchHotels = createAsyncThunk(
  'fetchHotels/list',
  async (params: IhotelListingParams) => {
    try {
      const data = await RequestManager.getFormData(params);
      const headers = await RequestManager.getRequestHeaders();

      const rep = await RequestManager.post(
        '/api/hotels/search-x',
        data,
        headers,
      );

      return RequestManager.createJsonResponse(rep);
    } catch (error: any) {
      console.error('Fetch Hotels API Error:', error);
      return RequestManager.createErrorResponse(error);
    }
  },
);

// export const fetchPropretyList = createAsyncThunk(
//   "/gen/msc/hotel-suggest",
//   async ({
//     cityId,
//     q,
//     _auth,
//     userId,
//   }: {
//     cityId: string;
//     q: string;
//     _auth: string;
//     userId: string;
//   }) => {
//     const res = await apiClient.get<IHotelSearchbyPropretyResponse[]>(
//       `/gen/msc/hotel-suggest?q=${encodeURIComponent(q)}&iSltrMd=true&city=${encodeURIComponent(cityId || "")}&userId=${userId}&_auth=${_auth}&application=com.tf.yourholiday`
//     );
//     return res;
//   }
// );

// export const fetchLocationList = createAsyncThunk(
//   "/gen/msc/paddr-suggest",
//   async ({
//     cityId,
//     q,
//     locationPtyp,
//     token,
//     _auth,
//     userId,
//   }: {
//     cityId: string;
//     q: string;
//     locationPtyp: string;
//     token: number;
//     _auth: string;
//     userId: string;
//   }) => {
//     const res = await apiClient.get<ILocationSuggestResponse[]>(
//       `/gen/msc/paddr-suggest?q=${encodeURIComponent(q)}&__xreq__=true&token=${token}&ptyp=${locationPtyp}&cid=${parseInt(cityId)}&userId=${userId}&_auth=${_auth}&application=com.tf.yourholiday`
//     );
//     return res;
//   }
// );

// export const fetchHotelSuggestions = createAsyncThunk(
//   "hotel/fetchHotelSuggestions",
//   async ({
//     q,
//     cityId,
//     _auth,
//     userId,
//   }: {
//     q: string;
//     cityId: string;
//     _auth: string;
//     userId: string;
//   }) => {
//     const res = await apiClient.get<IHotelSuggestResponse[]>(
//       `/gen/msc/hotel-suggest?q=${encodeURIComponent(q)}&__xreq__=true&city=${cityId}&userId=${userId}&_auth=${_auth}`
//     );
//     return res;
//   }
// );

// export const fetchRoomSuggestions = createAsyncThunk(
//   "hotel/fetchRoomSuggestions",
//   async ({ hotelId }: { hotelId: number }) => {
//     const res = await apiClient.get<IRoomSuggestResponse[]>(
//       `/gen/msc/room-suggest?hotel=${hotelId}`
//     );
//     return res;
//   }
// );

// export const fetchLocationDetails = createAsyncThunk(
//   "/gen/msc/paddr-detail",
//   async (params: any) => {
//     const res = await apiClient.post<any>(`/gen/msc/paddr-detail`, {
//       ...params,
//     });
//     return res;
//   }
// );

// Add Manual Hotel API call
// export const addManualHotel = createAsyncThunk(
//   "hotel/addManualHotel",
//   async ({
//     params,
//     _auth,
//     userId,
//   }: {
//     params: ManualHotelData;
//     _auth: string;
//     userId: string;
//   }) => {
//     // Currency mapping
//     const currencyMap: Record<string, string> = {
//       "Indian Rupees (INR)": "INDIAN_RUPEES",
//       "US Dollar (USD)": "USD",
//       "Euro (EUR)": "EUR",
//       "British Pound (GBP)": "GBP",
//       "Australian Dollar (AUD)": "AUD",
//       "Canadian Dollar (CAD)": "CAD",
//       "Swiss Franc (CHF)": "CHF",
//       "Japanese Yen (JPY)": "JPY",
//       "Chinese Yuan (CNY)": "CNY",
//       "Singapore Dollar (SGD)": "SGD",
//     };

//     const currencyCode = currencyMap[params.currency] || "INDIAN_RUPEES";

//     // Send to external pricing API
//     const res = await apiClient.post<any>(
//       `/partner/product-external-pricing-simple-update`,
//       {
//         ...params,
//         __xreq__: true,
//       }
//     );

//     return res;
//   }
// );

// export const fetchAddManualHotelRoom = createAsyncThunk(
//   "hotel/addManualHotelRoom",
//   async ({
//     params,
//   }: {
//     params: ManualHotelData;
//     _auth: string;
//     userId: string;
//   }) => {
//     const res = await apiClient.post<any>(
//       `/partner/hotel-room-add-update-save`,
//       {
//         ...params,
//         __xreq__: true,
//       }
//     );
//     return res;
//   }
// );

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    setHotelAlternativesOpen(state, action: PayloadAction<boolean>) {
      state.hotelAlternativesOpen = action.payload;
    },
    setDetailsHotel(state, action: PayloadAction<string | null>) {
      state.detailsHotel = action.payload;
    },
    setHotelSearchParams(
      state,
      action: PayloadAction<IhotelListingParams | undefined>,
    ) {
      state.hotelSearchParams = action.payload;
    },
    setSelectedRooms(state, action: PayloadAction<string[]>) {
      state.selectedRooms = action.payload;
    },
    setRoomFilter(
      state,
      action: PayloadAction<{
        search: string;
        breadandBreakfast: boolean;
        roomOnly: boolean;
        refundable: boolean;
        selectedMealPlanCodes: string[];
      }>,
    ) {
      state.roomFilter = action.payload;
    },
    setLayoutsetting(state, action: PayloadAction<string>) {
      state.layoutSetting = action.payload;
    },
    setBlkTravellersInfo(
      state,
      action: PayloadAction<{
        rmTvlG: string[][];
        tvlG: string[];
      }>,
    ) {
      state.blkTravellersInfo = action.payload;
    },
    setBlkId(state, action: PayloadAction<string>) {
      state.bid = action.payload;
    },
    setPropretyData(state, action: PayloadAction<[]>) {
      state.propretyData = action.payload;
    },
    setLocationSuggestions(state, action: PayloadAction<[]>) {
      state.locationSuggestions = action.payload;
    },

    setHotelSuggestions(state, action: PayloadAction<IHotelSuggestResponse[]>) {
      state.hotelSuggestions = action.payload;
    },
    setRoomSuggestions(state, action: PayloadAction<IRoomSuggestResponse[]>) {
      state.roomSuggestions = action.payload;
    },
    clearHotelSuggestions(state) {
      state.hotelSuggestions = [];
    },
    clearRoomSuggestions(state) {
      state.roomSuggestions = [];
    },
    clearAddManualHotelRoomData(state) {
      state.addManualHotelRoomData = null;
    },
    // Add Manual Hotel reducers
    setManualHotelModalOpen(state, action: PayloadAction<boolean>) {
      state.manualHotelModalOpen = action.payload;
    },
    setManualHotelData(state, action: PayloadAction<ManualHotelData | null>) {
      state.manualHotelData = action.payload;
    },
    resetManualHotelState(state) {
      state.manualHotelModalOpen = false;
      state.manualHotelLoading = false;
      state.manualHotelData = null;
    },
    setselectedRoomsTotalPrice(state, action: PayloadAction<number>) {
      state.selectedRoomsTotalPrice = action.payload;
    },
    updateSelfBookedStay(state, action: PayloadAction<any>) {
      state.selfBookedStayActionData = action.payload;
    },
    updateSelfBookedStayOpenModal(state, action: PayloadAction<boolean>) {
      state.selfBookedStayActionDataOpen = action.payload;
    },
    resetSelfBookedStayState(state) {
      state.selfBookedStayActionData = null;
      state.selfBookedStayActionDataOpen = false;
    },
    setViewDetailsOnly(state, action: PayloadAction<boolean>) {
      state.viewDetailsOnly = action.payload;
    },
    setViewCommission(state, action: PayloadAction<boolean>) {
      state.viewCommission = action.payload;
    },
    setHotelLookUpDialogOpen(state, action: PayloadAction<boolean>) {
      state.hotelLookUpDialogOpen = action.payload;
    },
    setHotelLookUpData(state, action: PayloadAction<any>) {
      state.hotelLookUpData = action.payload;
    },
    updateSelectedHotelDetails(
      state,
      action: PayloadAction<IHotelDetailsResponse>,
    ) {
      state.selectedHotelDetails = action.payload;
    },
    setPaxD(state, action: PayloadAction<string>) {
      state.paxD = action.payload;
    },
    setPrD(state, action: PayloadAction<string>) {
      state.prD = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchHotels.pending, state => {
        console.log('fetchHotels.pending');
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        console.log('fetchHotels.fulfilled with payload:', action.payload);
        state.loading = false;
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        console.error('fetchHotels.rejected:', action.error);
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchHotelDetails.pending, state => {
        console.log('fetchHotelDetails.pending');
        state.loading = true;
      })
      .addCase(fetchHotelDetails.fulfilled, (state, action) => {
        console.log(
          'fetchHotelDetails.fulfilled with payload:',
          action.payload,
        );
        state.loading = false;
        state.selectedHotelDetails = action.payload;
      })
      .addCase(fetchHotelDetails.rejected, (state, action) => {
        console.error('fetchHotelDetails.rejected:', action.error);
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setHotelAlternativesOpen,
  setDetailsHotel,
  setHotelSearchParams,
  setSelectedRooms,
  setRoomFilter,
  setLayoutsetting,
  setBlkTravellersInfo,
  setBlkId,
  setPropretyData,
  setLocationSuggestions,
  setManualHotelModalOpen,
  setManualHotelData,
  resetManualHotelState,
  setHotelSuggestions,
  setRoomSuggestions,
  clearHotelSuggestions,
  clearRoomSuggestions,
  clearAddManualHotelRoomData,
  setselectedRoomsTotalPrice,
  updateSelfBookedStay,
  resetSelfBookedStayState,
  setViewDetailsOnly,
  setViewCommission,
  setHotelLookUpDialogOpen,
  setHotelLookUpData,
  updateSelectedHotelDetails,
  updateSelfBookedStayOpenModal,
  setPaxD,
  setPrD,
} = hotelSlice.actions;
export default hotelSlice.reducer;
