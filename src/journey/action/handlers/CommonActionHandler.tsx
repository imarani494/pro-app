import { openAdvisoryCommentModal, openMarkupDiscountModal, openTextSummaryModal, openWhatsappSummaryModal, openWhatsappLinkModal, openEmailJourneyModal, openCustomInclusionsModal, openJourneyHistoryModal, openWhatChangedModal, setOpenConfirmDialog, setViewTravellersSidebar, resetJourneyHistory } from "@/journey/redux/journeySlice";
import { setJourneyModalOpen } from "@/journey/create/redux/customTripSlice";
import { ActionType } from "@/contentCard/types/contentCard";
import { AppDispatch } from "../../../../shared/lib/store";
import { Action } from "../../../types/journey";
import { ActionMiscData } from "../types/actionTypes";
import { cloneJourney } from "@/shared/redux/webAppConfigSlice";

export class CommonActionHandler {
  constructor(
    private dispatch: AppDispatch,
    private misc: ActionMiscData,
    private updateJourney: (items?: any[], request?: any) => Promise<any>
  ) { }

  handleAdd(action: Action): void { }
  handleRemove(action: any): void {
    this.updateJourney([
      {
        type: ActionType.ADVISOR_COMMENT_REMOVE,
        tvlG: action?.tvlG,
        blockId: this.misc?.blockId,
        dayNum: this.misc?.dayNum,
      },
    ] as any);
  }
  handleAddAdvisoryComments(action: Action): void {
    this.dispatch(
      openAdvisoryCommentModal({
        status: true,
        data: this.misc,
      })
    );
  }

  handleAddCustomIncusions(action: Action): void {
    this.dispatch(
      openCustomInclusionsModal({
        status: true,
        data: {
          ...this.misc,
          ...action,
        },
      })
    );
  }

  handleUpdateMarkupDiscount(action: Action): void {
    this.dispatch(
      openMarkupDiscountModal({
        status: true,
        data: action?.otherData,
      })
    ) as any;
  }

  handleRemoveCustomInclusions(action: Action): void {
    this.updateJourney([
      {
        type: ActionType.CUSTOM_INCLUSION_REMOVE,
        ctype: action?.ctype,
        date: this.misc?.date,
        blockId: this.misc?.blockId,
        dayNum: this.misc?.dayNum,
        // tvlG: action?.tvlG,
      }
    ] as any);
  }

  handleTextSummary(action: Action): void {
    this.dispatch(
      openTextSummaryModal({
        status: true,
        data: action,
      })
    );
  }
  handleWhatsappSummary(action: Action): void {
    this.dispatch(
      openWhatsappSummaryModal({
        status: true,
        data: action,
      })
    );
  }
  handleWhatsappLink(action: Action): void {
    this.dispatch(
      openWhatsappLinkModal({
        status: true,
        data: action,
      })
    );
  }
  handleShowEmailJourney(action: Action): void {
    this.dispatch(
      openEmailJourneyModal({
        status: true,
        data: action,
      })
    );
  }

  handleJourneyHistory(action: Action): void {
    this.dispatch(resetJourneyHistory());
    this.dispatch(
      openJourneyHistoryModal({
        status: true,
        data: action,
      })
    );
  }

  handleEditTravelDetails(action: Action): void {
    this.dispatch(setJourneyModalOpen({ isOpen: true, mode: "EDIT" }));
  }

  handleWhatChanged(action: Action): void {
    this.dispatch(
      openWhatChangedModal({
        status: true,
        data: action,
      })
    );
  }
  handleUpdateRequest(action: Action): void {
    this.updateJourney([], action.updReq);
  }

  handleViewTravellers(action: Action): void {
    this.dispatch(
      setViewTravellersSidebar({
        open: true,
        isEditable: action?.otherData?.isEditable || false,
      })
    )
  }

  async handleCloneJourney(action: Action): Promise<void> {
    const response = await this.dispatch(
      cloneJourney({
        jid: this?.misc?.jid,
      }) as any
    );
    const url = response?.payload?._data?.jurl;
    if (action?.otherData?.confirm) {
      this.dispatch(
        setOpenConfirmDialog({
          open: true,
          message: "Journey copied successfully! Do you want to open in a new window?",
          url: url,
        })
      );
    } else {
      window.open(url, "_blank");
    }
  }
}