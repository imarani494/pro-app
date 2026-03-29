// JourneyGroupTourCard.tsx
import React, {useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ViewStyle,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import {Check, MapPin} from 'lucide-react-native';
import {BUILDING} from '../../../../../utils/assetUtil';
import {useTheme} from '../../../../../context/ThemeContext';
import {CustomText} from '../../../../../common/components';
import DashedDrawLine from '../../../../../common/components/DashedDrawLine';
import ReadMoreText from '../../../../../common/components/ReadMoreText';
import {useBottomSheet} from '../../../../../common/hooks/useBottomSheet';

import {
  getHighlightsSummary,
  getDisplayHighlights,
  getTravelersFromApi,
} from './utils/groupTourHelpers';
import SummeryData from './SummeryData';
import {GroupTourApiData} from './types/GroupTourTypes';
import GroupTourDetailsModal from './components/GroupTourDetailsModal';
import MoreHighlightsModal from './components/MoreHighlightsModal';

interface JourneyGroupTourCardProps {
  containerStyle?: ViewStyle;
  imageSource?: ImageSourcePropType;
  apiData: GroupTourApiData;
  onReadMorePress?: () => void;
}

const ICON_SIZES = {
  mapPin: 16,
  check: 16,
} as const;

const JourneyGroupTourCard: React.FC<JourneyGroupTourCardProps> = ({
  imageSource,
  apiData,
}) => {
  const {colors} = useTheme();

  const {
    bottomSheetRef: detailsSheetRef,
    openBottomSheet: openDetailsSheet,
    closeBottomSheet: closeDetailsSheet,
  } = useBottomSheet();
  const {
    bottomSheetRef: highlightsSheetRef,
    openBottomSheet: openHighlightsSheet,
    closeBottomSheet: closeHighlightsSheet,
  } = useBottomSheet();

  const [showAllHighlights, setShowAllHighlights] = useState(false);

  if (!apiData?.pkgName) {
    return null;
  }

  const highlightsSummary = useMemo(
    () => getHighlightsSummary(apiData.pkgDstSmry),
    [apiData.pkgDstSmry],
  );

  const {displayHighlights, remainingCount} = useMemo(
    () => getDisplayHighlights(apiData.hgh, 4, showAllHighlights),
    [apiData.hgh, showAllHighlights],
  );

  const travelers = useMemo(
    () => getTravelersFromApi(apiData.tvlG),
    [apiData.tvlG],
  );

  const remainingHighlights = useMemo(() => {
    if (!apiData.hgh || apiData.hgh.length <= 4) {
      return [];
    }
    return apiData.hgh.slice(4);
  }, [apiData.hgh]);

  const handleMoreHighlightsPress = () => {
    openHighlightsSheet();
  };

  const handleReadMorePress = () => {
    openDetailsSheet();
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.imageWrapper, {backgroundColor: colors.white}]}>
        <Image
          source={imageSource || BUILDING}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.titleContainer}>
        <CustomText variant="text-base-semibold" color="neutral900">
          {apiData.pkgName}
        </CustomText>

        <View style={styles.mapView}>
          <MapPin
            size={ICON_SIZES.mapPin}
            style={styles.mapIcon}
            color={colors.neutral500}
          />
          <View style={styles.mapTextContainer}>
            <CustomText variant="text-sm-normal" color="neutral500">
              {apiData.itnDsp}
            </CustomText>
          </View>
        </View>
      </View>

      {/* Travelers Summary */}
      <SummeryData travelers={travelers} paxD={apiData.paxD} />

      <View style={[styles.divider, {backgroundColor: colors.neutral300}]} />

      {/* Description with Read More */}
      <View style={styles.descriptionView}>
        <ReadMoreText
          text={apiData.pkgDescription || ''}
          maxLength={120}
          variant="text-xs-medium"
          color="neutral500"
          readMoreColor="neutral900"
          readMoreVariant="text-xs-medium"
          underline={false}
          onReadMorePress={handleReadMorePress}
        />
      </View>

      {/* Tour Highlights */}
      <View
        style={[
          styles.tourTimingContainer,
          {
            backgroundColor: colors.neutral50,
            borderColor: colors.neutral200,
          },
        ]}>
        <CustomText variant="text-sm-semibold" color="neutral900">
          Highlights:
        </CustomText>

        <View
          style={[
            styles.cityView,
            {
              backgroundColor: colors.white,
              borderColor: colors.neutral200,
            },
          ]}>
          <CustomText
            variant="text-xs-medium"
            color="neutral900"
            numberOfLines={1}>
            {highlightsSummary}
          </CustomText>
        </View>

        <View style={styles.timeSlotContent}>
          {displayHighlights.map((highlight, index) => (
            <View key={`${highlight}-${index}`} style={styles.textTick}>
              <Check
                size={ICON_SIZES.check}
                color={colors.green700}
                style={styles.checkIcon}
              />
              <CustomText
                variant="text-xs-normal"
                color="neutral500"
                style={styles.highlightText}>
                {highlight}
              </CustomText>
            </View>
          ))}

          {apiData.hgh && apiData.hgh.length > 4 && remainingCount > 0 && (
            <TouchableOpacity
              onPress={handleMoreHighlightsPress}
              activeOpacity={0.7}
              style={styles.showMoreButton}>
              <View style={styles.textTick}>
                <Check
                  size={ICON_SIZES.check}
                  color={colors.green700}
                  style={styles.checkIcon}
                />
                <CustomText
                  variant="text-xs-normal"
                  color="neutral500"
                  style={styles.highlightTextUnderline}>
                  +{remainingCount} more
                </CustomText>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <DashedDrawLine
        dashLength={4}
        dashGap={4}
        dashColor={colors.neutral300}
        dashThickness={1}
        style={styles.dashedLine}
      />

      {/* Full Details Modal */}
      <GroupTourDetailsModal
        bottomSheetRef={detailsSheetRef}
        onClose={closeDetailsSheet}
        data={apiData}
        buttonTitle="Okay, got it"
        onButtonPress={() => {
          console.log('Group Tour details modal closed');
        }}
      />

      {/* More Highlights Modal - Shows only remaining highlights */}
      <MoreHighlightsModal
        bottomSheetRef={highlightsSheetRef}
        onClose={closeHighlightsSheet}
        highlights={remainingHighlights}
        packageName={apiData.pkgName}
        buttonTitle="Okay, got it"
        onButtonPress={() => {
          console.log('More highlights modal closed');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 14,
    paddingTop: 20,
  },
  imageWrapper: {
    borderRadius: 8,
    height: 128,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  titleContainer: {
    width: '100%',
    paddingTop: 12,
    alignItems: 'flex-start',
    alignSelf: 'center',
    flexDirection: 'column',
  },
  mapView: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
    width: '100%',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  mapIcon: {
    marginTop: 3,
  },
  mapTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  descriptionView: {
    width: '100%',
    marginBottom: 20,
  },
  tourTimingContainer: {
    width: '100%',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  cityView: {
    flexDirection: 'row',
    minHeight: 26,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  timeSlotContent: {
    flexDirection: 'column',
    gap: 8,
    width: '100%',
  },
  textTick: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    width: '100%',
  },
  checkIcon: {
    flexShrink: 0,
    marginTop: 2,
  },
  highlightText: {
    flex: 1,
    flexWrap: 'wrap',
  },
  highlightTextUnderline: {
    flex: 1,
    flexWrap: 'wrap',
    textDecorationLine: 'underline',
  },
  showMoreButton: {
    width: '100%',
  },
  dashedLine: {
    width: '100%',
    marginTop: 20,
  },
});

export default JourneyGroupTourCard;
