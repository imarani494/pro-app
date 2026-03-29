import HttpRequest from '../../../../utils/HttpRequest';
import AppConfig from '../../../../config/AppConfig';

export async function fetchHotelDetailsApi(request: any) {
  console.log('fetchHotelDetailsApi called with params:', request);
  try {
    // Extract hotelSlug to construct URL
    const {hotelSlug, ...otherParams} = request;

    if (!hotelSlug) {
      throw new Error('hotelSlug is required');
    }

    // Construct URL: Full path like "/hotels/d/galleria-10-sukhumvit-bangkok-by-compass-hospitality-65498"
    let url: string;
    if (hotelSlug?.startsWith('/')) {
      url = `/api${hotelSlug}`;
    } else {
      url = `/api/hotels/d/${hotelSlug}`;
    }

    // Build flat payload matching web curl exactly
    // Web expects: cityId, checkinDate, checkoutDate, nationality, tvlrKeys,
    // jid, hotelSlug, dayNum, isConciseLoad, userId, bid
    // AppConfig will add: application, device_id, app_version, isTablet, userAgent, _auth
    const payload: Record<string, any> = {
      cityId: otherParams.cityId,
      checkinDate: otherParams.checkinDate,
      checkoutDate: otherParams.checkoutDate,
      nationality: otherParams.nationality,
      tvlrKeys: otherParams.tvlrKeys, // Already stringified array
      jid: otherParams.jid,
      hotelSlug: hotelSlug,
      dayNum: otherParams.dayNum || 1,
      isConciseLoad:
        otherParams.isConciseLoad !== undefined
          ? otherParams.isConciseLoad
          : false,
    };

    // Add optional fields if present
    if (otherParams.userId) payload.userId = otherParams.userId;
    if (otherParams.bid) payload.bid = otherParams.bid;

    // Remove undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    console.log('Hotel Details Request:', {url, payload});

    // HttpRequest.post will call appConfigParams which adds app metadata
    // The backend will read the flat parameters at root level (ignoring 'data' field)
    const response = await HttpRequest.post(url, payload);
    console.log('response from fetchHotelDetailsApi', response);

    return response;
  } catch (error: any) {
    console.error('Hotel Details API Error:', error);
    return {success: false, error_msg: error.message || 'error!!'};
  }
}
