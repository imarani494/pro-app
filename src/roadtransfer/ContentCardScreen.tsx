import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import {Colors} from '../styles';
import RoadTransportSidebar from './components/RoadTransportSidebar';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {JourneyStackParamList} from '../navigators/types';
import {
  openContentCardSlider,
  closeContentCardSlider,
  resetContentOptions,
} from '../contentCard/redux/contentCardSlice';
import {CustomText} from '../common/components';
import {ContentCardQueryType} from '../contentCard/types/contentCard';

import {useContentCard} from '../contentCard/hooks/useContentCard';
import DateUtil from '../utils/DateUtil';

type ContentCardScreenRouteProp = RouteProp<
  JourneyStackParamList,
  'ContentCard'
>;

export default function ContentCardScreen() {
  const navigation = useNavigation();
  const route = useRoute<ContentCardScreenRouteProp>();
  const dispatch = useDispatch();
  const contentCardState = useSelector((state: RootState) => state.contentCard);
  const contentCard = useContentCard();

  const {actionType, date, blockId, sid, misc, action} = route.params || {};

  useEffect(() => {
    if (actionType === 'ROAD_VEHICLE' && misc) {
      dispatch(
        openContentCardSlider({
          open: true,
          query: {
            qt: ContentCardQueryType.LISTINGS,
            onDate: date,
            blockId: blockId,
            type: actionType,
            dayNum: misc.dayNum,
            tvlG: {
              tvlA: misc.tvlG || [],
            },
            cityId: misc.cityId,
            sid: sid,
            actionData: {
              ctype: 'ROAD_VEHICLE',
              otherData: action?.otherData || {},
            },
          },
          addPrms: {},
          rstTvlG: {
            tvlA: misc.tvlG || [],
          },
        } as any),
      );
    }
  }, [actionType, date, blockId, sid, misc, action, dispatch]);

  const handleClose = () => {
    dispatch(resetContentOptions());
    dispatch(closeContentCardSlider());
    navigation.goBack();
  };

  const actionData = contentCardState.context?.query?.actionData || {};
  const actionCtype = actionData?.ctype;

  const isRoadVehicle =
    actionType === 'ROAD_VEHICLE' || actionCtype === 'ROAD_VEHICLE';

  const formattedOnDate = useMemo(() => {
    const onDate = contentCardState?.context?.query?.onDate;
    if (!onDate) return '';
    try {
      return DateUtil.getDisplayDate(onDate);
    } catch {
      return '';
    }
  }, [contentCardState?.context?.query?.onDate]);

  const subtitle = useMemo(() => {
    const cityName = contentCardState?.context?.query?.cityName;
    const dayNum = contentCardState?.context?.query?.dayNum;
    const dayNumD = contentCardState?.context?.dayNumD;

    if (!cityName && !dayNum) {
      return '';
    }

    const dayPart = dayNum ? `Day ${dayNumD || dayNum}` : '';
    const datePart = formattedOnDate ? `: ${formattedOnDate}` : '';

    if (cityName && dayPart) {
      return `${cityName} (${dayPart}${datePart})`;
    } else if (cityName) {
      return cityName;
    } else if (dayPart) {
      return `${dayPart}${datePart}`;
    }

    return '';
  }, [
    contentCardState?.context?.query?.dayNum,
    contentCardState?.context?.query?.cityName,
    contentCardState?.context?.dayNumD,
    formattedOnDate,
  ]);

  if (!isRoadVehicle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <CustomText variant="text-base-normal" color="neutral600">
            Content type not supported yet
          </CustomText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RoadTransportSidebar onClose={handleClose} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.neutral100,
  },
  content: {
    flex: 1,
  },
});
