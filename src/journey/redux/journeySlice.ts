import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {journeydetailApi} from '../../common/api/journey/detail/[id]/route';
import {journeyUpdateRequestExecuteApi} from '../../common/api/journey/update-request-execute/route';
import {journeyHistoryApi} from '../../common/api/journey/history/[id]/route';
import {miscExecuteType} from '../../contentCard/types/contentCard';

export interface BreadcrumbItem {
  text: string;
  url?: string;
}

export interface PaginationInfo {
  endItem: number;
  total: number;
  startItem: number;
  limit: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  page: number;
}

export interface JourneyState {
  success: boolean;
  errorMessage: string | undefined;
  loading: boolean;
  hasAttemptedFetch: boolean;
  id?: string;
  jdid?: string;
  journey: any;
  breadcrumbA: BreadcrumbItem[];
  printMode: string;
  gBlkMap?: any;
  error: string | undefined;
  save: boolean;
  vldArr: any[];
  extraInfo: any;

  isTravellerDivergence: boolean;
  isRoomDivergence: boolean;
  isGuidedtourDivergence: boolean;
  isFlightDivergence: boolean;
  dayBlkActionsMap: Record<string, any>;
  customInclusionsModal: boolean;
  customInclusionsPayload: any;
  updateJourneyResponse: any;
  advisoryCommentModal: boolean;
  pricingBreakdownModal: boolean;
  travelerPricingBreakdownModal: boolean;
  travelerPricingBreakdownPayload: any;
  markupDiscountModal: boolean;
  textSummaryModal: boolean;
  whatsappSummaryModal: boolean;
  whatsappLinkModal: boolean;
  emailJourneyModal: boolean;
  journeyHistoryModal: boolean;
  journeyHistoryPayload: any;
  whatChangedModal: boolean;
  whatChangedPayload: any;
  markupDiscountPayload: any;
  pricingBreakdownPayload: any;
  textSummaryPayload: any;
  whatsappSummaryPayload: any;
  whatsappLinkPayload: any;
  emailJourneyPayload: any;
  advisoryCommentPayload: {
    comment: string;
    commentId?: string;
    blockId?: string;
    userName: string;
    tvlG: {tvlA: string[]};
  };
  journeyParams: Record<string, any>;
  journeyHistory: any[];
  historyLoading: boolean;
  historyPagination: PaginationInfo | null;

  // 🗺️ New: Map view toggle
  showMapView: boolean;
  flightGroupMap: Record<string, any>;

  // day card expanded state
  dayCardExpanded: Record<number, boolean>;

  // selected day for filtering (day index in dyA array)
  selectedDayIndex: number | null;
  travelerDayMapData: Record<string, any>;
}

const initialState: JourneyState = {
  loading: false,
  success: true,
  errorMessage: undefined,
  hasAttemptedFetch: false,
  journey: null,
  breadcrumbA: [],
  printMode: '',
  gBlkMap: null,
  error: undefined,
  save: true,
  vldArr: [],
  extraInfo: null, // Initialize extraInfo

  isTravellerDivergence: true,
  isRoomDivergence: false,
  isGuidedtourDivergence: true,
  isFlightDivergence: true,
  dayBlkActionsMap: {},
  advisoryCommentModal: false,
  markupDiscountModal: false,
  textSummaryModal: false,
  whatsappSummaryModal: false,
  whatsappLinkModal: false,
  emailJourneyModal: false,
  journeyHistoryModal: false,
  journeyHistoryPayload: {},
  whatChangedModal: false,
  whatChangedPayload: {},
  markupDiscountPayload: {},
  textSummaryPayload: {},
  whatsappSummaryPayload: {},
  whatsappLinkPayload: {},
  emailJourneyPayload: {},
  advisoryCommentPayload: {
    comment: '',
    userName: '',
    tvlG: {tvlA: []},
  },
  customInclusionsModal: false,
  customInclusionsPayload: {},
  updateJourneyResponse: null,
  pricingBreakdownModal: false,
  pricingBreakdownPayload: {},
  travelerPricingBreakdownModal: false,
  travelerPricingBreakdownPayload: {},
  journeyParams: {},
  journeyHistory: [],
  historyLoading: false,
  historyPagination: null,

  showMapView: false,
  flightGroupMap: {},
  dayCardExpanded: {},
  selectedDayIndex: null,
  travelerDayMapData: {},
};

export const fetchJourney = createAsyncThunk(
  'journey/detail',
  async (params: any) => {
    return await journeydetailApi(params || {});
  },
);

export const updateJourney = createAsyncThunk(
  'journey/update',
  async (params: any) => {
    return await journeyUpdateRequestExecuteApi(params || {});
  },
);

export const fetchJourneyHistory = createAsyncThunk(
  'journey/history',
  async (params: any) => {
    return await journeyHistoryApi(params || {});
  },
);

