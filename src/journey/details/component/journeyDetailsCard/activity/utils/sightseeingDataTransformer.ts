// utils/sightseeingDataTransformer.ts
import { SightseeingApiData, JourneySightseeingData } from '../types/SightseeingTypes';

export const transformSightseeingApiData = (apiData: SightseeingApiData): JourneySightseeingData => {
  const primaryPricing = apiData.invBkupA?.[0];

  // Format time slot from milliseconds to readable time
  const formatTimeSlot = (slot: { s: number; e: number }) => {
    const startHours = Math.floor(slot.s / (1000 * 60 * 60));
    const startMinutes = Math.floor((slot.s % (1000 * 60 * 60)) / (1000 * 60));
    const endHours = Math.floor(slot.e / (1000 * 60 * 60));
    const endMinutes = Math.floor((slot.e % (1000 * 60 * 60)) / (1000 * 60));

    const formatTime = (hours: number, minutes: number) => {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${period}`;
    };

    return `${formatTime(startHours, startMinutes)} - ${formatTime(endHours, endMinutes)}`;
  };

  // Extract time from slotD string (e.g., "02:30 PM (6)" -> "02:30 PM")
  const extractTimeFromSlotD = (slotD: string | undefined): string => {
    if (!slotD) return '';
    const match = slotD.match(/^(.+?)\s*\(/);
    return match ? match[1].trim() : slotD;
  };

  // Transform travelers array
  const transformTravelers = (tvlG: { tvlA: string[] }) => {
    if (!tvlG?.tvlA || tvlG.tvlA.length === 0) return [];
    return tvlG.tvlA.map((travelerId, index) => ({
      id: travelerId,
      type: travelerId.includes('ADULT') ? 'Adult' as const : 'Child' as const,
      name: `Traveler ${index + 1}`,
    }));
  };

  // Check if meals are included
  const hasMealsIncluded = !!apiData.mlT?.nm || 
    apiData.inTA?.some(inclusion => {
      const lowerInclusion = inclusion.toLowerCase();
      return (
        lowerInclusion.includes('meal') ||
        lowerInclusion.includes('food') ||
        lowerInclusion.includes('breakfast') ||
        lowerInclusion.includes('lunch') ||
        lowerInclusion.includes('dinner') ||
        lowerInclusion.includes('dining') ||
        lowerInclusion.includes('buffet')
      );
    }) || false;

  // Check if private transfer is included
  const hasPrivateTransfer = 
    apiData.txpT === 'PRIVATE' ||
    apiData.txpL?.nm?.toLowerCase().includes('private') ||
    false;

  // Get transfer display text
  const getTransferDisplayText = (): string => {
    if (apiData.txpL?.nm) {
      return apiData.txpL.nm;
    }
    // Fallback to formatted txpT
    const txptMap: Record<string, string> = {
      "NONE": "No Transfers",
      "SIC": "Seat in Coach",
      "PRIVATE": "Private Vehicle",
      "FERRY": "Ferry",
      "SEAPLANE": "Seaplane",
      "TRAIN": "Train",
      "CAR_RENTAL": "Car Rental",
      "PUBLIC_TRANSPORT": "Public Transport",
    };
    return apiData.txpT ? txptMap[apiData.txpT] || apiData.txpT : '';
  };

  return {
    title: apiData.cdnm || apiData.grpNm || apiData.ttl || 'Activity',
    cityName: apiData.dctyD || 'Unknown City',
    passengerInfo: apiData.paxD || `${apiData.tvlG?.tvlA?.length || 0} travelers`,
    description: apiData.dsc || 'No description available',
    image: apiData.img || '',
    duration: apiData.tmD || (apiData.drH ? `Duration: ${apiData.drH} hrs` : 'Duration not specified'),
    timeSlot: apiData.slotD 
      ? extractTimeFromSlotD(apiData.slotD) 
      : (apiData.slot ? formatTimeSlot(apiData.slot) : ''),
    inclusions: apiData.inTA || [],
    exclusions: apiData.exTA || [],
    transportType: apiData.txpT || 'UNKNOWN',
    transportStatus: apiData.txpL?.st || 'UNKNOWN',
    travelers: apiData.tvlG ? transformTravelers(apiData.tvlG) : [],
    hasPrivateTransfer,
    hasMealsIncluded,
    notes: apiData.ntA || [],
    pricing: primaryPricing
      ? {
          currency: primaryPricing.cur,
          cost: primaryPricing.cost,
          sell: primaryPricing.sell,
        }
      : undefined,
    transferDisplayText: getTransferDisplayText(),
    mealTypeName: apiData.mlT?.nm,
  };
};
