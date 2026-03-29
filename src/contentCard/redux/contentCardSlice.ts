import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentCardQueryType, ContentCardType } from '../types/contentCard';
import type { ContentCardExecuteActionItem } from '../types/contentCard';
import { contentOptionsLoadApi } from '../../common/api/journey/content-options-load/route';
import { contentOptionDetailsApi } from '../../common/api/activity/detail/[id]/route';

// -------------------- Types --------------------
export type ContentCardOptionDetailData = {
  cdDsp: string;
  exc: string[];
  tpTxt: string;
  cdImg: string[];
  hghPt: string[];
  cdtgs: string[];
  ptNt: string[];
  cdtmDr: string;
  inc: string[];
};

export interface ContentCardState {
  loading: boolean;
  error?: string | null;
  context: {
    open: boolean;
    jid?: string | null; // Journey ID
    addPrms?: any;
    tvlG?: any | null;
    rstTvlG?: any | null;
    dayNumD?: number | null;
    query: {
      qt: ContentCardQueryType;
      type?: ContentCardType;
      blockId?: string | null;
      onDate?: string | null;
      tvlG?: any | null;
      actionData?: any | null;
      dayNum?: number | null;
      cityName?: string | null;
    };
    skipDetailCall: boolean;
    filters?: {
      timeSlots: string[];
      activityTag: string;
      searchQuery: string;
      categoryRootKey?: string;
      categorySelections?: Record<string, string>;
    };
  };
  contentOptions: any[];
  contentDetail: any | null;
  contentOptionData: ContentCardOptionDetailData | null;
  contentOptionDataError: string | null;
  addOns: any[];
  requestExecute: { items: ContentCardExecuteActionItem[] };
  keyItemMap: any;
  cateArr: any[];
  selectedKeyItems: string;
  categoryFilterData: any;
  contentDetailItems: any[];
  contentDetailInclusions: any[];
  contentGroupData: any;
  othCtyA: any[];
  navigationHistory: Array<{
    query: any;
    contentOptions: any[];
    othCtyA: any[];
    filters: any;
  }>;
  filters: {
    active: {
      activity: string;
      operator: string;
      timeSlots: string[];
      search: string;
    };
    pending: {
      activity: string;
      operator: string;
    };
    filtersOpen: boolean;
  };
}

// -------------------- Initial State --------------------
const initialState: ContentCardState = {
  loading: false,
  error: null,
  context: {
    open: false,
    addPrms: null,
    tvlG: null,
    rstTvlG: null,
    dayNumD: null,
    query: {
      qt: ContentCardQueryType.LISTINGS,
      type: ContentCardType.SIGHTSEEING,
      blockId: null,
      onDate: null,
      tvlG: null,
    },
    skipDetailCall: false,
    filters: { timeSlots: [], activityTag: 'Show All', searchQuery: '' },
  },
  contentOptions: [],
  contentDetail: null,
  contentOptionData: null,
  contentOptionDataError: null,
  addOns: [],
  requestExecute: { items: [] },
  keyItemMap: {},
  cateArr: [],
  selectedKeyItems: '',
  categoryFilterData: null,
  contentDetailItems: [],
  contentDetailInclusions: [],
  contentGroupData: {},
  othCtyA: [],
  navigationHistory: [],
  filters: {
    active: { activity: 'Show All', operator: 'Show All', timeSlots: [], search: '' },
    pending: { activity: 'Show All', operator: 'Show All' },
    filtersOpen: false,
  },
};




export const contentOptionsLoad = createAsyncThunk(
  'contentcard/contentOptionsLoad',
  async (params: any, { rejectWithValue }) => {
    try {
     
console.log("before results")
      const result = await contentOptionsLoadApi(params || {});
      console.log('✅ API SUCCESS:',result)
      
      return result;
    } catch (error: any) {
      console.error('❌ API ERROR:', error.message || error);
      return rejectWithValue(error.message || 'Network error');
    }
  }
);



export const contentOptionDetails = createAsyncThunk(
  'contentcard/contentOptionDetails',
  async (params: any) => {
    return await contentOptionDetailsApi(params || {});
  },
);

