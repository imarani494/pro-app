import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {ChevronDown, X} from 'lucide-react-native';
import CustomText from '../../common/components/CustomText';
import {useTheme} from '../../context/ThemeContext';
import DashedDrawLine from '../../common/components/DashedDrawLine';

export interface DropCity {
  cnm: string;
  num: number;
  cid: number;
}

export interface DropDate {
  dDt: string;
  dpCtyA: DropCity[];
}

export interface PickupCity {
  cnm: string;
  cid: number;
  dpDtA: DropDate[];
}

export interface RdSrchOpts {
  pkCtyA: PickupCity[];
}

export interface RoadTransportSearchData {
  rdSrchOpts: RdSrchOpts;
}

const getInitialSelections = (pkCtyA: PickupCity[]) => {
  if (!pkCtyA || pkCtyA.length === 0)
    return {
      pickupCity: {cnm: '', cid: 0},
      dropDate: '',
      dropCity: {cnm: '', cid: 0},
    };
  const firstPickup = pkCtyA[0];
  const firstDpDtA = firstPickup.dpDtA?.[0];
  const firstDropDate = firstDpDtA?.dDt || '';
  const firstDropCityObj = firstDpDtA?.dpCtyA?.[0] || {cnm: '', cid: 0};
  return {
    pickupCity: {cnm: firstPickup.cnm, cid: firstPickup.cid},
    dropDate: firstDropDate,
    dropCity: {cnm: firstDropCityObj.cnm, cid: firstDropCityObj.cid},
  };
};

interface RoadTransportSearchProps {
  formState: {
    pickupCity: {
      cnm: string;
      cid: number;
    };
    dropCity: {
      cnm: string;
      cid: number;
    };
    dropDate: string;
  };
  setFormState: React.Dispatch<
    React.SetStateAction<{
      pickupCity: {
        cnm: string;
        cid: number;
      };
      dropCity: {
        cnm: string;
        cid: number;
      };
      dropDate: string;
    }>
  >;
  travellers: boolean;
  setTravellers: React.Dispatch<React.SetStateAction<boolean>>;
  contentCardState: any;
  onSearch: () => void;
}

