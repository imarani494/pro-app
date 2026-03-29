import {CitySuggestion} from '../create/redux/customTripSlice';
import {DyA} from '../types/journey';

/**
 * Data structure for self-booked tour form input (used in creation flow)
 */
export interface SelfBookedTourData {
  city: CitySuggestion;
  title: string;
  description: string;
  exitCityId?: number;
  nights: number;
}

/**
 * Data structure for self-booked tour info (parsed from journey data)
 */
export interface SelfBookedTourInfo {
  cky: string;
  title: string;
  description?: string;
  cityId: number;
  cityName: string;
  nights: number;
  exitCityId?: number;
}

export interface SelfBookedTourDayGroup {
  tourInfo: SelfBookedTourInfo;
  startDayIndex: number;
  endDayIndex: number;
  days: DyA[];
  startDate: string;
  endDate: string;
}

/**
 * Parse self-booked tours from cities array (sbTr embedded in each city)
 * and create a map of cityKey -> tour info
 */
export function parseSelfBookedTours(
  cities: any[] | undefined,
): Map<string, SelfBookedTourInfo> {
  const tourMap = new Map<string, SelfBookedTourInfo>();

  if (!cities || !Array.isArray(cities)) {
    return tourMap;
  }

  cities.forEach((city: any) => {
    if (city.cky && city.sbTr) {
      const tourInfo: SelfBookedTourInfo = {
        cky: String(city.cky),
        title: city.sbTr.ttl || city.sbTr.title || 'Self-Booked Tour',
        description: city.sbTr.dsc || city.sbTr.description,
        cityId: city.c || city.cid || 0,
        cityName: city.cnm || city.nm || city.name || '',
        nights: city.sbTr.nt || city.sbTr.nights || city.n || city.nt || 0,
        exitCityId: city.sbTr.ecid || city.sbTr.exitCityId,
      };
      tourMap.set(String(city.cky), tourInfo);
    }
  });

  return tourMap;
}

/**
 * Get self-booked tour info for a day
 * Checks both day.cky and BASE blocks with isSelfBookedTour flag
 */
function getSelfBookedTourInfo(
  day: DyA,
  tourMap: Map<string, SelfBookedTourInfo>,
): SelfBookedTourInfo | null {
  // First, try to get from day.cky
  if (day.cky) {
    const tourInfo = tourMap.get(day.cky);
    if (tourInfo) {
      return tourInfo;
    }
  }

  // Also check BASE blocks in the day for self-booked tour blocks
  if (day.blkA && Array.isArray(day.blkA)) {
    for (const block of day.blkA) {
      if (block.typ === 'BASE' && block.isSelfBookedTour) {
        const cityKey = block.cityKey || block.cky;
        if (cityKey) {
          const tourInfo = tourMap.get(String(cityKey));
          if (tourInfo) {
            return tourInfo;
          }
        }
      }
    }
  }

  return null;
}

/**
 * Group consecutive days that belong to the same self-booked tour
 */
export function groupSelfBookedTourDays(
  days: DyA[],
  tourMap: Map<string, SelfBookedTourInfo>,
): SelfBookedTourDayGroup[] {
  const groups: SelfBookedTourDayGroup[] = [];
  let currentGroup: SelfBookedTourDayGroup | null = null;

  if (!days || days.length === 0) {
    return groups;
  }

  days.forEach((day, index) => {
    const tourInfo = getSelfBookedTourInfo(day, tourMap);

    if (tourInfo) {
      // Check if this day continues the current group
      if (currentGroup && currentGroup.tourInfo.cky === tourInfo.cky) {
        // Continue the current group
        currentGroup.endDayIndex = index;
        currentGroup.days.push(day);
        currentGroup.endDate = day.date;
      } else {
        // Start a new group
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          tourInfo,
          startDayIndex: index,
          endDayIndex: index,
          days: [day],
          startDate: day.date,
          endDate: day.date,
        };
      }
    } else {
      // Not a self-booked tour day - close current group if exists
      if (currentGroup) {
        groups.push(currentGroup);
        currentGroup = null;
      }
    }
  });

  // Don't forget the last group
  if (currentGroup) {
    groups.push(currentGroup);
  }

  return groups;
}

/**
 * Format date range for display
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const formatDate = (dateString: string) => {
    const [yyyy, mm, dd] = dateString.split('-').map(Number);
    const d = new Date(Date.UTC(yyyy, mm - 1, dd));
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const dayName = dayNames[d.getUTCDay()];
    const day = d.getUTCDate().toString().padStart(2, '0');
    const month = months[d.getUTCMonth()];

    return `${dayName}, ${day} ${month}`;
  };

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (startDate === endDate) {
    return start;
  }

  return `${start} - ${end}`;
}