export const processJourney = (state: JourneyState, journey: any) => {
  state.gBlkMap = {};
  state.dayBlkActionsMap = {};
  state.vldArr = [];
  state.travelerDayMapData = {};

  if (journey.gBlkA && journey.gBlkA.length > 0) {
    state.gBlkMap = journey.gBlkA.reduce((acc: any, blk: any) => {
      acc[blk.bid] = blk;
      return acc;
    }, {});
  }

  state.flightGroupMap = {};
  journey.dyA.forEach((dy: any, dk: number) => {
    state.dayBlkActionsMap[dy.date] = dy;
    if (dy.blkA && dy.blkA.length > 0) {
      dy.blkA.forEach((blk: any) => {
        state.dayBlkActionsMap[blk.bid] = blk;
        if (blk.typ === 'FLIGHT') {
          state.flightGroupMap[blk.tGrpId] =
            state.flightGroupMap[blk.tGrpId] || [];
          state.flightGroupMap[blk.tGrpId].push(blk);
        }

        if (blk.tvlG.tvlA.length > 0) {
          blk.tvlG.tvlA.forEach((tvl: any) => {
            const tvlKey = dk + '_' + tvl;
            state.travelerDayMapData[tvlKey] =
              state.travelerDayMapData[tvlKey] || [];
            state.travelerDayMapData[tvlKey].push(blk.bid);
          });
        }

        if (blk.bid) {
          state.gBlkMap[blk.bid] = blk;
        }

        if (blk.vldA && blk.vldA.length > 0) {
          const enhancedValidations = blk.vldA.map((vld: any) => ({
            ...vld,
            title: dy.ttl,
            dayNum: dy.dayNum,
            bid: blk.bid,
            btyp: blk.typ,
            btypD: blk.typD,
            date: dy.date,
          }));
          state.vldArr.push(...enhancedValidations);
        }
      });
    }
  });
};

export const getMetaExecuteType = (state: JourneyState) => {
  return state.journey.inEditMode
    ? miscExecuteType.UPDATE
    : miscExecuteType.META;
};

