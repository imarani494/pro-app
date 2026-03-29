import { FlightCardExecuteType } from "../../../../contentCard/types/contentCard";
import {
  openFlightSlider,
  resetState,
} from "../../../../flights/redux/flightSlice";
import { AppDispatch } from "../../../../shared/lib/store";
import { ActionMiscData } from "../types/actionTypes";

export class FlightActionHandler {
  constructor(
    private dispatch: AppDispatch,
    private misc: ActionMiscData,
    private updateJourney: (items?: any[], request?: any) => Promise<any>
  ) { }

  handleAdd(action: any): void {
    this.dispatch(resetState());
    if (this.misc?.srchO) {
      this.dispatch(
        openFlightSlider({
          open: true,
          searchData: this.misc?.srchO,
          rstTvlG: action?.rstTvlG,
          query: {
            blockId: this.misc?.blockId,
            onDate: this.misc?.date,
            tvlG: action?.tvlG,
            dayNum: this.misc?.dayNum,
          },
        } as any)
      );
    } else {
      this.dispatch(
        openFlightSlider({
          open: true,
          notFireSearch: action?.notFireSearch,
          restrictDate: action?.restrictDate,
          searchData: { sTyp: "RETURN" },
          query: {}
        } as any)
      );
    }
  }

  handleAddMulticity(action: any): void {
    this.dispatch(resetState());
    if (action?.otherData?.srchO) {
      this.dispatch(
        openFlightSlider({
          open: true,
          searchData: action?.otherData?.srchO,
          notFireSearch: action?.notFireSearch,
          rstTvlG: action?.rstTvlG,
          query: {},
        } as any)
      );
    }
  }

  handleRemove(action: any): void {
    const updatePayload: any = {
      type: FlightCardExecuteType.TRANSPORT_REMOVE,
      ctype: action.ctype,
      date: this.misc?.date,
      tvlG: action?.tvlG,
      blockId: this.misc?.blockId,
      dayNum: this.misc?.dayNum,
    };

    // If user selected an option from the alignment dialog
    if (action.avdCtyAlgnSelected !== undefined) {
      updatePayload.txptData = {
        ...(updatePayload.txptData || {}),
        avdCtyAlgn: action.avdCtyAlgnSelected, // true or false
      };
    }

    this.updateJourney([updatePayload] as any);
  }

  handleSelfBooking(action: any): void {
    this.dispatch(
      openFlightSlider({
        open: true,
        flow: "SELF_BOOKING",
        query: {
          blockId: this.misc?.blockId,
          onDate: this.misc?.date,
          tvlG: action?.tvlG,
          dayNum: this.misc?.dayNum,
        },
        searchData: null,
        selfBookConfigData: action?.otherData?.config,
      } as any)
    );
  }

  handleEarlyCheckIn(action: any): void {
    this.dispatch(
      openFlightSlider({
        open: true,
        flow: "EARLY_CHECKIN_OPTIONS",
        query: {
          blockId: this.misc?.blockId,
          onDate: this.misc?.date,
          tvlG: action?.tvlG,
          dayNum: this.misc?.dayNum,
        },
        checkInNcheckOutOpts: action?.otherData?.opts,
      } as any)
    );
  }

  handleLateCheckOut(action: any): void {
    this.dispatch(
      openFlightSlider({
        open: true,
        flow: "LATE_CHECKOUT_OPTIONS",
        query: {
          blockId: this.misc?.blockId,
          onDate: this.misc?.date,
          tvlG: action?.tvlG,
          dayNum: this.misc?.dayNum,
        },
        checkInNcheckOutOpts: action?.otherData?.opts,
      } as any)
    );
  }

  handleAddManual(action: any): void {
    this.dispatch(
      openFlightSlider({
        open: true,
        flow: "ADD_MANUAL_FLIGHT",
        query: {
          blockId: this.misc?.blockId,
          onDate: this.misc?.date,
          tvlG: action?.tvlG,
          fltSA: this.misc?.fltSA,
          dayNum: this.misc?.dayNum,
        },
        searchData: null,
      } as any)
    );
  }

  handleAddOn(action: any): void {
    this.dispatch(
      openFlightSlider({
        open: true,
        flow: "TRANSPORT_ADD_ONS",
        query: {
          blockId: this.misc?.blockId,
          onDate: this.misc?.date,
          tvlG: action?.tvlG,
          dayNum: this.misc?.dayNum,
        },
        addonActionData: action,
      } as any)
    );
  }
}
