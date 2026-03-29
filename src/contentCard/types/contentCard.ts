// Content Card API Response Types
export interface ContentCardSlot {
  isAvl: boolean;
  start: string;
  end: string;
  id: number;
}

export interface ContentCardCategory {
  t: string;
  v: string;
  n: string;
}

export interface ContentCardTransferLocation {
  st: string;
  nm: string;
}

export interface ContentCardPrice {
  prc: number;
  prcD: string;
}

export interface ContentCardItem {
  dur: number;
  slots: ContentCardSlot[];
  ctagA: ContentCardCategory[];
  dsc: string;
  txpL: ContentCardTransferLocation;
  price: ContentCardPrice;
  name: string;
  id: number;
  addOnA: any[];
  validity: any;
  inTA: string[];
  ntA: string[];
  exTA: string[];
  tvlG?: any;
}

export interface ContentCardDetails {
  subGroupId: string;
  img: string;
  price: ContentCardPrice;
  name: string;
  id: string;
  items: ContentCardItem[];
  desc: string;
  incA: any[];
}

export interface ContentCardApiResponse {
  success: boolean;
  response_ref: string;
  _data: {
    rt: string;
    item: ContentCardDetails;
    type: string;
  };
}

// Component Props Types
export interface TravellerInfo {
  initials: string;
  name: string;
  color: string;
}

export interface FilterSelections {
  [ticketId: number]: {
    level: string;
    hours: string;
    transfer: string;
  };
}

export interface GlobalFilters {
  level: string;
  hours: string;
  transfer: string;
}

export interface ContentCardDetailProps {
  onShowDetailView?: (ticketId: number) => void;
}

export enum ContentCardQueryType {
  LISTINGS = 'LISTINGS',
  DETAIL = 'DETAIL',
  OPTION_DETAIL = 'OPTION_DETAIL',
  GROUP_LISTINGS = 'GROUP_LISTINGS',
}

export enum ContentCardType {
  SIGHTSEEING = 'SIGHTSEEING',
  TRANSFERS = 'TRANSFERS',
  MEAL_COUPONS = 'MEAL_COUPONS',
  VISA = 'VISA',
  TRAVEL_INSURANCE = 'TRAVEL_INSURANCE',
  TRAVEL_PASS = 'TRAVEL_PASS',
  HOTEL_ROOM = 'HOTEL_ROOM',
  TRAIN = 'TRAIN',
  FLIGHT = 'FLIGHT',
  STAY_EXTRA_SERVICE = 'STAY_EXTRA_SERVICE',
  HOTEL_EXTRAS = 'HOTEL_EXTRAS',
  ROAD_VEHICLE = 'ROAD_VEHICLE',
  ATTRACTION_TICKET = 'ATTRACTION_TICKET',
  ITINERARY = 'ITINERARY',
}

export enum ActionType {
  ADD = 'ADD',
  ADD_MULTICITY = 'ADD_MULTICITY',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
  ADD_FD_OPTIONAL = 'ADD_FD_OPTIONAL',
  REMOVE_FD_OPTIONAL = 'REMOVE_FD_OPTIONAL',
  STAY_LOOKUP = 'STAY_LOOKUP',
  ROOM_CHANGE = 'ROOM_CHANGE',
  SELF_BOOKED_TRANSPORT_ADD = 'SELF_BOOKED_TRANSPORT_ADD',
  EARLY_CHECKIN_OPTIONS = 'EARLY_CHECKIN_OPTIONS',
  LATE_CHECKOUT_OPTIONS = 'LATE_CHECKOUT_OPTIONS',
  ADD_MANUAL_FLIGHT = 'ADD_MANUAL_FLIGHT',
  ADVISOR_COMMENT = 'ADVISOR_COMMENT',
  ADD_TRANSPORTSTAY = 'ADD_TRANSPORTSTAY',
  ADD_MANUAL_HOTEL = 'ADD_MANUAL_HOTEL',
  ADD_CUSTOM_INCLUSION = 'ADD_CUSTOM_INCLUSION',
  TRANSPORT_ADD_ONS = 'TRANSPORT_ADD_ONS',
  ADVISOR_COMMENT_REMOVE = 'ADVISOR_COMMENT_REMOVE',
  ADVISOR_COMMENT_UPDATE = 'ADVISOR_COMMENT_UPDATE',
  MARKUP_DISCOUNT_UPDATE = 'MARKUP_DISCOUNT_UPDATE',
  MARKUP_UPDATE = 'MARKUP_UPDATE',
  REMOVE_CUSTOM_INCLUSION = 'REMOVE_CUSTOM_INCLUSION',
  TEXT_SUMMARY = 'TEXT_SUMMARY',
  WHATSAPP_SUMMARY = 'WHATSAPP_SUMMARY',
  WHATSAPP_LINK = 'WHATSAPP_LINK',
  EMAIL_JOURNEY = 'EMAIL_JOURNEY',
  JOURNEY_HISTORY = 'JOURNEY_HISTORY',
  EDIT_TRAVEL_DETAILS = 'EDIT_TRAVEL_DETAILS',
  WHAT_CHANGED = 'WHAT_CHANGED',
  SELF_BOOKED_STAY = 'SELF_BOOKED_STAY',
  CUSTOM_INCLUSION_UPDATE = 'CUSTOM_INCLUSION_UPDATE',
  CUSTOM_INCLUSION_REMOVE = 'CUSTOM_INCLUSION_REMOVE',
  SELF_BOOKED_TRANSPORT_UPDATE = 'SELF_BOOKED_TRANSPORT_UPDATE',
  UPDATE_REQUEST = 'UPDATE_REQUEST',
  CLONE_JOURNEY = 'CLONE_JOURNEY',
  FD_UPDATE_ROOM = 'FD_UPDATE_ROOM',
  VIEW_TRAVELER_DETAILS = 'VIEW_TRAVELER_DETAILS',
}

export enum ContentCardExecuteType {
  CONTENT_REMOVE = 'CONTENT_REMOVE',
  CONTENT_ADD = 'CONTENT_ADD',
  CAR_RENTAL_REMOVE = 'CAR_RENTAL_REMOVE',
}

export enum JourneyUpdateType {
  FD_OPTIONAL_ADD = 'FD_OPTIONAL_ADD',
  FD_OPTIONAL_REMOVE = 'FD_OPTIONAL_REMOVE',
}

export enum HotelCardExecuteType {
  STAY_REMOVE = 'STAY_REMOVE',
}

export enum FlightCardExecuteType {
  FLIGHTS_UPDATE = 'FLIGHTS_UPDATE',
  TRANSPORT_REMOVE = 'TRANSPORT_REMOVE',
  TRANSPORT_UPDATE = 'TRANSPORT_UPDATE',
  TRANSPORT_EARLY_CHECKIN = 'TRANSPORT_EARLY_CHECKIN',
  TRANSPORT_LATE_CHECKOUT = 'TRANSPORT_LATE_CHECKOUT',
}

export enum miscExecuteType {
  META = 'META',
  UPDATE = 'UPDATE',
}

export interface ContentCardExecuteActionItem {
  type: ContentCardExecuteType;
  ctype: ContentCardType;
  date: string;
  tvlG: any | null;
  blockId: string | null;
}
