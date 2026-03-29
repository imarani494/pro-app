

export const getTransportInfo = (contentCardState: any, searchParams?: any) => {
  const data = contentCardState?.context?.query?.actionData?.otherData;
  const pkCtyA = data?.rdSrchOpts?.pkCtyA || [];
  const existingQuery = data?.rdTxptQ;

  const getPickupCity = () => {
    if (existingQuery?.pkCid && pkCtyA) {
      const pickupCity = pkCtyA.find((city: any) => city.cid === existingQuery.pkCid);
      return pickupCity?.cnm || '';
    }
    return searchParams?.pickupCity?.cnm || pkCtyA[0]?.cnm || '';
  };

  const getDropoffCity = () => {
    if (existingQuery?.dpCid && existingQuery?.dpDt && pkCtyA) {
     
      const dropDate = existingQuery.dpDt.split(' ')[0];

    
      const pickupCity = pkCtyA.find((city: any) => city.cid === existingQuery.pkCid);
      if (pickupCity?.dpDtA) {
    
        const dropDateObj = pickupCity.dpDtA.find(
          (dt: any) => dt.dDt === dropDate,
        );
        if (dropDateObj?.dpCtyA) {
          // Find the matching drop city
          const dropCity = dropDateObj.dpCtyA.find(
            (city: any) => city.cid === existingQuery.dpCid,
          );
          return dropCity?.cnm || '';
        }
      }
    }
    return searchParams?.dropCity?.cnm || '';
  };

  return {
    pickupCity: getPickupCity(),
    dropoffDate:
      existingQuery?.dpDt ||
      searchParams?.dropDate ||
      contentCardState?.context?.query?.onDate ||
      '',
    dropoffCity: getDropoffCity(),
    travellers: contentCardState?.context?.query?.tvlG?.tvlA?.length || 0,
    dayNum: contentCardState?.context?.query?.dayNum || 1,
    onDate: contentCardState?.context?.query?.onDate,
  };
};

export const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return dateStr;
  const date = new Date(dateStr);
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
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};