// -------------------- Utility Functions --------------------
export const processContentCard = (items: any) => {
  const treeMap: any = {};
  const itemTree: any = {};
  const cTagA: string[] = [];
  const travelerGroupMap: any = {};

  if (!items?.length) return { cTagA, treeMap, itemTree, travelerGroupMap };

  items.forEach((item: any) => {
    if (!item.ctagA?.length) return;

    const rootKey = item.ctagA[0].v || item.ctagA[0].k;
    const rootName = item.ctagA[0].n;
    if (!cTagA.includes(rootName)) cTagA.push(rootName);

    if (!treeMap[rootKey]) treeMap[rootKey] = {};
    if (!itemTree[rootKey]) itemTree[rootKey] = { items: [], _categoryName: rootName };

    itemTree[rootKey].items.push(item);
    if (item.tvlG) travelerGroupMap[rootKey] = item.tvlG;

    let currentLevel = itemTree[rootKey];
    for (let i = 1; i < item.ctagA.length; i++) {
      const tag = item.ctagA[i];
      const cat = tag.n;
      const val = tag.v || tag.k;
      if (!cTagA.includes(cat)) cTagA.push(cat);

      if (!treeMap[rootKey][cat]) treeMap[rootKey][cat] = [];
      if (!treeMap[rootKey][cat].includes(val)) treeMap[rootKey][cat].push(val);

      if (!currentLevel[cat]) currentLevel[cat] = {};
      if (!currentLevel[cat][val]) currentLevel[cat][val] = { items: [], _categoryName: cat };

      currentLevel[cat][val].items.push(item);
      currentLevel = currentLevel[cat][val];
    }
  });

  return { cTagA, treeMap, itemTree, travelerGroupMap };
};

export const getItemsByCombination = (itemTree: any, rootKey: string, selections: Record<string, string> = {}) => {
  const rootLevel = itemTree[rootKey];
  if (!rootLevel) return [];
  if (!Object.keys(selections).length) return rootLevel.items || [];

  let current = rootLevel;
  for (const cat of Object.keys(selections)) {
    const val = selections[cat];
    if (!val || !current[cat]?.[val]) return [];
    current = current[cat][val];
  }
  return current.items || [];
};

