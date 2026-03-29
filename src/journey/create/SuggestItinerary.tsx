import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {JourneyStackParamList} from '../../navigators/types';
import {Colors} from '../../styles';
import {
  CustomBottomSheet,
  CustomText,
  SelectableInput,
} from '../../common/components';
import AutoCompleteBottomSheet from '../../common/components/AutoCompleteBottomSheet';
import {flex} from '../../styles/typography';
import {
  CircleX,
  PencilLine,
  Sparkles,
  X,
  Clock,
  Calendar,
  Star,
  MoonStar,
  CalendarDays,
} from 'lucide-react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomButton from '../../common/components/CustomButton';
import {Destination} from '.';
import {useBottomSheet} from '../../common/hooks/useBottomSheet';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useAppDispatch} from '../../store';
import {
  createItinerarySuggestion,
  CitySuggestion,
} from './redux/customTripSlice';
import User from '../../data/User';
import {useJourneyCreation} from './hooks/useJourneyCreation';
import {suggestedItineraryData} from '../details/data/mockData';
import {divider} from '../../styles/outlines';
import shadows from '../../styles/shadows';

export interface regionName {
  value: string;
  data: {
    rnm: string;
    id: number;
    nm: string;
  };
}

type Props = NativeStackScreenProps<JourneyStackParamList, 'SuggestItinerary'>;
// Night options for dropdown
const nightOptions = [
  {dnm: '2 nights', value: '2_2'},
  {dnm: '3 nights', value: '3_3'},
  {dnm: '4 nights', value: '4_4'},
  {dnm: '5 - 6 nights', value: '5_6'},
  {dnm: '7 - 9 nights', value: '7_9'},
  {dnm: '10 - 13 nights', value: '10_13'},
  {dnm: '14 - 17 nights', value: '14_17'},
  {dnm: '18 - 20 nights', value: '18_20'},
  {dnm: '21 - 24 nights', value: '21_24'},
];
const SuggestItinerary: React.FC<Props> = ({navigation, route}) => {
  // All hooks must be called in the same order every time
  const {colors} = useTheme();
  const dispatch = useAppDispatch();
  const nightsBottomSheetOptions = useBottomSheet();
  const cityBottomSheetOptions = useBottomSheet();

  const [selectedCities, setSelectedCities] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const {createItinerarySuggestionRes} = useJourneyCreation();
  const [suggestFormData, setSuggestFormData] = useState({
    destinations: {
      id: '1',
      regionName: [] as regionName[],
    },
    nights: {
      dnm: '2 nights',
      value: '4_4',
    },
  });

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount or errorMessage change
    }
  }, [errorMessage]);

  // Sync selectedCities with suggestFormData
  const handleMultipleSelectionChange = (items: CitySuggestion[]) => {
    const formattedItems = items.map(item => ({
      value: item.value || `${item.data.nm} (${item.data.rnm})`,
      data: {
        rnm: item.data.rnm,
        id: item.data.id,
        nm: item.data.nm,
      },
    }));

    setSelectedCities(items);
    setSuggestFormData({
      ...suggestFormData,
      destinations: {
        ...suggestFormData.destinations,
        regionName: formattedItems,
      },
    });
  };

  // Convert selectedCities back to regionName format for display
  const getSelectedCitiesFromState = () => {
    return selectedCities.map(city => ({
      value: city.value,
      data: {
        rnm: city.data.rnm,
        id: city.data.id,
        nm: city.data.nm,
      },
    }));
  };

  // Remove selected city by id
  const removeSelectedCity = (cityId: number) => {
    const updatedCities = selectedCities.filter(
      city => city.data.id !== cityId,
    );
    const formattedItems = updatedCities.map(item => ({
      value: item.value || `${item.data.nm} (${item.data.rnm})`,
      data: {
        rnm: item.data.rnm,
        id: item.data.id,
        nm: item.data.nm,
      },
    }));

    setSelectedCities(updatedCities);
    setSuggestFormData({
      ...suggestFormData,
      destinations: {
        ...suggestFormData.destinations,
        regionName: formattedItems,
      },
    });
  };

  // Helper function to open nights bottom sheet
  const onOpenNightsBottomSheet = () => {
    try {
      const ref = nightsBottomSheetOptions.bottomSheetRef.current;
      if (ref) {
        ref.present();
      } else {
      }
    } catch (error) {}
  };

  // Helper function to open city bottom sheet
  const onOpenCityBottomSheet = () => {
    try {
      const ref = cityBottomSheetOptions.bottomSheetRef.current;
      if (ref) {
        ref.present();
      } else {
      }
    } catch (error) {}
  };

  const getSelectedCityIds = () => {
    if (selectedCities.length > 0) {
      return selectedCities.map(city => city.data.id).join(',');
    }
    return '';
  };

  const getSelectedCitiesDisplayText = () => {
    if (selectedCities.length > 0) {
      return selectedCities.map(city => city.data.nm).join(', ');
    }
    return '';
  };

  const handleLoadSuggestion = async (): Promise<void> => {
    if (selectedCities.length === 0) {
      setErrorMessage('Please select at least one city');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(''); // Clear previous errors
      const authToken = await User.getAuthToken();
      const userId = User.getUserId();
      const params = {
        destIds: getSelectedCityIds(),
        duration: suggestFormData.nights.value,
        _auth: authToken,
        userId: userId,
        __xreq__: true,
      };
      const result = await dispatch(
        createItinerarySuggestion(params as any) as any,
      );

      // Check if the response contains an error message
      if (result?.payload?._data?.errMsg) {
        setErrorMessage(result.payload._data.errMsg);
        return;
      }

      // Navigate to next screen or handle success
      console.log('Suggestion created successfully:', result);
    } catch (error: any) {
      console.error('Error in load suggestion', error);
      setErrorMessage(
        error?.message || 'Failed to load suggestions. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (pkg: any): void => {
    if (Array.isArray(pkg.itnSgts) && pkg.itnSgts.length > 0) {
      const newDestinations = pkg.itnSgts.map((city: any) => {
        // Prefer `c` as canonical id and keep original `cky` separately if present
        const idVal = city.c ?? city.cid ?? city.cky ?? Date.now();
        const ckyVal = city.cky !== undefined ? String(city.cky) : undefined;
        const name = city.cnm || city.nm || city.name || '';
        const cityId = Number(city.c ?? city.cid) || 0;
        const nights = city.nt ?? city.n ?? 1;
        return {
          id: String(idVal),
          ...(ckyVal ? {cky: ckyVal} : {}),
          cityName: {
            value: name,
            data: {rnm: name, id: cityId, nm: name},
          },
          nights,
          isEdit: city.isEdit !== undefined ? city.isEdit : true,
          ...(city.fdPkgId !== undefined ? {fdPkgId: city.fdPkgId} : {}),
          ...(city.fdPkgNm !== undefined ? {fdPkgNm: city.fdPkgNm} : {}),
          ...(city.dTyp !== undefined ? {dTyp: city.dTyp} : {}),
        } as Destination;
      });
      route.params.setDestinations(newDestinations);
      //   onClose();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <View style={styles.errorContent}>
              <CircleX size={20} color={colors.red700} />
              <View style={styles.errorTextContainer}>
                <CustomText variant="text-sm-normal" color="red700">
                  {errorMessage}
                </CustomText>
              </View>
            </View>
          </View>
        ) : null}
        <View style={styles.headerContent}>
          <CustomText variant="text-lg-semibold" color="neutral900">
            Where would you like to wander?
          </CustomText>
        </View>
        <View style={styles.subtitle}>
          <CustomText variant="text-sm-normal" color="neutral500">
            Enter your desire destinations below and let us{'\n'}guide you to
            the perfect itinerary for your{'\n'}wanderlust.
          </CustomText>
        </View>
        <View style={styles.inputContainer}>
          {/* City Selection */}

          <View style={styles.destinationInput}>
            {selectedCities.length > 0 ? (
              <View>
                <View style={{...flex.rowJustifyBetweenItemCenter}}>
                  <CustomText variant="text-sm-semibold" color="neutral900">
                    Selected Cities*
                  </CustomText>
                  <TouchableOpacity onPress={onOpenCityBottomSheet}>
                    <PencilLine size={16} color={colors.neutral900} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    ...flex.row,
                    gap: 8,
                    flexWrap: 'wrap',
                    marginTop: 20,
                  }}>
                  {selectedCities.map(city => (
                    <View
                      key={city.data.id}
                      style={styles.selectedCityContainer}>
                      <CustomText variant="text-sm-normal" color="neutral900">
                        {city.data.nm}
                      </CustomText>
                      <TouchableOpacity
                        onPress={() => removeSelectedCity(city.data.id)}>
                        <X size={16} color={colors.neutral900} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.addDestinationButton}
                  onPress={onOpenCityBottomSheet}>
                  <CustomText variant="text-sm-medium" color="neutral900">
                    + Add Another city
                  </CustomText>
                </TouchableOpacity>
              </View>
            ) : (
              <SelectableInput
                label="Selected Cities"
                displayValue={getSelectedCitiesDisplayText()}
                hasValue={selectedCities.length > 0}
                onPress={onOpenCityBottomSheet}
                required={true}
                containerStyle={{marginBottom: 0}}
              />
            )}
          </View>

          <View style={styles.nightsInput}>
            <SelectableInput
              label="No of nights"
              displayValue={suggestFormData.nights.dnm}
              hasValue={true}
              onPress={onOpenNightsBottomSheet}
              required={true}
              containerStyle={{marginBottom: 0}}
            />
          </View>
        </View>
        <View style={styles.suggestButton}>
          <CustomButton
            title={loading ? 'Creating Suggestions...' : 'Suggest Itinerary'}
            variant="text-base-medium"
            textStyle={{color: 'neutral50'}}
            iconLeft
            iconComponent={Sparkles}
            onPress={handleLoadSuggestion}
            disabled={loading || selectedCities.length === 0}
          />
        </View>
        {createItinerarySuggestionRes?.itnSgts &&
          createItinerarySuggestionRes.itnSgts.length > 0 && (
            <View>
              <View style={[styles.divider, {marginBottom: 24}]} />
              <View>
                {createItinerarySuggestionRes.itnSgts.map((pkg, idx) => (
                  <View key={idx} style={styles.suggestionCard}>
                    {/* Cities and nights breakdown */}
                    <View style={styles.citiesContainer}>
                      {pkg.itnSgts?.map((city: any, cityIdx: number) => (
                        <View key={cityIdx} style={styles.cityRow}>
                          <CustomText
                            variant="text-sm-normal"
                            color="neutral800">
                            {city.cnm || city.nm || 'Unknown City'}
                          </CustomText>
                          <CustomText
                            variant="text-sm-normal"
                            color="neutral300"
                            style={{marginHorizontal: 8}}>
                            |
                          </CustomText>
                          <CustomText
                            variant="text-sm-normal"
                            color="neutral800">
                            {city.nt || city.n || 1} Night
                            {(city.nt || city.n || 1) > 1 ? 's' : ''}
                          </CustomText>
                        </View>
                      ))}
                    </View>
                    <View style={styles.divider} />

                    {/* Select button */}
                    <View style={styles.selectButtonContainer}>
                      <View>
                        <View style={[styles.cityRow, {paddingBottom: 0}]}>
                          <View style={{...flex.rowItemCenter}}>
                            <MoonStar
                              style={styles.bottomIcon}
                              size={14}
                              color={colors.neutral700}
                            />
                            <CustomText
                              variant="text-xs-normal"
                              color="neutral700">
                              {pkg.tnt} Nights
                            </CustomText>
                          </View>

                          <CustomText
                            variant="text-xs-normal"
                            color="neutral300"
                            style={{marginHorizontal: 8}}>
                            |
                          </CustomText>

                          <View style={{...flex.rowItemCenter}}>
                            <CalendarDays
                              style={styles.bottomIcon}
                              size={14}
                              color={colors.neutral700}
                            />
                            <CustomText
                              variant="text-xs-normal"
                              color="neutral700">
                              {pkg.tnt + 1} Days
                            </CustomText>
                          </View>
                        </View>
                        {pkg.pct && (
                          <View style={styles.durationItem}>
                            <Star size={14} color={colors.blue900} />
                            <CustomText
                              variant="text-xs-medium"
                              color="blue900">
                              Chosen by {pkg.pct}% of Travelers
                            </CustomText>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.selectButton}
                        onPress={() => {
                          handleSelectSuggestion(pkg);
                          navigation.goBack();
                        }}>
                        <CustomText variant="text-sm-medium" color="neutral900">
                          Select
                        </CustomText>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
      </ScrollView>

      {/* Nights Selection Bottom Sheet */}
      <CustomBottomSheet
        ref={nightsBottomSheetOptions.bottomSheetRef}
        snapPoints={['60%']}
        title="Select Nights"
        enableBackdrop={true}
        onClose={() => nightsBottomSheetOptions.closeBottomSheet()}
        enablePanDownToClose={true}>
        <BottomSheetScrollView
          style={{backgroundColor: colors.white, paddingBottom: 30}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.nightsSheetContainer}>
            {nightOptions.map(option => {
              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.nightOption}
                  onPress={() => {
                    setSuggestFormData({
                      ...suggestFormData,
                      nights: {
                        value: option.value,
                        dnm: option.dnm,
                      },
                    });
                    nightsBottomSheetOptions.closeBottomSheet();
                  }}>
                  <CustomText variant="text-base-normal" color="neutral900">
                    {option.dnm}
                  </CustomText>
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </CustomBottomSheet>

      <AutoCompleteBottomSheet
        bottomSheetOptions={cityBottomSheetOptions}
        value={{value: '', data: {rnm: '', id: 0, nm: ''}}}
        onChange={() => {}}
        title="Search Cities"
        type="customTripCityArr"
        placeholder="Search cities..."
        multipleSelection={true}
        selectedItems={selectedCities}
        onMultipleSelectionChange={handleMultipleSelectionChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  errorToast: {
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.red200,
    backgroundColor: Colors.lightThemeColors.red50,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  errorToastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningIcon: {
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightThemeColors.neutral200,
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },

  headerContent: {
    paddingTop: 16,
  },
  suggestButton: {
    paddingVertical: 24,
  },
  subtitle: {
    paddingTop: 6,
  },
  nightsInput: {
    marginTop: 0,
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
  inputContainer: {
    gap: 20,
  },

  destinationInput: {
    paddingTop: 20,
  },
  selectedCityContainer: {
    backgroundColor: Colors.lightThemeColors.neutral200,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    ...flex.rowItemCenter,
    gap: 6,
  },
  addDestinationButton: {
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral900,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: Colors.lightThemeColors.white,
    marginTop: 20,
  },
  errorContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.lightThemeColors.red50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.red200,
  },
  errorContent: {
    ...flex.rowItemCenter,
    gap: 12,
  },
  errorTextContainer: {
    flex: 1,
  },
  suggestionCard: {
    backgroundColor: Colors.lightThemeColors.white,
    borderRadius: 12,

    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    ...shadows['shadow-sm'],
  },
  citiesContainer: {
    paddingTop: 14,
    paddingHorizontal: 14,
  },
  cityRow: {
    ...flex.row,
    paddingBottom: 14,
  },
  durationContainer: {
    ...flex.rowItemCenter,
    gap: 16,
    marginBottom: 16,
  },
  durationItem: {
    ...flex.rowItemCenter,
    backgroundColor: Colors.lightThemeColors.blue50,
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 12,
  },
  selectButtonContainer: {
    // alignItems: 'flex-end',
    ...flex.rowJustifyBetweenItemCenter,
    paddingHorizontal: 14,
    paddingBottom: 16,
  },
  selectButton: {
    backgroundColor: Colors.lightThemeColors.white,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral900,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  bottomIcon: {
    marginRight: 4,
  },
});

export default SuggestItinerary;
