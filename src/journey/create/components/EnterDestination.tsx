import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Vibration,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {Destination} from '..';
import {
  CustomBottomSheet,
  CustomText,
  SelectableInput,
} from '../../../common/components';
import {Colors} from '../../../styles';
import {useBottomSheet} from '../../../common/hooks/useBottomSheet';
import {useTheme} from '../../../context/ThemeContext';
import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import {BottomSheetBackdrop, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import AutoCompleteBottomSheet from '../../../common/components/AutoCompleteBottomSheet';
import shadows from '../../../styles/shadows';
import {flex} from '../../../styles/typography';
import {Sparkles, ChevronDown, GripVertical, Trash2} from 'lucide-react-native';
import {CitySuggestion} from '../redux/customTripSlice';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {JourneyStackParamList} from '../../../navigators/types';

export interface EnterDestinationProps {
  destinations: Destination[];
  nightOptions: {value: number; label: string}[];
  addDestination: () => void;
  removeDestination: (id: string) => void;
  updateDestination: (id: string, field: keyof Destination, value: any) => void;
  onDragEnd: (result: any) => void;
  missingFields: any;
  clearFieldError: (
    field: string,
    index?: number | undefined,
    subfield?: string | undefined,
  ) => void;
  setDestinations: React.Dispatch<React.SetStateAction<Destination[]>>;
  isEditMode: boolean;
  navigation: NativeStackNavigationProp<
    JourneyStackParamList,
    'JourneyCreation',
    undefined
  >;
}

const EnterDestination = ({
  destinations,
  nightOptions,
  addDestination,
  removeDestination,
  updateDestination,
  onDragEnd,
  missingFields,
  clearFieldError,
  setDestinations,
  isEditMode,
  navigation,
}: EnterDestinationProps) => {
  const {colors} = useTheme();

  const [showNightsSheet, setShowNightsSheet] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] =
    useState<string>('');
  const prevDestinationsLengthRef = useRef(destinations.length);
  const inputRefs = useRef<{[key: string]: any}>({});
  // Bottom sheet hook for city autocomplete
  const cityBottomSheetOptions = useBottomSheet();
  // Bottom sheet hook for nights selection
  const nightsBottomSheetOptions = useBottomSheet();

  // Helper function to open city autocomplete bottom sheet
  const onOpenCityBottomSheet = (destinationId: string) => {
    console.log('Opening city autocomplete for destination:', destinationId);
    cityBottomSheetOptions.openBottomSheet();
  };

  // Helper function to open nights bottom sheet
  const onOpenNightsBottomSheet = (destinationId: string) => {
    console.log('Opening nights bottom sheet for destination:', destinationId);
    console.log('Night options:', nightOptions);
    setSelectedDestinationId(destinationId);
    nightsBottomSheetOptions.openBottomSheet();
  };

  // Helper function to handle nights selection
  const onSelectNights = (nights: number) => {
    if (selectedDestinationId) {
      updateDestination(selectedDestinationId, 'nights', nights);
      clearFieldError(
        'destinationsError',
        destinations.findIndex(d => d.id === selectedDestinationId),
        'nights',
      );
    }
    nightsBottomSheetOptions.closeBottomSheet();
  };

  // Handle drag end for reordering destinations
  const handleDragEnd = ({data}: {data: Destination[]}) => {
    // Provide haptic feedback when drag ends
    Vibration.vibrate(50);
    setDestinations(data);
    // Call the parent's onDragEnd if needed
    onDragEnd({data});
  };

  // Handle drag start with haptic feedback
  const handleDragStart = () => {
    Vibration.vibrate(30);
  };

  // Render function for each draggable destination item
  const renderDestinationItem = ({
    item: destination,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<Destination>) => {
    const index = getIndex() ?? 0;

    // Get error state for this destination
    const destinationError = missingFields.destinationsError?.[index];
    const hasCityError = destinationError?.city;
    const hasNightsError = destinationError?.nights;

    return (
      <ScaleDecorator>
        <View
          style={[
            styles.destinationRow,
            isActive && styles.destinationRowActive,
          ]}>
          {/* Drag Handle */}
          <TouchableOpacity
            style={[styles.dragHandle, isActive && styles.dragHandleActive]}
            onLongPress={() => {
              handleDragStart();
              drag();
            }}
            onPressIn={() => {
              if (!isActive) {
                handleDragStart();
                drag();
              }
            }}
            disabled={isActive}
            activeOpacity={0.7}
            delayLongPress={100}>
            <GripVertical size={20} color={colors.neutral400} />
          </TouchableOpacity>

          {/* City Input */}
          <View style={styles.destinationInput}>
            <SelectableInput
              label="Enter City"
              displayValue={
                destination.cityName?.data?.nm ||
                destination.cityName?.value ||
                ''
              }
              hasValue={!!destination.cityName?.value}
              onPress={() => onOpenCityBottomSheet(destination.id)}
              required={true}
              containerStyle={{marginBottom: 0}}
              hasError={hasCityError}
            />
          </View>

          {/* Nights Input */}
          <View style={styles.nightsInput}>
            <SelectableInput
              label="No of nights"
              displayValue={`${destination.nights} ${
                destination.nights === 1 ? 'Night' : 'Nights'
              }`}
              hasValue={true}
              onPress={() => onOpenNightsBottomSheet(destination.id)}
              required={true}
              containerStyle={{marginBottom: 0}}
              hasError={hasNightsError}
            />
          </View>

          {/* Delete Button */}
          {destinations.length > 1 && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeDestination(destination.id)}>
              <Trash2 size={20} color={colors.red500} />
            </TouchableOpacity>
          )}
        </View>
        <AutoCompleteBottomSheet
          bottomSheetOptions={cityBottomSheetOptions}
          value={destination.cityName}
          onChange={city => {
            clearFieldError('destinationsError', index, 'city');
            updateDestination(destination.id, 'cityName', city);
            cityBottomSheetOptions.closeBottomSheet();
          }}
          // onSelectItem={onSelectCity}
          title="Destination City"
          type="customTripCityArr"
          placeholder="Search for a city..."
        />
      </ScaleDecorator>
    );
  };

  // Removed unused isHotelSearch state; use hotelSearchMap per row
  const [hotelSearchMap, setHotelSearchMap] = useState<{
    [id: string]: boolean;
  }>({});

  // Focus on the last destination's input when a new destination is added
  useEffect(() => {
    if (destinations.length > prevDestinationsLengthRef.current) {
      // New destination was added, focus on the last input
      setTimeout(() => {
        const lastDestination = destinations[destinations.length - 1];
        if (lastDestination && inputRefs.current[lastDestination.id]) {
          const lastInputRef = inputRefs.current[lastDestination.id];
          // Check if the input ref has a focus method
          if (lastInputRef && typeof lastInputRef.focus === 'function') {
            lastInputRef.focus();
          }
        }
      }, 100);
    }
    prevDestinationsLengthRef.current = destinations.length;
  }, [destinations.length]);

  // Function to set input ref for each destination
  const setInputRef = (destinationId: string, ref: any) => {
    inputRefs.current[destinationId] = ref;
  };

  const onSplitStay = (destination: Destination, index: number): void => {
    {
      const cityVal = destination.cityName?.value?.trim();
      if (!cityVal) {
        Alert.alert('Please provide the destination city');
        return;
      }
      const nights = destination.nights;
      if (nights <= 1) {
        // Add another city with 1 night, copy city name
        const newId = `${destination.id}-split-${Date.now()}`;
        updateDestination(destination.id, 'nights', 1);
        const newDest = {
          ...destination,
          id: newId,
          nights: 1,
          cityName: {...destination.cityName},
        };
        const newArr = [
          ...destinations.slice(0, index + 1),
          newDest,
          ...destinations.slice(index + 1),
        ];
        setDestinations(newArr);
      } else {
        // Split nights, copy city name
        const first = Math.ceil(nights / 2);
        const second = nights - first;
        // Update current city nights
        const updatedCurrent = {
          ...destination,
          nights: first,
        };
        const newId = `${destination.id}-split-${Date.now()}`;
        const newDest = {
          ...destination,
          id: newId,
          nights: second,
          cityName: {...destination.cityName},
        };
        const newArr = [
          ...destinations.slice(0, index),
          updatedCurrent,
          newDest,
          ...destinations.slice(index + 1),
        ];
        setDestinations(newArr);
      }
    }
  };
  // Group destinations by fdPkgId to track which destinations belong to which package
  const groupedPackagesMap = destinations.reduce(
    (acc: Record<string, any>, d: Destination) => {
      if (!d?.fdPkgId) return acc;
      const key = String(d.fdPkgId);
      if (!acc[key]) {
        acc[key] = {
          fdPkgId: d.fdPkgId,
          fdPkgNm: d.fdPkgNm,
          cities: [],
          lastIndex: -1,
        };
      }
      acc[key].cities.push({
        city: d.cityName?.value || d.cityName?.data?.nm || '',
        nights: d.nights,
      });
      return acc;
    },
    {},
  );

  // Track the last index of each package group to know when to render the card
  destinations.forEach((d, index) => {
    if (d?.fdPkgId) {
      const key = String(d.fdPkgId);
      if (groupedPackagesMap[key]) {
        groupedPackagesMap[key].lastIndex = index;
      }
    }
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <CustomText variant="text-lg-semibold" color="neutral900">
            Enter Destination
          </CustomText>
          <TouchableOpacity
            style={styles.suggestButton}
            onPress={() =>
              navigation.navigate('SuggestItinerary', {setDestinations})
            }>
            <Sparkles size={14} color={colors.yellow500} style={styles.icon} />
            <CustomText variant="text-xs-normal" color="neutral900">
              Suggest Itinerary
            </CustomText>
          </TouchableOpacity>
        </View>
        <View style={styles.subtitle}>
          <CustomText variant="text-sm-normal" color="neutral500">
            Enter the cities below in the order in which they will be visited
            for the itinerary.
          </CustomText>
        </View>
      </View>

      {/* Destination List */}
      <DraggableFlatList
        data={destinations}
        onDragEnd={handleDragEnd}
        keyExtractor={item => item.id}
        renderItem={renderDestinationItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.destinationListContent}
        activationDistance={10}
        dragItemOverflow={true}
        autoscrollSpeed={100}
        autoscrollThreshold={50}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addDestinationButton}
            onPress={addDestination}>
            <CustomText variant="text-sm-medium" color="neutral900">
              + Add Another city
            </CustomText>
          </TouchableOpacity>
        }
      />

      {/* Nights Selection Bottom Sheet */}
      <CustomBottomSheet
        ref={nightsBottomSheetOptions.bottomSheetRef}
        snapPoints={['60%']}
        title="Add Nights"
        onClose={() => nightsBottomSheetOptions.closeBottomSheet()}
        enablePanDownToClose={true}>
        <BottomSheetScrollView
          style={{backgroundColor: colors.white, paddingBottom: 20}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.nightsSheetContainer}>
            {nightOptions.map(option => {
              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.nightOption}
                  onPress={() => onSelectNights(option.value)}>
                  <CustomText variant="text-base-normal" color="neutral900">
                    {option.label}
                  </CustomText>
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </CustomBottomSheet>
    </View>
  );
};

