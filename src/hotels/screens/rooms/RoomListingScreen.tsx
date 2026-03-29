import {
  Dimensions,
  StyleSheet,
  View,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import {CustomText} from '../../../common/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  AirVent,
  ArrowLeft,
  Bath,
  BedDouble,
  ListFilter,
  Search,
  SquarePen,
  Tv,
  User,
  Wifi,
} from 'lucide-react-native';
import {Colors} from '../../../styles';
import TravelerSummary from '../../../common/components/TravelersTag';
import CustomSwitchButton from '../../../common/components/CustomSwitchButton';
import {useState} from 'react';
import DashedLine from '../../../common/components/DashedLine';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import RoomCard from './components/RoomCard';
import {useNavigation} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';

const {width, height} = Dimensions.get('window');
export default function RoomListingScreen() {
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  const navigation = useNavigation();
  const selectedHotel = useSelector(
    (state: RootState) => state.hotel.selectedHotelDetails?._data,
  );

  const detail = useSelector((state: RootState) => state.hotel.detailsHotel);
  console.log('checkout this hotel', detail);
  console.log('selectedHotelDetailsHere ==', selectedHotel);
  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      {/* top header */}
      <View style={styles.header}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: '16'}}>
          <ArrowLeft onPress={() => navigation.goBack()} size={24} />
          <CustomText variant="text-base-semibold" color="neutral900">
            Change Room
          </CustomText>
        </View>
        <View style={styles.squarePenButton}>
          <User size={16} color={Colors.lightThemeColors.neutral500} />
          <CustomText variant="text-xs-normal" color="neutral500">
            8 . 4 Rooms
          </CustomText>
          <SquarePen size={16} />
        </View>
      </View>

      {/* room overview  and commision switch*/}
      <View style={styles.roomOverViewContainer}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 12}}>
          <CustomText variant="text-sm-medium" color="neutral800">
            Room #1
          </CustomText>
          <TravelerSummary travelers={['0', '1']} />
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 8}}>
          <CustomText variant="text-xs-medium" color="neutral800">
            View Commission
          </CustomText>
          <CustomSwitchButton onToggle={setSwitchValue} value={switchValue} />
        </View>
      </View>
      <View style={styles.line} />

      {/* Search bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <Search size={16} color={Colors.lightThemeColors.neutral500} />

          <TextInput
            placeholder="Search"
            placeholderTextColor={Colors.lightThemeColors.neutral500}
            style={{
              flex: 1,
              fontSize: 14,
              color: Colors.lightThemeColors.neutral900,
              padding: 0,
            }}
          />
        </View>
        <View style={styles.filterOption}>
          <ListFilter size={16} color={Colors.lightThemeColors.neutral900} />
        </View>
      </View>

      {/* room listing */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 200}}>
        <View>
          {selectedHotel?.rmA.map((item, idx) => (
            <View key={idx}>
              <View style={styles.border}>
                <CustomText variant="text-base-semibold" color="neutral900">
                  {item.nm}
                </CustomText>
                {item?.szD && (
                  <CustomText variant="text-xs-normal" color="neutral500">
                    Size - {item?.szD}
                  </CustomText>
                )}
              </View>
              <View style={styles.imageRow}>
                {item.dsc && (
                  <View
                    style={{
                      width: width * 0.6,
                      overflow: 'hidden',
                      height: height * 0.08,
                    }}>
                    <RenderHTML
                      contentWidth={width}
                      source={{html: item.dsc as string}}
                      tagsStyles={{
                        p: {marginVertical: 4, color: '#444', fontSize: 12},
                        b: {fontWeight: '600'},
                        strong: {fontWeight: '600'},
                      }}
                    />
                  </View>
                )}
                {(item.imgA?.length as number) > 0 && (
                  <Image
                    source={{
                      uri: item?.imgA?.[0] as string,
                    }}
                    style={{
                      width: '30%',
                      height: height * 0.08,
                      borderRadius: 8,
                      alignSelf: 'flex-start',
                    }}
                  />
                )}
              </View>
              <View style={{width: width * 0.9, alignSelf: 'center'}}>
                {(item?.dsc ||
                  ((item.imgA?.length as number) ||
                    (item.amA?.length as number)) > 0) && (
                  <View>
                    <DashedLine
                      dashGap={6}
                      dashColor={Colors.lightThemeColors.neutral300}
                      style={{
                        marginVertical: 8,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap', // ⭐ key
                        gap: 6, // or rowGap / columnGap
                      }}>
                      {item.amA?.map((text, idx) => (
                        <CustomText
                          key={idx}
                          variant="text-xs-normal"
                          color="neutral500">
                          {text}
                        </CustomText>
                      ))}
                    </View>
                  </View>
                )}
                {item.roptA.slice(0, 3).map((value, idx) => (
                  <View key={idx}>
                    <RoomCard
                      roomData={value}
                      isRoomListingScreen={true}
                      showCommison={switchValue}
                    />
                    {item.roptA.length > 3 && idx === 2 && (
                      <View
                        style={{
                          width: width * 0.9,
                          backgroundColor: Colors.lightThemeColors.neutral100,
                          padding: 12,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 12,
                          marginVertical: 8,
                        }}>
                        <CustomText variant="text-sm-medium" color="neutral900">
                          {`View ${item.roptA.length - 3} more`}
                        </CustomText>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  squarePenButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral300,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    columnGap: 6,
  },
  roomOverViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
    alignSelf: 'center',
    alignItems: 'center',
  },
  line: {
    height: 1,
    backgroundColor: Colors.lightThemeColors.neutral200,
    marginVertical: 8,
  },

  // search bar
  searchBarWrapper: {
    width: width * 0.9,
    alignSelf: 'center',
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral300,
    width: width * 0.75,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  filterOption: {
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral300,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  // room listing
  border: {
    backgroundColor: Colors.lightThemeColors.neutral100,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  imageRow: {
    width: width * 0.9,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    alignItems: 'center',
  },
});
