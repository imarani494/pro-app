import { clearJourneyError, clearUpdateJourneyResponse } from "@/journey/redux/journeySlice";
import {
  ActionType,
  ContentCardExecuteType,
  ContentCardType,
  HotelCardExecuteType,
} from "../../../../contentCard/types/contentCard";
import {
  setBlkId,
  setBlkTravellersInfo,
  setDetailsHotel,
  setHotelAlternativesOpen,
  setHotelSearchParams,
  setLayoutsetting,
  updateSelfBookedStay,
  setManualHotelModalOpen,
  setHotelLookUpDialogOpen,
  setHotelLookUpData,
  setSelectedRooms,
  updateSelectedHotelDetails,
  updateSelfBookedStayOpenModal,
} from "../../../../hotels/redux/hotelSlice";
import { AppDispatch } from "../../../../shared/lib/store";
import { ActionMiscData } from "../types/actionTypes";
import { useAppSelector } from "@/shared/lib/hooks";

export class HotelActionHandler {
  constructor(
    private dispatch: AppDispatch,
    private misc: ActionMiscData,
    private updateJourney: (items?: any[], request?: any) => Promise<any>
  ) { }

  handleAdd(action: any): void {
    this.handleUpdate(action);
  }

  handleRoomChange(action: any): void {
    this.handleUpdate(action);
  }

  handleRemoveAddOn(action: any): void {
    this.updateJourney([
      {
        type: ContentCardExecuteType.CONTENT_REMOVE,
        ctype: ContentCardType.HOTEL_EXTRAS,
        date: this.misc?.date,
        tvlG: this.misc?.rmTvlG,
        blockId: this.misc?.blockId,
        dayNum: this.misc?.dayNum,
      },
    ] as any);
  }

  handleRemove(action: any): void {
    this.updateJourney([
      {
        type: HotelCardExecuteType.STAY_REMOVE,
        ctype: action.ctype,
        date: this.misc?.date,
        tvlG: this.misc?.rmTvlG,
        blockId: this.misc?.blockId,
        dayNum: this.misc?.dayNum,
      },
    ] as any);
  }

  // Add new method for manual hotel
  handleAddManual(action: any): void {
    // Open the hotel alternatives sidebar
    // this.dispatch(setHotelAlternativesOpen(true));

    // Set layout to manual-hotel mode to render AddManualHotelModal
    // this.dispatch(setLayoutsetting("manual-hotel"));

    this.dispatch(setManualHotelModalOpen(true));
    // Set traveller information
    this.dispatch(
      setBlkTravellersInfo({ rmTvlG: this.misc?.rmTvlG, tvlG: this.misc?.tvlG })
    );

    // Set search parameters (even though we won't search, we need these for the form)
    this.dispatch(
      setHotelSearchParams({
        cityId: this.misc.cityId,
        checkinDate: this.misc.checkinDate,
        checkoutDate: this.misc.checkoutDate,
        nationality: this.misc.nationality,
        tvlrKeys: this.misc.tvlrKeys,
        jid: this.misc.jid,
        dayNum: this.misc.dayNum,
      } as any)
    );

    this.dispatch(setBlkId(this.misc?.bid as any));
  }

  handleSelfBookedStay(action: any): void {
    this.dispatch(
      updateSelfBookedStay({
        ...action,
        openSelfBookedStayModal: true,
        misc: this.misc,
      })
    );
    this.dispatch(updateSelfBookedStayOpenModal(true))
    this.dispatch(clearJourneyError())
    this.dispatch(clearUpdateJourneyResponse())
  }

  handleLookUPHotel(action: any): void {
    this.dispatch(setHotelLookUpDialogOpen(true));
    this.dispatch(setHotelLookUpData(this.misc));
  }

  private handleUpdate(action: any): void {

    this.dispatch(setHotelAlternativesOpen(true));
    this.dispatch(
      setBlkTravellersInfo({ rmTvlG: this.misc?.rmTvlG, tvlG: this.misc?.tvlG })
    );
    const normalizedCityId =
      (action.ctype !== "HOTEL_ROOM" && typeof this.misc.cityId === "string" && this.misc.cityId.includes("_"))
        ? this.misc.cityId.split("_")[0]
        : this.misc.cityId;

    this.dispatch(
      setHotelSearchParams({
        cityId: normalizedCityId,
        checkinDate: this.misc.checkinDate,
        checkoutDate: this.misc.checkoutDate,
        nationality: this.misc.nationality,
        tvlrKeys: this.misc.tvlrKeys,
        jid: this.misc.jid,
        hotelSlug: action.otherData?.url,
        dayNum: this.misc.dayNum,
      } as any)
    );

    if (action.type === "UPDATE") {
      this.dispatch(setLayoutsetting("comparison"));
      this.dispatch(setSelectedRooms([]));
      this.dispatch(updateSelectedHotelDetails(null));
    } else {
      this.dispatch(setLayoutsetting("details"));
      this.dispatch(setDetailsHotel(action.otherData?.url as any));
      this.dispatch(setSelectedRooms([]));
      this.dispatch(updateSelectedHotelDetails(null));
    }
    this.dispatch(setSelectedRooms([]));
    this.dispatch(updateSelectedHotelDetails(null));
    this.dispatch(setBlkId(this.misc?.bid as any));
  }
}
