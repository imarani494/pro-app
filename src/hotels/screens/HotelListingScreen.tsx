import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeft, EditIcon, User} from 'lucide-react-native';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';

import {useNavigation} from '@react-navigation/native';

import HotelCard from './components/HotelCard';
import React, {useCallback, useEffect, useState} from 'react';
import {HotelFiltersRow} from './components/HotelFilterRow';
import CustomSwitchButton from '../../common/components/CustomSwitchButton';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../../store';
import {IhotelListingParams} from '../types/detailsType';
import {
  fetchHotels,
  setDetailsHotel,
  setHotelAlternativesOpen,
  setLayoutsetting,
  setPaxD,
  setPrD,
  setViewDetailsOnly,
} from '../redux/hotelSlice';
import {RsltA} from '../actions/hotelSearhListings';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {JourneyStackParamList} from '../../navigators/types';

const {width} = Dimensions.get('window');

export default function HotelListingScreen() {
  const navigate =
    useNavigation<NativeStackNavigationProp<JourneyStackParamList>>();
  const dispatch = useAppDispatch();
  const [showCommision, setShowCommision] = useState<boolean>(false);
  const hotelsListingData = useSelector(
    (state: RootState) => state.hotel.hotels,
  );
  const postData = useSelector(
    (state: RootState) => state.hotel.hotelSearchParams,
  );

  const bid = useSelector((state: RootState) => state.hotel.bid);

  useEffect(() => {
    dispatch(
      fetchHotels({...postData, bid: bid} as IhotelListingParams &
        Record<string, string[]>),
    );
  }, [bid, dispatch, postData]);

  const callHotelListing = useCallback(
    (filterObject?: Record<string, string[]>, tvlrKeys?: string) => {
      if (!postData) return;

      // Merge filters into base postData if provided
      let payload = {...postData};

      if (filterObject) {
        payload = {...payload, ...filterObject};
      }

      if (tvlrKeys) {
        payload = {...payload, tvlrKeys: JSON.stringify(tvlrKeys)};
      }

      // Add bid to payload
      const finalPayload: IhotelListingParams = {
        ...payload,
        bid: bid || '',
      };

      dispatch(fetchHotels(finalPayload));
    },
    [dispatch, postData, bid],
  );

  const formatPax = (pax: string = ''): string => {
    const adults = pax?.match(/(\d+)\s*adults?/i)?.[1] ?? '0';
    const rooms = pax?.match(/(\d+)\s*rooms?/i)?.[1] ?? '0';
    return `${adults} • ${rooms} Room`;
  };

  const setHotelDetail = ({item}: {item: RsltA}) => {
    const urlMatch = item.url.match(/\/hotels\/d\/([^/?]+)/);
    if (urlMatch && urlMatch[1]) {
      const hotelPath = `/hotels/d/${urlMatch[1]}`;
      console.log('hotel dets ----->', hotelPath);
      dispatch(setDetailsHotel(hotelPath));
      dispatch(setLayoutsetting('details'));
      dispatch(setHotelAlternativesOpen(true));
      dispatch(setViewDetailsOnly(true));
      dispatch(setPrD(item.prD));
      // dispatch(setPaxD(item?. || ''));
    }
    navigate.navigate('HotelDetail');
  };

  const renderItem = React.useCallback(
    ({item}: {item: RsltA}) => (
      <TouchableOpacity onPress={() => setHotelDetail({item})}>
        <HotelCard data={item} commision={showCommision} />
      </TouchableOpacity>
    ),
    [showCommision],
  );

  console.log('hotels LIST HERE --> ', hotelsListingData);
  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.headerWrapper}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 16}}>
          <ArrowLeft onPress={() => navigate.goBack()} />
          <View>
            <CustomText variant="text-base-semibold" color="neutral900">
              Search Hotels
            </CustomText>
            <CustomText variant="text-xs-normal" color="neutral600">
              {`${hotelsListingData?._data?.srchO?.nts} Nights ${hotelsListingData?._data?.srchO?.cnm}`}
            </CustomText>
          </View>
        </View>
        <View style={styles.leftActionButton}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', columnGap: 4}}>
            <User color={Colors.lightThemeColors.neutral500} size={14} />
            <CustomText color="neutral500">
              {formatPax(hotelsListingData?._data?.srchO?.paxD as string)}
            </CustomText>
          </View>
          <EditIcon size={20} />
        </View>
      </View>

      {/* Separator */}
      <View style={styles.separator}></View>

      <View>
        <HotelFiltersRow />
      </View>

      <View
        style={{
          backgroundColor: Colors.lightThemeColors.neutral100,
          paddingVertical: 10,
          rowGap: 10,
          paddingBottom: 280,
        }}>
        {/* Radio Button for commison */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}>
          <CustomText variant="text-xs-medium" color="neutral500">
            {`Showing “${hotelsListingData?._data.rsltA.length}” results`}
          </CustomText>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              alignItems: 'center',
              columnGap: 8,
            }}>
            <CustomText variant="text-xs-medium" color="neutral800">
              View commission
            </CustomText>

            <CustomSwitchButton
              value={showCommision}
              onToggle={setShowCommision}
            />
          </View>
        </View>

        {/* Hotel Cards Lising Section */}
        <FlatList
          data={hotelsListingData?._data.rsltA}
          keyExtractor={item => item.id as any} // stable unique id
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={8}
          windowSize={7}
          maxToRenderPerBatch={8}
          contentContainerStyle={{
            backgroundColor: Colors.lightThemeColors.neutral100,
            paddingVertical: 10,
            rowGap: 20,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    columnGap: 16,
    width: width * 0.9,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 5,
    justifyContent: 'space-between',
  },
  leftActionButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.lightThemeColors.neutral500,
    padding: 5,
    columnGap: 8,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.lightThemeColors.neutral300,
    marginTop: 5,
  },
});
