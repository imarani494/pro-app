import { setCarRentalsDetails } from "../../../car/redux/carRentalSlice";
import { ContentCardExecuteType } from "../../../contentCard/types/contentCard";
import { AppDispatch } from "../../../store";
import { Action } from "../../types/journey";
import { ActionMiscData } from "../types/actionTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { JourneyStackParamList } from "../../../navigators/types";


export class CarRentalActionHandler {
  constructor(
    private dispatch: AppDispatch,
    private misc: ActionMiscData,
    private updateJourney: (items?: any[], request?: any) => Promise<any>,
    private navigation?: NativeStackNavigationProp<JourneyStackParamList>
  ) {}
  handleAdd(action: Action): void {
    // Extract pkTm and dpTm from misc or construct from selectedPickupLocation/selectedDropLocation
    let pkTm = this.misc?.pkTm;
    let dpTm = this.misc?.dpTm;
    let pkLoc = this.misc?.pkLoc;
    let dpLoc = this.misc?.dpLoc;

    // If not in misc, try to construct from selectedPickupLocation/selectedDropLocation in action
    if (!pkTm || !dpTm) {
      const carRentalSearchData = (action?.otherData as any)?.carRentalSearchData;
      const selectedPickupLocation = carRentalSearchData?.selectedPickupLocation;
      const selectedDropLocation = carRentalSearchData?.selectedDropLocation;

      if (!pkTm && selectedPickupLocation?.date && selectedPickupLocation?.minTime) {
        // Construct pkTm from date and minTime (format: "YYYY-MM-DD HH:MM")
        pkTm = `${selectedPickupLocation.date} ${selectedPickupLocation.minTime}`;
      }

      if (!dpTm && selectedDropLocation?.date) {
        // For dropoff, use date with a default time or maxTime if available
        const dropoffTime = selectedDropLocation.maxTime || '09:00';
        dpTm = `${selectedDropLocation.date} ${dropoffTime}`;
      }

      // Extract location names if not in misc
      if (!pkLoc && selectedPickupLocation?.nm) {
        pkLoc = selectedPickupLocation.nm;
      }
      if (!dpLoc && selectedDropLocation?.nm) {
        dpLoc = selectedDropLocation.nm;
      }
    }

    this.dispatch(
      setCarRentalsDetails({
        open: true,
        actionData: action || {},
        isPackageFlow: true,
        date: this.misc?.date,
        dayNum: this.misc?.dayNum,
        blockId: this.misc?.blockId,
        pkTm: pkTm,
        dpTm: dpTm,
        pkLoc: pkLoc,
        dpLoc: dpLoc,
      })
    );
    
    // Navigate to CarRentalSearch screen if navigation is available
    if (this.navigation) {
      this.navigation.navigate('CarReantalStack', {
        initialRouteName: 'CarRentalSearch',
        action: action,
      });
    }
  }
  handleRemove(action: any): void {
    this.updateJourney([
      {
        type: ContentCardExecuteType.CAR_RENTAL_REMOVE,
        ctype: action.ctype,
        date: this.misc?.date,
        tvlG: action?.tvlG,
        blockId: this.misc?.blockId,
        dayNum: this.misc?.dayNum,
      },
    ] as any);
  }
}

