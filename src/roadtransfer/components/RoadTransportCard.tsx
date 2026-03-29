import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import AddPackage from './AddPackage';

import {useSelector} from 'react-redux';
import {JourneyStackParamList} from '../../navigators/types';
import {useTheme} from '../../context/ThemeContext';
import {CustomText} from '../../common/components';
import DashedDrawLine from '../../common/components/DashedDrawLine';
import {useUpdateJourney} from '../../journey/hooks/useUpdateJourney';

interface VehicleOption {
  id: string;
  name: string;
  addInfo: {
    pkCty: string;
    dpCty: string;
    dCtyA: string[];
    dpDt: string;
    pkDt: string;
  };
  seats: number;
  selected: boolean;
  price: {prcD: string};
}

interface RoadTransportCardProps {
  contentCardState: any;
  setSelectedCardDetails: React.Dispatch<
    React.SetStateAction<
      | {
          id: string | null;
          amount: string | null;
        }
      | undefined
    >
  >;
  onClose?: () => void;
}

export default function RoadTransportCard({
  contentCardState,
  setSelectedCardDetails,
  onClose,
}: RoadTransportCardProps) {
  const {colors} = useTheme();
  const contentDetails = contentCardState?.contentOptions;
  const data = contentCardState?.context?.query;
  const navigation =
    useNavigation<NativeStackNavigationProp<JourneyStackParamList>>();
  const journeyUpdate = useUpdateJourney();
  const journeyData = useSelector((state: any) => state.journey);
  const [vehicleOptions, setVehicleOptions] = useState<VehicleOption[]>([]);
  const [addPackageStatus, setAddPackageStatus] = useState<
    'success' | 'error' | 'loading'
  >('success');
  const [selectedOption, setSelectedOption] = useState<VehicleOption | null>(
    null,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (contentDetails) {
      setVehicleOptions(
        contentDetails.map((item: any) => ({
          ...item,
          selected: false,
        })),
      );
    }
  }, [contentDetails]);

  const handleSelect = (option: VehicleOption) => {
    const updatedOptions = vehicleOptions.map(opt => ({
      ...opt,
      selected: opt.id === option.id,
    }));
    setVehicleOptions(updatedOptions);

    setSelectedCardDetails({
      id: option.id.toString(),
      amount: option.price?.prcD || null,
    });
  };

  const handleAddToPackage = async (option: VehicleOption) => {
    // Removed console.log

    handleSelect(option);
    setSelectedOption(option);
    setAddPackageStatus('loading');
    setApiError(null);
    setIsModalVisible(true);

    try {
      const saveResult = await journeyUpdate(
        [
          {
            type: 'CONTENT_ADD',
            ctype: data?.actionData?.ctype || 'ROAD_VEHICLE',
            date: data?.onDate,
            tvlG: data?.tvlG,
            blockId: data?.blockId,
            dropDate: option.addInfo?.dpDt || data?.rdTxptQ?.dpDt,
            cardData: {id: option.id},
            dayNum: data?.dayNum,
          },
        ],
        null,
        {jdid: '7cf78c26d83d2e49', edit: true},
      );

      const isSuccess =
        saveResult?.type?.endsWith('/fulfilled') ||
        saveResult?.payload?.success ||
        (saveResult as any)?._data?.success;

      if (isSuccess) {
        setAddPackageStatus('success');
      } else {
        setAddPackageStatus('error');
        const errorMsg =
          saveResult?.payload?.error_msg ||
          saveResult?.payload?.message ||
          'Failed to add to package';
        setApiError(errorMsg);
      }
    } catch (error: any) {
      setAddPackageStatus('error');
      setApiError(error?.message || 'An unexpected error occurred');
    }
  };

  const handleGoToItinerary = () => {
    setIsModalVisible(false);
    if (onClose) {
      onClose();
    }
    navigation.navigate('JourneyDetails', {
      journeyId: journeyData?.id || '7cf78c26d83d2e49',
      jdid: 'dad1acca72c2216e',
    });
  };

  const handleTryAgain = () => {
    if (selectedOption) {
      handleAddToPackage(selectedOption);
    } else {
      setIsModalVisible(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const renderTravellerBubbles = () => {
    const travellers = contentCardState.context.query.tvlG?.tvlA || [];
    if (travellers.length === 0) return null;

    return (
      <View style={styles.travellerContainer}>
        {travellers.slice(0, 4).map((traveller: any, index: number) => (
          <View
            key={index}
            style={[
              styles.travellerBubble,
              {
                marginLeft: index === 0 ? 0 : -4,
                backgroundColor: colors.neutral100,
                borderColor: colors.neutral300,
              },
            ]}>
            <CustomText variant="text-xs-normal" color="neutral800">{`T${
              index + 1
            }`}</CustomText>
          </View>
        ))}
        {travellers.length > 4 && (
          <View
            style={[
              styles.travellerBubble,
              {
                marginLeft: -4,
                backgroundColor: colors.neutral100,
                borderColor: colors.neutral300,
              },
            ]}>
            <CustomText variant="text-xs-normal" color="neutral800">{`+${
              travellers.length - 4
            }`}</CustomText>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {vehicleOptions.map((option: VehicleOption) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.card,
            {
              backgroundColor: colors.white,
              borderColor: option.selected ? colors.primary : colors.neutral300,
            },
            option.selected && {borderWidth: 2},
          ]}
          onPress={() => handleSelect(option)}
          activeOpacity={0.7}>
          <View style={styles.titleSection}>
            <View style={styles.itemContent}>
              <View style={styles.titleContainer}>
                <CustomText variant="text-base-semibold" color="neutral900">
                  {option.name}
                </CustomText>
              </View>
              {renderTravellerBubbles()}
            </View>

            <View style={styles.seatsBadge}>
              <View style={styles.seatsRow}>
                <Icon name="car-seat" size={16} color={colors.neutral500} />
                <CustomText
                  variant="text-xm-normal"
                  style={{flex: 1, color: colors.neutral500}}>
                  {option.seats} Seats
                </CustomText>
              </View>
            </View>
          </View>

          <View style={styles.departureArriveContainer}>
            <View style={styles.leftContainer}>
              <CustomText
                variant="text-xs-normal"
                style={{color: colors.neutral500}}>
                Pick up
              </CustomText>
              <View style={styles.timeContainer}>
                <CustomText variant="text-sm-medium" color="neutral900">
                  {option.addInfo.pkCty || ''}
                </CustomText>
              </View>
              <View style={styles.timeContainer}>
                <CustomText
                  variant="text-xs-normal"
                  style={{color: colors.neutral500}}>
                  {option.addInfo.pkDt || ''}
                </CustomText>
              </View>
            </View>

            <View style={styles.rightContainer}>
              <CustomText
                variant="text-xs-normal"
                style={[styles.sectionLabelRight, {color: colors.neutral500}]}>
                Drop off
              </CustomText>
              <View style={styles.timeContainerRight}>
                <CustomText variant="text-sm-medium" color="neutral900">
                  {option.addInfo.dpCty || ''}
                </CustomText>
              </View>
              <View style={styles.timeContainerRight}>
                <CustomText
                  variant="text-xs-normal"
                  style={[styles.dateTextRight, {color: colors.neutral500}]}>
                  {option.addInfo.dpDt || ''}
                </CustomText>
              </View>
            </View>
          </View>

          <DashedDrawLine />
          <View style={styles.cardFooter}>
            <View style={styles.priceContainer}>
              <CustomText variant="text-lg-semibold" color="neutral900">
                {option.price?.prcD || ''}
              </CustomText>
            </View>

            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  backgroundColor: colors.neutral100,
                  borderColor: colors.neutral600,
                },
              ]}
              onPress={() => handleAddToPackage(option)}>
              <CustomText variant="text-sm-medium" color="neutral900">
                Add to Package
              </CustomText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}>
        <View
          style={[
            modalStyles.modalOverlay,
            {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          ]}>
          <TouchableOpacity
            style={modalStyles.backdrop}
            activeOpacity={1}
            onPress={closeModal}
          />
          <View
            style={[
              modalStyles.modalContainer,
              {backgroundColor: colors.white},
            ]}>
            <View style={modalStyles.modalHeader}>
              <View
                style={[
                  modalStyles.handleBar,
                  {backgroundColor: colors.neutral300},
                ]}
              />
            </View>
            <AddPackage
              onGoToItinerary={
                addPackageStatus === 'success'
                  ? handleGoToItinerary
                  : handleTryAgain
              }
              status={addPackageStatus}
              errorMessage={apiError}
              selectedItem={selectedOption}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  titleSection: {
    gap: 4,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  titleContainer: {
    flex: 1,
  },
  travellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingRight: 4.4,
  },
  travellerBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatsBadge: {
    width: '100%',
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: 576,
  },
  departureArriveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 0,
  },
  leftContainer: {
    flex: 1,
    gap: 4,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  sectionLabelRight: {
    textAlign: 'right',
  },
  timeContainer: {
    width: '100%',
  },
  timeContainerRight: {
    width: '100%',
    alignItems: 'flex-end',
  },
  cityTextRight: {
    textAlign: 'right',
  },
  dateTextRight: {
    textAlign: 'right',
  },
  separator: {
    height: 1,
    width: '100%',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    height: 44,
  },
  priceContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  addButton: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: 'rgba(26, 26, 26, 0.05)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
});

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '45%',
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleBar: {
    width: 64,
    height: 6,
    borderRadius: 3,
  },
});
