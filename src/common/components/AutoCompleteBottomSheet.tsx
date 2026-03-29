import {useEffect, useMemo, useState, useRef, useCallback} from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {Colors, Typography} from '../../styles';
import {ArrowLeft, Edit, Search, X} from 'lucide-react-native';
import CustomText from './CustomText';
import CustomBottomSheet from './CustomBottomSheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {
  citySuggest,
  CitySuggestion,
  fetchAgentSuggestions,
  fetchHotelSuggestions,
} from '../../journey/create/redux/customTripSlice';
import {User} from '../../data';
import {useAppDispatch} from '../../store';
import fontConfig from '../../styles/fontConfig';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {flex} from '../../styles/typography';

interface AutoCompleteBottomSheetProps {
  bottomSheetOptions: {
    bottomSheetRef: React.RefObject<BottomSheetModalMethods | null>;
    openBottomSheet: (index?: number) => void;
    closeBottomSheet: () => void;
    snapToIndex: (index: number) => void;
  };
  value: {
    value: string;
    data: {
      rnm: string;
      id: number;
      nm: string;
    };
  };
  onChange: (value: CitySuggestion) => void;
  apiUrl?: string;
  params?: Record<string, any>;
  onSelectItem?: (item: CitySuggestion) => void;
  title?: string;
  type?:
    | 'departure'
    | 'arrival'
    | 'customTripCityArr'
    | 'customTripLeaving'
    | 'customTripAgent';
  placeholder?: string;
  isHotelSearch?: boolean;
  setIsHotelSearch?: React.Dispatch<React.SetStateAction<boolean>>;
  multipleSelection?: boolean;
  selectedItems?: CitySuggestion[];
  onMultipleSelectionChange?: (items: CitySuggestion[]) => void;
}

