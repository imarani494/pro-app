import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../../styles';

import {
  JourneyActivityCard,
  JourneyCarCard,
  JourneyCruiseCard,
  JourneyDayScheduleCard,
  JourneyFlightCard,
  JourneyGroupTourCard,
  JourneyHotelCard,
  JourneySelfBookedFlightCard,
  JourneyTransferCard,
} from '..';
import SectionLabel from './journeyDetailsCard/hotel/components/SectionLabel';
import {BlkA} from '../../types/journey';
import {useJournery} from '../../hooks/useJournery';
import TravelPassCard from './journeyDetailsCard/travelPass/TravelPassCard';
import {JourneyRoadTransportCard} from './journeyDetailsCard/roadTransport /JourneyRoadTransportCard';
import ActionFooter from './ActionFooter';
import CommentCard from './CommentCard';

interface TripDayInclusionCardProps {
  inclusion: BlkA;
  date: string;
  dCtyD: string;
  onClosePopover?: () => void;
}

const cardFrameStyle = {
  // borderColor: Colors.lightThemeColors.neutral200,
  // backgroundColor: Colors.lightThemeColors.white,
  // borderWidth: 1,
};

const TripDayInclusionCard = ({
  inclusion,
  date,
  dCtyD,
  onClosePopover,
}: TripDayInclusionCardProps) => {
  const {journey} = useJournery();

  const getInclusionTitle = () => {
    if (inclusion?.isSelfBookedTour && inclusion?.title) {
      return 'Self Booked Tour';
    }
    if (inclusion?.typ === 'TRANSPORT' && inclusion?.uTxptO?.typ) {
      return `Self-Booked ${
        inclusion.uTxptO.typ.charAt(0) +
        inclusion.uTxptO.typ.slice(1).toLowerCase()
      }`.toUpperCase();
    }
    return inclusion?.typD.toUpperCase() || '';
  };

  const getInclusionType = () => {
    if (inclusion?.isSelfBookedTour) {
      return 'SELF_BOOKED_TOUR';
    }
    if (inclusion?.typ === 'TRANSPORT' && inclusion?.uTxptO?.typ) {
      return inclusion.uTxptO.typ.toUpperCase();
    }
    return inclusion?.typ?.toUpperCase() || '';
  };

  return (
    <View style={styles.container}>
      <View style={[styles.section]}>
        <SectionLabel
          title={getInclusionTitle()}
          type={getInclusionType()}
          city={dCtyD}
        />
      </View>

      {/* Self-Booked Tour */}
      {inclusion?.uTxptO && (
        <View style={[styles.cardView, cardFrameStyle]}>
          {/* @ts-ignore */}
          <JourneySelfBookedFlightCard data={inclusion} />
        </View>
      )}

      {/* Flight Card */}
      {inclusion?.typ === 'FLIGHT' && !inclusion?.isSelfBookedTour && (
        <View style={[styles.cardView, cardFrameStyle]}>
          {/* @ts-ignore */}
          <JourneyFlightCard data={inclusion} />
        </View>
      )}

      {/* Hotel Card (includes TRAIN) */}
      {(inclusion?.typ === 'HOTEL_ROOM' || inclusion?.typ === 'TRAIN') &&
        !inclusion?.isSelfBookedTour && (
          <View style={[styles.cardView, cardFrameStyle]}>
            <JourneyHotelCard apiData={inclusion} />
          </View>
        )}
      {/* Transfers */}
      {inclusion?.typ === 'JOURNEY_CRUISE=' && (
        <View style={[styles.cardView, cardFrameStyle]}>
          {/* @ts-ignore */}
          <JourneyCruiseCard apiData={inclusion} />
        </View>
      )}

      {/* Sightseeing & Hotel Extras */}
      {(inclusion?.typ === 'SIGHTSEEING' ||
        inclusion?.typ === 'HOTEL_EXTRAS') && (
        <View style={[styles.cardView, cardFrameStyle]}>
          {/* @ts-ignore */}
          <JourneyActivityCard apiData={inclusion} />
        </View>
      )}

      {/* Transfers */}
      {inclusion?.typ === 'TRANSFERS' && (
        <View style={[styles.cardView, cardFrameStyle]}>
          {/* @ts-ignore */}
          <JourneyTransferCard apiData={inclusion} />
        </View>
      )}

      {/* Car Rental */}
      {inclusion?.typ === 'CAR_RENTAL' && (
        <View style={[styles.cardView, cardFrameStyle]}>
          <JourneyCarCard apiData={inclusion} />
        </View>
      )}

      {/* Road Vehicle */}
      {inclusion?.typ === 'ROAD_VEHICLE' && (
        <View style={[styles.cardView, cardFrameStyle]}>
          <JourneyRoadTransportCard data={inclusion} />
        </View>
      )}

      {/* Itinerary */}
      {inclusion?.typ === 'ITINERARY' && (
        <View style={[styles.cardView, cardFrameStyle]}>
          {/* @ts-ignore */}
          <JourneyDayScheduleCard data={inclusion} />
        </View>
      )}

      {/* Fixed Package */}
      {inclusion?.typ === 'FIXED_PACKAGE' && (
        <View style={[styles.cardView, cardFrameStyle]}>
          {/* @ts-ignore */}
          <JourneyGroupTourCard apiData={inclusion} />
        </View>
      )}

      {/* Travel Pass */}
      {inclusion?.typ === 'TRAVEL_PASS' && (
        <View style={[styles.cardView, cardFrameStyle]}>
          <TravelPassCard data={inclusion} />
        </View>
      )}
      {inclusion.advCmtA && (
        <View
          style={{
            paddingHorizontal: 16,
            borderColor: Colors.lightThemeColors.neutral200,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            paddingBottom: 16,
          }}>
          <CommentCard
            comment={inclusion?.advCmtA[0]?.comment}
            author={inclusion?.advCmtA[0]?.userName}
            id={inclusion?.advCmtA[0]?.commentId}
            blockId={inclusion?.bid}
          />
        </View>
      )}
      <ActionFooter
        inclusion={inclusion}
        date={date}
        dayNum={inclusion?.dayNum || 1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
  },
  section: {
    alignItems: 'flex-start',
    gap: 8,
    width: '100%',
    marginTop: 28,
    marginBottom: 12,
  },
  cardView: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    borderColor: Colors.lightThemeColors.neutral200,
    // backgroundColor: Colors.lightThemeColors.white,
    borderWidth: 1,
    borderBottomWidth: 0,
    // borderBottomEndRadius: 16,
    // borderBottomStartRadius: 16,
  },
});

export default TripDayInclusionCard;
