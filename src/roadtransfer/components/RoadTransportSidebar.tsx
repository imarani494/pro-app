import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {useContentCard} from '../../contentCard/hooks/useContentCard';
import {useContentOptionsLoad} from '../../contentCard/hooks/useContentOptionsLoad';
import RoadTransportCard from './RoadTransportCard';
import RoadTransportSearch from './RoadTransportSearch';
import RoadTransportHeader from './RoadTransportHeader';
import EditRoadModal from './EditRoadModal';

import {useTheme} from '../../context/ThemeContext';
import {CustomText} from '../../common/components';
import {SquarePen} from 'lucide-react-native';
import {useUpdateJourney} from '../../journey/hooks/useUpdateJourney';

interface RoadTransportSidebarProps {
  onClose: () => void;
}

export default function RoadTransportSidebar({
  onClose,
}: RoadTransportSidebarProps) {
  const [formState, setFormState] = useState({
    pickupCity: {cnm: '', cid: 0},
    dropCity: {cnm: '', cid: 0},
    dropDate: '',
  });
  const [showRoomConfig, setShowRoomConfig] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const contentCardState = useContentCard();
  const journeyUpdate = useUpdateJourney();

  const contentOptionsLoad = useContentOptionsLoad();

  const data = contentCardState.context?.query;
  const [selectedCardDetails, setSelectedCardDetails] = useState<
    | {
        id: string | null;
        amount: string | null;
      }
    | undefined
  >(undefined);

  const {colors} = useTheme();
  const handleSearch = async () => {
    if (
      !formState.pickupCity.cid ||
      !formState.dropCity.cid ||
      !formState.dropDate
    ) {
      return;
    }

    const query = {
      qt: data?.qt || 'LISTINGS',
      onDate: data?.onDate,
      blockId: data?.blockId,
      type: data?.actionData?.ctype || 'ROAD_VEHICLE',
      dayNum: data?.dayNum,
      rdTxptQ: {
        pkCid: formState.pickupCity.cid,
        dpCid: formState.dropCity.cid,
        dpDt: formState.dropDate,
      },
    };

    await contentOptionsLoad(query);

    setShowResults(true);
  };

  const getTransportInfo = () => {
    return {
      pickupCity: formState.pickupCity.cnm,
      dropCity: formState.dropCity.cnm,
      dropDate: formState.dropDate,
      dayNum: data?.dayNum,
      onDate: data?.onDate,
    };
  };

  const handleBackToSearch = () => {
    setShowResults(false);
  };

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleEditSearch = async (newParams: any) => {
    setFormState({
      pickupCity: newParams.pickupCity,
      dropCity: newParams.dropCity,
      dropDate: newParams.dropDate,
    });

    const query = {
      qt: data?.qt || 'LISTINGS',
      onDate: data?.onDate,
      blockId: data?.blockId,
      type: data?.actionData?.ctype || 'ROAD_VEHICLE',
      dayNum: data?.dayNum,
      rdTxptQ: {
        pkCid: newParams.pickupCity.cid,
        dpCid: newParams.dropCity.cid,
        dpDt: newParams.dropDate,
      },
    };

    await contentOptionsLoad(query);
  };

  const getTotalAmount = () => {
    if (!selectedCardDetails?.amount) return '0';
    return selectedCardDetails.amount;
  };

  const renderSearchScreen = () => (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.white,
        },
      ]}>
      <RoadTransportHeader
        onBack={onClose}
        contentCardState={contentCardState}
        searchParams={getTransportInfo()}
        title="Add Road Vehicle"
        tvlG={contentCardState.context?.query?.tvlG}
      />

      <View style={styles.searchSection}>
        <RoadTransportSearch
          formState={formState}
          setFormState={setFormState}
          travellers={showRoomConfig}
          setTravellers={setShowRoomConfig}
          contentCardState={contentCardState}
          onSearch={handleSearch}
        />
      </View>
    </View>
  );

  const renderResultsScreen = () => (
    <View style={[styles.container, {backgroundColor: colors.white}]}>
      <RoadTransportHeader
        onBack={handleBackToSearch}
        contentCardState={contentCardState}
        searchParams={getTransportInfo()}
        title="Add Road Vehicle"
        tvlG={contentCardState.context?.query?.tvlG}
      />

      <View
        style={[
          styles.transportInfoContainer,
          {backgroundColor: colors.white, borderColor: colors.neutral300},
        ]}>
        <View style={styles.transportInfoHeader}>
          <CustomText variant="text-lg-semibold" color="neutral900">
            Transport Info
          </CustomText>
          <TouchableOpacity
            style={[
              styles.changeButton,
              {backgroundColor: colors.white, borderColor: colors.neutral300},
            ]}
            onPress={handleOpenEditModal}>
            <SquarePen size={16} color={colors.neutral900} />
            <CustomText variant="text-sm-medium" color="neutral900">
              Change
            </CustomText>
          </TouchableOpacity>
        </View>

        <View style={styles.infoList}>
          <View style={styles.infoRow}>
            <CustomText variant="text-sm-medium" color="neutral900">
              {' '}
              Pick-up city:
            </CustomText>
            <CustomText variant="text-sm-normal" color="neutral900">
              {formState.pickupCity.cnm}
            </CustomText>
          </View>
          <View style={styles.infoRow}>
            <CustomText variant="text-sm-medium" color="neutral900">
              Drop off date:
            </CustomText>
            <CustomText variant="text-sm-normal" color="neutral900">
              {formState.dropDate}
            </CustomText>
          </View>
          <View style={styles.infoRow}>
            <CustomText variant="text-sm-medium" color="neutral900">
              Drop off city:
            </CustomText>
            <CustomText variant="text-sm-normal" color="neutral900">
              {formState.dropCity.cnm}
            </CustomText>
          </View>
          <View style={styles.infoRow}>
            <CustomText variant="text-sm-medium" color="neutral900">
              Travellers:
            </CustomText>
            <CustomText variant="text-sm-normal" color="neutral900">
              {contentCardState.context?.query?.tvlG?.tvlA?.length || 0}{' '}
              Travellers
            </CustomText>
          </View>
        </View>
      </View>

      {contentCardState?.contentOptions === null ? (
        <View style={styles.emptyState}>
          <CustomText>
            No options available. Please search to see results.
          </CustomText>
        </View>
      ) : (
        <>
          <ScrollView
            style={[
              styles.cardsContainer,
              {
                backgroundColor: colors.neutral100,
              },
            ]}
            showsVerticalScrollIndicator={false}>
            <RoadTransportCard
              contentCardState={contentCardState}
              setSelectedCardDetails={setSelectedCardDetails}
              onClose={onClose}
            />
          </ScrollView>

          <View
            style={[styles.hrBottom, {backgroundColor: colors.neutral200}]}
          />
        </>
      )}

      {showEditModal && (
        <EditRoadModal
          onClose={handleCloseEditModal}
          contentCardState={contentCardState}
          onSearch={handleEditSearch}
        />
      )}
    </View>
  );

  return showResults ? renderResultsScreen() : renderSearchScreen();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  searchSection: {
    flexShrink: 0,
    paddingTop: 20,
  },

  transportInfoContainer: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,

    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    gap: 8,
  },
  transportInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  changeButton: {
    borderWidth: 1,

    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: 'rgba(26, 26, 26, 0.05)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },

  infoList: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 7,
  },

  emptyState: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
    minHeight: 400,
  },

  cardsContainer: {
    flex: 1,
  },
  hrBottom: {
    height: 1,
  },
  footer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 12,
    paddingTop: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',

    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  totalSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: 24,
  },

  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
});
