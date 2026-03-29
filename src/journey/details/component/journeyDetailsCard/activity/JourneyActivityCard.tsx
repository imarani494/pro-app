import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {Check, Utensils} from 'lucide-react-native';

import {useTheme} from '../../../../../context/ThemeContext';
import {CustomText} from '../../../../../common/components';
import {BUILDING} from '../../../../../utils/assetUtil';
import SummeryData from '../group/SummeryData';
import {SightseeingApiData} from './types/SightseeingTypes';
import {transformSightseeingApiData} from './utils/sightseeingDataTransformer';
import DashedDrawLine from '../../../../../common/components/DashedDrawLine';
import ReadMoreText from '../../../../../common/components/ReadMoreText';
import PointsToNote from '../../../../../common/components/PointsToNote';
import {useBottomSheet} from '../../../../../common/hooks/useBottomSheet';
import SightseeingDetailsModal from './components/SightseeingDetailsModal';
import SightseeingPointsToNoteModal from './components/SightseeingPointsToNoteModal';

interface JourneyActivityCardProps {
  containerStyle?: ViewStyle;
  apiData?: SightseeingApiData;
  onReadMorePress?: () => void;
  onSeeDetailsPress?: () => void;
  onRemovePress?: () => void;
  onOtherActionsPress?: () => void;
}

const checkIconSize = 16;
const utensilsIconSize = 12;

