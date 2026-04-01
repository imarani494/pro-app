// Utility function to transform car rental JSON data for CarRentalDetails component

export interface CarRentalApiData {
  carO: {
    pkTm: string;
    dpTm: string;
    prc: number;
    cur: string;
    days: number;
    fpl: string;
    mpl: string;
    fpT: string;
    pkLoc: {
      loc: string;
    };
    dpLoc: {
      loc: string;
    };
    optr: {
      nm: string;
      lg?: string;
    };
    vd: {
      vnm: string;
      vtyp: string;
      img: string;
      nst: number;
      ndr: number;
      slg: number;
      mlg: number;
      llg?: number;
      isAutoTx: boolean;
      hasAC: boolean;
      ftA: string[];
    };
    incA: Array<{
      nm: string;
      iPrcInc?: boolean;
      prc?: number;
      q?: number;
    }>;
    optGA?: Array<{
      incA: Array<{
        mxq: number;
        nm: string;
        prc: number;
        prcD: string;
        prcQ: string;
        iPyL?: boolean;
        id: string;
        dsc?: string;
      }>;
      typ: string;
      gnm?: string;
      isOne?: boolean;
    }>;
  };
}

export function transformCarDataForDetails(
  apiData: CarRentalApiData,
  fallbackData?: {
    pickupLocation?: string;
    dropoffLocation?: string;
    pickupTime?: string;
    dropoffTime?: string;
  },
): {
  carName: string;
  seats: number;
  doors: number;
  bags: number;
  transmission: string;
  airConditioning: boolean;
  price: number;
  currency: string;
  imageUrl: string;
  features: string[];
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  provider: {
    nm: string | undefined;
    lg?: string | undefined;
  };
  vehicleType: string;
  days: number;
} {
  const { carO } = apiData;
  const { vd, optr, pkLoc, dpLoc } = carO;

  // Calculate total bags
  const totalBags = (vd.slg || 0) + (vd.mlg || 0) + (vd.llg || 0);

  // Build features array
  const features: string[] = [
    carO.fpl ? `Fuel: ${carO.fpl}` : null,
    carO.mpl ? carO.mpl : null,
    ...vd.ftA,
    // ...carO.incA.filter(inc => inc.iPrcInc).map(inc => inc.nm)
  ].filter((item): item is string => Boolean(item));

  // Format dates and times
  const formatDateTime = (dateTimeStr: string): { date: string; time: string } => {
    if (!dateTimeStr) {
      console.warn('formatDateTime: Empty dateTimeStr');
      return { date: '', time: '' };
    }
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) {
        console.warn('formatDateTime: Invalid date string:', dateTimeStr);
        return { date: '', time: '' };
      }
      return {
        date: date.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        }).toUpperCase(),
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        })
      };
    } catch (error) {
      console.warn('formatDateTime: Error formatting date:', dateTimeStr, error);
      return { date: '', time: '' };
    }
  };

  // Debug logging
  console.log('transformCarDataForDetails - pkLoc:', pkLoc);
  console.log('transformCarDataForDetails - dpLoc:', dpLoc);
  console.log('transformCarDataForDetails - pkTm:', carO.pkTm);
  console.log('transformCarDataForDetails - dpTm:', carO.dpTm);
  console.log('transformCarDataForDetails - fallbackData:', fallbackData);

  const pickup = formatDateTime(carO.pkTm || '');
  const dropoff = formatDateTime(carO.dpTm || '');

  // Use fallback data if API response doesn't have location/time data
  const finalPickupLocation = pkLoc?.loc || fallbackData?.pickupLocation || '';
  const finalDropoffLocation = dpLoc?.loc || fallbackData?.dropoffLocation || '';
  const finalPickupTime = pickup.time || fallbackData?.pickupTime || '';
  const finalDropoffTime = dropoff.time || fallbackData?.dropoffTime || '';

  return {
    carName: vd.vnm,
    seats: vd.nst,
    doors: vd.ndr,
    bags: totalBags,
    transmission: vd.isAutoTx ? "Automatic" : "Manual",
    airConditioning: vd.hasAC,
    price: Math.round(carO.prc),
    currency: carO.cur === "INR" ? "₹" : carO.cur,
    imageUrl: vd.img,
    features,
    pickupLocation: finalPickupLocation,
    dropoffLocation: finalDropoffLocation,
    pickupDate: pickup.date,
    dropoffDate: dropoff.date,
    pickupTime: finalPickupTime,
    dropoffTime: finalDropoffTime,
    provider: optr,
    vehicleType: vd.vtyp,
    days: carO.days
  };
}

export function getOptionalExtras(apiData: CarRentalApiData): Array<{
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  priceQualifier: string;
  payAtPickup: boolean;
  mxq: number;
}> {
  const { carO } = apiData;
  
  if (!carO.optGA) return [];

  return carO.optGA.flatMap(group => 
    group.incA.map(item => ({
      id: item.id,
      name: item.nm,
      price: item.prc,
      priceDisplay: item.prcD,
      priceQualifier: item.prcQ,
      payAtPickup: item.iPyL || false,
      mxq: item.mxq || 1
    }))
  );
}

// New function to get grouped extras for radio button selection
export function getGroupedExtras(apiData: CarRentalApiData): Array<{
  groupName: string;
  type: string;
  isOne: boolean;
  options: Array<{
    id: string;
    name: string;
    price: number;
    priceDisplay: string;
    priceQualifier: string;
    description: string;
    mxq: number;
  }>;
}> {
  const { carO } = apiData;
  
  if (!carO.optGA) return [];

  return carO.optGA.map(group => ({
    groupName: group.gnm || 'Options',
    type: group.typ || 'MISC',
    isOne: group.isOne || false,
    options: group.incA.map(item => ({
      id: item.id,
      name: item.nm,
      price: item.prc || 0,
      priceDisplay: item.prcD || '',
      priceQualifier: item.prcQ || '',
      description: item.dsc || '',
      mxq: item.mxq || 1
    }))
  }));
}
