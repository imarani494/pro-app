import {IHotelDetailsData} from '../hotels/types/detailsType';
import {Destination} from '../journey/create';

export type RootStackParamList = {
  Screen1: undefined;
  Screen2: undefined;
  Auth: undefined;
  Journey: undefined;
};
export type CarReantalStackParamList = {
  CarRentalSearch: {
    action?: any;
    date?: string;
    blockId?: string;
    sid?: string;
  };
  CarRentalDetails: {
    carkey?: string;
    selectedTvlG?: string[];
    pickupLocation?: string;
    dropoffLocation?: string;
    pickupTime?: string;
    dropoffTime?: string;
  };
  CarRentalListing: undefined;
};
export type AuthStackParamList = {
  AuthLoading: undefined;
  Login: undefined;
  Onboarding: undefined;
  ForgotPassword: undefined;
  VerifyOtp: {input?: string; inputType?: string};
};

export type JourneyStackParamList = {
  JourneyCreation: {
    leadId?: number | null;
    pkgId?: number | null;
    travelDate?: string | null;
    excity?: any;
    journeyId?: string;
  };
  JourneyCreateEntry: undefined;
  JourneyDetails: {
    journeyId?: string;
    jdid?: string;
  };
  SuggestItinerary: {
    setDestinations: React.Dispatch<React.SetStateAction<Destination[]>>;
  };
  HotelDetail: undefined;
  HotelImages: undefined;
  HotelListing: undefined;
  SelectedRoomListing: undefined;
  RoomListing: undefined;
  HotelSupplements: {
    hotelId?: string;
    hotelName?: string;
  };


  CarReantalStack: {
    initialRouteName?: keyof CarReantalStackParamList;
  };
  ContentCard: {
    actionType?: string;
    date?: string;
    blockId?: string;
    sid?: string;
    misc?: any;
    action?: any;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
