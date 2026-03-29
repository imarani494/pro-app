import {ArrowLeft, SquarePen} from 'lucide-react-native';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomText} from '../../../common/components';
import {Colors} from '../../../styles';
import RoomCard from './components/RoomCard';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {useMemo} from 'react';
import {RmA, RoptA} from '../../types/detailsType';
import filterSelectedRooms from '../../hooks/filterSelectedHotelRooms';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {JourneyStackParamList} from '../../../navigators/types';

const {width} = Dimensions.get('window');

export default function SelectedRoomListing() {
  const navigation =
    useNavigation<NativeStackNavigationProp<JourneyStackParamList>>();

  const selectedHotelDetails = useSelector(
    (state: RootState) => state.hotel.selectedHotelDetails?._data,
  );

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft />
          </TouchableOpacity>
          <View style={styles.headerDetails}>
            <CustomText variant="text-sm-medium" color="neutral900">
              {selectedHotelDetails?.details?.hotelName}
            </CustomText>
            <CustomText variant="text-xs-normal" color="neutral500">
              23 Feb - 01 Mar
            </CustomText>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 200}}>
        {filterSelectedRooms(
          selectedHotelDetails?.rmA as RmA[],
          selectedHotelDetails?.rmCfg.rmPaxTxt.length,
        ).map((item, idx) => (
          <View
            key={idx}
            style={{
              width: width * 0.9,
              alignSelf: 'center',
              marginVertical: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <CustomText variant="text-lg-semibold" color="neutral700">
                {`Room #${idx + 1}`}
              </CustomText>
              <TouchableOpacity
                onPress={() => navigation.navigate('RoomListing')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: Colors.lightThemeColors.neutral400,
                  padding: 8,
                  columnGap: 4,
                }}>
                <SquarePen size={16} />
                <CustomText color="neutral900" variant="text-sm-medium">
                  Change
                </CustomText>
              </TouchableOpacity>
            </View>
            <RoomCard key={idx} roomData={item} isSelectedValue={true} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingBottom: 12,
    borderWidth: 1,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.lightThemeColors.neutral200,
  },
  header: {
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: Colors.lightThemeColors.neutral50,
    borderColor: Colors.lightThemeColors.neutral200,
    width: width * 0.9,
    alignSelf: 'center',
    padding: 12,
    borderRadius: 8,
    columnGap: 12,
    alignItems: 'center',
  },
  headerDetails: {
    flexDirection: 'column',
    rowGap: 2,
    alignSelf: 'flex-start',
  },
});
