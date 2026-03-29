// utils/carDataTransformer.ts - COMPLETE FILE

import { CarRentalApiData, JourneyCarData, JourneyTraveler } from '../types/CarRentalTypes';

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const formatTime = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
};

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    const time = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const date = d.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return `${time} ${date}`;
  } catch {
    return dateString;
  }
};

const cleanString = (val: any): string => {
  if (val === null || val === undefined) return '';
  const s = String(val).trim();
  if (!s) return '';
  if (s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined') return '';
  return s;
};

export const transformCarApiData = (apiData: CarRentalApiData): JourneyCarData => {
  const carO = apiData._data?.carO || apiData.carO;
  if (!carO) {
    throw new Error('Invalid car data: carO not found');
  }

  const {
    vd,
    optr,
    pkLoc,
    dpLoc,
    pkTm,
    dpTm,
    days,
    incA = [],
    mpl,
    fpl,
    prcD,
    prcPyLD,
    cur,
    asts,
  } = carO;

  const invBkup = (apiData._data as any)?.invBkupA?.[0] || (apiData as any)?.invBkupA?.[0] || {};
  const currency = invBkup.cur || cur || 'USD';
  const priceInUSD = invBkup.sellInUSD || invBkup.sell || 0;
  const displayPrice = prcPyLD || prcD || priceInUSD;

  const pickupDateTime = pkTm ? new Date(pkTm.replace(' ', 'T')) : null;
  const dropoffDateTime = dpTm ? new Date(dpTm.replace(' ', 'T')) : null;

  const features: string[] = [];
  if (vd.vtyp) features.push(vd.vtyp);
  if (vd.ndr > 0) features.push(`${vd.ndr} doors`);
  if (vd.ftA?.length) features.push(...vd.ftA);
  if (vd.hasAC) features.push('AC');
  if (vd.isAWD) features.push('All-wheel drive/4x4');
  if (mpl) features.push(mpl);
  if (fpl) features.push(`Fuel: ${fpl}`);

  // ✅ Inclusions - Keep all items, remove trailing colons
  const dynamicInclusions = incA
    .filter(inc => {
      // Skip payable items
      if (inc.Iply === true) {
        return false;
      }
      
      const name = inc.nm?.trim();
      
      // Skip empty names
      if (!name) {
        return false;
      }
      
      return true;
    })
    .map(inc => {
      let text = inc.nm.trim();
      
      // Remove trailing colon if exists
      if (text.endsWith(':')) {
        text = text.slice(0, -1).trim();
      }
      
      // Skip if nothing left after removing colon
      if (!text || text === '') {
        return '';
      }
      
      return text;
    })
    .filter(text => text.length > 0);  // Remove empty strings

  // ✅ Exclusions - Same logic
  const dynamicExclusions = incA
    .filter(inc => {
      // Only payable items
      if (inc.Iply !== true) {
        return false;
      }
      
      const name = inc.nm?.trim();
      
      if (!name) {
        return false;
      }
      
      return true;
    })
    .map(inc => {
      let text = inc.nm.trim();
      
      // Remove trailing colon
      if (text.endsWith(':')) {
        text = text.slice(0, -1).trim();
      }
      
      if (!text || text === '') {
        return '';
      }
      
      return text;
    })
    .filter(text => text.length > 0);

  console.log('📦 Final Inclusions:', dynamicInclusions);
  console.log('📦 Final Exclusions:', dynamicExclusions);

  const apiTravelers = apiData._data?.tvlG?.tvlA || apiData.tvlG?.tvlA || [];

  let travelers: JourneyTraveler[] = [];
  let passengerInfo = '';

  if (apiTravelers.length > 0) {
    travelers = apiTravelers.slice(0, 2).map((t: any, i: number) => ({
      id: t.id || `T${i + 1}`,
      type: t.type || 'Adult',
      name: t.nm || t.name,
    }));
    passengerInfo = apiData._data?.paxD || apiData.paxD || `${travelers.length} Travelers`;
  } else if (vd.nst > 0) {
    const derivedCount = Math.min(vd.nst, 2);
    travelers = Array.from({ length: derivedCount }).map((_, i) => ({
      id: `T${i + 1}`,
      type: 'Adult' as const,
    }));
    passengerInfo = `${derivedCount} Adults`;
  }

  const pickupLoc = cleanString(pkLoc?.loc);
  const dropoffLoc = cleanString(dpLoc?.loc);

  const journeyData: JourneyCarData = {
    name: vd.vnm || 'Car',
    seats: vd.nst || 0,
    features,
    transmission: vd.isAutoTx ? 'Automatic' : 'Manual',
    passengerInfo,
    travelers,
    image: vd.img || 'https://www.globalmediaserver.com/images/cars/default.jpg',
    logoImage: optr?.lg,
    pickupLocation: pickupLoc,
    dropoffLocation: dropoffLoc,
    pickupDate: pickupDateTime ? formatDate(pkTm) : '',
    dropoffDate: dropoffDateTime ? formatDate(dpTm) : '',
    pickupTime: pkLoc?.locTm || (pickupDateTime ? formatTime(pkTm) : ''),
    dropoffTime: dpLoc?.locTm || (dropoffDateTime ? formatTime(dpTm) : ''),
    pickupDateTimeFormatted: pickupDateTime ? formatDateTime(pkTm) : '',
    dropoffDateTimeFormatted: dropoffDateTime ? formatDateTime(dpTm) : '',
    days: days || 1,
    inclusions: dynamicInclusions,
    exclusions: dynamicExclusions,
    price: displayPrice?.toString() || '0',
    currency: currency,
    priceInUSD: priceInUSD,
    mileage: mpl,
    fuelPolicy: fpl ? `Fuel: ${fpl}` : undefined,
    availability: asts,
    airConditioning: vd.hasAC || false,
    provider: optr,
  };

  return journeyData;
};
