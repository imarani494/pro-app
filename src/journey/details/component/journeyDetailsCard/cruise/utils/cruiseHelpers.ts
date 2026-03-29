import {TravelerInfo, RefundabilityStatus} from '../types/CruiseTypes';

/**
 * Extract travelers from paxes data
 * @param paxes - Paxes object from API
 * @returns Array of traveler info objects
 */
export const getTravelersFromPaxes = (paxes: {
  rooms: Array<{
    ad: number;
    ch: number;
    chAge: number[];
  }>;
}): TravelerInfo[] => {
  const travelers: TravelerInfo[] = [];
  let adultIndex = 0;
  let childIndex = 0;

  paxes.rooms.forEach(room => {
   
    for (let i = 0; i < room.ad; i++) {
      travelers.push({
        id: `T_ADULT_${adultIndex++}`,
        type: 'Adult',
      });
    }
   
    for (let i = 0; i < room.ch; i++) {
      travelers.push({
        id: `T_CHILD_${childIndex++}`,
        type: 'Child',
      });
    }
  });

  return travelers;
};

/**
 * Format cruise date from DD/MM/YYYY to DD MMM YYYY
 * @param dateStr - Date string in DD/MM/YYYY format
 * @returns Formatted date string
 */
export const formatCruiseDate = (dateStr: string): string => {
  try {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(+year, +month - 1, +day);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

/**
 * Calculate number of nights between check-in and check-out
 * @param chkIn - Check-in date (DD/MM/YYYY)
 * @param chkOut - Check-out date (DD/MM/YYYY)
 * @returns Number of nights
 */
export const calculateNights = (chkIn: string, chkOut: string): number => {
  try {
    const [inDay, inMonth, inYear] = chkIn.split('/').map(Number);
    const [outDay, outMonth, outYear] = chkOut.split('/').map(Number);
    const checkInDate = new Date(inYear, inMonth - 1, inDay);
    const checkOutDate = new Date(outYear, outMonth - 1, outDay);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch {
    return 0;
  }
};

/**
 * Extract amenities from HTML description
 * @param htmlDesc - HTML description string
 * @returns Array of amenity strings
 */
export const extractAmenities = (htmlDesc: string): string[] => {
  const amenities: string[] = [];
  const lines = htmlDesc.split('<br>');
  
  lines.forEach(line => {
    const cleaned = line.replace(/<[^>]*>/g, '').trim();
    if (cleaned && cleaned.startsWith('•')) {
      amenities.push(cleaned.substring(1).trim());
    }
  });
  
  return amenities;
};

/**
 * Determine refundability status from room key
 * @param key - Array of room key strings
 * @returns Refundability status object
 */
export const getRefundabilityStatus = (key: string[]): RefundabilityStatus => {
  const hasNonRefundable = key.some(k =>
    k.toLowerCase().includes('non-refundable'),
  );
  
  return {
    isRefundable: !hasNonRefundable,
    text: hasNonRefundable ? 'Non-Refundable' : 'Refundable',
  };
};

/**
 * Generate booking info text dynamically
 * @param cityName - City name
 * @param nights - Number of nights
 * @returns Formatted info text
 */
export const generateBookingInfoText = (
  cityName: string,
  nights: number,
): string => {
  const city = cityName || 'This';
  const nightsText = `${nights} ${nights === 1 ? 'night' : 'nights'}`;
  return `${city} cruise booking includes ${nightsText} accommodation. Please verify room configuration details.`;
};
