import { contentOptionDetails, openContentCardSlider } from "../../../../contentCard/redux/contentCardSlice";
import {
  ContentCardExecuteType,
  ContentCardQueryType,
  ContentCardType,
} from "../../../../contentCard/types/contentCard";
import { AppDispatch } from "../../../../shared/lib/store";
import { Action } from "../../../types/journey";
import { ActionMiscData } from "../types/actionTypes";

export class ContentCardActionHandler {
  constructor(
    private dispatch: AppDispatch,
    private misc: ActionMiscData,
    private updateJourney: (items?: any[], request?: any) => Promise<any>
  ) {}

  handleAdd(action: Action): void {
    const addPrms: any = action.addPrms ? action.addPrms : {};
    if (action.ctype === ContentCardType.MEAL_COUPONS) {
      //addPrms.mealType = misc?.mealType;
    }

    // Only open detail view for SIGHTSEEING UPDATE actions with cdid
    const isSightseeingUpdateWithDetails = 
      action.type === "UPDATE" && 
      (action.ctype === ContentCardType.SIGHTSEEING || action.ctype === ContentCardType.TRANSFERS) && 
      this.misc?.cdid;

    let queryType = isSightseeingUpdateWithDetails 
      ? ContentCardQueryType.DETAIL 
      : ContentCardQueryType.LISTINGS;

      if(action.ctype === ContentCardType.TRANSFERS && action.qt === ContentCardQueryType.GROUP_LISTINGS){
        queryType = ContentCardQueryType.GROUP_LISTINGS;
      }

    // Add groupId to addPrms for detail view
    if (isSightseeingUpdateWithDetails && this.misc.cdid) {
      addPrms.groupId = this.misc.cdid;
    }

    this.dispatch(
      openContentCardSlider({
        open: true,
        addPrms: addPrms,
        tvlG: action?.tvlG,
        rstTvlG: action?.rstTvlG,
        query: {
          qt: queryType,
          type: action.ctype,
          blockId: this.misc?.blockId,
          onDate: this.misc?.date,
          tvlG: action?.tvlG,
          actionData: action,
          dayNum: this.misc?.dayNum,
          cityName: this.misc?.cityName,
        },
        dayNumD: this.misc?.dayNumD,
      })
    );
  }

  handleRemove(action: any): void {
    this.updateJourney([
      {
        type: ContentCardExecuteType.CONTENT_REMOVE,
        ctype: action.ctype,
        date: this.misc?.date,
        tvlG: action?.tvlG,
        blockId: this.misc?.blockId,
        dayNum: this.misc?.dayNum,
      },
    ] as any);
  }
}