export default function RoadTransportSearch({
  formState,
  setFormState,
  travellers,
  setTravellers,
  contentCardState,
  onSearch,
}: RoadTransportSearchProps) {
  const {colors} = useTheme();
  const [showPickupCityModal, setShowPickupCityModal] = useState(false);
  const [showDropCityModal, setShowDropCityModal] = useState(false);
  const [showDropDateModal, setShowDropDateModal] = useState(false);

  const actionData = contentCardState?.context?.query?.actionData;
  const data = actionData?.otherData;

  useEffect(() => {
    if (!data || !data.rdSrchOpts || !data.rdSrchOpts.pkCtyA) {
      return;
    }

    const restore = async () => {
      const saved = await AsyncStorage.getItem('roadTransportFormState');
      if (saved) {
        setFormState(JSON.parse(saved));
      } else if (
        (!formState.pickupCity?.cnm || !formState.pickupCity?.cid) &&
        !formState.dropDate &&
        (!formState.dropCity?.cnm || !formState.dropCity?.cid) &&
        data.rdSrchOpts.pkCtyA.length > 0
      ) {
        setFormState(getInitialSelections(data.rdSrchOpts.pkCtyA));
      }
    };
    restore();
  }, [data?.rdSrchOpts?.pkCtyA]);

  if (!data || !data.rdSrchOpts || !data.rdSrchOpts.pkCtyA) {
    return (
      <View style={styles.container}>
        <CustomText
          variant="text-base-medium"
          color="red600"
          style={styles.errorText}>
          Road transport data not available. Please try again later.
        </CustomText>
      </View>
    );
  }

  const selectedPickupObj =
    data.rdSrchOpts.pkCtyA.find(
      (c: PickupCity) =>
        c.cnm === formState.pickupCity?.cnm &&
        c.cid === formState.pickupCity?.cid,
    ) || data.rdSrchOpts.pkCtyA[0];

  const dropDates =
    selectedPickupObj?.dpDtA?.map((dt: DropDate) => dt.dDt) || [];

  const selectedDropDateObj =
    selectedPickupObj?.dpDtA?.find(
      (dt: DropDate) => dt.dDt === formState.dropDate,
    ) || selectedPickupObj?.dpDtA?.[0];

  const dropCities = selectedDropDateObj?.dpCtyA || [];

  const handleSearchWithPersist = async () => {
    await AsyncStorage.setItem(
      'roadTransportFormState',
      JSON.stringify(formState),
    );
    onSearch();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.white,
        },
      ]}>
      <View style={styles.fieldSet}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CustomText variant="text-base-semibold" color="neutral900">
              Pickup Info
            </CustomText>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowPickupCityModal(true)}>
            <View
              style={[
                styles.inputField,
                {backgroundColor: colors.white, borderColor: colors.neutral200},
              ]}>
              <View style={styles.fieldContent}>
                <View style={styles.fieldLabel}>
                  <CustomText variant="text-xs-normal" color="neutral500">
                    Pick-up City
                  </CustomText>
                  <CustomText variant="text-xs-normal" color="neutral500">
                    *
                  </CustomText>
                </View>
                <CustomText variant="text-sm-medium" color="neutral900">
                  {formState.pickupCity?.cnm || 'Select Pickup City'}
                </CustomText>
              </View>
              <ChevronDown size={16} color={colors.neutral500} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.separator, {backgroundColor: '#E5E5E5'}]} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CustomText variant="text-base-semibold" color="neutral900">
              Drop-off Info
            </CustomText>
          </View>

          <View style={styles.fieldSet}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (!!formState.pickupCity?.cid && !!formState.dropDate) {
                  setShowDropCityModal(true);
                }
              }}>
              <View
                style={[
                  styles.inputField,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.neutral200,
                  },
                ]}>
                <View style={styles.fieldContent}>
                  <View style={styles.fieldLabel}>
                    <CustomText variant="text-xs-normal" color="neutral500">
                      Drop-off City
                    </CustomText>
                    <CustomText variant="text-xs-normal" color="neutral500">
                      *
                    </CustomText>
                  </View>
                  <CustomText
                    variant="text-sm-medium"
                    color={
                      !!formState.pickupCity?.cid && !!formState.dropDate
                        ? 'neutral900'
                        : 'neutral400'
                    }>
                    {formState.dropCity?.cnm || 'Select Drop City'}
                  </CustomText>
                </View>
                <ChevronDown size={16} color={colors.neutral500} />
              </View>
            </TouchableOpacity>

            {/* Drop Date */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.fieldSpacing}
              onPress={() => {
                if (!!formState.pickupCity?.cid) {
                  setShowDropDateModal(true);
                }
              }}>
              <View
                style={[
                  styles.inputField,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.neutral200,
                  },
                ]}>
                <View style={styles.fieldContent}>
                  <View style={styles.fieldLabel}>
                    <CustomText variant="text-xs-normal" color="neutral500">
                      Drop-off Date
                    </CustomText>
                    <CustomText variant="text-xs-normal" color="neutral500">
                      *
                    </CustomText>
                  </View>
                  <CustomText
                    variant="text-sm-medium"
                    color={
                      !!formState.pickupCity?.cid ? 'neutral900' : 'neutral400'
                    }>
                    {formState.dropDate || 'Select Drop Date'}
                  </CustomText>
                </View>
                <ChevronDown size={16} color={colors.neutral500} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <DashedDrawLine />

        <View style={styles.section}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTravellers(!travellers)}>
            <View
              style={[
                styles.inputField,
                {backgroundColor: colors.white, borderColor: colors.neutral200},
              ]}>
              <View style={styles.fieldContent}>
                <View style={styles.fieldLabel}>
                  <CustomText variant="text-xs-normal" color="neutral500">
                    Travellers
                  </CustomText>
                  <CustomText variant="text-xs-normal" color="neutral500">
                    *
                  </CustomText>
                </View>
                <CustomText variant="text-sm-medium" color="neutral900">
                  {contentCardState.context.query.tvlG
                    ? contentCardState.context.query.tvlG?.tvlA?.length || 0
                    : 0}{' '}
                  {(contentCardState.context.query.tvlG?.tvlA?.length || 0) ===
                  1
                    ? 'Traveller'
                    : 'Travellers'}
                </CustomText>
              </View>
              <ChevronDown size={16} color={colors.neutral500} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Button */}
      <TouchableOpacity
        style={[styles.searchButton, {backgroundColor: '#171717'}]}
        onPress={handleSearchWithPersist}>
        <CustomText variant="text-sm-medium" color="white">
          Search
        </CustomText>
      </TouchableOpacity>

      <Modal
        visible={showPickupCityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPickupCityModal(false)}>
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowPickupCityModal(false)}
          />
          <View
            style={[
              styles.modalContent,
              {backgroundColor: colors.white || '#ffffff'},
            ]}>
            <View style={styles.modalHeader}>
              <CustomText variant="text-lg-semibold" color="neutral900">
                Select Pickup City
              </CustomText>
              <TouchableOpacity
                onPress={() => setShowPickupCityModal(false)}
                style={styles.closeButton}>
                <X size={24} color={colors.neutral500} />
              </TouchableOpacity>
            </View>

            {/* Cities List */}
            <FlatList
              data={data.rdSrchOpts.pkCtyA}
              keyExtractor={item => item.cid.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.cityItem,
                    {
                      backgroundColor:
                        formState.pickupCity?.cid === item.cid
                          ? colors.primary50 || '#f0f9ff'
                          : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    const firstDropDate = item?.dpDtA?.[0]?.dDt || '';
                    const firstDropCityObj = item?.dpDtA?.[0]?.dpCtyA?.[0] || {
                      cnm: '',
                      cid: 0,
                    };
                    setFormState({
                      pickupCity: {cnm: item.cnm, cid: item.cid},
                      dropDate: firstDropDate,
                      dropCity: {
                        cnm: firstDropCityObj.cnm,
                        cid: firstDropCityObj.cid,
                      },
                    });
                    setShowPickupCityModal(false);
                  }}>
                  <CustomText
                    variant="text-base-medium"
                    color={
                      formState.pickupCity?.cid === item.cid
                        ? 'primary600'
                        : 'neutral900'
                    }>
                    {item.cnm}
                  </CustomText>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Drop City Modal */}
      <Modal
        visible={showDropCityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDropCityModal(false)}>
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowDropCityModal(false)}
          />
          <View
            style={[
              styles.modalContent,
              {backgroundColor: colors.white || '#ffffff'},
            ]}>
            <View style={styles.modalHeader}>
              <CustomText variant="text-lg-semibold" color="neutral900">
                Select Drop-off City
              </CustomText>
              <TouchableOpacity
                onPress={() => setShowDropCityModal(false)}
                style={styles.closeButton}>
                <X size={24} color={colors.neutral500} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={dropCities}
              keyExtractor={item => item.cid.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.cityItem,
                    {
                      backgroundColor:
                        formState.dropCity?.cid === item.cid
                          ? colors.primary50 || '#f0f9ff'
                          : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setFormState(prev => ({
                      ...prev,
                      dropCity: {cnm: item.cnm, cid: item.cid},
                    }));
                    setShowDropCityModal(false);
                  }}>
                  <CustomText
                    variant="text-base-medium"
                    color={
                      formState.dropCity?.cid === item.cid
                        ? 'primary600'
                        : 'neutral900'
                    }>
                    {item.cnm}
                  </CustomText>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <CustomText variant="text-base-medium" color="neutral400">
                    No drop cities available. Please select a pickup city and
                    date first.
                  </CustomText>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Drop Date Modal */}
      <Modal
        visible={showDropDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDropDateModal(false)}>
        <View style={styles.modalOverlay}>
          <Pressable
            style={[
              styles.modalBackdrop,
              {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            ]}
            onPress={() => setShowDropDateModal(false)}
          />
          <View
            style={[
              styles.modalContent,
              {backgroundColor: colors.white || '#ffffff'},
            ]}>
            {/* Modal Header */}
            <View
              style={[
                styles.modalHeader,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: '#E5E5E5',
                },
              ]}>
              <CustomText variant="text-lg-semibold" color="neutral900">
                Select Drop-off Date
              </CustomText>
              <TouchableOpacity
                onPress={() => setShowDropDateModal(false)}
                style={styles.closeButton}>
                <X size={24} color={colors.neutral500} />
              </TouchableOpacity>
            </View>

            {/* Dates List */}
            <FlatList
              data={dropDates}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.cityItem,
                    {
                      backgroundColor:
                        formState.dropDate === item
                          ? colors.primary50 || '#f0f9ff'
                          : 'transparent',

                      borderBottomWidth: 1,
                      borderBottomColor: '#F5F5F5',
                    },
                  ]}
                  onPress={() => {
                    const dropDateObj = selectedPickupObj?.dpDtA?.find(
                      (dt: DropDate) => dt.dDt === item,
                    );
                    const firstDropCityObj = dropDateObj?.dpCtyA?.[0] || {
                      cnm: '',
                      cid: 0,
                    };
                    setFormState(prev => ({
                      ...prev,
                      dropDate: item,
                      dropCity: {
                        cnm: firstDropCityObj.cnm,
                        cid: firstDropCityObj.cid,
                      },
                    }));
                    setShowDropDateModal(false);
                  }}>
                  <CustomText
                    variant="text-base-medium"
                    color={
                      formState.dropDate === item ? 'primary600' : 'neutral900'
                    }>
                    {item}
                  </CustomText>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <CustomText variant="text-base-medium" color="neutral400">
                    No drop dates available. Please select a pickup city first.
                  </CustomText>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  fieldSet: {
    gap: 24,
    marginBottom: 24,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    paddingVertical: 0,
    justifyContent: 'flex-start',
  },

  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,

    gap: 10,
  },
  fieldContent: {
    flex: 1,
    gap: 4,
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },

  fieldSpacing: {
    marginTop: 20,
  },
  hiddenPicker: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  separator: {
    height: 1,
    width: '100%',
    marginVertical: 0,
    paddingHorizontal: 20,
  },
  searchButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 100,
    paddingVertical: 14,
    shadowColor: 'rgba(26, 26, 26, 0.05)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 34,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  cityItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  emptyState: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
