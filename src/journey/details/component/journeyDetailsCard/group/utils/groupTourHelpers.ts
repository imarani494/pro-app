import {TravelerInfo} from '../types/GroupTourTypes';

export const getHighlightsSummary = (pkgDstSmry: {
  cts: number;
  cntry: number;
  dys: number;
}): string => {
  return `${pkgDstSmry.cts} cities · ${pkgDstSmry.cntry} hotels · ${pkgDstSmry.dys} transfers`;
};


// ✅ UPDATED FUNCTION
export const getDisplayHighlights = (
  highlights: string[],
  displayCount: number = 4,
  showAll: boolean = false,
): {displayHighlights: string[]; remainingCount: number} => {
  if (!highlights || highlights.length === 0) {
    return {displayHighlights: [], remainingCount: 0};
  }

  if (showAll) {
    return {
      displayHighlights: highlights,
      remainingCount: 0,
    };
  }

  const displayHighlights = highlights.slice(0, displayCount);
  const remainingCount = Math.max(0, highlights.length - displayCount);
  return {displayHighlights, remainingCount};
};

export const getTravelersFromApi = (tvlG: {tvlA: string[]}): TravelerInfo[] => {
  if (!tvlG || !Array.isArray(tvlG.tvlA) || tvlG.tvlA.length === 0) {
    return [];
  }

  return tvlG.tvlA.map(
    (travelerId): TravelerInfo => ({
      id: travelerId,
      type: travelerId.includes('ADULT') ? 'Adult' : 'Child',
    }),
  );
};

export const truncateDescription = (
  description: string,
  maxLength: number = 120,
): string => {
  if (!description) {
    return '';
  }
  if (description.length <= maxLength) {
    return description;
  }
  return `${description.substring(0, maxLength)}...`;
};

export const formatTourDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const calculateTotalPrice = (
  invBkupA: Array<{
    cur: string;
    cost: number;
    sell: number;
  }>,
): {currency: string; totalCost: number; totalSell: number} => {
  const totalCost = invBkupA.reduce((sum, item) => sum + item.cost, 0);
  const totalSell = invBkupA.reduce((sum, item) => sum + item.sell, 0);
  const currency = invBkupA[0]?.cur || 'USD';
  return {currency, totalCost, totalSell};
};
