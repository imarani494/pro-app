export type HotelApiResponse = { [k: string]: any };

export interface Traveler {
  t?: 'Adult' | 'Child' | string;
  nm?: string;
  fnm?: string;
  id?: string;
}

export interface HotelCardProps {
  hotelName?: string;
  city?: string;
  hotelImage?: { uri: string } | null;
  address?: string;
  hotelLocation?: string;
  roomInfo?: string;
  checkIn?: { date: string; time: string } | null;
  checkOut?: { date: string; time: string } | null;
  duration?: string;
  labels?: Record<string, string>;
  maxStars?: number;
  rating?: number;
  reviewCount?: number;
  reviewText?: string;
  score?: string | number;
}

// ✅ 2025-12-31 UPDATE: Enhanced null safety with better type checking
function parsePaxD(paxD?: string) {
  const res = { rooms: 0, adults: 0, children: 0 };
  // Added strict validation - return empty if invalid input
  if (!paxD || typeof paxD !== 'string' || paxD.trim() === '') return res;
  
  const rooms = paxD.match(/(\d+)\s*room/i);
  const adults = paxD.match(/(\d+)\s*adult/i);
  const children = paxD.match(/(\d+)\s*child/i);

  if (rooms) res.rooms = Number(rooms[1]);
  if (adults) res.adults = Number(adults[1]);
  if (children) res.children = Number(children[1]);

  return res;
}

// ✅ 2025-12-31 UPDATE: Added comprehensive date validation
function tryParseDate(dateStr?: string): Date | null {
  // Strict validation - return null for any invalid input
  if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') {
    return null;
  }
  
  const s = dateStr.trim();

  // DD/MM/YYYY format
  const dmY = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(.+))?$/);
  if (dmY) {
    const day = Number(dmY[1]);
    const month = Number(dmY[2]) - 1;
    const year = Number(dmY[3]);
    const date = new Date(year, month, day);
    // Validate the date is actually valid
    return !isNaN(date.getTime()) ? date : null;
  }

  // YYYY-MM-DD format
  const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(.+))?$/);
  if (ymd) {
    if (s.includes(' ')) {
      const iso = s.replace(' ', 'T');
      const d = new Date(iso);
      return isNaN(d.getTime())
        ? new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]))
        : d;
    }
    return new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
  }

  // YYYY/MM/DD format
  const ymd2 = s.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (ymd2) {
    return new Date(Number(ymd2[1]), Number(ymd2[2]) - 1, Number(ymd2[3]));
  }

  // Fallback to native Date parsing
  const d = new Date(s);
  return !isNaN(d.getTime()) ? d : null;
}

// ✅ 2025-12-31 UPDATE: Added null check for date formatting
function formatToDisplayDate(date: Date | null, locale?: string): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  
  const loc = locale || undefined;
  const weekday = date.toLocaleString(loc, { weekday: 'short' });
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString(loc, { month: 'short' });
  const year = date.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

// ✅ 2025-12-31 UPDATE: Enhanced validation for night count calculation
function computeNightCountFromDates(d1: Date | null, d2: Date | null) {
  if (!d1 || !d2 || !(d1 instanceof Date) || !(d2 instanceof Date)) return 0;
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
  
  const msPerDay = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  const days = Math.max(0, Math.floor((utc2 - utc1) / msPerDay));
  return days;
}

// ✅ 2025-12-31 UPDATE: Only return date object if valid data exists
function makeCheckDate(dateStr?: string, timeStr?: string) {
  const parsed = tryParseDate(dateStr);
  const formattedDate = parsed ? formatToDisplayDate(parsed) : dateStr || '';
  const time = timeStr || '';
  
  // Only return object if we have valid date
  return formattedDate ? { date: formattedDate, time } : null;
}

// ✅ 2025-12-31 UPDATE: Improved rating conversion with strict validation
function convertRatingToStars(rt?: number, maxStars = 5) {
  if (rt === undefined || rt === null || isNaN(Number(rt))) return 0;
  
  const numRating = Number(rt);
  if (numRating < 0) return 0;
  
  if (numRating > maxStars) {
    const scaled = (numRating / 10) * maxStars;
    return Number(Math.min(scaled, maxStars).toFixed(1));
  }
  return Number(Math.min(numRating, maxStars).toFixed(1));
}

