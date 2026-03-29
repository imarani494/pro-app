export type ActivityType =
  | 'flight'
  | 'transfer'
  | 'hotel'
  | 'activity'
  | 'meals'
  | 'train'
  | 'ship'
  | 'sightseeing'
  | 'no-flight'
  | 'no-stay'
  | 'not-joined'
  | 'joins-day'
  | 'leaves-journey'
  | 'no-activity'
  | 'add-flight'
  | 'add-hotel'
  | 'car-rental'
  | 'itinerary'
  | 'fixed-package'
  | 'road-transport'
  | 'selfBookedTour';

export type ActivityStatus =
  | 'private'
  | 'shared'
  | 'joining'
  | 'leaving'
  | 'info'
  | 'flight-add'
  | 'hotel-add';

export interface Activity {
  id: string;
  type: ActivityType;
  status: ActivityStatus;
  blk: any;
  title: string;
  subtitle?: string;
  time?: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
  isShared?: boolean;
  sharedLabel?: string;
  blockId?: string;
  actions?: any[];
  isMatched?: boolean;
  txpT?: string;
  warning?: boolean;
}

export interface TravelerDay {
  travelerId: string;
  activities: Activity[];
}

export interface ActivityRow {
  rowId: string;
  activityKey: string;
  activityType: ActivityType;
  referenceActivity: Activity;
  travelerActivities: Record<string, Activity | null>;
  time?: string;
  title: string;
}
export interface ActivityRow {
  rowId: string;
  activityKey: string;
  referenceActivity: Activity;
  travelerActivities: Record<string, Activity | null>;
}

export interface DayInfo {
  dayNumber: number;
  actions: any[];
  date: string;
  location: string;
  travelers: TravelerDay[];
  activityRows?: ActivityRow[];
}

export interface Traveler {
  id: string;
  name: string;
  initials: string;
  color: string;
}
