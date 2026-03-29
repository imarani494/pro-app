import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  CustomBottomSheet,
  CustomText,
  SelectableInput,
  DateCalendarBottomSheet,
  TravelersBottomSheet,
} from '../../../common/components';
import {Colors} from '../../../styles';
import {useBottomSheet} from '../../../common/hooks/useBottomSheet';
import {useTheme} from '../../../context/ThemeContext';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import AutoCompleteBottomSheet from '../../../common/components/AutoCompleteBottomSheet';
import {flex} from '../../../styles/typography';
import {Check, Star} from 'lucide-react-native';
import DateUtil from '../../../utils/DateUtil';
import moment from 'moment';
import DashedLine from '../../../common/components/DashedLine';

export interface EnterTripDetailsProps {
  tripDetails: any;
  setTripDetails: (details: any) => void;
  travelerSelection: any;
  setTravelerSelection?: (selection: any) => void;
  setShowTravelerDropdown: (show: boolean) => void;
  showTravelerDropdown: boolean;
  updateRoomAdults: (roomId: string, adults: number) => void;
  updateRoomChildren: (roomId: string, childrenCount: number) => void;
  updateChildAge: (roomId: string, childId: string, age: string) => void;
  removeRoom: (roomId: string) => void;
  addRoom: () => void;
  childAgeOptions: string[];
  starRatingOptions: any[];
  tripDetailsData: any;
  missingFields: any;
  clearFieldError: (field: string) => void;
  isEditMode: boolean;
}