// ✅ 2025-12-31 UPDATE: Added comprehensive null checks - only return data that exists
export function mapHotelApiToCardProps(api: HotelApiResponse): HotelCardProps {
  if (!api || typeof api !== 'object') return {};

  // Only set values if they exist and are non-empty
  const hotelName = api.hnm?.trim() || api.name?.trim() || api.hotelName?.trim() || undefined;
  const city = api.dctyD?.trim() || api.city?.trim() || api.dcty?.trim() || undefined;
  const hotelImage = api.img?.trim() ? { uri: api.img } : api.hotelImage || null;
  const address = api.loc?.trim() || api.address?.trim() || undefined;
  const hotelLocation = api.area?.trim() || api.hotelLocation?.trim() || undefined;

  // Room info - only if room data exists
  const roomObj = api.rmA && Array.isArray(api.rmA) && api.rmA.length > 0 ? api.rmA[0] : null;
  const roomName = roomObj?.rmN?.trim() || '';
  const roomQty = roomObj?.qty || 1;
  const roomInfo = roomName
    ? roomQty > 1
      ? `${roomQty}x ${roomName}`
      : roomName
    : undefined;

  // Check-in/out - only return if valid dates exist
  const checkInRaw = api.chkin || api.checkIn || api.pkdt || api.depDt || '';
  const checkOutRaw = api.chkout || api.checkOut || api.dpdt || api.arrDt || '';
  const checkInTime = api.cinT || api.pkTm || api.depTm || '';
  const checkOutTime = api.coutT || api.dpTm || api.arrTm || '';

  const checkIn = makeCheckDate(checkInRaw, checkInTime);
  const checkOut = makeCheckDate(checkOutRaw, checkOutTime);

  // Duration - only calculate if we have valid night count
  const nightsNum = Number(
    api.nt ?? api.nts ?? api.numNights ?? api.numOfNights ?? 0,
  );
  let nights =
    nightsNum > 0
      ? nightsNum
      : computeNightCountFromDates(
          tryParseDate(checkInRaw),
          tryParseDate(checkOutRaw),
        );
  const duration =
    nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}` : undefined;

  const labels = api.labels || {};

  // Rating - only if valid rating exists
  const rawRating =
    api.urtO?.rt ?? api.rating ?? api.score ?? api.st ?? undefined;
  const maxStars = api.maxStars ?? 5;
  const rating = rawRating !== undefined ? convertRatingToStars(Number(rawRating), maxStars) : undefined;

  // Review data - only if exists
  const reviewCount = api.urtO?.numRt ?? api.reviewCount ?? api.numRt ?? undefined;
  const reviewText = api.urtO?.rtTxt?.trim() ?? api.reviewText?.trim() ?? api.rtTxt?.trim() ?? undefined;
  const score = rawRating;

  return {
    hotelName,
    city,
    hotelImage,
    address,
    hotelLocation,
    roomInfo,
    checkIn,
    checkOut,
    duration,
    labels,
    maxStars,
    rating,
    reviewCount,
    reviewText,
    score,
  };
}

// ✅ 2025-12-31 UPDATE: Enhanced traveler mapping with strict validation
export function mapTravelersFromApi(api: HotelApiResponse): Traveler[] {
  if (!api || typeof api !== 'object') return [];

  const out: Traveler[] = [];

  // Method 1: From search query rooms
  const rooms = api.srchQ?.paxes?.rooms;
  if (Array.isArray(rooms) && rooms.length > 0) {
    rooms.forEach((room: any, rIndex: number) => {
      const adults = Number(room.ad || 0);
      const children = Number(room.ch || 0);
      for (let i = 0; i < adults; i++) {
        out.push({ t: 'Adult', fnm: `Adult ${rIndex + 1}-${i + 1}` });
      }
      for (let i = 0; i < children; i++) {
        out.push({ t: 'Child', fnm: `Child ${rIndex + 1}-${i + 1}` });
      }
    });
    return out;
  }

  // Method 2: From traveler array
  const tvlA = api.tvlG?.tvlA;
  if (Array.isArray(tvlA) && tvlA.length > 0) {
    tvlA.forEach((code: string, idx: number) => {
      const isChild = /CHILD/i.test(code);
      out.push({
        t: isChild ? 'Child' : 'Adult',
        fnm: `${isChild ? 'Child' : 'Adult'} ${idx + 1}`,
      });
    });
    return out;
  }

  // Method 3: From paxD string
  const paxD = api.paxD || api.paxes || '';
  if (typeof paxD === 'string' && paxD.trim() !== '') {
    const parsed = parsePaxD(paxD);
    for (let i = 0; i < parsed.adults; i++)
      out.push({ t: 'Adult', fnm: `Adult ${i + 1}` });
    for (let i = 0; i < parsed.children; i++)
      out.push({ t: 'Child', fnm: `Child ${i + 1}` });
    return out;
  }

  return [];
}

// ✅ 2025-12-31 UPDATE: Strict validation for hotel actions
export function extractHotelActions(
  api: HotelApiResponse,
): Array<{ type?: string; name?: string; [k: string]: any }> {
  if (!api || typeof api !== 'object') return [];
  return Array.isArray(api.actions) && api.actions.length > 0 ? api.actions : [];
}

// ✅ 2025-12-31 UPDATE: Only return amenities if they exist
export function getHotelAmenities(api: HotelApiResponse): string[] {
  if (!api || typeof api !== 'object') return [];
  
  if (Array.isArray(api.hlA) && api.hlA.length > 0)
    return api.hlA.map((h: any) => String(h)).filter(Boolean);
  
  if (Array.isArray(api.amenities) && api.amenities.length > 0)
    return api.amenities.map((a: any) => String(a)).filter(Boolean);
  
  return [];
}

// ✅ 2025-12-31 UPDATE: Return null if no pricing data exists
export function extractPricingInfo(api: HotelApiResponse): {
  currency?: string;
  cost?: number;
  sell?: number;
} | null {
  if (!api || typeof api !== 'object') return null;
  
  const inv = Array.isArray(api.invBkupA) ? api.invBkupA[0] : api.invBkupA;
  if (!inv || typeof inv !== 'object') return null;

  const currency = inv.cur?.trim() || inv.currency?.trim() || undefined;
  const cost =
    typeof inv.cost === 'number' ? inv.cost : Number(inv.cost) || undefined;
  const sell =
    typeof inv.sell === 'number' ? inv.sell : Number(inv.sell) || undefined;

  // Only return if at least one field exists
  if (!currency && !cost && !sell) return null;

  return { currency, cost, sell };
}

// ✅ 2025-12-31 UPDATE: Enhanced paxD extraction with better formatting
export function extractPaxD(api: HotelApiResponse): string {
  if (!api || typeof api !== 'object') return '';
  
  // Method 1: From paxD string (clean it up)
  if (typeof api.paxD === 'string' && api.paxD.trim().length > 0) {
    return api.paxD
      .replace(/\d+\s*room[s]?,?\s*/i, '')
      .trim()
      .replace(/^,/, '')
      .trim();
  }

  // Method 2: From search query
  const rooms = api.srchQ?.paxes?.rooms;
  if (Array.isArray(rooms) && rooms.length > 0) {
    let totalAdults = 0;
    let totalChildren = 0;
    rooms.forEach((room: any) => {
      totalAdults += Number(room.ad || 0);
      totalChildren += Number(room.ch || 0);
    });
    
    // Only create string if we have travelers
    if (totalAdults === 0 && totalChildren === 0) return '';
    
    const adultLabel = `${totalAdults} adult${totalAdults !== 1 ? 's' : ''}`;
    const childLabel =
      totalChildren > 0
        ? `, ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}`
        : '';
    return `${adultLabel}${childLabel}`;
  }

  // Method 3: From paxes string
  if (typeof api.paxes === 'string' && api.paxes.trim() !== '') {
    const parsed = parsePaxD(api.paxes);
    if (parsed.adults === 0 && parsed.children === 0) return '';
    
    const adultLabel = `${parsed.adults} adult${parsed.adults !== 1 ? 's' : ''}`;
    const childLabel =
      parsed.children > 0
        ? `, ${parsed.children} child${parsed.children !== 1 ? 'ren' : ''}`
        : '';
    return `${adultLabel}${childLabel}`.trim();
  }

  return '';
}

// ✅ 2025-12-31 UPDATE: Only return cancellation policy if it exists
export function extractCancellationPolicy(api: HotelApiResponse): {
  xpSmry?: string;
  xpA?: string[];
  xpD?: string;
} {
  if (!api || typeof api !== 'object') return {};

  const xpSmry = api.xpSmry?.trim() || api.cancellationSummary?.trim() || undefined;
  const xpA = Array.isArray(api.xpA) && api.xpA.length > 0 
    ? api.xpA.filter(Boolean) 
    : undefined;
  const xpD = api.xpD?.trim() || api.cancellationDetails?.trim() || undefined;

  // Only return object if at least one field exists
  if (!xpSmry && !xpA && !xpD) return {};

  return { xpSmry, xpA, xpD };
}
