import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../screens/auth/redux/authSlice';
import customTripReducer from '../journey/create/redux/customTripSlice';
import journeyReducer from '../journey/redux/journeySlice';
import hotelReducer from '../hotels/redux/hotelSlice';
import contentCardReducer from '../contentCard/redux/contentCardSlice';

import carRentalReducer from '../car/redux/carRentalSlice';

export const store = configureStore({
  reducer: {
    device: authReducer,
    customTrip: customTripReducer,
    journey: journeyReducer,
    hotel: hotelReducer,
    carRental: carRentalReducer,
    contentCard: contentCardReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],

        ignoredActionPaths: [],

        ignoredPaths: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
