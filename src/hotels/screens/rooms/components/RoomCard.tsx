import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CustomText} from '../../../../common/components';
import {Colors} from '../../../../styles';
import {RoptA} from '../../../types/detailsType';
import {Check, Cross, X} from 'lucide-react-native';
import DashedLine from '../../../../common/components/DashedLine';
import {useState} from 'react';
import {borderRadius} from '../../../../styles/outlines';

const {width} = Dimensions.get('window');

const RoomCard = ({
  roomData,
  isSelectedValue = false,
  isRoomListingScreen = false,
  showCommison,
}: {
  roomData: RoptA;
  isSelectedValue?: boolean;
  isRoomListingScreen?: boolean;
  showCommison?: boolean;
}) => {
  const [isSelected, setisSelected] = useState<boolean>(isSelectedValue);
  return (
    <View
      style={[
        styles.cardWrapper,
        isSelected && (isRoomListingScreen as boolean)
          ? {borderColor: Colors.lightThemeColors.neutral800}
          : {borderColor: Colors.lightThemeColors.neutral200},
      ]}>
      <View style={styles.cardHeader}>
        <View style={{rowGap: 0}}>
          <View style={{width: width * 0.58}}>
            <CustomText variant="text-sm-semibold" color="neutral900">
              {roomData.name}
            </CustomText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 8,
            }}>
            <CustomText variant="text-xs-normal" color="neutral500">
              Total Price
            </CustomText>
            <CustomText variant="text-lg-bold" color="neutral900">
              {roomData?.prD}
            </CustomText>
            {showCommison && (
              <View
                style={{
                  backgroundColor: Colors.lightThemeColors.amber100,
                  padding: 4,
                  borderRadius: 6,
                }}>
                <CustomText variant="text-sm-medium" color="amber800">
                  {roomData?.cmsD}
                </CustomText>
              </View>
            )}
          </View>
        </View>

        {/* Selected Button */}
        <TouchableOpacity
          onPress={() => {
            if (!isRoomListingScreen) {
              return;
            }
            setisSelected(!isSelected);
          }}
          style={[
            styles.selectButton,
            isSelected
              ? {backgroundColor: '#D6F1DF', paddingHorizontal: 8}
              : {
                  backgroundColor: Colors.lightThemeColors.neutral100,
                  borderWidth: 1,
                  borderColor: Colors.lightThemeColors.neutral400,
                  paddingHorizontal: 28,
                },
          ]}>
          {isSelected && (
            <Check size={16} color={Colors.lightThemeColors.green800} />
          )}
          <CustomText color={isSelected ? 'green900' : 'neutral900'}>
            {isSelected ? 'Selected' : 'Select'}
          </CustomText>
        </TouchableOpacity>
      </View>
      <DashedLine
        dashColor={Colors.lightThemeColors.neutral300}
        dashLength={8}
        style={{marginVertical: 18}}
      />
      <View style={{rowGap: 8}}>
        {roomData?.key.map((item, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 10,
            }}>
            <Check size={16} color={Colors.lightThemeColors.neutral600} />
            <CustomText
              variant="text-sm-normal"
              color={'neutral700'}
              style={{flexShrink: 1}}>
              {item}
            </CustomText>
          </View>
        ))}
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 10,
            },
          ]}>
          {roomData?.xpSmry == 'Non-refundable' ? (
            <X size={16} color={Colors.lightThemeColors.red600} />
          ) : (
            <Check size={16} color={Colors.lightThemeColors.green800} />
          )}
          <CustomText
            variant="text-sm-normal"
            color={
              roomData?.xpSmry == 'Non-refundable' ? 'red600' : 'green800'
            }>
            {roomData?.xpSmry}
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default RoomCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: 10,
    width: width * 0.9,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 1,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 12,
    columnGap: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
});
