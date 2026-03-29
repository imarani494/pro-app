import { openContentCardSlider } from "@/contentCard/redux/contentCardSlice";
import {
  setBlkTravellersInfo,
  setFdOpen,
  setGuidedTourListInfo,
  setGuidedTourParams,
  setGuidedTourUpdateRoom,
  setLayoutsetting,
  setSelectedTourId,
} from "../../../../guidedTour/redux/guidedTourSlice";
import { AppDispatch } from "../../../../shared/lib/store";
import { Action } from "../../../types/journey";
import { ActionMiscData } from "../types/actionTypes";
import { ContentCardQueryType } from "@/contentCard/types/contentCard";
import { useJournery } from "@/journey/hooks/useJournery";
import { clearUpdateJourneyResponse } from "@/journey/redux/journeySlice";

export class GuidedTourActionHandler {
  constructor(
    private dispatch: AppDispatch,
    private misc: ActionMiscData,
    private updateJourney: (items?: any[], request?: any) => Promise<any>
  ) {}

  handleAdd(action: Action): void {
    if (action.name === "Add Optionals") {
      this.dispatch(
        openContentCardSlider({
          open: true,
          addPrms: action.addPrms ? action.addPrms : {},
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
    } else {
      // Extract bid (blockId) and exactDateMatch from action if available (for self-booked tour)
      const bid = action.addPrms?.blockId || action.addPrms?.bid;
      const exactDateMatch = action.addPrms?.exactDateMatch === "true" || action.addPrms?.exactDateMatch === true;
      
      const guidedTourParams = {
        jid: this.misc.jid,
        searchDate: this.misc?.date,
        tvlrKeys: action?.rmTvlG,
        dayNum: this.misc?.dayNum,
        //  rmTvlG: action?.rmTvlG,
        //   rstTvlG: action?.rstTvlG.tvlA,
        // Add bid and exactDateMatch for self-booked tour replacement
        // Backend will read dates from the block
        ...(exactDateMatch && bid && {
          bid: bid,
          exactDateMatch: true,
        }),
      };

      console.log({guidedTourParams,action,misc:this.misc});
      
       this.dispatch(setBlkTravellersInfo({
        rmTvlG: action?.rmTvlG,
        rstTvlG: action?.rstTvlG.tvlA,
      }));
      this.dispatch(setGuidedTourUpdateRoom(false));
      this.dispatch(clearUpdateJourneyResponse())
      this.dispatch(
        setGuidedTourParams(guidedTourParams as any)
      );
      this.dispatch(
        setGuidedTourListInfo({
          dayNum: this.misc?.dayNum,
          bid: bid, // Store bid in guidedTourListInfo for use in fetchGuidedTours
        } as any)
      );
      this.dispatch(setLayoutsetting("comparison"));
      this.dispatch(setFdOpen(true));
    }
  }
  handleRemove(action: Action): void {
    // Check if this is an FD removal with options (SHIFT_DATES or ADD_SELF_BOOKED_TOUR)
    // FD removal actions have addPrms.actions array with options
    const hasFDRemoveOptions = action.addPrms?.actions && Array.isArray(action.addPrms.actions) && action.addPrms.actions.length > 0;
    const additionalParams = (action as any).additionalParams;
    const hasFDAdditionalParams = additionalParams && (additionalParams.option === "SHIFT_DATES" || additionalParams.option === "ADD_SELF_BOOKED_TOUR");
    
    // If this is an FD removal (has options or additionalParams), handle as FD removal
    if (hasFDRemoveOptions || hasFDAdditionalParams) {
      const updatePayload: any = {
        type: "FD_REMOVE",
        ctype: action.ctype,
        date: this.misc?.date,
        tvlG: this.misc?.rmTvlG,
        blockId: this.misc?.blockId,
        dayNum: this.misc?.dayNum,
      };

      // Pass additionalParams if present (contains option and selfBookedTourData)
      if (additionalParams) {
        updatePayload.additionalParams = additionalParams;
      }

      this.updateJourney([updatePayload] as any);
      return;
    }

    // Check if this is a self-booked tour removal
    // Priority: 1) isSelfBookedTourBlock flag, 2) cityKey in action.addPrms, 3) cityKey in misc
    const isSelfBookedTourBlock = this.misc?.isSelfBookedTourBlock || action.addPrms?.isSelfBookedTour;
    const cityKeyFromAction = action.addPrms?.cityKey;
    const cityKeyFromMisc = this.misc?.cityKey;
    
    // Determine if this is a self-booked tour removal
    // Only treat as self-booked tour if explicitly flagged OR has cityKey without FD options
    const isSelfBookedTourRemoval = isSelfBookedTourBlock || (cityKeyFromAction && !hasFDRemoveOptions) || (cityKeyFromMisc && !hasFDRemoveOptions);
    const removeCityKey = cityKeyFromAction || cityKeyFromMisc;
    
    if (isSelfBookedTourRemoval && removeCityKey) {
      this.updateJourney([
        {
          type: "SELF_BOOKED_TOUR_REMOVE",
          cityKey: removeCityKey,
        },
      ] as any);
      return;
    } else if (isSelfBookedTourRemoval && !removeCityKey) {
      console.warn("[GuidedTourActionHandler] Self-booked tour removal detected but no cityKey found", {
        cityKeyFromAction,
        cityKeyFromMisc,
        isSelfBookedTourBlock,
        actionAddPrms: action.addPrms,
        misc: this.misc,
        action,
      });
      // Still try to proceed with self-booked tour removal if we have blockId
      // The backend might be able to find the cityKey from the block
      if (this.misc?.blockId) {
        console.warn("[GuidedTourActionHandler] Attempting removal with blockId only", {
          blockId: this.misc.blockId,
        });
        // Note: This might not work if backend requires cityKey, but worth trying
        // In practice, the backend should always provide cityKey in addPrms
      }
    }

    // Fallback: Regular FD removal (no options selected yet, but it's an FD block)
    const updatePayload: any = {
        type: "FD_REMOVE",
        ctype: action.ctype,
        date: this.misc?.date,
        tvlG: this.misc?.rmTvlG,
        blockId: this.misc?.blockId,
        dayNum: this.misc?.dayNum,
    };

    // Pass additionalParams if present (contains option and selfBookedTourData)
    if (additionalParams) {
      updatePayload.additionalParams = additionalParams;
    }

    this.updateJourney([updatePayload] as any);
  }

  handleRemoveFDOptional(action: Action): void {
    // Get the card ID from the action's otherData or cardData
    // The backend expects cardData.id to identify which optional to remove
    const cardId = this.misc?.cdid || action?.otherData?.cardId || action?.cardData?.id;
    
    if (!cardId) {
      console.error("Card ID is required to remove FD optional");
      return;
    }

    this.updateJourney([
      {
        type: "FD_OPTIONAL_REMOVE", // Use JourneyUpdateType.FD_OPTIONAL_REMOVE
        ctype: action.ctype,
        date: this.misc?.date,
        tvlG: action?.tvlG,
        blockId: this.misc?.blockId,
        cardData: {
          id: cardId,
        },
        dayNum: this.misc?.dayNum,
      },
    ] as any);
  }

  handleChnageRoomFD(action: Action): void {
    console.log({action},{misc:this.misc});
     this.dispatch(
        setGuidedTourParams({
          jid: this.misc.jid,
          searchDate: this.misc?.date,
          tvlrKeys: action?.rmTvlG,
          dayNum: this.misc?.dayNum,
          // rmTvlG: action?.rmTvlG,
          // rstTvlG: action?.rstTvlG.tvlA,
          bid: this.misc?.bid,
        } as any)
      );
      this.dispatch(clearUpdateJourneyResponse())
       this.dispatch(setBlkTravellersInfo({
        rmTvlG: action?.rmTvlG,
        rstTvlG: action?.rstTvlG.tvlA,
      }));
      if(this.misc?.selectedTourId){
        this.dispatch(setSelectedTourId(this.misc?.selectedTourId))
      }
      this.dispatch(setLayoutsetting("details"));
      this.dispatch(setFdOpen(true));
      this.dispatch(setGuidedTourUpdateRoom(true));
  }
}