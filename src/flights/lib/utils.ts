import moment from 'moment';

// Local date utility functions
const convertDateToDDMMYYYY = (date: any) => {
  if (!date) return '';
  return moment(date).format('DD/MM/YYYY');
};

const formatTime = (time: any) => {
  if (!time) return '';
  return moment(time).format('HH:mm');
};

const getDaysDiff = (startDate: any, endDate: any, absolute = false) => {
  const start = moment(startDate);
  const end = moment(endDate);
  const diff = end.diff(start, 'days');
  return absolute ? Math.abs(diff) : diff;
};

const getDurationMinDisplay = (
  minutes: number,
  hourLabel = 'h',
  minuteLabel = 'm',
) => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) {
    return `${hours}${hourLabel} ${mins}${minuteLabel}`;
  } else if (hours > 0) {
    return `${hours}${hourLabel}`;
  } else {
    return `${mins}${minuteLabel}`;
  }
};

const toDateSafe = (date: any) => {
  if (!date) return null;
  const momentDate = moment(date);
  return momentDate.isValid() ? momentDate.toDate() : null;
};

const getSearchQuery = (searchParams: any) => {
  const {fitin, pax, sTyp, cabin} = searchParams || {};
  const routes = fitin.split('_');
  const legs: any = [];
  if (routes && routes.length > 0) {
    routes.forEach((route: string) => {
      const [src, dst, dep] = route.split('-');
      legs.push({src, dst, dep});
    });
  }
  const [nAdt, nChd, nInf] = pax?.split('-') || [1, 0, 0];
  return {
    chkInDt: null,
    chkOutDt: null,
    pkgId: '-1',
    srchQ: JSON.stringify({
      nAdt: nAdt || 1,
      nChd: nChd || 0,
      nInf: nInf || 0,
      isStpAl: true,
      legs,
      cabin: cabin || 'A',
      isRet: 'false',
      sTyp: sTyp || 'ONE_WAY',
    }),
    incPrc: true,
    fphFlow: false,
    prdFlow: null,
    prFlt: true,
    __xreq__: false,
  };
};

const getAirlineLogo = function (carA: any, lIcon: any) {
  const iconStr = lIcon ? 'licons' : 'icons';
  const carStr = Array.isArray(carA)
    ? carA.length > 1
      ? 'MULT'
      : carA[0]
    : carA;

  return `//cdn.yourholiday.me/static/img/poccom/airlines/${iconStr}/${carStr}.gif`;
};

const getAirlineNames = function (carA: any, airlines: any) {
  var nmA = [];
  for (var i = 0; i < carA.length; i++) {
    nmA.push(airlines[carA[i]].nm);
  }
  return nmA;
};

const getFlightInfo = (flight: any, data: any) => {
  const nextFlight = null;
  const comboMap = null;
  const carA: any = [];
  const fltNumA: any = [];
  const bggA: any = [];
  let stops = 0;
  let hasUpg = false;

  if (flight && flight.legs && flight.legs.length > 0) {
    stops = flight.legs.length > 1 ? flight.legs.length - 1 : 0;
    flight.legs.forEach((leg: any) => {
      if (carA.indexOf(leg.car) === -1) {
        carA.push(leg.car);
      }
      if (leg.bgg && bggA.indexOf(leg.bgg) === -1) {
        bggA.push(leg.bgg);
      }
      fltNumA.push(leg.car + '-' + leg.flt);
      stops += leg.stps ? leg.stps : 0;
      if (!hasUpg) {
        hasUpg = leg.upg;
      }
    });
  }
  const arlNms = getAirlineNames(carA, data.airlines);
  const firstLeg = flight.legs ? flight.legs[0] : null;
  const lastLeg = flight.legs ? flight.legs[flight.legs.length - 1] : null;

  return {
    cur: data.cur,
    ...flight,
    airlineLogo: getAirlineLogo(carA, true),
    fltNumA,
    arlNms,
    arls: carA,
    depAirport: data.airports[firstLeg.from].cNm,
    depCode: data.airports[firstLeg.from].cd,
    arrCode: data.airports[lastLeg.to].cd,
    arrAirport: data.airports[lastLeg.to].cNm,
    bggA,
    stops,
    depTime: formatTime(firstLeg.dep),
    arrTime: formatTime(lastLeg.arr),
    depT: firstLeg.fromT,
    arrT: lastLeg.toT,
    layDurStr: getDurationMinDisplay(flight.dur, 'h', 'm'),
    arr: lastLeg.arr,
    dep: firstLeg.dep,
    nextFlight,
    comboMap,
    hasUpg,
  };
};

