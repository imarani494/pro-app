import {TransferApiData, JourneyTransferData} from '../types/TransferTypes';


export const transformTransferApiData = (
  apiData: TransferApiData,
): JourneyTransferData => {
  
  const {
    date = '',
    bggN = '',
    grpNm = '',
    paxD = '',
    tvlG = {tvlA: []},
    ttl = '',
    cdnm = '',
    dctyD = '',
    invBkupA = [],
    dsc = '',
    txpL = {st: '', nm: ''},
    subType = '',
    ntA = [],
    drH = 0,
    txpT = '',
  } = apiData || {};

 
  const features: string[] = [];

  console.log('🔍 Feature Extraction - Starting...');
  console.log('Transport Type (txpT):', txpT);
  console.log('Baggage Info (bggN):', bggN);
  console.log('Title (ttl):', ttl);
  console.log('Group Name (grpNm):', grpNm);
  console.log('Invoice Backup Array (invBkupA):', invBkupA);

  
  if (txpT?.trim()) {
    const transportFeature = txpT === 'PRIVATE' ? 'Private Transfer' : txpT;
    features.push(transportFeature);
    console.log('✅ Added Transport Feature:', transportFeature);
  }

  
  if (bggN?.trim()) {
    features.push(bggN);
    console.log('✅ Added Baggage Feature:', bggN);
  }


  if (ttl?.trim()) {
    const timeMatch = ttl.match(/\(([^)]+)\)/);
    if (timeMatch?.[1]) {
      features.push(timeMatch[1]);
      console.log('✅ Added Time Feature:', timeMatch[1]);
    }
  }


  if (grpNm?.trim() && cdnm && !cdnm.includes(grpNm)) {
    features.push(grpNm);
    console.log('✅ Added Group Name Feature:', grpNm);
  }

 
  const addedServices = new Set<string>();
  if (invBkupA && Array.isArray(invBkupA)) {
    invBkupA.forEach((item, index) => {
      console.log(`📦 Processing Invoice Item [${index}]:`, item.details);

      if (item.details) {
        const detailsLower = item.details.toLowerCase();

       
        if (
          detailsLower.includes('arrival') &&
          !addedServices.has('Arrival')
        ) {
          features.push('Airport Arrival');
          addedServices.add('Arrival');
          console.log('✅ Added Service: Airport Arrival');
        }
        if (
          detailsLower.includes('porterage') &&
          !addedServices.has('Porterage')
        ) {
          features.push('Porterage Available');
          addedServices.add('Porterage');
          console.log('✅ Added Service: Porterage Available');
        }
        if (detailsLower.includes('guide') && !addedServices.has('Guide')) {
          features.push('Guide Service');
          addedServices.add('Guide');
          console.log('✅ Added Service: Guide Service');
        }
      }
    });
  }

  console.log('🔥 FINAL FEATURES EXTRACTED:', features);
  console.log('📊 Total Features Count:', features.length);

  
  const getDescription = (): string => {
    return (
      dsc?.trim() ||
      cdnm?.trim() ||
      ttl?.trim() ||
      grpNm?.trim() ||
      'Transfer service details'
    );
  };

 
  const travelers = tvlG.tvlA.map(traveler => ({
    id: traveler,
    type: (traveler.includes('ADULT') ? 'Adult' : 'Child') as const,
    name: paxD,
  }));

 
  const totalCost = invBkupA.reduce((sum, item) => sum + (item.cost || 0), 0);
  const totalSell = invBkupA.reduce((sum, item) => sum + (item.sell || 0), 0);
  const totalCostInUSD = invBkupA.reduce(
    (sum, item) => sum + (item.costInUSD || 0),
    0,
  );
  const totalSellInUSD = invBkupA.reduce(
    (sum, item) => sum + (item.sellInUSD || 0),
    0,
  );
  const currency = invBkupA[0]?.cur || 'USD';

  // Create pricing breakdown from invoice items
  const breakdown = invBkupA.map(item => ({
    details: item.details || '',
    cost: item.cost || 0,
    sell: item.sell || 0,
    currency: item.cur || currency,
  }));

 
  const formatDate = (dateString: string): string => {
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

  
  const getPickupLabel = (): string => {
    if (subType === 'AIRPORT_PICKUP') return 'Airport Pickup';
    if (subType === 'AIRPORT_DROP') return 'Airport Drop-off';
    return txpL.nm || 'Transfer';
  };

  const pickupInfo = {
    label: getPickupLabel(),
    details: `${dctyD} - ${formatDate(date)}`,
  };

 
  return {
    transferType: txpL.nm || 'Transfer',
    title: cdnm || ttl,
    cdnm: cdnm,
    description: getDescription(),
    cityName: dctyD,
    passengerInfo: paxD,
    baggageInfo: bggN,
    transportLabel: txpL.nm,
    transportType: txpT,
    transportStatus: txpL.st,
    date: formatDate(date),
    duration: drH,
    subType,
    features,
    notes: ntA,
    travelers,
    pricing: {
      currency,
      totalCost,
      totalSell,
      totalCostInUSD,
      totalSellInUSD,
      breakdown,
    },
    pickupInfo,
  };
};


export const formatTransferPricing = (
  pricing: JourneyTransferData['pricing'],
): string => {
  return `Pay at Pickup: ${pricing.currency} ${pricing.totalSell.toFixed(2)}`;
};


export const getTransferFeatures = (
  data: JourneyTransferData,
): Array<{id: number; text: string; styleKey: 'doorView' | 'bagRow'}> => {
  console.log('⚠️ getTransferFeatures called (deprecated, use useMemo in component)');
  console.log('Features:', data.features);

  return data.features.slice(0, 2).map((feature, index) => ({
    id: index + 1,
    text: feature,
    styleKey: (index === 0 ? 'doorView' : 'bagRow') as const,
  }));
};
