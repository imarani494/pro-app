import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomText from '../../common/components/CustomText';
import {X, CalendarDays, ChevronDown} from 'lucide-react-native';
import {useContentOptionsLoad} from '../../contentCard/hooks/useContentOptionsLoad';

interface EditRoadModalProps {
  onClose: () => void;
  contentCardState?: any;
  onSearch?: (newParams: any) => void;
}

interface FormState {
  pickupCity: {cnm: string; cid: number};
  dropCity: {cnm: string; cid: number};
  dropDate: string;
}

const EditRoadModal = ({
  onClose,
  contentCardState,
  onSearch,
}: EditRoadModalProps) => {
  const {colors} = useTheme();
  const contentOptionsLoad = useContentOptionsLoad();

  const rdTxptQ = contentCardState?.context?.query?.rdTxptQ;
  const pkCtyA =
    contentCardState?.context?.query?.actionData?.otherData?.rdSrchOpts
      ?.pkCtyA || [];
  const travellers = Array.isArray(contentCardState?.context?.query?.tvlG?.tvlA)
    ? contentCardState.context.query.tvlG.tvlA
    : [];

  const [formState, setFormState] = useState<FormState>({
    pickupCity: {cnm: '', cid: 0},
    dropCity: {cnm: '', cid: 0},
    dropDate: '',
  });

  const [modal, setModal] = useState<{
    visible: boolean;
    type: 'pickup' | 'dropDate' | 'dropCity' | null;
  }>({
    visible: false,
    type: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const isFormValid =
    !!formState?.pickupCity?.cid &&
    !!formState?.dropCity?.cid &&
    !!formState?.dropDate;

  const hasChanges =
    formState?.pickupCity?.cid !== rdTxptQ?.pkCid ||
    formState?.dropCity?.cid !== rdTxptQ?.dpCid ||
    formState?.dropDate !== (rdTxptQ?.dpDt ? rdTxptQ.dpDt.split(' ')[0] : '');

  const closeModal = () => {
    setModal({visible: false, type: null});
  };

  const openModal = (type: 'pickup' | 'dropDate' | 'dropCity') => {
    setModal({visible: true, type});
  };

  useEffect(() => {
    if (rdTxptQ && pkCtyA && pkCtyA.length > 0) {
      const currentPickupCity = pkCtyA.find(
        (city: any) => city.cid === rdTxptQ.pkCid,
      );
      const currentDropCity = getDropoffCityObject();

      setFormState({
        pickupCity: currentPickupCity
          ? {cnm: currentPickupCity.cnm, cid: currentPickupCity.cid}
          : {cnm: '', cid: 0},
        dropCity: currentDropCity || {cnm: '', cid: 0},
        dropDate: rdTxptQ.dpDt ? rdTxptQ.dpDt.split(' ')[0] : '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rdTxptQ, pkCtyA]);

  const getDropoffCityObject = () => {
    if (rdTxptQ?.dpCid && rdTxptQ?.dpDt && pkCtyA) {
      const dropDate = rdTxptQ.dpDt.split(' ')[0];
      const pickupCityObj = pkCtyA.find(
        (city: any) => city.cid === rdTxptQ.pkCid,
      );
      if (pickupCityObj?.dpDtA) {
        const dropDateObj = pickupCityObj.dpDtA.find(
          (dt: any) => dt.dDt === dropDate,
        );
        if (dropDateObj?.dpCtyA) {
          const dropCity = dropDateObj.dpCtyA.find(
            (city: any) => city.cid === rdTxptQ.dpCid,
          );
          return dropCity ? {cnm: dropCity.cnm, cid: dropCity.cid} : null;
        }
      }
    }
    return null;
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr.split(' ')[0]);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const pickupCityOptions = pkCtyA.map((city: any) => ({
    label: city.cnm,
    value: city.cid,
  }));

  const selectedPickupObj = pkCtyA.find(
    (c: any) => c.cid === formState.pickupCity.cid,
  );

  const dropDateOptions =
    selectedPickupObj?.dpDtA?.map((dt: any) => ({
      label: formatDisplayDate(dt.dDt),
      value: dt.dDt,
    })) || [];

  const selectedDropDateObj = selectedPickupObj?.dpDtA?.find(
    (dt: any) => dt.dDt === formState.dropDate,
  );

  const dropCityOptions =
    selectedDropDateObj?.dpCtyA?.map((city: any) => ({
      label: city.cnm,
      value: city.cid,
    })) || [];

  const handleUpdate = async () => {
    console.log('🔄 Update clicked:', formState);

    setFormErrors([]);

    if (
      !formState.pickupCity.cid ||
      !formState.dropCity.cid ||
      !formState.dropDate
    ) {
      setFormErrors(['Please fill all required fields']);
      return;
    }

    if (!hasChanges) {
      onClose();
      return;
    }

    setIsLoading(true);

    try {
      const searchQuery = {
        qt: 'LISTINGS',
        type: 'ROAD_VEHICLE',
        rdTxptQ: {
          pkCid: formState.pickupCity.cid,
          dpCid: formState.dropCity.cid,
          dpDt: formState.dropDate,
        },
      };

      const result = await contentOptionsLoad(searchQuery);

      console.log('📥 Update result:', {
        status: result?.meta?.requestStatus,
        success: result?.payload?.success,
        items: result?.payload?._data?.items?.length,
        errorMsg: result?.payload?.error_msg,
      });

      if (result?.meta?.requestStatus === 'fulfilled') {
        onSearch?.({
          pickupCity: formState.pickupCity,
          dropCity: formState.dropCity,
          dropDate: formState.dropDate,
          searchCompleted: true,
        });
        onClose();
      } else {
        let errorMsg = result?.payload?.error_msg;
        if (
          !errorMsg &&
          'error' in result &&
          result.error &&
          typeof result.error === 'object' &&
          'message' in result.error
        ) {
          errorMsg = (result.error as any).message;
        }
        if (!errorMsg) errorMsg = 'Update failed';
        setFormErrors([errorMsg]);
      }
    } catch (error: any) {
      console.error('❌ Update error:', error);
      setFormErrors([error.message || 'Update failed']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View
        style={[
          styles.modalBackdrop,
          {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        ]}>
        <View style={[styles.container, {backgroundColor: colors.white}]}>
          {/* Header */}
          <View style={[styles.header, {borderBottomColor: colors.neutral200}]}>
            <CustomText variant="text-lg-medium" color="neutral900">
              Edit Transport Details
            </CustomText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={16} color={colors.neutral900} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}>
            <View style={styles.fieldsContainer}>
              {/* Pick-up City */}
              <View style={styles.fieldWrapper}>
                <TouchableOpacity
                  style={[
                    styles.inputField,
                    {
                      borderColor: colors.neutral200,
                      backgroundColor: colors.white,
                    },
                  ]}
                  onPress={() => openModal('pickup')}>
                  <View style={styles.fieldContent}>
                    <CustomText variant="text-xs-normal" color="neutral500">
                      Pick - up City
                    </CustomText>
                    <CustomText variant="text-sm-medium" color="neutral900">
                      {formState.pickupCity?.cnm ? (
                        formState.pickupCity.cnm
                      ) : (
                        <CustomText variant="text-sm-medium" color="neutral900">
                          Kochi
                        </CustomText>
                      )}
                    </CustomText>
                  </View>
                  <ChevronDown size={16} color={colors.neutral500} />
                </TouchableOpacity>
              </View>

              {/* Drop off City */}
              <View style={styles.fieldWrapper}>
                <TouchableOpacity
                  style={[
                    styles.inputField,
                    {
                      borderColor: colors.neutral200,
                      backgroundColor: colors.white,
                    },
                  ]}
                  onPress={() =>
                    formState.pickupCity.cid &&
                    formState.dropDate &&
                    openModal('dropCity')
                  }
                  disabled={!formState.pickupCity.cid || !formState.dropDate}>
                  <View style={styles.fieldContent}>
                    <CustomText variant="text-xs-normal" color="neutral500">
                      Drop off City
                    </CustomText>
                    <CustomText variant="text-sm-medium" color="neutral900">
                      {formState.dropCity?.cnm ? (
                        formState.dropCity.cnm
                      ) : (
                        <CustomText variant="text-sm-medium" color="neutral900">
                          Trivandrum
                        </CustomText>
                      )}
                    </CustomText>
                  </View>
                  <ChevronDown
                    size={16}
                    color={
                      !formState.pickupCity.cid || !formState.dropDate
                        ? colors.neutral900
                        : colors.neutral500
                    }
                  />
                </TouchableOpacity>
              </View>

              {/* Drop off Date with Calendar */}
              <View style={styles.fieldWrapper}>
                <TouchableOpacity
                  style={[
                    styles.inputField,
                    {
                      borderColor: colors.neutral200,
                      backgroundColor: colors.white,
                    },
                  ]}
                  onPress={() =>
                    formState.pickupCity.cid && openModal('dropDate')
                  }
                  disabled={!formState.pickupCity.cid}>
                  <View style={styles.fieldContent}>
                    <CustomText variant="text-xs-normal" color="neutral500">
                      Drop off Date
                    </CustomText>
                    <CustomText variant="text-sm-medium" color="neutral900">
                      {formState.dropDate ? (
                        formatDisplayDate(formState.dropDate)
                      ) : (
                        <CustomText variant="text-sm-medium" color="neutral900">
                          30 Mar 2026
                        </CustomText>
                      )}
                    </CustomText>
                  </View>
                  <CalendarDays
                    size={16}
                    color={colors.neutral500}
                  />
                </TouchableOpacity>
              </View>

              {/* Travellers */}
              <View style={styles.fieldWrapper}>
                <View
                  style={[
                    styles.inputField,
                    {
                      borderColor: colors.neutral200,
                      backgroundColor: colors.white,
                    },
                  ]}>
                  <View style={styles.fieldContent}>
                    <View style={styles.travellersHeader}>
                      <CustomText variant="text-xs-normal" color="neutral500">
                        Travellers
                      </CustomText>
                      <CustomText variant="text-xs-normal" color="neutral500">
                        *
                      </CustomText>
                    </View>
                    <CustomText variant="text-sm-medium" color="neutral900">
                      {`${travellers.length > 0 ? travellers.length : 2} ${
                        (travellers.length > 0 ? travellers.length : 2) === 1
                          ? 'Traveller'
                          : 'Travellers'
                      }`}
                    </CustomText>
                  </View>
                  <ChevronDown size={16} color={colors.neutral500} />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.updateButton,
                {
                  backgroundColor: colors.neutral900,
                },
              ]}
              onPress={handleUpdate}
              disabled={
                !isFormValid ||
                !hasChanges ||
                isLoading ||
                formErrors.length > 0
              }>
              <CustomText variant="text-sm-medium" color="neutral50">
                {isLoading
                  ? 'Updating...'
                  : !hasChanges
                  ? 'No Changes'
                  : 'Update Search'}
              </CustomText>
            </TouchableOpacity>

            <View style={styles.buttonStatus}>
              {formErrors.length > 0 && (
                <CustomText variant="text-xs-normal" color="red600">
                  {formErrors[0] || 'An error occurred'}
                </CustomText>
              )}
            </View>
          </View>

          {/* Center Popup Modal (single implementation) */}
          <Modal
            visible={modal.visible}
            transparent={true}
            animationType="fade"
            onRequestClose={closeModal}>
            <View
              style={[
                styles.modalOverlay,
                {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
              ]}>
              <View
                style={[
                  styles.modalContainer,
                  {backgroundColor: colors.white},
                ]}>
                <View
                  style={[
                    styles.modalHeader,
                    {borderBottomColor: colors.neutral200},
                  ]}>
                  <CustomText variant="text-lg-semibold" color="neutral900">
                    {modal.type === 'pickup'
                      ? 'Select Pickup City'
                      : modal.type === 'dropDate'
                      ? 'Select Drop Date'
                      : 'Select Drop City'}
                  </CustomText>
                  <TouchableOpacity onPress={closeModal}>
                    <X size={24} color={colors.neutral900} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalContent}>
                  {modal.type === 'pickup' && (
                    <FlatList
                      data={pickupCityOptions}
                      keyExtractor={item => item.value.toString()}
                      showsVerticalScrollIndicator={false}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={[
                            styles.modalItem,
                            {
                              backgroundColor:
                                formState.pickupCity.cid === item.value
                                  ? colors.blue100
                                  : colors.white,
                              borderBottomColor: colors.neutral200,
                            },
                          ]}
                          onPress={() => {
                            const selectedCity = pkCtyA.find(
                              (city: any) => city.cid === item.value,
                            );
                            if (selectedCity) {
                              setFormState({
                                pickupCity: {
                                  cnm: selectedCity.cnm,
                                  cid: selectedCity.cid,
                                },
                                dropDate: selectedCity.dpDtA?.[0]?.dDt || '',
                                dropCity: {
                                  cnm:
                                    selectedCity.dpDtA?.[0]?.dpCtyA?.[0]?.cnm ||
                                    '',
                                  cid:
                                    selectedCity.dpDtA?.[0]?.dpCtyA?.[0]?.cid ||
                                    0,
                                },
                              });
                            }
                            closeModal();
                          }}>
                          <CustomText
                            variant="text-base-medium"
                            color={
                              formState.pickupCity.cid === item.value
                                ? 'blue600'
                                : 'neutral900'
                            }>
                            {item.label}
                          </CustomText>
                        </TouchableOpacity>
                      )}
                    />
                  )}

                  {modal.type === 'dropDate' && (
                    <FlatList
                      data={dropDateOptions}
                      keyExtractor={item => item.value}
                      showsVerticalScrollIndicator={false}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={[
                            styles.modalItem,
                            {
                              backgroundColor:
                                formState.dropDate === item.value
                                  ? colors.blue100
                                  : colors.white,
                              borderBottomColor: colors.neutral200,
                            },
                          ]}
                          onPress={() => {
                            const dropDateObj = selectedPickupObj?.dpDtA?.find(
                              (dt: any) => dt.dDt === item.value,
                            );
                            const firstDropCity = dropDateObj?.dpCtyA?.[0];
                            setFormState(prev => ({
                              ...prev,
                              dropDate: item.value,
                              dropCity: firstDropCity
                                ? {
                                    cnm: firstDropCity.cnm,
                                    cid: firstDropCity.cid,
                                  }
                                : {cnm: '', cid: 0},
                            }));
                            closeModal();
                          }}>
                          <CustomText
                            variant="text-base-medium"
                            color={
                              formState.dropDate === item.value
                                ? 'blue600'
                                : 'neutral900'
                            }>
                            {item.label}
                          </CustomText>
                        </TouchableOpacity>
                      )}
                    />
                  )}

                  {modal.type === 'dropCity' && (
                    <FlatList
                      data={dropCityOptions}
                      keyExtractor={item => item.value.toString()}
                      showsVerticalScrollIndicator={false}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={[
                            styles.modalItem,
                            {
                              backgroundColor:
                                formState.dropCity.cid === item.value
                                  ? colors.blue100
                                  : colors.white,
                              borderBottomColor: colors.neutral200,
                            },
                          ]}
                          onPress={() => {
                            setFormState(prev => ({
                              ...prev,
                              dropCity: {cnm: item.label, cid: item.value},
                            }));
                            closeModal();
                          }}>
                          <CustomText
                            variant="text-base-medium"
                            color={
                              formState.dropCity.cid === item.value
                                ? 'blue600'
                                : 'neutral900'
                            }>
                            {item.label}
                          </CustomText>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    maxHeight: '90%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  fieldsContainer: {
    width: '100%',
    gap: 16,
  },
  fieldWrapper: {
    width: '100%',
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  fieldContent: {
    flex: 1,
    gap: 4,
  },
  travellersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  footer: {
    paddingHorizontal: 16,
  },
  updateButton: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonStatus: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalContent: {
    maxHeight: 400,
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
});

export default EditRoadModal;
