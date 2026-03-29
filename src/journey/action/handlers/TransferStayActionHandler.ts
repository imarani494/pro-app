import {
  openTransferStaySidebar,
  resetTransferStayState,
} from "@/transferstay/redux/transferstaySlice";
import { AppDispatch } from "@/shared/lib/store";
import { ActionMiscData } from "../types/actionTypes";
import {
  setHotelSearchParams,
  setBlkTravellersInfo,
  setBlkId,
} from "@/hotels/redux/hotelSlice";
export class TransferStayActionHandler {
  constructor(
    private dispatch: AppDispatch,
    private misc: ActionMiscData,
    private updateJourney: (items?: any[], request?: any) => Promise<any>
  ) {}

  handleAdd(action: any): void {
    this.dispatch(resetTransferStayState());

    this.dispatch(
      setBlkTravellersInfo({ rmTvlG: this.misc?.rmTvlG, tvlG: this.misc?.tvlG })
    );
    this.dispatch(
      setHotelSearchParams({
        cityId: this.misc.cityId,
        checkinDate: this.misc.checkinDate,
        checkoutDate: this.misc.checkoutDate,
        nationality: this.misc.nationality,
        tvlrKeys:
          this.misc.tvlrKeys ||
          (this.misc.tvlG?.length > 0 &&
            JSON.stringify(this.misc.tvlG.map((tvl: string) => tvl))),
        jid: this.misc.jid,
        hotelSlug: action.otherData?.url,
      } as any)
    );

    const sidebarPayload = {
      open: true,
      actionData: action,
      query: {
        blockId: this.misc?.blockId,
        onDate: this.misc?.date,
        cityId: this.misc?.cityId,
        cityName: this.misc?.cityName,
        tvlG: action?.tvlG,
        rstTvlG: action?.rstTvlG,
        tvlgKeys: this.misc?.tvlG,
        ctype: action?.ctype,
        dayNum: this.misc?.dayNum,
      },
      type: action?.ctype || "RAIL",
      misc: this.misc,
    };
    this.dispatch(openTransferStaySidebar(sidebarPayload));
  }

  handleRemove(action: any): void {
    this.updateJourney([
      {
        type: "CONTENT_REMOVE",
        ctype: action.ctype,
        date: this.misc?.date,
        tvlG: action?.tvlG,
        blockId: this.misc?.blockId,
        dayNum: this.misc?.dayNum,
      },
    ] as any);
  }

  handleUpdate(action: any): void {
    const updateMisc = {
      ...this.misc,
      isUpd: true,
      cityId: action.addPrms.cityId,
      checkinDate: this.misc.checkinDate,
      checkoutDate: this.misc.checkoutDate,
      transportStayId: this.misc?.transportStayId,
      roomOptionId: this.misc?.roomOptionId,
    };

    // set hotel search params similar to handleAdd so hotel list uses same filters
    this.dispatch(
      setHotelSearchParams({
        cityId: action.addPrms.cityId,
        checkinDate: this.misc.checkinDate,
        checkoutDate: this.misc.checkoutDate,
        nationality: this.misc.nationality,
        tvlrKeys:
          this.misc.tvlrKeys ||
          (this.misc.tvlG?.length > 0 &&
            JSON.stringify(this.misc.tvlG.map((tvl: string) => tvl))),
        jid: this.misc.jid,
        hotelSlug: action.otherData?.url,
      } as any)
    );
    const updatePayload = {
      open: true,
      actionData: action,
      flow: "UPDATE",
      query: {
        blockId: this.misc?.blockId,
        onDate: this.misc?.date,
        cityId: action.addPrms.cityId,
        cityName: this.misc?.cityName,
        date: this.misc?.date,
        tvlG: action?.tvlG,
        tvlrKeys: action?.tvlG,
        rstTvlG: action?.rstTvlG,
        ctype: action?.ctype,
        dayNum: this.misc?.dayNum,
      },
      type: action?.ctype || "RAIL",
      misc: updateMisc,
    };

    this.dispatch(setBlkId(this.misc?.bid as any));
    this.dispatch(openTransferStaySidebar(updatePayload));
  }
}