const JourneyActivityCard: React.FC<JourneyActivityCardProps> = ({apiData}) => {
  const {colors} = useTheme();

  const {
    bottomSheetRef: detailsBottomSheetRef,
    openBottomSheet: openDetailsBottomSheet,
    closeBottomSheet: closeDetailsBottomSheet,
  } = useBottomSheet();

  const {
    bottomSheetRef: notesBottomSheetRef,
    openBottomSheet: openNotesBottomSheetRaw,
    closeBottomSheet: closeNotesBottomSheet,
  } = useBottomSheet();

  const handleOpenNotesBottomSheet = React.useCallback(() => {
    notesBottomSheetRef.current?.present();
    notesBottomSheetRef.current?.snapToIndex?.(0); // collapsed
  }, [notesBottomSheetRef]);

  React.useEffect(() => {
    if (apiData && notesBottomSheetRef.current) {
      notesBottomSheetRef.current.snapToIndex?.(1); // expand
    }
  }, [apiData, notesBottomSheetRef]);

  const currentSightseeingData = React.useMemo(() => {
    return apiData ? transformSightseeingApiData(apiData) : undefined;
  }, [apiData]);

  if (!currentSightseeingData) {
    return null;
  }

  const variantsCount = apiData?.numVariants || 0;
  const hasVariants = variantsCount > 1;

  const hasPointsToNote =
    (apiData?.ntA && Array.isArray(apiData.ntA) && apiData.ntA.length > 0) ||
    (apiData?.exTA && Array.isArray(apiData.exTA) && apiData.exTA.length > 0);

  const hasMealsIncluded = currentSightseeingData.hasMealsIncluded;
  const transportLabel =
    currentSightseeingData.transferDisplayText || 'Private Transfer';

  const generateTimeSlots = () => {
    const slots: string[] = [];
    if (currentSightseeingData.timeSlot) {
      slots.push(`Selected time slot: ${currentSightseeingData.timeSlot}`);
    }
    if (
      currentSightseeingData.duration &&
      !currentSightseeingData.timeSlot?.includes(
        currentSightseeingData.duration,
      )
    ) {
      slots.push(currentSightseeingData.duration);
    }
    return slots;
  };

  const formattedSlotTime = React.useMemo(() => {
    if (!currentSightseeingData.timeSlot) return null;
    const match = currentSightseeingData.timeSlot.match(/^(.+?)\s*\(/);
    return match ? match[1].trim() : currentSightseeingData.timeSlot;
  }, [currentSightseeingData.timeSlot]);

  const timeSlots = React.useMemo(() => {
    const slots: string[] = [];
    if (formattedSlotTime) {
      slots.push(`Selected time slot: ${formattedSlotTime}`);
    }
    if (
      currentSightseeingData.duration &&
      !formattedSlotTime?.includes(currentSightseeingData.duration)
    ) {
      slots.push(currentSightseeingData.duration);
    }
    return slots;
  }, [formattedSlotTime, currentSightseeingData.duration]);

  return (
    <View style={styles.wrapper}>
      {currentSightseeingData.image ? (
        <View style={[styles.imageContainer, {backgroundColor: colors.white}]}>
          <Image
            source={{uri: currentSightseeingData.image}}
            style={styles.tripImage}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View style={[styles.imageContainer, {backgroundColor: colors.white}]}>
          <Image
            source={BUILDING}
            style={styles.tripImage}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={styles.titleSection}>
        <CustomText variant="text-base-semibold" color="darkCharcoal">
          {currentSightseeingData.title}
        </CustomText>
      </View>

      <SummeryData
        travelers={currentSightseeingData.travelers}
        paxD={apiData?.paxD || currentSightseeingData.passengerInfo}
      />

      <View style={styles.badgesContainer}>
        {currentSightseeingData.transferDisplayText && (
          <TouchableOpacity
            style={[
              styles.singleBadge,
              styles.privateTransferBadge,
              {backgroundColor: colors.lightPurple100},
            ]}
            activeOpacity={0.8}>
            <CustomText
              variant="text-xs-medium"
              color="lightPurple900"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{flexShrink: 1}}>
              {transportLabel}
            </CustomText>
          </TouchableOpacity>
        )}

        {hasMealsIncluded && currentSightseeingData.mealTypeName && (
          <TouchableOpacity
            style={[
              styles.singleBadge,
              styles.mealsIncludedBadge,
              {backgroundColor: colors.greenChip},
            ]}
            activeOpacity={0.8}>
            <Utensils size={utensilsIconSize} color={colors.green900} />
            <CustomText
              variant="text-xs-medium"
              color="green900"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{flexShrink: 1}}>
              {currentSightseeingData.mealTypeName} included
            </CustomText>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          height: 1,
          marginVertical: 18,
          backgroundColor: colors.neutral300,
        }}
      />

      {currentSightseeingData.description && (
        <View style={styles.descriptionContainer}>
          <ReadMoreText
            text={currentSightseeingData.description}
            maxLength={150}
            variant="text-xs-normal"
            color="neutral500"
            readMoreColor="neutral900"
            readMoreVariant="text-xs-semibold"
            onReadMorePress={openDetailsBottomSheet}
          />
        </View>
      )}

      {timeSlots.length > 0 && (
        <View style={styles.timeSlotsWrapper}>
          <View
            style={[
              styles.timeSlotsContainer,
              {
                backgroundColor: colors.neutral50,
                borderColor: colors.neutral200,
              },
            ]}>
            <View style={styles.timeSlotsContent}>
              {timeSlots.map((timeSlot, index) => (
                <View key={`timeslot-${index}`} style={styles.singleTimeSlot}>
                  <Check size={checkIconSize} color={colors.green700} />
                  <CustomText variant="text-xs-normal" color="neutral500">
                    {timeSlot}
                  </CustomText>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {hasVariants && (
        <View style={[styles.container, {borderColor: colors.neutral200}]}>
          <View
            style={[styles.leftLine, {borderLeftColor: colors.darkCharcoal}]}
          />
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <CustomText variant="text-base-semibold" color="darkCharcoal">
                Explore other variants
              </CustomText>
              <CustomText variant="text-xs-normal" color="neutral500">
                {variantsCount > 1
                  ? `${variantsCount - 1} more ${
                      variantsCount - 1 === 1 ? 'variant' : 'variants'
                    } available`
                  : `${variantsCount} variant available`}
              </CustomText>
            </View>
            <TouchableOpacity
              style={[styles.button, {borderColor: colors.neutral200}]}>
              <CustomText variant="text-xs-medium" color="neutral500">
                View all
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Points To Note */}
      {hasPointsToNote && <PointsToNote onPress={handleOpenNotesBottomSheet} />}

      <DashedDrawLine
        dashLength={4}
        dashGap={4}
        dashColor={colors.neutral300}
        dashThickness={1}
        style={{width: '100%', marginTop: 16}}
      />

      <SightseeingDetailsModal
        bottomSheetRef={detailsBottomSheetRef}
        onClose={closeDetailsBottomSheet}
        data={currentSightseeingData}
      />

      <SightseeingPointsToNoteModal
        bottomSheetRef={notesBottomSheetRef}
        onClose={closeNotesBottomSheet}
        activityName={currentSightseeingData.title}
        apiData={apiData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: 14,
    paddingTop: 16,
  },
  imageContainer: {
    borderRadius: 8,
    height: 128,
    overflow: 'hidden',
    position: 'relative',
  },
  tripImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  leftLine: {
    width: 0,
    height: 24,
    borderLeftWidth: 2,
    marginTop: -18,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  button: {
    width: 70,
    height: 35,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginTop: 10,
  },
  singleBadge: {
    minHeight: 22,
    borderRadius: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    minWidth: 90,
    maxWidth: '100%',
    marginBottom: 6,
  },
  privateTransferBadge: {},
  mealsIncludedBadge: {
    flexDirection: 'row',
    gap: 4,
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  timeSlotsWrapper: {
    marginBottom: 8,
  },
  timeSlotsContainer: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeSlotsContent: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  singleTimeSlot: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    width: '90%',
  },
});

export default JourneyActivityCard;
