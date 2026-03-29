import { openContentCardSlider } from "../../../../contentCard/redux/contentCardSlice";
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
    this.dispatch(
      openContentCardSlider({
        open: true,
        addPrms: addPrms,
        tvlG: action?.tvlG,
        rstTvlG: action?.rstTvlG,
        query: {
          qt: ContentCardQueryType.LISTINGS,
          type: action.ctype,
          blockId: this.misc?.blockId,
          onDate: this.misc?.date,
          tvlG: action?.tvlG,
          actionData: action,
          dayNum: this.misc?.dayNum,
          cityName: this.misc?.cityName,
        },
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
      },
    ] as any);
  }
}
