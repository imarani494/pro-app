import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../../store';
import {fetchHotelDetails} from '../redux/hotelSlice';
import HotelDetails from './components/HotelDetail';
import {useRoute} from '@react-navigation/native';
import {IHotelDetailsData} from '../types/detailsType';
import User from '../../data/User';

export default function HotelDetailScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const params = route.params as any;

  const selectedHotelDetails = useSelector(
    (state: RootState) => state.hotel.selectedHotelDetails,
  );
  const hotelSearchParams = useSelector(
    (state: RootState) => state.hotel.hotelSearchParams,
  );
  const detailsHotel = useSelector(
    (state: RootState) => state.hotel.detailsHotel,
  );
  const bid = useSelector((state: RootState) => state.hotel.bid);
  const {paxD} = useSelector((state: RootState) => state.hotel);

  useEffect(() => {
    // Fetch hotel details when component mounts
    // Priority: detailsHotel (set from navigation) > params.hotelSlug > hotelSearchParams.hotelSlug
    const hotelSlug =
      detailsHotel || params?.hotelSlug || hotelSearchParams?.hotelSlug;

    if (hotelSlug) {
      const fetchParams = {
        ...hotelSearchParams,
        hotelSlug: hotelSlug,
        bid: bid,
        userId: User.getUserId(), // Add userId from User
        // _auth will be added by AppConfig.appConfigParams
      };
      dispatch(fetchHotelDetails(fetchParams as any));
    } else {
      console.log('No hotelSlug found, skipping fetch');
    }
  }, [
    detailsHotel,
    params?.hotelSlug,
    hotelSearchParams?.hotelSlug,
    bid,
    dispatch,
  ]);

  console.log(selectedHotelDetails);

  return (
    <HotelDetails
      data={selectedHotelDetails?._data as IHotelDetailsData}
      paxD={paxD as string}
    />
  );
}
