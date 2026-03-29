import {CarRentalActionHandler} from '../handlers/CarRentalActionHandler';
// import {CommonActionHandler} from '../handlers/CommonActionHandler';
// import {ContentCardActionHandler} from '../handlers/ContentCardActionHandler';
// import {FlightActionHandler} from '../handlers/FlightActionHandler';
// import {GuidedTourActionHandler} from '../handlers/GuidedTourActionHandler';
// import {HotelActionHandler} from '../handlers/HotelActionHandler';
// import {TransferStayActionHandler} from '../handlers/TransferStayActionHandler';
import {ActionMiscData} from '../types/actionTypes';
// import {StayExtraActionHandler} from '../handlers/stayExtraService';
import {useAppDispatch} from '../../../store';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {JourneyStackParamList} from '../../../navigators/types';
import {useUpdateJourney} from '../../hooks/useUpdateJourney';

export function useActionHandlers(
  misc: ActionMiscData,
  navigation?: NativeStackNavigationProp<JourneyStackParamList>,
) {
  const dispatch = useAppDispatch();
  const updateJourney = useUpdateJourney();

  return {
    // common: new CommonActionHandler(dispatch, misc, updateJourney),
    // flight: new FlightActionHandler(dispatch, misc, updateJourney),
    // hotel: new HotelActionHandler(dispatch, misc, updateJourney),
    // stayExtraService: new StayExtraActionHandler(dispatch, misc, updateJourney),
    // contentCard: new ContentCardActionHandler(dispatch, misc, updateJourney),
    car: new CarRentalActionHandler(dispatch, misc, updateJourney, navigation),
    // guidedTour: new GuidedTourActionHandler(dispatch, misc, updateJourney),
    // transferStay: new TransferStayActionHandler(dispatch, misc, updateJourney),
  };
}
