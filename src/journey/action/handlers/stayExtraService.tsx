import {
  ContentCardExecuteType,
  ContentCardType,
} from "../../../../contentCard/types/contentCard";
import { AppDispatch } from "../../../../shared/lib/store";
import { Action } from "../../../types/journey";
import { ActionMiscData } from "../types/actionTypes";

export class StayExtraActionHandler {
  constructor(
    private dispatch: AppDispatch,
    private misc: ActionMiscData,
    private updateJourney: (items?: any[], request?: any) => Promise<any>
  ) {}

  handleRemove(action: Action): void {
    this.updateJourney([
      {
        type: ContentCardExecuteType.CONTENT_REMOVE,
        ctype: ContentCardType.STAY_EXTRA_SERVICE,
        date: this.misc?.date,
        tvlG: this.misc?.rmTvlG || action?.tvlG,
        blockId: this.misc?.blockId || this.misc?.bid,
        dayNum: this.misc?.dayNum,
      },
    ] as any);
  }
}
