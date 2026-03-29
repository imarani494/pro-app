export interface IGuidedTourDetailsResponse {
  success: boolean;
  response_ref: string;
  _data: Data;
}

export interface Data {
  pkgDetails: PkgDetails;
  pkgAvailability: PkgAvailability;
}

export interface PkgAvailability {
  dtA: DtA[];
  prcQ: string;
  prcO: PrcO;
  tNts: number;
  sltdDt: string;
}

export interface DtA {
  dt: string;
  prc: number;
  avl: boolean;
  prcD: string;
  cls: string;
  ttl: string;
  prcQ: string;
}

export interface PrcO {
  prcD: string;
}

export interface IinclusionsByCity{
  [key: string]: string[];
}
export interface PkgDetails {
  title: string;
  nights: number;
  days: number;
  description: string;
  highlights: string[];
  id: number;
  termsConditions: string[];
  itineraryDays: ItineraryDay[];
  images: Images;
  departure: Departure;
  exclusions: any[];
  itinerary: string;
  packageUrl: string;
  cityList: CityList[];
  mealsIncluded: string;
  whatToExpect: any[];
  categories: any[];
  inclusionsByCity:IinclusionsByCity;
}

export interface CityList {
  cityName: string;
  numNights: number;
  starRating: number;
  hotelName: string;
  roomName: string;
  mealPlan: string;
  hotelImageURL: string;
}

export interface Departure {
  startDate: Date;
  endDate: Date;
  priceDisplay: string;
}

export interface Images {
  bannerLarge: string[];
  bannerSmall: string[];
}

export interface ItineraryDay {
  dayNumber: number;
  location: string;
  title: string;
  description: string;
  dayImageURL: string;
}