const AutoCompleteBottomSheet = ({
  bottomSheetOptions,
  value,
  apiUrl = '',
  onChange,
  onSelectItem,
  title = 'Search',
  type = 'customTripCityArr',
  placeholder = 'Search city...',
  isHotelSearch = false,
  setIsHotelSearch,
  multipleSelection = false,
  selectedItems = [],
  onMultipleSelectionChange,
}: AutoCompleteBottomSheetProps) => {
  const {colors} = useTheme();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    value?.data?.nm || value?.data?.rnm || value?.value || '',
  );
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<CitySuggestion | null>(null);

  // Temporary selection state for multiple selection mode
  const [tempSelectedItems, setTempSelectedItems] = useState<CitySuggestion[]>(
    [],
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['85%', '85%', '85%'], []);

  // Debounced search function - matches web version
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (query.length < 3) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);

      timeoutRef.current = setTimeout(async () => {
        try {
          let result: any;
          if (type === 'customTripAgent') {
            result = await dispatch(
              fetchAgentSuggestions({
                q: query,
                __xreq__: true,
                incDsp: true,
                incDsb: false,
                _auth: User.authToken,
                userId: User.getUserId(),
              }) as any,
            );
          } else if (isHotelSearch) {
            result = await dispatch(
              fetchHotelSuggestions({
                q: query,
                __xreq__: true,
                flrHC: true,
                incCStAr: true,
                flrIF: false,
                _auth: User.authToken,
              }) as any,
            );
          } else {
            const params: any =
              type === 'customTripCityArr'
                ? {
                    q: query,
                    incCStAr: true,
                    flrEC: true,
                    flrHC: true,
                    flrIF: false,
                    __xreq__: true,
                    _auth: User.authToken,
                    userId: User.getUserId(),
                  }
                : type === 'customTripLeaving'
                ? {
                    q: query,
                    incCAr: false,
                    isEx: true,
                    rstAvl: true,
                    flrAC: false,
                    __xreq__: true,
                    _auth: User.authToken,
                    userId: User.getUserId(),
                  }
                : {
                    q: query,
                    ...((type === 'departure' && {isFm: true}) ||
                      (type === 'arrival' && {isTo: true})),
                    _auth: User.authToken,
                    userId: User.getUserId(),
                  };

            result = await dispatch(citySuggest(params) as any);
          }

          setSuggestions(Array.isArray(result?.payload) ? result.payload : []);
        } catch (err) {
          console.error('search error', err);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    },
    [dispatch, type, User.authToken, User.getUserId(), isHotelSearch],
  );

  // Debounced agent search function - matches web version
  const debouncedAgentSearch = useCallback(
    async (query: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (query.length < 3) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);

      timeoutRef.current = setTimeout(async () => {
        try {
          const params = {
            q: query,
            __xreq__: true,
            incDsp: true,
            incDsb: false,
            _auth: User.authToken,
            userId: User.getUserId(),
          };
          const result = await dispatch(fetchAgentSuggestions(params) as any);
          // Transform the API response to match our interface
          if (result.payload && Array.isArray(result.payload)) {
            setSuggestions(result.payload);
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error('City search failed:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    },
    [dispatch, type, User.authToken, User.getUserId()],
  );

  // Handle input change and trigger search - matches web version
  const handleInputChange = (text: string) => {
    setInputValue(text);
    setIsOpen(true);

    // Trigger debounced search
    if (type === 'customTripAgent') {
      debouncedAgentSearch(text);
    } else {
      debouncedSearch(text);
    }
  };

  // Handle suggestion selection - matches web version
  const handleSuggestionClick = (suggestion: CitySuggestion): void => {
    if (multipleSelection) {
      const isAlreadySelected = tempSelectedItems.some(
        item => item.data.id === suggestion.data.id,
      );

      let newTempSelectedItems;
      if (isAlreadySelected) {
        newTempSelectedItems = tempSelectedItems.filter(
          item => item.data.id !== suggestion.data.id,
        );
      } else {
        newTempSelectedItems = [...tempSelectedItems, suggestion];
      }

      setTempSelectedItems(newTempSelectedItems);
      setInputValue(''); // Clear search after selection
    } else {
      setSelectedSuggestion(suggestion);
      const displayValue =
        suggestion.data.nm || suggestion.data.rnm || suggestion.value;

      setInputValue(displayValue);
      onChange(suggestion);
      setIsOpen(false);
      setSuggestions([]);
      bottomSheetOptions.closeBottomSheet();
    }
  };

  // Helper function to get selected cities display text for multiple selection
  const getSelectedItemsDisplayText = () => {
    if (selectedItems.length > 0) {
      return selectedItems
        .map(item => item.data.nm || item.data.rnm || item.value)
        .join(', ');
    }
    return '';
  };

  // Remove selected item by id from temporary selection
  const removeSelectedItem = (cityId: number) => {
    const updatedItems = tempSelectedItems.filter(
      item => item.data.id !== cityId,
    );
    setTempSelectedItems(updatedItems);
  };

  // Handle done button press - confirm temporary selection
  const handleDonePress = () => {
    onMultipleSelectionChange?.(tempSelectedItems);
    bottomSheetOptions.closeBottomSheet();
  };

  // Initialize temporary selection when opening bottom sheet
  const initializeTempSelection = () => {
    if (multipleSelection) {
      setTempSelectedItems([...selectedItems]);
    }
  };

  // Handle item selection for compatibility
  const handleItemSelect = (item: CitySuggestion) => {
    handleSuggestionClick(item);
    //   onSelectItem?.(item);
  };

  // Sync inputValue with value prop changes
  useEffect(() => {
    if (!multipleSelection) {
      const displayValue =
        value?.data?.nm || value?.data?.rnm || value?.value || '';
      setInputValue(displayValue);
    }
  }, [value, multipleSelection]);

  // Initialize temporary selection when bottom sheet opens
  useEffect(() => {
    if (multipleSelection) {
      setTempSelectedItems([...selectedItems]);
    }
  }, [selectedItems, multipleSelection]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <View>
      <CustomBottomSheet
        ref={bottomSheetOptions.bottomSheetRef}
        snapPoints={snapPoints}
        title={title}
        multipleSelection={multipleSelection}
        onSelect={multipleSelection ? handleDonePress : undefined}
        onClose={bottomSheetOptions.closeBottomSheet}
        onDismiss={() => {
          setInputValue('');
          setSuggestions([]);
          setIsOpen(false);
          if (multipleSelection) {
            setTempSelectedItems([...selectedItems]); // Reset temp selection on dismiss
          }
        }}>
        <View style={styles.bottomSheetContent}>
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Search
              size={16}
              color={colors.neutral500}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, {color: colors.neutral900}]}
              placeholder={placeholder}
              placeholderTextColor={colors.neutral400}
              value={inputValue}
              onChangeText={handleInputChange}
              autoFocus={true}
            />
          </View>

          {/* Selected Items Display for Multiple Selection */}
          {multipleSelection && tempSelectedItems.length > 0 && (
            <View style={{...flex.row, gap: 8, flexWrap: 'wrap'}}>
              {tempSelectedItems.map(city => (
                <View key={city.data.id} style={styles.selectedItemsContainer}>
                  <CustomText variant="text-sm-normal" color="neutral900">
                    {city.data.nm}
                  </CustomText>
                  <TouchableOpacity
                    onPress={() => removeSelectedItem(city.data.id)}>
                    <X size={16} color={colors.neutral900} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.blue500} />
              <CustomText
                variant="text-sm-normal"
                color="neutral500"
                style={{marginLeft: 8}}>
                Searching...
              </CustomText>
            </View>
          )}

          {/* Search Results */}
          <BottomSheetScrollView
            style={{backgroundColor: colors.white, paddingBottom: 20}}
            showsVerticalScrollIndicator={false}>
            {!isLoading &&
              inputValue.length > 0 &&
              suggestions.length === 0 && (
                <View style={styles.emptyContainer}>
                  <CustomText variant="text-base-normal" color="neutral500">
                    No results found for "{inputValue}"
                  </CustomText>
                </View>
              )}

            {!isLoading &&
              suggestions.length > 0 &&
              suggestions.map((item: CitySuggestion, index: number) => {
                const isSelected = multipleSelection
                  ? tempSelectedItems.some(
                      selected => selected.data.id === item.data.id,
                    )
                  : false;

                return (
                  <TouchableOpacity
                    key={`${item.data.id}-${item.data.nm}-${index}`}
                    style={[
                      styles.searchResultItem,
                      multipleSelection &&
                        isSelected &&
                        styles.selectedResultItem,
                    ]}
                    onPress={() => handleItemSelect(item)}>
                    <View style={{flex: 1}}>
                      <CustomText
                        variant="text-base-normal"
                        color={
                          multipleSelection && isSelected
                            ? 'neutral600'
                            : 'neutral900'
                        }>
                        {item.data.nm || item.value}
                      </CustomText>
                      {item.data.rnm && (
                        <CustomText
                          variant="text-sm-normal"
                          color={
                            multipleSelection && isSelected
                              ? 'neutral400'
                              : 'neutral500'
                          }>
                          {item.data.rnm}
                        </CustomText>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
          </BottomSheetScrollView>
        </View>
      </CustomBottomSheet>
    </View>
  );
};
const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral900,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 12,
    backgroundColor: Colors.lightThemeColors.white,
  },
  searchIcon: {
    marginRight: 8,
    marginTop: 4,
  },
  searchInput: {
    flex: 1,
    height: 44,
    ...fontConfig['text-sm-normal'],
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  resultsContainer: {
    paddingBottom: 20,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
  },
  selectedResultItem: {
    backgroundColor: Colors.lightThemeColors.neutral50,
  },
  selectedItemsContainer: {
    backgroundColor: Colors.lightThemeColors.neutral200,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    ...flex.rowItemCenter,
    gap: 6,
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
});

export default AutoCompleteBottomSheet;