const getNextFlightKeyMap = (flightkey: any, data: any = []) => {
  let flightKeyMap: any = {};
  if (!data || !data[flightkey]) {
    return flightKeyMap;
  }
  flightKeyMap = data[flightkey].reduce((acc: any, flight: any) => {
    if (!acc[flight.key]) {
      acc[flight.key] = {};
    }
    acc[flight.key] = {
      ...flight,
    };
    return acc;
  }, {});

  return flightKeyMap;
};

const getComboFlightsMap = (flights: any, flightKeyMap: any, data: any) => {
  const comboFlightsMap: any = {};
  flights.forEach((flight: any) => {
    if (flight.nfmap) {
      flight.nfmap.forEach((nf: any) => {
        const nextFlight = flightKeyMap[nf.k];
        const fltCombKey = getFltCombKey(flight, nextFlight, nf.p);
        if (!comboFlightsMap[fltCombKey]) {
          comboFlightsMap[fltCombKey] = {
            oFlt: [],
            rFlt: [],
            flightInfoMap: {},
          };
        }
        if (!comboFlightsMap[fltCombKey].oFlt.includes(nf.ok)) {
          comboFlightsMap[fltCombKey].oFlt.push(nf.ok);
          comboFlightsMap[fltCombKey].flightInfoMap[nf.ok] = getFlightInfo(
            flight,
            data,
          );
        }
        if (!comboFlightsMap[fltCombKey].rFlt.includes(nf.k)) {
          comboFlightsMap[fltCombKey].rFlt.push(nf.k);
          comboFlightsMap[fltCombKey].flightInfoMap[nf.k] = getFlightInfo(
            nextFlight,
            data,
          );
        }
      });
    }
  });
  return comboFlightsMap;
};

const getFltCombKey = (flight: any, nextFlight: any, price: any) => {
  return flight.legs[0].car + '-' + nextFlight.legs[0].car + '-' + price;
};

