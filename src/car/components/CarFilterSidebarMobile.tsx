import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Switch,
} from 'react-native';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';
import {useTheme} from '../../context/ThemeContext';
import {X, Search} from 'lucide-react-native';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {setCarFilters, resetCarFilters} from '../redux/carRentalSlice';
import {CarFilters} from '../utils/CarFilters';

interface CarSearchResult {
  prc: number;
  dpLoc?: {loc?: string; isApt?: boolean};
  pkLoc?: {loc?: string; isApt?: boolean};
  fpl?: string;
  gk?: string;
  mpl?: string;
  prD?: string;
  optr?: {nm?: string; lg?: string};
  vd?: {
    vnm?: string;
    img?: string;
    vtyp?: string;
    isAutoTx?: boolean;
    hasAC?: boolean;
    ndr?: number;
    nst?: number;
    slg?: number;
    ftA?: string[];
  };
}

interface CarFilterSidebarMobileProps {
  isOpen: boolean;
  onClose: () => void;
  carSearchResults: CarSearchResult[];
  onFilterChange: (filteredResults: CarSearchResult[]) => void;
  onFilterCountChange?: (count: number) => void;
}

export function CarFilterSidebarMobile({
  isOpen,
  onClose,
  carSearchResults,
  onFilterChange,
  onFilterCountChange,
}: CarFilterSidebarMobileProps) {
  const {colors} = useTheme();
  const dispatch = useAppDispatch();
  const reduxFilters = useAppSelector(state => state.carRental.filters);

  const [carFilters, setLocalCarFilters] = useState<CarFilters | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterUpdateTrigger, setFilterUpdateTrigger] = useState<number>(0);

  useEffect(() => {
    if (!carSearchResults || carSearchResults.length === 0) return;

    const filters = new CarFilters(carSearchResults);

    Object.entries(reduxFilters.filterMap || {}).forEach(([type, ids]) => {
      ids.forEach(id =>
        filters.applyFilter(
          type as keyof typeof filters.filterOptions,
          id,
        ),
      );
    });

    setLocalCarFilters(filters);
    setSearchTerm(reduxFilters.searchQuery || '');
  }, [carSearchResults, reduxFilters.filterMap, reduxFilters.searchQuery]);

  useEffect(() => {
    if (carFilters) {
      const filteredResults = carFilters.getFilteredResults(searchTerm);
      onFilterChange(filteredResults);

      if (onFilterCountChange) {
        onFilterCountChange(carFilters.getAppliedFiltersCount());
      }
    }
  }, [
    carFilters,
    searchTerm,
    filterUpdateTrigger,
    onFilterChange,
    onFilterCountChange,
  ]);

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    dispatch(setCarFilters({searchQuery: text}));
  };

  const handleFilterToggle = <
    T extends keyof NonNullable<typeof carFilters>['filterOptions'],
  >(
    filterType: T,
    optionId: string | number,
  ) => {
    if (!carFilters) return;

    carFilters.applyFilter(filterType, optionId);

    dispatch(
      setCarFilters({
        filterMap: {
          ...(reduxFilters.filterMap ?? {}),
          [filterType]: [...carFilters.filterOptions[filterType].applA],
        },
      }),
    );

    setFilterUpdateTrigger(prev => prev + 1);
  };

  const handleSelectAllToggle = <
    T extends keyof NonNullable<typeof carFilters>['filterOptions'],
  >(
    filterType: T,
  ) => {
    if (!carFilters) return;

    const options = carFilters.filterOptions[filterType];
    if (!options || !options.optA) return;

    const allSelected = options.optA.every((opt: any) =>
      options.applA?.includes(opt.id),
    );

    if (allSelected) {
      // Deselect all
      options.optA.forEach((opt: any) => {
        if (options.applA?.includes(opt.id)) {
          carFilters.applyFilter(filterType, opt.id);
        }
      });
    } else {
      // Select all
      options.optA.forEach((opt: any) => {
        if (!options.applA?.includes(opt.id)) {
          carFilters.applyFilter(filterType, opt.id);
        }
      });
    }

    dispatch(
      setCarFilters({
        filterMap: {
          ...(reduxFilters.filterMap ?? {}),
          [filterType]: [...carFilters.filterOptions[filterType].applA],
        },
      }),
    );

    setFilterUpdateTrigger(prev => prev + 1);
  };

  const isAllSelected = <
    T extends keyof NonNullable<typeof carFilters>['filterOptions'],
  >(
    filterType: T,
  ): boolean => {
    if (!carFilters) return false;
    const options = carFilters.filterOptions[filterType];
    if (!options || !options.optA || options.optA.length === 0) return false;
    return options.optA.every((opt: any) => options.applA?.includes(opt.id));
  };

  const handleClearAllFilters = () => {
    if (carFilters) {
      carFilters.resetAppliedFilters();
      setSearchTerm('');
      dispatch(resetCarFilters());
      setFilterUpdateTrigger(prev => prev + 1);
    }
  };

  if (!carFilters || !carSearchResults || carSearchResults.length === 0) {
    return null;
  }

  const filterOptions = carFilters.filterOptions;
  const appliedFiltersCount = carFilters.getAppliedFiltersCount();

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, {backgroundColor: colors.white}]}>
          {/* Header */}
          <View style={[styles.header, {borderBottomColor: colors.neutral200}]}>
            <CustomText variant="text-lg-semibold" color="neutral900">
              Filters
            </CustomText>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={24} color={colors.neutral900} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Search by Car Name */}
            <View style={styles.searchSection}>
              <CustomText variant="text-sm-semibold" color="neutral900" style={styles.searchLabel}>
                Search by Car Name
              </CustomText>
              <View style={[styles.searchInputContainer, {borderColor: colors.neutral200}]}>
                <Search size={18} color={colors.neutral400} />
                <TextInput
                  style={[
                    styles.searchInput,
                    {
                      color: colors.neutral900,
                    },
                  ]}
                  placeholder="Search"
                  placeholderTextColor={colors.neutral400}
                  value={searchTerm}
                  onChangeText={handleSearchChange}
                />
              </View>
            </View>

            {/* Filter Sections */}
            {Object.entries(filterOptions).map(([filterType, options]) => {
              if (!options || !options.optA || options.optA.length === 0) {
                return null;
              }

              const allSelected = isAllSelected(filterType as any);
              const sectionTitle = filterType
                .split(/(?=[A-Z])/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');

              return (
                <View key={filterType} style={styles.filterSection}>
                  {/* Section Header with Select All */}
                  <View style={styles.sectionHeader}>
                    <CustomText variant="text-sm-semibold" color="neutral900">
                      {sectionTitle}
                    </CustomText>
                    <View style={styles.selectAllContainer}>
                      <CustomText variant="text-sm-normal" color="neutral600" style={styles.selectAllText}>
                        Select all
                      </CustomText>
                      <TouchableOpacity
                        onPress={() => handleSelectAllToggle(filterType as any)}
                        activeOpacity={0.8}>
                        <View
                          style={[
                            styles.customSwitch,
                            {
                              backgroundColor: allSelected
                                ? colors.neutral900
                                : colors.neutral300,
                            },
                          ]}>
                          <View
                            style={[
                              styles.switchThumb,
                              {
                                backgroundColor: colors.white,
                                transform: [{translateX: allSelected ? 10 : 0}],
                              },
                            ]}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Checkbox Options */}
                  <View style={styles.optionsContainer}>
                    {options.optA.map((option: any, index: number) => {
                      const isSelected = options.applA?.includes(option.id);
                      return (
                        <TouchableOpacity
                          key={`${filterType}-${option.id}-${index}`}
                          style={styles.checkboxOption}
                          onPress={() =>
                            handleFilterToggle(
                              filterType as any,
                              option.id,
                            )
                          }>
                          <View
                            style={[
                              styles.checkbox,
                              {
                                backgroundColor: isSelected
                                  ? colors.neutral900
                                  : colors.white,
                                borderColor: isSelected
                                  ? colors.neutral900
                                  : colors.neutral300,
                              },
                            ]}>
                            {isSelected && (
                              <View style={styles.checkmarkInner} />
                            )}
                          </View>
                          <CustomText
                            variant="text-sm-normal"
                            color="neutral900"
                            style={styles.checkboxLabel}>
                            {option.nm || option.id}
                          </CustomText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, {borderTopColor: colors.neutral200}]}>
            <TouchableOpacity
              style={[styles.resetButton, {borderColor: colors.neutral300, backgroundColor: colors.white}]}
              onPress={handleClearAllFilters}
              disabled={appliedFiltersCount === 0}
              activeOpacity={0.8}>
              <CustomText
                variant="text-sm-medium"
                color={appliedFiltersCount === 0 ? 'neutral400' : 'neutral900'}>
                Reset all filters
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, {backgroundColor: colors.neutral900}]}
              onPress={onClose}
              activeOpacity={0.8}>
              <CustomText variant="text-sm-semibold" color="white">
                Apply filters {appliedFiltersCount > 0 ? `(${appliedFiltersCount})` : ''}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchLabel: {
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectAllText: {
    fontSize: 14,
  },
  customSwitch: {
    width: 26,
    height: 16,
    borderRadius: 20,
    justifyContent: 'center',
    padding: 0.5,
  },
  switchThumb: {
    width: 14,
    height: 14,
    borderRadius: 10,
  },
  optionsContainer: {
    gap: 12,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkInner: {
    width: 6,
    height: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.lightThemeColors.white,
    transform: [{rotate: '45deg'}],
    marginTop: -2,
  },
  checkboxLabel: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
