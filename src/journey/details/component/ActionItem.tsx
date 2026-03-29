import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {CustomText} from '../../../common/components';
import {useTheme} from '../../../context/ThemeContext';
import {Colors} from '../../../styles';
import {useNavigation} from '@react-navigation/native';
import {ActionMiscData} from '../../action/types/actionTypes';
import {useDispatch} from 'react-redux';
import {useActionMisc} from '../../action/hooks/useActionMisc';
import {useActionHandlers} from '../../action/hooks/useActionHandlers';
import {executeAction} from '../../action/utils/actionExecutor';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {JourneyStackParamList} from '../../../navigators/types';
import {
  setBlkTravellersInfo,
  setHotelAlternativesOpen,
  setHotelSearchParams,
} from '../../../hotels/redux/hotelSlice';
import { setCarRentalsDetails } from '../../../car/redux/carRentalSlice';

interface ActionItemProps {
  date: string;
  action: any;
  blockId: string;
  sid: string;
  leftIcon?: React.ReactNode;
  grpName?: string;
  rightIcon?: React.ReactNode;
  hideText?: boolean;
  onSelect?: () => void;
  isBottomSheetItem?: boolean;
  btnStyle?: any;
  textColor?: string;
  textStyle?: any;
}

export default function ActionItem({
  date,
  action,
  blockId,
  sid,
  leftIcon,
  grpName,
  rightIcon,
  hideText,
  onSelect,
  isBottomSheetItem = false,
  btnStyle,
  textColor = 'neutral900',
  textStyle,
}: ActionItemProps) {
  const dispatch = useDispatch();
  const misc: ActionMiscData = useActionMisc(date, action, blockId, sid);
  const navigation =
  useNavigation<NativeStackNavigationProp<JourneyStackParamList>>();
  const handlers = useActionHandlers(misc, navigation);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePress = () => {
    // Handle ROAD_VEHICLE action - navigate to ContentCard screen
    if (action.ctype === 'ROAD_VEHICLE') {
      navigation.navigate('ContentCard', {
        actionType: 'ROAD_VEHICLE',
        date,
        blockId,
        sid,
        misc,
        action,
      });
    }
    // Handle Change Hotel action
    else if (action.ctype === 'HOTEL_ROOM' && action.name === 'Change Hotel') {
      dispatch(setHotelAlternativesOpen(true));
      dispatch(setBlkTravellersInfo({rmTvlG: misc?.rmTvlG, tvlG: misc?.tvlG}));
      const normalizedCityId =
        action.ctype !== 'HOTEL_ROOM' &&
        typeof misc.cityId === 'string' &&
        misc.cityId.includes('_')
          ? misc.cityId.split('_')[0]
          : misc.cityId;

      dispatch(
        setHotelSearchParams({
          cityId: normalizedCityId,
          checkinDate: misc.checkinDate,
          checkoutDate: misc.checkoutDate,
          nationality: misc.nationality,
          tvlrKeys: misc.tvlrKeys,
          jid: misc.jid,
          hotelSlug: action.otherData?.url,
          dayNum: misc.dayNum,
        } as any),
      );
      navigation.navigate('HotelListing');
      onSelect?.();
      return;
    }
  console.log('Action Pressed:', JSON.stringify(action, null, 2));
  
    // Special handling for CAR_RENTAL
    // Execute the action (sets Redux state via handler and navigates)
    if (action.ctype === 'CAR_RENTAL') {
      executeAction(action, handlers, setDialogOpen);
      onSelect?.();
      return;
    }

    onSelect?.();
  };


  

  if (isBottomSheetItem) {
    return (
      <TouchableOpacity style={styles.bottomSheetItem} onPress={handlePress}>
        <View style={styles.bottomSheetItemContent}>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <CustomText variant="text-base-normal" color="neutral900">
            {action.name}
          </CustomText>
        </View>
        {action.description && (
          <CustomText variant="text-sm-normal" color="neutral600">
            {action.description}
          </CustomText>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.regularActionItem, btnStyle]}
      onPress={handlePress}>
      {leftIcon}
      {!hideText && (
        <CustomText
          variant="text-sm-medium"
          color={textColor as any}
          style={textStyle}>
          {grpName || action.name}
        </CustomText>
      )}
      {rightIcon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  regularActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bottomSheetItem: {
    // paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  bottomSheetItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});