export default EnterDestination;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
    paddingHorizontal: 20,
  },
  header: {},
  icon: {
    marginRight: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestButton: {
    ...flex.rowJustifyBetweenItemCenter,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: Colors.lightThemeColors.white,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    ...shadows['shadow-sm'],
  },
  subtitle: {},
  destinationListContent: {
    paddingTop: 16,
    // paddingBottom: 20,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
    backgroundColor: Colors.lightThemeColors.white,
    borderRadius: 8,
    padding: 4,
  },
  destinationRowActive: {
    backgroundColor: Colors.lightThemeColors.neutral50,
    borderColor: Colors.lightThemeColors.neutral200,
    borderWidth: 1,
    ...shadows['shadow-md'],
  },
  dragHandle: {
    paddingVertical: 12,
    marginTop: 6,
  },
  dragHandleActive: {
    backgroundColor: Colors.lightThemeColors.gray100,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral800,
  },
  destinationInput: {
    flex: 3,
  },
  nightsInput: {
    flex: 3,
  },
  deleteButton: {
    paddingTop: 18,
    paddingLeft: 8,
  },
  addDestinationButton: {
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral900,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: Colors.lightThemeColors.neutral100,
    marginTop: 8,
  },
  nightsSheetContainer: {
    paddingHorizontal: 20,
  },
  nightOption: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
  },
});
