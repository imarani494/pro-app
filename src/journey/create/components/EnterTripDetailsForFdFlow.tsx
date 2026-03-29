import React, {useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  CustomText,
  SelectableInput,
  TravelersBottomSheet,
} from '../../../common/components';
import {Colors} from '../../../styles';
import {useBottomSheet} from '../../../common/hooks/useBottomSheet';
import {useTheme} from '../../../context/ThemeContext';
import AutoCompleteBottomSheet from '../../../common/components/AutoCompleteBottomSheet';
import {TravelerSelection} from '..';

export interface EnterTripDetailsForFdFlowProps {
  tripDetails: any;
  setTripDetails: (details: any) => void;
  travelerSelection: any;
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
  setTravelerSelection: React.Dispatch<React.SetStateAction<TravelerSelection>>;
}

const EnterTripDetailsForFdFlow = ({
  tripDetails,
  setTripDetails,
  travelerSelection,
  setShowTravelerDropdown,
  showTravelerDropdown,
  updateRoomAdults,
  updateRoomChildren,
  updateChildAge,
  removeRoom,
  addRoom,
  childAgeOptions,
  tripDetailsData,
  missingFields,
  clearFieldError,
  setTravelerSelection,
}: EnterTripDetailsForFdFlowProps) => {
  const {colors} = useTheme();
  const travellersBottomSheetOptions = useBottomSheet();
  const cityBottomSheetOptions = useBottomSheet();

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
      </View>
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

export default EnterTripDetailsForFdFlow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
    paddingHorizontal: 20,
  },
  HeaderText: {
    textAlign: 'left',
    marginBottom: 16,
  },
  subtitle: {},
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    gap: 12,
    backgroundColor: Colors.lightThemeColors.white,
    borderRadius: 8,
    // padding: 4,
  },
  destinationInput: {
    flex: 1,
  },
});