const processFlightData = (data: any) => {
  let flightData: any = {
    search: data.search,
    flightKeyMap: {},
  };
  if (data.search?.legs) {
    data.search.legs.forEach((leg: any, key: any) => {
      if (data.search?.combinedF && key > 0) {
        return;
      }

      //
      const depStr = leg.dep.replaceAll('/', '');
      const flightKey = `F-${leg.src}-${leg.dst}-${depStr}`;
      flightData[flightKey] = [];

      //
      let nextFlightKey = '';
      let flightKeyMap: any = {};
      let comboFlightsMap = null;
      if (data.search?.combinedF && key < data.search.legs.length - 1) {
        const nextFlightLeg = data.search.legs[key + 1];
        const nextDepStr = nextFlightLeg?.dep.replaceAll('/', '');
        nextFlightKey = `F-${nextFlightLeg?.src}-${nextFlightLeg?.dst}-${nextDepStr}`;
        flightKeyMap = getNextFlightKeyMap(nextFlightKey, data);
        comboFlightsMap = getComboFlightsMap(
          data[flightKey],
          flightKeyMap,
          data,
        );
      }

      const comboproccessedFlights: any = [];

      if (data[flightKey]) {
        data[flightKey].forEach((flight: any) => {
          if (data.search?.combinedF) {
            if (flight.nfmap) {
              flight.nfmap.forEach((nf: any) => {
                const flightInfo = getFlightInfo(flight, data);
                const nextFlight = flightKeyMap[nf.k];
                const nextFlightInfo = getFlightInfo(nextFlight, data);
                flightInfo.nextFlight = nextFlightInfo;
                flightInfo.prc = nf.p;
                const fltCombKey = getFltCombKey(flight, nextFlight, nf.p);
                flightInfo.fltCombKey = fltCombKey;
                if (!comboproccessedFlights.includes(fltCombKey)) {
                  flightInfo.comboMap = comboFlightsMap[fltCombKey];
                  flightData[flightKey].push(flightInfo);
                  comboproccessedFlights.push(fltCombKey);
                }
              });
            }
          } else {
            const flightInfo = getFlightInfo(flight, data);
            flightData[flightKey].push(flightInfo);
            flightData['flightKeyMap'][flight.key] = flightInfo;
          }
        });
      }
    });
  }

  return flightData;
};
const checkSelFltForDateChange = (
  flt: any,
  srchO: any,
  srchLgIdx: number = 0,
) => {
  const nxtDtA: any[] = [];
  if (srchO.sTyp !== 'ONE_WAY') {
    // Calculate flight day difference using moment
    const fltDayDiff = getDaysDiff(flt.dep, flt.arr, true);

    // Parse the search date using moment
    const nextLegDate = srchO.legs[srchLgIdx + 1]?.dep;
    if (!nextLegDate) return nxtDtA;

    // Parse DD/MM/YYYY format date
    let dtM = moment(nextLegDate, 'DD/MM/YYYY');
    const srchDtM = moment(nextLegDate, 'DD/MM/YYYY');
    let hasSrchDt = false;

    if (fltDayDiff > 0) {
      for (let i = 0; i <= fltDayDiff; i++) {
        if (srchDtM.isSame(dtM, 'day')) hasSrchDt = true;

        let isShow = i === fltDayDiff;
        let isFstNtEChkin = false;
        let ntOffst = 0;

        if (i === fltDayDiff - 1) {
          isShow = true;
          // Check if arrival hour is less than 10
          const arrivalDate = toDateSafe(flt.arr);
          if (arrivalDate && moment(arrivalDate).hour() < 10) {
            isFstNtEChkin = true;
          } else {
            ntOffst = -1;
          }
        }

        nxtDtA.push({
          dt: dtM.toDate(),
          isShw: isShow,
          isFstNtEChkin: isFstNtEChkin,
          ntOffst: ntOffst,
        });

        dtM = dtM.add(1, 'day');
      }
    } else {
      dtM = dtM.add(fltDayDiff, 'days');
      for (let i = fltDayDiff; i <= 0; i++) {
        if (srchDtM.isSame(dtM, 'day')) hasSrchDt = true;

        let isShow = i === fltDayDiff;
        let isFstNtEChkin = false;
        let ntOffst = 0;

        if (i === 0) {
          isShow = true;
          ntOffst = -fltDayDiff;
        }

        nxtDtA.push({
          dt: dtM.toDate(),
          isShw: isShow,
          isFstNtEChkin: isFstNtEChkin,
          ntOffst: ntOffst,
        });

        dtM = dtM.add(1, 'day');
      }
    }
  }
  return nxtDtA.length > 1 ? nxtDtA : [];
};
const suggestToLegMapper = (suggestion: any) => {
  return {
    sCyNm: suggestion.from.data.cNm,
    src: suggestion.from.data.cd,
    sArNm: suggestion.from.data.nm,
    dCyNm: suggestion.to.data.cNm,
    dst: suggestion.to.data.cd,
    dArNm: suggestion.to.data.nm,
    dep: convertDateToDDMMYYYY(suggestion.date),
  };
};
const suggestToReturnLegMapper = (segment: any, returnDate: Date) => {
  return {
    sCyNm: segment.to.data.cNm,
    src: segment.to.data.cd,
    sArNm: segment.to.data.nm,
    dCyNm: segment.from.data.cNm,
    dst: segment.from.data.cd,
    dArNm: segment.from.data.nm,
    dep: convertDateToDDMMYYYY(returnDate),
  };
};
const legToSuggestMapper = (leg: any, type: String) => {
  if (!leg) {
    return null;
  }
  if (type == 'From') {
    return {
      value: `${leg.sCyNm} (${leg.src} - ${leg.sArNm})`,
      data: {
        cNm: leg.sCyNm,
        cd: leg.src,
        cid: -1,
        nm: leg.sArNm,
      },
    };
  } else if (type == 'To') {
    return {
      value: `${leg.dCyNm} (${leg.dst} - ${leg.dArNm})`,
      data: {
        cNm: leg.dCyNm,
        cd: leg.dst,
        cid: -1,
        nm: leg.dArNm,
      },
    };
  }
};
const isTravellerType = (
  traveller: any,
  type: 'ADULT' | 'CHILD' | 'INFANT',
) => {
  switch (type) {
    case 'ADULT':
      return traveller.t === 'ADULT' || traveller.age >= 12;

    case 'CHILD':
      return (
        traveller.t === 'CHILD' || (traveller.age < 12 && traveller.age >= 2)
      );

    case 'INFANT':
      return traveller.t === 'INFANT' || traveller.age < 2;

    default:
      return false;
  }
};

export {
  getSearchQuery,
  processFlightData,
  getAirlineLogo,
  getAirlineNames,
  checkSelFltForDateChange,
  suggestToLegMapper,
  legToSuggestMapper,
  suggestToReturnLegMapper,
  isTravellerType,
};