const EnterTripDetails = ({
  tripDetails,
  setTripDetails,
  travelerSelection,
  setTravelerSelection,
  setShowTravelerDropdown,
  showTravelerDropdown,
  updateRoomAdults,
  updateRoomChildren,
  updateChildAge,
  removeRoom,
  addRoom,
  childAgeOptions,
  starRatingOptions,
  tripDetailsData,
  missingFields,
  clearFieldError,
  isEditMode,
}: EnterTripDetailsProps) => {
  const {colors} = useTheme();

  const cityBottomSheetOptions = useBottomSheet();
  const calendarBottomSheetOptions = useBottomSheet();
  const travellersBottomSheetOptions = useBottomSheet();
  const nationalityBottomSheetOptions = useBottomSheet();

  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) return;

    const timer = setTimeout(() => {
      if (tripDetailsData && Object.keys(tripDetailsData).length > 0) {
        if (
          tripDetailsData.addTxfrs !== undefined ||
          tripDetailsData.addTours !== undefined
        ) {
          setTripDetails((prev: any) => ({
            ...prev,
            addTxfrs:
              tripDetailsData.addTxfrs !== undefined
                ? tripDetailsData.addTxfrs
                : true,
            addTours:
              tripDetailsData.addTours !== undefined
                ? tripDetailsData.addTours
                : true,
          }));
          hasInitializedRef.current = true;
          return;
        }
      }

      setTripDetails((prev: any) => ({
        ...prev,
        addTxfrs: true,
        // addTours: true,
      }));
      hasInitializedRef.current = true;
    }, 150);

    return () => clearTimeout(timer);
  }, [tripDetailsData, setTripDetails]);

  return (
    <View style={styles.container}>
      <View>
        <CustomText
          variant="text-lg-semibold"
          color="neutral900"
          style={styles.HeaderText}>
          Enter Trip details
        </CustomText>

        <View style={styles.destinationRow}>
          {/* Leaving from */}
          <View style={styles.destinationInput}>
            <SelectableInput
              label="Leaving from"
              displayValue={
                tripDetails.leavingFrom?.cityName?.data?.nm ||
                tripDetails.leavingFrom?.cityName?.value ||
                tripDetails.leavingFrom?.cityName?.data?.rnm ||
                ''
              }
              hasValue={!!tripDetails.leavingFrom?.cityName?.value}
              onPress={() => cityBottomSheetOptions.openBottomSheet()}
              required={true}
              containerStyle={{marginBottom: 0}}
              hasError={!!missingFields.leavingFrom}
            />
          </View>

          {/* Leaving on */}
          <View style={styles.leavingOnInput}>
            <SelectableInput
              label="Leaving on"
              displayValue={
                tripDetails.leavingOn
                  ? moment(tripDetails.leavingOn, 'YYYY-MM-DD').format(
                      'DD MMM YYYY',
                    )
                  : ''
              }
              hasValue={!!tripDetails.leavingOn}
              onPress={() => calendarBottomSheetOptions.openBottomSheet()}
              required={true}
              containerStyle={{marginBottom: 0}}
              hasError={!!missingFields.leavingOn}
            />
          </View>
        </View>
        <View style={styles.destinationRow}>
          {/* No. of Travelers */}
          <View style={styles.destinationInput}>
            <SelectableInput
              label="No. of Travelers"
              displayValue={travelerSelection.totalDisplay || ''}
              hasValue={!!travelerSelection.totalDisplay}
              onPress={() => travellersBottomSheetOptions.openBottomSheet()}
              required={true}
              containerStyle={{marginBottom: 0}}
              hasError={!!missingFields.rooms}
            />
          </View>

          {/* Nationality */}
          <View style={styles.leavingOnInput}>
            <SelectableInput
              label="Nationality"
              displayValue={
                tripDetailsData?.nationalities?.find(
                  (n: any) => n.id === tripDetails.nationality,
                )?.text || ''
              }
              hasValue={!!tripDetails.nationality}
              onPress={() => nationalityBottomSheetOptions.openBottomSheet()}
              required={false}
              containerStyle={{marginBottom: 0}}
              hasError={!!missingFields.nationality}
            />
          </View>
        </View>

        {/* Star Rating - only show if not in edit mode */}
        {!isEditMode && (
          <View style={styles.starRatingContainer}>
            <CustomText
              variant="text-sm-normal"
              color="neutral500"
              style={styles.sectionLabel}>
              Star Rating
            </CustomText>
            <View style={styles.starRatingButtonsRow}>
              {starRatingOptions?.map((option: any) => {
                const isSelected = tripDetails.starRating === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.starRatingButton,
                      {
                        backgroundColor: colors.white,
                        borderColor: isSelected
                          ? colors.neutral900
                          : colors.neutral200,
                      },
                    ]}
                    onPress={() =>
                      setTripDetails({
                        ...tripDetails,
                        starRating: option.value,
                      })
                    }>
                    <CustomText
                      variant="text-sm-medium"
                      color={isSelected ? 'neutral900' : 'neutral500'}>
                      {option.value}
                    </CustomText>
                    <Star
                      size={16}
                      color={isSelected ? colors.neutral900 : colors.neutral500}
                      style={{
                        marginLeft: 4,
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Add Transfers and Activities - only show if not in edit mode */}
        {!isEditMode && (
          <View style={styles.preferencesContainer}>
            <DashedLine
              dashLength={4}
              dashGap={6}
              dashColor={colors.neutral300}
              dashThickness={1}
              style={styles.dashedBorder}
            />
            <View style={styles.preferencesRow}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() =>
                  setTripDetails({
                    ...tripDetails,
                    addTxfrs: !tripDetails.addTxfrs,
                  })
                }>
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: tripDetails.addTxfrs
                        ? colors.neutral900
                        : 'transparent',
                      borderColor: tripDetails.addTxfrs
                        ? colors.neutral900
                        : colors.neutral300,
                    },
                  ]}>
                  {tripDetails.addTxfrs && (
                    <Check size={16} color={colors.white} strokeWidth={3} />
                  )}
                </View>
                <CustomText variant="text-base-normal" color="neutral600">
                  Add Transfers
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() =>
                  setTripDetails({
                    ...tripDetails,
                    addTours: !tripDetails.addTours,
                  })
                }>
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: tripDetails.addTours
                        ? colors.neutral900
                        : 'transparent',
                      borderColor: tripDetails.addTours
                        ? colors.neutral900
                        : colors.neutral300,
                    },
                  ]}>
                  {tripDetails.addTours && (
                    <Check size={16} color={colors.white} strokeWidth={3} />
                  )}
                </View>
                <CustomText variant="text-base-normal" color="neutral600">
                  Add Activities
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      {/* for leavingFrom bottomsheet */}
      <AutoCompleteBottomSheet
        bottomSheetOptions={cityBottomSheetOptions}
        value={
          tripDetails.leavingFrom?.cityName || {
            value: '',
            data: {rnm: '', id: 0, nm: ''},
          }
        }
        onChange={city => {
          clearFieldError('leavingFrom');
          setTripDetails({
            ...tripDetails,
            leavingFrom: {...tripDetails.leavingFrom, cityName: city},
          });
          cityBottomSheetOptions.closeBottomSheet();
        }}
        title="Search leaving from"
        type="customTripLeaving"
        placeholder="Leaving from"
      />
      {/* for Nationality bottomsheet */}
      <CustomBottomSheet
        ref={nationalityBottomSheetOptions.bottomSheetRef}
        snapPoints={['80%']}
        title="Nationality"
        onClose={() => nationalityBottomSheetOptions.closeBottomSheet()}
        enablePanDownToClose={true}>
        <BottomSheetScrollView
          style={{backgroundColor: colors.white, paddingBottom: 20}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.nationalitySheetContainer}>
            {tripDetailsData?.nationalities &&
              [...tripDetailsData.nationalities]
                .sort((a: any, b: any) => {
                  if (tripDetails.nationality === a.id) return -1;
                  if (tripDetails.nationality === b.id) return 1;
                  return 0;
                })
                .map((option: any) => {
                  const isSelected = tripDetails.nationality === option.id;
                  return (
                    <TouchableOpacity
                      key={option?.id}
                      style={[
                        styles.nationalityOption,
                        isSelected && styles.selectedNationalityOption,
                      ]}
                      onPress={() => {
                        clearFieldError('nationality');
                        setTripDetails({
                          ...tripDetails,
                          nationality: option.id || '',
                        });
                        nationalityBottomSheetOptions.closeBottomSheet();
                      }}>
                      <CustomText
                        variant={
                          isSelected ? 'text-base-medium' : 'text-base-normal'
                        }
                        color={isSelected ? 'neutral900' : 'neutral900'}>
                        {option?.text}
                      </CustomText>
                      {isSelected && (
                        <Check size={20} color={colors.neutral900} />
                      )}
                    </TouchableOpacity>
                  );
                })}
          </View>
        </BottomSheetScrollView>
      </CustomBottomSheet>

      {/* Calendar Bottom Sheet */}
      <DateCalendarBottomSheet
        bottomSheetOptions={calendarBottomSheetOptions}
        minDate={DateUtil.getMinDate(0)}
        maxDate={DateUtil.getMaxDate(24)}
        title="Select Leaving Date"
        onClose={() => {
          calendarBottomSheetOptions.closeBottomSheet();
        }}
        mode="single"
        onChange={(date: string, endDate?: string) => {
          clearFieldError('leavingOn');
          setTripDetails({
            ...tripDetails,
            leavingOn: date, // Store in YYYY-MM-DD format
          });
        }}
        restrictedDates={[]}
        initialDate={tripDetails.leavingOn || ''}
      />

      {/* Travelers Bottom Sheet */}
      <TravelersBottomSheet
        bottomSheetOptions={travellersBottomSheetOptions}
        travelerSelection={travelerSelection}
        updateRoomAdults={updateRoomAdults}
        updateRoomChildren={updateRoomChildren}
        updateChildAge={updateChildAge}
        removeRoom={removeRoom}
        addRoom={addRoom}
        childAgeOptions={childAgeOptions}
        onUpdateTravelerSelection={setTravelerSelection}
        onClose={() => {
          travellersBottomSheetOptions.closeBottomSheet();
        }}
      />
    </View>
  );
};

export default EnterTripDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
    paddingHorizontal: 20,
  },
  HeaderText: {
    textAlign: 'left',
    // marginBottom: 16,
  },
  subtitle: {},
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    gap: 12,
    backgroundColor: Colors.lightThemeColors.white,
    borderRadius: 8,
    // padding: 4,
  },
  destinationInput: {
    flex: 1,
  },
  leavingOnInput: {
    flex: 1,
  },
  nationalitySheetContainer: {
    paddingHorizontal: 20,
  },
  nationalityOption: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
  },
  selectedNationalityOption: {
    backgroundColor: Colors.lightThemeColors.neutral100,
    marginTop: 16,
    borderRadius: 8,
    ...flex.rowJustifyBetweenItemCenter,
  },
  starRatingContainer: {
    marginTop: 16,
  },
  sectionLabel: {
    marginBottom: 8,
  },
  starRatingButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',

    gap: 8,
  },
  starRatingButton: {
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 118,
  },
  preferencesContainer: {},
  dashedBorder: {
    width: '100%',
    marginVertical: 24,
  },
  preferencesRow: {
    flexDirection: 'row',
    gap: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
