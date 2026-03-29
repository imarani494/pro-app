import React, {
  forwardRef,
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

import {Edit, Edit2, Plus, Search, X} from 'lucide-react-native';
import {useTheme} from '../../../context/ThemeContext';
import {Colors} from '../../../styles';
import {CustomText} from '../../../common/components';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import fontConfig from '../../../styles/fontConfig';
import {useAppDispatch} from '../../../store';
import {fetchCustomerSearchX} from '../redux/customTripSlice';
import {User} from '../../../data';
import SecureStorageUtil from '../../../utils/SecureStorageUtil';
import {AppConfig} from '../../../config';
import {flex} from '../../../styles/typography';
import TravellerFormBottomSheet from './TravellerFormBottomSheet';

export interface AddTravelersBottomSheetProps {
  AddTravelerBottomSheetRef: React.RefObject<BottomSheetModalMethods | null>;
  onSelectTraveller: (travellerOption: {
    id: string;
    name: string;
    customerId?: string | number | undefined;
    age?: number | undefined;
  }) => void;
  existingTravellers?: TravellerOption[];
}
export interface TravellerOption {
  id: string;
  name: string;
  customerId?: number | string;
  age?: number;
}

const AddTravelersBottomSheet = ({
  AddTravelerBottomSheetRef,
  onSelectTraveller,
  existingTravellers = [],
}: AddTravelersBottomSheetProps) => {
  const {colors} = useTheme();
  const snapPoints = useMemo(() => ['80%', '80%', '80%'], []);
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useAppDispatch();

  // Add missing state variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [editingTraveller, setEditingTraveller] =
    useState<TravellerOption | null>(null);
  const [availableTravellers, setAvailableTravellers] = useState<
    TravellerOption[]
  >([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const authToken = async () => {
    const authToken = await SecureStorageUtil.getSecretKey('authToken');
    if (authToken) {
      return authToken;
    } else {
      return '';
    }
  };

  // Backdrop component
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const searchCustomers = useCallback(
    async (query: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const requestSignal = abortController.signal;

      setLoading(true);
      setError(null);
      setAvailableTravellers([]); // Clear old data immediately

      try {
        const response = await dispatch(
          fetchCustomerSearchX({
            q: query.trim() || ' ',
            __xreq__: true,
            _auth: await authToken(),
            userId: User.getUserId()?.toString() || '0',
          }) as any,
        );

        const data = response.payload;

        let customers: any[] = [];

        if (
          data &&
          data._data &&
          typeof data._data === 'object' &&
          data._data !== null
        ) {
          customers = data._data.CA || data._data.cA || [];

          if (Array.isArray(customers)) {
          } else {
            customers = [];
          }
        }
        // Fallback to _data as direct array
        else if (data && data._data && Array.isArray(data._data)) {
          customers = data._data;
        }
        // Fallback to other _data properties
        else if (data && data._data && typeof data._data === 'object') {
          customers =
            data._data.customers ||
            data._data.list ||
            data._data.data ||
            data._data.items ||
            [];
        }
        // Direct array response
        else if (Array.isArray(data)) {
          customers = data;
        }
        // Root level extraction (check both cases)
        else if (data && typeof data === 'object') {
          customers =
            data.CA ||
            data.cA ||
            data.customers ||
            data.list ||
            data.data ||
            data.items ||
            [];
        }

        // Ensure customers is an array
        if (!Array.isArray(customers)) {
          console.warn('⚠️ Customers is not an array, converting:', customers);
          customers = [];
        }

        // Transform to TravellerOption format
        if (customers.length > 0) {
          const travellers: TravellerOption[] = customers
            .map((customer: any, index: number) => {
              // Extract customer ID
              const customerId =
                customer.id ||
                customer.cuid ||
                customer.customerId ||
                customer.cid;

              const name =
                customer.nm ||
                customer.name ||
                `${customer.firstName || customer.fn || ''} ${
                  customer.lastName || customer.ln || ''
                }`.trim() ||
                customer.fullName ||
                `Traveller ${index + 1}`;

              const traveller: TravellerOption = {
                id:
                  customerId?.toString() ||
                  `temp_${index}_${customer.id || 'unknown'}`,
                name: name.trim() || `Traveller ${index + 1}`,
                customerId: customerId || undefined,
              };

              return traveller;
            })
            .filter((t: TravellerOption) => {
              const isValid = t && t.name && t.name.trim().length > 0;
              if (!isValid) {
              }
              return isValid;
            });

          // Remove duplicates based on customerId
          const uniqueTravellers = travellers.filter(
            (traveller, index, self) => {
              if (!traveller.customerId) {
                return true;
              }
              const firstIndex = self.findIndex(
                t =>
                  t.customerId &&
                  traveller.customerId &&
                  t.customerId.toString() === traveller.customerId.toString(),
              );
              return index === firstIndex;
            },
          );

          setAvailableTravellers(uniqueTravellers);
        } else {
          setAvailableTravellers([]);
        }
      } catch (err: any) {
        if (err.name === 'AbortError' || err.message?.includes('aborted')) {
          return;
        }

        console.error('❌ Search error:', err);
        setError(
          err.message || 'Failed to search customers. Please try again.',
        );
        setAvailableTravellers([]);
        setLoading(false);
      } finally {
        if (!requestSignal.aborted) {
          setLoading(false);
        }
      }
    },
    [dispatch],
  );
  // Remove the automatic API call on mount
  // The API will only be called when the bottom sheet is opened

  const handleSelectTraveller = (traveller: TravellerOption) => {
    setSearchValue('');
    onSelectTraveller(traveller);
    AddTravelerBottomSheetRef.current?.dismiss();
  };
  const handleAddNewCustomer = () => {
    setShowNewCustomerModal(true);
  };

  const handleNewCustomerSave = (travellerData: any, custID: any) => {
    const newTraveller: TravellerOption = {
      id: custID?.toString() || `new_traveller_${existingTravellers.length}`,
      name:
        `${travellerData.firstName || ''} ${
          travellerData.lastName || ''
        }`.trim() ||
        travellerData.firstName ||
        'New Traveller',
      customerId: custID,
      age: travellerData.age,
    };
    handleSelectTraveller(newTraveller);
    setShowNewCustomerModal(false);
  };

  const handleEditTraveller = (
    traveller: TravellerOption,
    e: GestureResponderEvent,
  ) => {
    e.stopPropagation();
    setEditingTraveller(traveller);
  };

  const calculateAgeFromDOB = (
    day?: string | number,
    month?: string | number,
    year?: string | number,
  ): number | '' => {
    if (!day || !month || !year) return '';

    const d = Number(day);
    const m = Number(month);
    const y = Number(year);

    if (!d || !m || !y) return '';

    const today = new Date();
    let age = today.getFullYear() - y;

    const monthDiff = today.getMonth() + 1 - m;
    const dayDiff = today.getDate() - d;

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age > 0 ? age : '';
  };

  const handleEditTravellerSave = (travellerData: any, custID: any) => {
    if (!editingTraveller) return;

    // 1. Try to derive age from birthdayDay / birthdayMonth / birthdayYear
    const derivedAge = calculateAgeFromDOB(
      travellerData.birthdayDay,
      travellerData.birthdayMonth,
      travellerData.birthdayYear,
    );

    // 2. Final age priority: DOB → explicit age → existing age
    const ageValue: number | '' =
      derivedAge !== ''
        ? derivedAge
        : travellerData.age !== undefined && travellerData.age !== null
        ? typeof travellerData.age === 'number'
          ? travellerData.age
          : parseInt(travellerData.age, 10) || ''
        : editingTraveller.age;

    const updatedTraveller: TravellerOption = {
      ...editingTraveller,
      name:
        `${travellerData.firstName || ''} ${
          travellerData.lastName || ''
        }`.trim() ||
        travellerData.firstName ||
        editingTraveller.name,
      customerId: custID || editingTraveller.customerId,
      age: ageValue || undefined,
    };

    // Update the traveller in the available list
    setAvailableTravellers(prev =>
      prev.map(t =>
        t.id === editingTraveller.id ||
        (t.customerId &&
          editingTraveller.customerId &&
          t.customerId.toString() === editingTraveller.customerId.toString())
          ? updatedTraveller
          : t,
      ),
    );

    setEditingTraveller(null);
  };
  // Handle bottom sheet state changes
  const handleSheetChange = useCallback(
    (index: number) => {
      // When bottom sheet opens (index >= 0), call the search API
      if (index >= 0 && User.authToken && User.getUserId()) {
        setAvailableTravellers([]); // Clear old data immediately
        setLoading(true);
        setError(null);
        searchCustomers('');
      }
    },
    [searchCustomers],
  );

  return (
    <BottomSheetModal
      ref={AddTravelerBottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      style={styles.bottomSheet}
      handleStyle={[styles.handle, {backgroundColor: colors.white}]}
      handleIndicatorStyle={[
        styles.handleIndicator,
        {backgroundColor: colors.neutral300},
      ]}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChange}>
      <View style={{flex: 1}}>
        <View style={styles.headerContent}>
          <CustomText variant="text-lg-semibold" color="neutral900">
            Add Travelers
          </CustomText>
          <View style={flex.rowItemCenter}>
            <TouchableOpacity
              style={styles.headerRight}
              onPress={handleAddNewCustomer}>
              <Plus size={18} color={colors.neutral900} />
              <CustomText variant="text-sm-medium" color="neutral900">
                Add New
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                AddTravelerBottomSheetRef.current?.dismiss();
                setSearchValue('');
              }}>
              <X size={20} color={colors.neutral900} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Search
            size={16}
            color={colors.neutral500}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, {color: colors.neutral900}]}
            placeholder="Search"
            placeholderTextColor={colors.neutral400}
            value={searchValue}
            onChangeText={text => {
              setSearchValue(text);
              searchCustomers(text);
            }}
            autoFocus={true}
          />
        </View>
        <BottomSheetScrollView
          style={[styles.contentContainer, {backgroundColor: colors.white}]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.nationalitySheetContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.neutral900} />
                <CustomText
                  variant="text-base-normal"
                  color="neutral500"
                  style={{marginTop: 8}}>
                  Loading travelers...
                </CustomText>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <CustomText variant="text-base-normal" color="red500">
                  {error}
                </CustomText>
              </View>
            ) : availableTravellers.length > 0 ? (
              availableTravellers.map(traveller => (
                <TouchableOpacity
                  key={traveller.id}
                  style={[styles.nationalityOption]}
                  onPress={() => {
                    handleSelectTraveller(traveller);
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <CustomText variant={'text-base-normal'} color="neutral900">
                      {traveller.name}
                    </CustomText>
                    {/* {traveller.customerId && (
                      <TouchableOpacity
                        onPress={e => handleEditTraveller(traveller, e)}
                        style={{padding: 4}}>
                        <Edit2 size={16} color={colors.neutral600} />
                      </TouchableOpacity>
                    )} */}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <CustomText variant="text-base-normal" color="neutral500">
                  No travellers found
                </CustomText>
              </View>
            )}
          </View>
        </BottomSheetScrollView>

        {/* New Customer Modal */}
        {showNewCustomerModal && (
          <TravellerFormBottomSheet
            visible={showNewCustomerModal}
            onSave={handleNewCustomerSave}
            onClose={() => setShowNewCustomerModal(false)}
            sectionTitle="Add New Traveler"
          />
        )}

        {/* Edit Traveller Modal */}
        {editingTraveller && (
          <TravellerFormBottomSheet
            visible={!!editingTraveller}
            initialData={editingTraveller}
            onSave={(travellerData, custID) => {
              const updatedTraveller: TravellerOption = {
                ...editingTraveller,
                name: `${travellerData.firstName || ''} ${
                  travellerData.lastName || ''
                }`.trim(),
                customerId: custID || editingTraveller.customerId,
                age: travellerData.age || editingTraveller.age,
              };
              handleSelectTraveller(updatedTraveller);
              setEditingTraveller(null);
            }}
            onClose={() => setEditingTraveller(null)}
            sectionTitle="Edit Traveler"
          />
        )}
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    // paddingHorizontal: 20,
    // paddingTop: 10,
    // flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
    paddingHorizontal: 20,
  },
  handle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral900,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 12,
    backgroundColor: Colors.lightThemeColors.white,
    marginHorizontal: 20,
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
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
});

export default AddTravelersBottomSheet;