// -------------------- Slice --------------------
export const contentCardSlice = createSlice({
  name: 'contentCard',
  initialState,
  reducers: {
    openContentCardSlider(state, action: PayloadAction<ContentCardState['context']>) {
      state.context.open = action.payload.open;
      if (action.payload.open) state.context = { ...action.payload, filters: state.context.filters };
      if (action.payload.query.qt === ContentCardQueryType.LISTINGS) state.contentDetail = null;
    },
    closeContentCardSlider(state) {
      state.context.open = false;
      state.filters = initialState.filters;
      state.navigationHistory = [];
    },
    updateContentCardQuery(state, action: PayloadAction<any>) {
      state.context.query = action.payload;
    },
    setSelectedTvlG(state, action: PayloadAction<any>) {
      state.context.query.tvlG = action.payload;
    },
    resetContentOptions(state) {
      state.contentOptions = [];
      state.contentDetail = null;
      state.addOns = [];
      state.contentGroupData = {};
    },
    setSelectedKeyItems(state, action: PayloadAction<string>) {
      state.selectedKeyItems = action.payload;
    },
    setContentGroupData(state, action: PayloadAction<any>) {
      state.contentGroupData[action.payload.groupId] = { ...action.payload };
    },

    // ---------------- Filters + Navigation ----------------
    setContentFilters(state, action: PayloadAction<any>) {
      if (!state.context.filters) state.context.filters = { timeSlots: [], activityTag: 'Show All', searchQuery: '' };
      state.context.filters = { ...state.context.filters, ...action.payload };
    },
    resetContentFilters(state) {
      state.context.filters = { timeSlots: [], activityTag: 'Show All', searchQuery: '', categoryRootKey: undefined, categorySelections: undefined };
    },
    pushNavigationHistory(state) {
      state.navigationHistory.push({
        query: { ...state.context.query },
        contentOptions: state.contentOptions,
        othCtyA: state.othCtyA,
        filters: JSON.parse(JSON.stringify(state.filters)),
      });
    },
    popNavigationHistory(state) {
      const prev = state.navigationHistory.pop();
      if (prev) {
        state.context.query = prev.query;
        state.contentOptions = prev.contentOptions;
        state.othCtyA = prev.othCtyA;
        state.filters = prev.filters;
      }
    },
    clearNavigationHistory(state) {
      state.navigationHistory = [];
    },
    setFiltersOpen(state, action: PayloadAction<boolean>) {
      state.filters.filtersOpen = action.payload;
    },
    setPendingActivityFilter(state, action: PayloadAction<string>) {
      state.filters.pending.activity = action.payload;
    },
    setPendingOperatorFilter(state, action: PayloadAction<string>) {
      state.filters.pending.operator = action.payload;
    },
    applyFilters(state) {
      state.filters.active.activity = state.filters.pending.activity;
      state.filters.active.operator = state.filters.pending.operator;
    },
    toggleTimeFilter(state, action: PayloadAction<string>) {
      const idx = state.filters.active.timeSlots.indexOf(action.payload);
      if (idx >= 0) state.filters.active.timeSlots.splice(idx, 1);
      else state.filters.active.timeSlots.push(action.payload);
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.filters.active.search = action.payload;
    },
  },
 extraReducers: builder => {
  builder
    // ✅ PENDING - Show loading
    .addCase(contentOptionsLoad.pending, state => {
      state.loading = true;
      state.error = null;
      // Don't clear contentOptions here - keep previous results during search
    })
    
    // ✅ FULFILLED - Handle BOTH success AND business errors
    .addCase(contentOptionsLoad.fulfilled, (state, action) => {
      state.loading = false;
      
      console.log('📦 contentOptionsLoad fulfilled:', {
        success: action.payload?.success,
        hasData: !!action.payload?._data,
        rt: action.payload?._data?.rt,
        itemsCount: action.payload?._data?.items?.length,
      });
      
      // ✅ Backend returns {success: false, error_msg: "..."} → Business error
      if (action.payload?.success === false) {
        console.log('⚠️ Business error:', action.payload.error_msg);
        state.error = action.payload.error_msg || 'Search failed';
        state.contentOptions = []; // Clear results
        return;
      }
      
      // ✅ SUCCESS - Process data
      const data = action.payload?._data;
      if (!data) {
        state.error = 'No data received';
        state.contentOptions = [];
        return;
      }
      
      const rt = data?.rt;
      
      state.context.skipDetailCall = 
        state.context.query?.qt === ContentCardQueryType.LISTINGS && 
        rt === ContentCardQueryType.DETAIL;

      if ([ContentCardQueryType.LISTINGS, ContentCardQueryType.GROUP_LISTINGS].includes(rt)) {
        state.contentOptions = data?.items || [];
        state.othCtyA = data?.othCtyA || [];
        console.log('✅ Set contentOptions:', state.contentOptions.length, 'items');
      } else if (rt === ContentCardQueryType.DETAIL) {
        state.contentDetail = data?.item || null;
        state.contentDetailItems = data?.item?.items || [];
        state.contentDetailInclusions = data?.item?.incA || [];
        state.addOns = data?.addOns || [];
      }
      
      state.context.query.qt = rt;
      state.error = null; // Clear any previous errors
    })
    
    // ✅ REJECTED - Network/JS errors only
    .addCase(contentOptionsLoad.rejected, (state, action) => {
      state.loading = false;
      console.error('❌ contentOptionsLoad rejected:', action.payload || action.error);
      state.error = (action.payload as string) || action.error?.message || 'Network error';
      state.contentOptions = [];
    });
},

});

// -------------------- Exports --------------------
export const {
  openContentCardSlider,
  closeContentCardSlider,
  updateContentCardQuery,
  setSelectedTvlG,
  resetContentOptions,
  setSelectedKeyItems,
  setContentGroupData,
  // Filters & History
  setContentFilters,
  resetContentFilters,
  pushNavigationHistory,
  popNavigationHistory,
  clearNavigationHistory,
  setFiltersOpen,
  setPendingActivityFilter,
  setPendingOperatorFilter,
  applyFilters,
  toggleTimeFilter,
  setSearchQuery,
} = contentCardSlice.actions;

export default contentCardSlice.reducer;