import {ActionType} from '../../../contentCard/types/contentCard';
import {Action, ContentCardType} from '../../types/journey';

type ActionExecutor = (
  action: Action,
  handlers: any,
  setState: (open: boolean) => void,
) => void;

const ACTION_EXECUTORS: Record<string, ActionExecutor> = {
  //Flight
  [`${ActionType.ADD}_FLIGHT`]: (action, handlers) =>
    handlers.flight.handleAdd(action),

  [`${ActionType.ADD_MULTICITY}_FLIGHT`]: (action, handlers) =>
    handlers.flight.handleAddMulticity(action),

  [`${ActionType.UPDATE}_FLIGHT`]: (action, handlers) =>
    handlers.flight.handleAdd(action),

  [ActionType.EARLY_CHECKIN_OPTIONS]: (action, handlers) =>
    handlers.flight.handleEarlyCheckIn(action),

  [ActionType.LATE_CHECKOUT_OPTIONS]: (action, handlers) =>
    handlers.flight.handleLateCheckOut(action),

  [ActionType.ADD_MANUAL_FLIGHT]: (action, handlers) =>
    handlers.flight.handleAddManual(action),

  [ActionType.SELF_BOOKED_TRANSPORT_ADD]: (action, handlers) =>
    handlers.flight.handleSelfBooking(action),

  [ActionType.SELF_BOOKED_TRANSPORT_UPDATE]: (action, handlers) =>
    handlers.flight.handleSelfBooking(action),

  [`${ActionType.REMOVE}_FLIGHT`]: (action, handlers) =>
    handlers.flight.handleRemove(action),

  [`${ActionType.REMOVE}_TRANSPORT`]: (action, handlers) =>
    handlers.flight.handleRemove(action),

  [`${ActionType.TRANSPORT_ADD_ONS}_FLIGHT`]: (action, handlers) =>
    handlers.flight.handleAddOn(action),

  // Hotel
  [`${ActionType.ADD}_HOTEL_ROOM`]: (action, handlers) =>
    handlers.hotel.handleAdd(action),

  [`${ActionType.UPDATE}_HOTEL_ROOM`]: (action, handlers) =>
    handlers.hotel.handleAdd(action),

  [`${ActionType.REMOVE}_HOTEL_ROOM`]: (action, handlers) =>
    handlers.hotel.handleRemove(action),

  [ActionType.ROOM_CHANGE]: (action, handlers) =>
    handlers.hotel.handleRoomChange(action),

  [ActionType.ADD_MANUAL_HOTEL]: (action, handlers) =>
    handlers.hotel.handleAddManual(action),

  [ActionType.SELF_BOOKED_STAY]: (action, handlers) =>
    handlers.hotel.handleSelfBookedStay(action),

  [ActionType.STAY_LOOKUP]: (action, handlers) =>
    handlers.hotel.handleLookUPHotel(action),

  // Car Rental
  [`${ActionType.ADD}_CAR_RENTAL`]: (action, handlers) =>
    handlers.car.handleAdd(action),
  [`${ActionType.UPDATE}_CAR_RENTAL`]: (action, handlers) =>
    handlers.car.handleAdd(action),
  [`${ActionType.REMOVE}_CAR_RENTAL`]: (action, handlers) =>
    handlers.car.handleRemove(action),
  // Guided Tour
  [`${ActionType.ADD}_FIXED_PACKAGE`]: (action, handlers) =>
    handlers.guidedTour.handleAdd(action),
  [`${ActionType.UPDATE}_FIXED_PACKAGE`]: (action, handlers) =>
    handlers.guidedTour.handleAdd(action),
  [ActionType.ADD_FD_OPTIONAL]: (action, handlers) =>
    handlers.guidedTour.handleAdd(action),
  [ActionType.REMOVE_FD_OPTIONAL]: (action, handlers) =>
    handlers.guidedTour.handleRemoveFDOptional(action),
  [`${ActionType.REMOVE}_FIXED_PACKAGE`]: (action, handlers) =>
    handlers.guidedTour.handleRemove(action),
  [`${ActionType.FD_UPDATE_ROOM}`]: (action, handlers) =>
    handlers.guidedTour.handleChnageRoomFD(action),

  // Content Card
  [`${ActionType.ADD}_${ContentCardType.SIGHTSEEING}`]: (action, handlers) =>
    handlers.contentCard.handleAdd(action),

  [`${ActionType.ADD}_${ContentCardType.TRANSFERS}`]: (action, handlers) =>
    handlers.contentCard.handleAdd(action),

  [`${ActionType.ADD}_${ContentCardType.MEAL_COUPONS}`]: (action, handlers) =>
    handlers.contentCard.handleAdd(action),

  [`${ActionType.ADD}_${ContentCardType.VISA}`]: (action, handlers) =>
    handlers.contentCard.handleAdd(action),

  [`${ActionType.ADD}_${ContentCardType.TRAVEL_INSURANCE}`]: (
    action,
    handlers,
  ) => handlers.contentCard.handleAdd(action),

  [`${ActionType.ADD}_${ContentCardType.TRAVEL_PASS}`]: (action, handlers) =>
    handlers.contentCard.handleAdd(action),

  [`${ActionType.UPDATE}_${ContentCardType.SIGHTSEEING}`]: (action, handlers) =>
    handlers.contentCard.handleAdd(action),

  [`${ActionType.UPDATE}_${ContentCardType.TRANSFERS}`]: (action, handlers) =>
    handlers.contentCard.handleAdd(action),

  [`${ActionType.UPDATE}_${ContentCardType.MEAL_COUPONS}`]: (
    action,
    handlers,
  ) => handlers.contentCard.handleAdd(action),

  [`${ActionType.UPDATE}_${ContentCardType.VISA}`]: (action, handlers) =>
    handlers.contentCard.handleAdd(action),

  [`${ActionType.UPDATE}_${ContentCardType.TRAVEL_INSURANCE}`]: (
    action,
    handlers,
  ) => handlers.contentCard.handleAdd(action),

  [`${ActionType.UPDATE}_${ContentCardType.TRAVEL_PASS}`]: (action, handlers) =>
    handlers.contentCard.handleAdd(action),

  [`${ActionType.REMOVE}_${ContentCardType.SIGHTSEEING}`]: (action, handlers) =>
    handlers.contentCard.handleRemove(action),

  [`${ActionType.REMOVE}_${ContentCardType.TRANSFERS}`]: (action, handlers) =>
    handlers.contentCard.handleRemove(action),

  [`${ActionType.REMOVE}_${ContentCardType.MEAL_COUPONS}`]: (
    action,
    handlers,
  ) => handlers.contentCard.handleRemove(action),

  [`${ActionType.REMOVE}_${ContentCardType.VISA}`]: (action, handlers) =>
    handlers.contentCard.handleRemove(action),

  [`${ActionType.REMOVE}_${ContentCardType.TRAVEL_INSURANCE}`]: (
    action,
    handlers,
  ) => handlers.contentCard.handleRemove(action),

  [`${ActionType.REMOVE}_${ContentCardType.TRAVEL_PASS}`]: (action, handlers) =>
    handlers.contentCard.handleRemove(action),

  [`${ActionType.ADD}_${ContentCardType.STAY_EXTRA_SERVICE}`]: (
    action,
    handlers,
  ) => handlers.contentCard.handleAdd(action),

  [`${ActionType.ADD}_${ContentCardType.HOTEL_EXTRAS}`]: (action, handlers) =>
    handlers.contentCard.handleAdd(action),

  [`${ActionType.ADD}_${ContentCardType.ROAD_VEHICLE}`]: (action, handlers) =>
    handlers.contentCard.handleAdd(action),

  [`${ActionType.UPDATE}_${ContentCardType.ROAD_VEHICLE}`]: (
    action,
    handlers,
  ) => handlers.contentCard.handleAdd(action),

  [`${ActionType.REMOVE}_${ContentCardType.ROAD_VEHICLE}`]: (
    action,
    handlers,
  ) => handlers.contentCard.handleRemove(action),

  [`${ActionType.REMOVE}_${ContentCardType.ATTRACTION_TICKET}`]: (
    action,
    handlers,
  ) => handlers.contentCard.handleRemove(action),

  [`${ActionType.ADD}_${ContentCardType.ATTRACTION_TICKET}`]: (
    action,
    handlers,
  ) => handlers.contentCard.handleAdd(action),

  [`${ActionType.UPDATE}_${ContentCardType.ATTRACTION_TICKET}`]: (
    action,
    handlers,
  ) => handlers.contentCard.handleAdd(action),

  // ADVISOR_COMMENT

  [`${ActionType.ADVISOR_COMMENT}`]: (action, handlers) =>
    handlers.common.handleAddAdvisoryComments(action),

  [`${ActionType.ADVISOR_COMMENT_REMOVE}`]: (action, handlers) =>
    handlers.common.handleRemove(action),

  // CUSTOM_INCLUSION_UPDATE
  [`${ActionType.ADD_CUSTOM_INCLUSION}`]: (action, handlers) =>
    handlers.common.handleAddCustomIncusions(action),

  [`${ActionType.REMOVE_CUSTOM_INCLUSION}`]: (action, handlers) =>
    handlers.common.handleRemoveCustomInclusions(action),

  [`${ActionType.MARKUP_DISCOUNT_UPDATE}`]: (action, handlers) =>
    handlers.common.handleUpdateMarkupDiscount(action),

  //Right Side Journey
  [`${ActionType.TEXT_SUMMARY}`]: (action, handlers) =>
    handlers.common.handleTextSummary(action),

  [`${ActionType.UPDATE_REQUEST}`]: (action, handlers) =>
    handlers.common.handleUpdateRequest(action),

  [`${ActionType.WHATSAPP_SUMMARY}`]: (action, handlers) =>
    handlers.common.handleWhatsappSummary(action),

  [`${ActionType.WHATSAPP_LINK}`]: (action, handlers) =>
    handlers.common.handleWhatsappLink(action),

  // [`${ActionType.REMOVE}_HOTEL_EXTRA`]: (action, handlers) =>
  //   handlers.hotel.handleRemoveAddOn(action),

  [`${ActionType.VIEW_TRAVELER_DETAILS}`]: (action, handlers) =>
    handlers.common.handleViewTravellers(action),

  [`${ActionType.REMOVE}_${ContentCardType.HOTEL_EXTRAS}`]: (
    action,
    handlers,
  ) => handlers.hotel.handleRemoveAddOn(action),
  // Transfer Stay - Update this line
  [`${ActionType.ADD}_TRANSPORTSTAY`]: (action, handlers) =>
    handlers.transferStay.handleAdd(action),
  // Add other transfer stay actions if needed
  [`${ActionType.UPDATE}_TRANSPORTSTAY`]: (action, handlers) =>
    handlers.transferStay.handleUpdate(action),
  [`${ActionType.REMOVE}_TRANSPORTSTAY`]: (action, handlers) =>
    handlers.transferStay.handleRemove(action),
  [`${ActionType.EMAIL_JOURNEY}`]: (action, handlers) =>
    handlers.common.handleShowEmailJourney(action),
  [`${ActionType.JOURNEY_HISTORY}`]: (action, handlers) =>
    handlers.common.handleJourneyHistory(action),
  [`${ActionType.EDIT_TRAVEL_DETAILS}`]: (action, handlers) =>
    handlers.common.handleEditTravelDetails(action),
  [`${ActionType.WHAT_CHANGED}`]: (action, handlers) =>
    handlers.common.handleWhatChanged(action),

  // ITINERARY

  [`${ActionType.UPDATE}_${ContentCardType.ITINERARY}`]: (action, handlers) =>
    handlers.contentCard.handleAdd(action),

  // Copy Journey
  [`${ActionType.CLONE_JOURNEY}`]: (action, handlers) =>
    handlers.common.handleCloneJourney(action),

  [`${ActionType.REMOVE}_${ContentCardType.STAY_EXTRA_SERVICE}`]: (
    action,
    handlers,
  ) => handlers.stayExtraService.handleRemove(action),
};

export function executeAction(
  action: Action,
  handlers: any,
  setDialogOpen: (open: boolean) => void,
): void {
  const key = `${action.type}_${action.ctype}`;
  const executor = ACTION_EXECUTORS[key] ?? ACTION_EXECUTORS[action.type];
  if (executor) {
    executor(action, handlers, setDialogOpen);
  } else {
    console.warn(`No executor found for action type: ${action.type}`);
  }
}