export const journeySlice = createSlice({
  name: 'journey',
  initialState,
  reducers: {
    setJourneyId(state, action) {
      state.id = action.payload;
    },
    setJourneyJdid(state, action) {
      state.jdid = action.payload;
    },
    setJourneyParamsStatus(state, action) {
      state.journeyParams = action.payload.params;
      state.save = action.payload.params.save === 'false' ? false : true;
    },
    openAdvisoryCommentModal(state, action) {
      state.advisoryCommentModal = action.payload.status;
      state.advisoryCommentPayload = action.payload.data;
    },
    openCustomInclusionsModal(state, action) {
      state.customInclusionsModal = action.payload.status;
      state.customInclusionsPayload = action.payload.data;
    },
    clearUpdateJourneyResponse(state) {
      state.updateJourneyResponse = null;
    },
    openPricingBreakdownModal(state, action) {
      state.pricingBreakdownModal = action.payload.status;
      state.pricingBreakdownPayload = action.payload.data;
    },
    openTravelerPricingBreakdownModal(state, action) {
      state.travelerPricingBreakdownModal = action.payload.status;
      state.travelerPricingBreakdownPayload = action.payload.data;
    },
    resetJourneyHistory(state) {
      state.journeyHistory = [];
    },
    openMarkupDiscountModal(state, action) {
      state.markupDiscountModal = action.payload.status;
      state.markupDiscountPayload = action.payload.data;
    },
    openTextSummaryModal(state, action) {
      state.textSummaryModal = action.payload.status;
      state.textSummaryPayload = action.payload.data;
    },
    openWhatsappSummaryModal(state, action) {
      state.whatsappSummaryModal = action.payload.status;
      state.whatsappSummaryPayload = action.payload.data;
    },
    openWhatsappLinkModal(state, action) {
      state.whatsappLinkModal = action.payload.status;
      state.whatsappLinkPayload = action.payload.data;
    },

    toggleMapView(state) {
      state.showMapView = !state.showMapView;
    },
    setMapView(state, action) {
      state.showMapView = action.payload;
    },
    openEmailJourneyModal(state, action) {
      state.emailJourneyModal = action.payload.status;
      state.emailJourneyPayload = action.payload.data;
    },

    // open & close day card
    openDayCard(state, action) {
      state.dayCardExpanded[action.payload] = true;
    },
    closeDayCard(state, action) {
      state.dayCardExpanded[action.payload] = false;
    },
    openAllDayCards(state) {
      // Expand all days that exist in the journey
      const dayCount = state.journey?.dyA?.length || 0;
      for (let i = 1; i <= dayCount; i++) {
        state.dayCardExpanded[i] = true;
      }
    },
    closeAllDayCards(state) {
      // Collapse all days that exist in the journey
      const dayCount = state.journey?.dyA?.length || 0;
      for (let i = 1; i <= dayCount; i++) {
        state.dayCardExpanded[i] = false;
      }
    },
    openJourneyHistoryModal(state, action) {
      state.journeyHistoryModal = action.payload.status;
      state.journeyHistoryPayload = action.payload.data;
    },
    openWhatChangedModal(state, action) {
      state.whatChangedModal = action.payload.status;
      state.whatChangedPayload = action.payload.data;
    },
    setSelectedDay(state, action) {
      state.selectedDayIndex = action.payload;
    },
    clearSelectedDay(state) {
      state.selectedDayIndex = null;
    },
    clearJourneyError(state) {
      state.error = undefined;
      state.errorMessage = undefined;
      state.success = true; // Reset to default success state
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchJourney.pending, (state: JourneyState) => {
        state.loading = true;
        state.hasAttemptedFetch = true;
      })
      .addCase(fetchJourney.fulfilled, (state: JourneyState, action) => {
        if (action.payload.success && action.payload?._data?.journey) {
          processJourney(state, action.payload?._data?.journey);
          state.journey = action.payload?._data?.journey;
          // Store breadcrumb data if present
          state.breadcrumbA = action.payload?._data?.breadcrumbA || [];
          // Set default selected day to day 1 (index 0) and expand it
          state.printMode = action.payload?._data?.printMode;
          state.extraInfo = action.payload?._data?.extraInfo;
          if (state.journey?.dyA && state.journey.dyA.length > 0) {
            state.selectedDayIndex = 0;
            const firstDay = state.journey.dyA[0];
            const firstDayNum = firstDay?.dayNum || 1;
            state.dayCardExpanded[firstDayNum] = true;
          }
        } else {
          state.success = action.payload.success;
          state.errorMessage = action.payload.error_msg;
          // Store extraInfo if present in the response (can be extrainfo or extraInfo)
        }
        state.loading = false;
        state.hasAttemptedFetch = true;
      })
      .addCase(updateJourney.pending, (state: JourneyState) => {
        state.loading = true;
      })
      .addCase(updateJourney.fulfilled, (state: JourneyState, action) => {
        state.updateJourneyResponse = action.payload;
        if (action.payload.success && action.payload?._data?.journey) {
          processJourney(state, action.payload?._data?.journey);
          state.journey = action.payload?._data?.journey;
          // Store breadcrumb data if present in update response
          if (action.payload?._data?.breadcrumbA) {
            state.breadcrumbA = action.payload._data.breadcrumbA;
          }
          // Store extraInfo if present in update response (can be extraInfo or extrainfo)
          if (
            action.payload?._data?.extraInfo ||
            action.payload?._data?.extrainfo
          ) {
            state.extraInfo =
              action.payload._data.extraInfo || action.payload._data.extrainfo;
          }
          // Set default selected day to day 1 (index 0) if not already set
          if (
            state.journey?.dyA &&
            state.journey.dyA.length > 0 &&
            state.selectedDayIndex === null
          ) {
            state.selectedDayIndex = 0;
          }
        } else {
          state.error = action.payload;
          state.loading = false;
        }
        state.loading = false;
      })
      .addCase(updateJourney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchJourneyHistory.pending, (state: JourneyState) => {
        state.historyLoading = true;
      })
      .addCase(fetchJourneyHistory.fulfilled, (state: JourneyState, action) => {
        state.historyLoading = false;
        const payload = action.payload;

        if (payload?.success && payload?._data) {
          const data = payload._data;
          const historyItems = data.historyItems;
          const pagination = data.pagination;

          const newItems = Array.isArray(historyItems) ? historyItems : [];

          if (state.journeyHistory.length === 0) {
            state.journeyHistory = newItems;
          } else {
            state.journeyHistory = [...state.journeyHistory, ...newItems];
          }

          state.historyPagination = pagination || null;
        } else {
          state.journeyHistory = [];
          state.historyPagination = null;
        }
      })
      .addCase(fetchJourneyHistory.rejected, state => {
        state.historyLoading = false;
      });
  },
});

export const {
  setJourneyId,
  setJourneyJdid,
  openAdvisoryCommentModal,
  openCustomInclusionsModal,
  clearUpdateJourneyResponse,
  setJourneyParamsStatus,
  openPricingBreakdownModal,
  openTravelerPricingBreakdownModal,
  resetJourneyHistory,
  openMarkupDiscountModal,
  openTextSummaryModal,
  openWhatsappSummaryModal,
  openWhatsappLinkModal,
  toggleMapView,
  setMapView,
  openEmailJourneyModal,
  openDayCard,
  closeDayCard,
  openAllDayCards,
  closeAllDayCards,
  openJourneyHistoryModal,
  openWhatChangedModal,
  setSelectedDay,
  clearSelectedDay,
  clearJourneyError,
} = journeySlice.actions;

export default journeySlice.reducer;
