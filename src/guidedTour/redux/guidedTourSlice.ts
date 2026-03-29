import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import {IGuidedTourDetailsResponse} from '../types/GuidedTourDetailsType';
import {IDepatureListResponse} from '../types/GuidedTourTypes';
import {FetchGuidedToursApi} from '../../common/api/package/details/route';
import {FetchGuidedTourDetailsApi} from '../../common/api/trip/search-x/route';

interface IguidedTourParams {
  __xreq__: boolean;
  jid?: string;
  searchDate?: string;
  tvlrKeys?: string[][];
  application: string;
  bid?: string;
  exactDateMatch?: boolean;
  dayNum?: number;
}

interface IguidedTourListInfo {
  dayNum: number;
  bid?: string;
}
interface GuidedTourState {
  fdOpen: boolean;
  guidedTourList: IDepatureListResponse | null;
  loading: boolean;
  layoutSetting: string;
  error: string | undefined;
  guidedTourParams: IguidedTourParams;
  guidedTourListInfo: IguidedTourListInfo;
  blkTravellersInfo:
    | {
        rmTvlG: string[][];
        tvlG: string[];
      }
    | undefined;
  selectedTourId: number | undefined;
  guidedTourDetails: IGuidedTourDetailsResponse | undefined;
  fdRemoveOptionOpenSlice: boolean;
  pendingFDRemoveActionslice: any;
  pendingFDRemoveWithSelfBookedTourslice: any;
  selfBookedTourModalOpen: boolean;
}

const initialState: GuidedTourState = {
  fdOpen: false,
  guidedTourList: null,
  loading: false,
  error: undefined,
  layoutSetting: 'comparison', //"details", // ,
  guidedTourParams: {
    __xreq__: true,
    // jid: "5ee3057521787cb6", //"be1a99874548cc5c",
    // searchDate: "2025-10-12", //"22/10/2025",
    // tvlrKeys: [["T_ADULT_0", "T_ADULT_1"]],
    application: 'com.tf.webapp',
  },
  guidedTourListInfo: {
    dayNum: 1,
    bid: 'mea_d8031e3648b3cdeb', //no need block id
  },
  blkTravellersInfo: {
    rmTvlG: [['T_ADULT_0', 'T_ADULT_1']],
    tvlG: ['T_ADULT_0', 'T_ADULT_1'],
  },
  selectedTourId: undefined,
  guidedTourDetails: undefined,
  fdRemoveOptionOpenSlice: false,
  pendingFDRemoveActionslice: undefined,
  pendingFDRemoveWithSelfBookedTourslice: undefined,
  selfBookedTourModalOpen: false,
};

export const fetchGuidedTours = createAsyncThunk(
  'GuidedTour/list',
  async (listparams: IguidedTourParams) => {
    return await FetchGuidedToursApi(listparams || {});
  },
);

export const fetchGuidedTourDetails = createAsyncThunk(
  'GuidedTour/details',
  async (params: {
    pkgId: string;
    searchDate?: string;
    blockId?: string;
    exactDateMatch?: boolean;
  }) => {
    return await FetchGuidedTourDetailsApi({
      ...params,
      // Pass exactDateMatch if blockId is present (replacing self-booked tour)
      exactDateMatch: params.blockId ? true : params.exactDateMatch,
    });
  },
);

const GuidedTourSlice = createSlice({
  name: 'GuidedTour',
  initialState,
  reducers: {
    setFdOpen: (state, action: PayloadAction<boolean>) => {
      state.fdOpen = action.payload;
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
    setSelectedTourId(state, action: PayloadAction<number>) {
      state.selectedTourId = action.payload;
    },
    setGuidedTourParams(state, action: PayloadAction<IguidedTourParams>) {
      state.guidedTourParams = action.payload;
    },
    setGuidedTourListInfo(state, action: PayloadAction<IguidedTourListInfo>) {
      state.guidedTourListInfo = action.payload;
    },
    setFdRemoveOptionOpenSlice(state, action: PayloadAction<boolean>) {
      state.fdRemoveOptionOpenSlice = action.payload;
    },
    setPendingFDRemoveActionslice(state, action: PayloadAction<any>) {
      state.pendingFDRemoveActionslice = action.payload;
    },
    setPendingFDRemoveWithSelfBookedTourslice(
      state,
      action: PayloadAction<any>,
    ) {
      state.pendingFDRemoveWithSelfBookedTourslice = action.payload;
    },
    setSelfBookedTourModalOpen(state, action: PayloadAction<boolean>) {
      state.selfBookedTourModalOpen = action.payload;
    },
  },
  extraReducers: builder => {
    // For fetchGuidedTours
    builder
      .addCase(fetchGuidedTours.pending, state => {
        state.loading = true;
      })
      .addCase(fetchGuidedTours.fulfilled, (state, action) => {
        state.loading = false;
        state.guidedTourList = action.payload;
      })
      .addCase(fetchGuidedTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    // For fetchGuidedTours
    builder
      .addCase(fetchGuidedTourDetails.pending, state => {
        state.loading = true;
      })
      .addCase(fetchGuidedTourDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.guidedTourDetails = action.payload;
      })
      .addCase(fetchGuidedTourDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setFdOpen,
  setSelectedTourId,
  setLayoutsetting,
  setGuidedTourParams,
  setGuidedTourListInfo,
  setFdRemoveOptionOpenSlice,
  setPendingFDRemoveActionslice,
  setPendingFDRemoveWithSelfBookedTourslice,
  setSelfBookedTourModalOpen,
} = GuidedTourSlice.actions;
export default GuidedTourSlice.reducer;
