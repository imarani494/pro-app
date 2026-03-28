import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  saveDeviceInfoApi,
  SaveDeviceInfoParams,
} from '../../../common/api/mobile/save-device-info/route';
import {loginApi, LoginParams} from '../../../common/api/mobile/login/route';

// Types
export type {SaveDeviceInfoParams};

interface DeviceState {
  // Save device info
  saveDeviceInfoLoading: boolean;
  saveDeviceInfoError: string | null;
  saveDeviceInfoResponse: any | null;
  // Login
  loginLoading: boolean;
  loginError: string | null;
  loginResponse: any | null;
}

// Initial state
const initialState: DeviceState = {
  saveDeviceInfoLoading: false,
  saveDeviceInfoError: null,
  saveDeviceInfoResponse: null,
  loginLoading: false,
  loginError: null,
  loginResponse: null,
};

// Thunk for /api/mobile/save-device-info
export const saveDeviceInfo = createAsyncThunk(
  'device/saveDeviceInfo',
  async (params: SaveDeviceInfoParams) => {
    return await saveDeviceInfoApi(params || {});
  },
);

// Thunk for /api/mobile/save-device-info
export const fetchLogin = createAsyncThunk(
  'device/login',
  async (params: LoginParams) => {
    return await loginApi(params || {});
  },
);

export const authSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    clearSaveDeviceInfo: state => {
      state.saveDeviceInfoResponse = null;
      state.saveDeviceInfoError = null;
    },
    clearLogin: state => {
      state.loginResponse = null;
      state.loginError = null;
    },
  },
  extraReducers: builder => {
    builder
      // Save device info handlers
      .addCase(saveDeviceInfo.pending, state => {
        state.saveDeviceInfoLoading = true;
        state.saveDeviceInfoError = null;
        state.saveDeviceInfoResponse = null;
      })
      .addCase(saveDeviceInfo.fulfilled, (state, action) => {
        state.saveDeviceInfoLoading = false;
        state.saveDeviceInfoResponse = action.payload;
      })
      .addCase(saveDeviceInfo.rejected, (state, action) => {
        state.saveDeviceInfoLoading = false;
        state.saveDeviceInfoError =
          action.error.message || 'Failed to save device info';
        state.saveDeviceInfoResponse = null;
      })
      // Login handlers
      .addCase(fetchLogin.pending, state => {
        state.loginLoading = true;
        state.loginError = null;
        state.loginResponse = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.loginResponse = action.payload;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.error.message || 'Failed to login';
        state.loginResponse = null;
      });
  },
});

export const {clearSaveDeviceInfo, clearLogin} = authSlice.actions;

export default authSlice.reducer;
