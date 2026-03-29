import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../../styles';
import {useAppSelector} from '../../../store';
import {
  groupSelfBookedTourDays,
  parseSelfBookedTours,
} from '../../utils/selfBookedTourUtils';
import {DyA} from '../../types/journey';
import {TripDayCard} from './TripDayCard';
import VisaInsuranceContainer from './journeyDetailsCard/visaInsurance/VisaInsuranceContainer';

const JourneyDayView = ({
  journeyData,
  isDetailedView,
  registerDayPosition,
}: {
  journeyData: any;
  isDetailedView: boolean;
  registerDayPosition?: (
    dayNum: number,
    y: number,
    height: number,
    day: any,
  ) => void;
}) => {
  const selectedDayIndex = useAppSelector(
    (state: any) => state.journey?.selectedDayIndex,
  ) as number | null;

  const filteredDays = useMemo(() => {
    if (selectedDayIndex === null || !journeyData?.dyA) {
      return journeyData?.dyA || [];
    }
    if (selectedDayIndex === -1) {
      return [];
    }
    return [journeyData.dyA[selectedDayIndex]].filter(Boolean);
  }, [selectedDayIndex, journeyData?.dyA]);

  const showOthers = selectedDayIndex === -1;
  const cities = useAppSelector(
    (state: any) =>
      state.journey?.journey?.ctyA || state.journey?.journey?.cities,
  ) as any[] | undefined;

  const selfBookedTourGroups = useMemo(() => {
    if (!journeyData?.dyA || !cities) return [];
    const tourMap = parseSelfBookedTours(cities);
    return groupSelfBookedTourDays(journeyData.dyA, tourMap);
  }, [journeyData?.dyA, cities]);

  const actualJourney = journeyData?.journey || journeyData;

  const gBlkA = Array.isArray(journeyData?.gBlkA) ? journeyData.gBlkA : [];
  const visaArray = Array.isArray(journeyData?.visa) ? journeyData.visa : [];
  const insuranceArray = Array.isArray(journeyData?.insurance)
    ? journeyData.insurance
    : [];

  const hasOthersData =
    gBlkA.length > 0 || visaArray.length > 0 || insuranceArray.length > 0;

  return (
    <View style={styles.container}>
      {!showOthers &&
        (isDetailedView ? journeyData?.dyA : filteredDays || []).map(
          (day: DyA, key: any) => {
            const originalIndex =
              journeyData?.dyA?.findIndex(
                (d: any) => d.date === day.date && d.dayNum === day.dayNum,
              ) ?? key;

            const selfBookedGroup = selfBookedTourGroups.find(
              group =>
                originalIndex >= group.startDayIndex &&
                originalIndex <= group.endDayIndex,
            );

            if (selfBookedGroup) {
              const isFirstDay =
                originalIndex === selfBookedGroup.startDayIndex;
              const isLastDay = originalIndex === selfBookedGroup.endDayIndex;
              const isMiddleDay =
                originalIndex > selfBookedGroup.startDayIndex &&
                originalIndex < selfBookedGroup.endDayIndex;
              const isTransferDay = day.dayType === 'TRANSFER' || day.sCty;
              const isFirstDayTransfer = isFirstDay && isTransferDay;
              const isLastDayTransfer = isLastDay && isTransferDay;

              if (isFirstDayTransfer || isLastDayTransfer) {
                return (
                  <React.Fragment key={`fragment-${originalIndex}`}>
                    <View
                      key={`day-${day.dayNum}-${day.date}`}
                      data-day-index={originalIndex}
                      style={styles.dayCardWrapper}>
                      <TripDayCard
                        index={originalIndex}
                        day={day}
                        jid={actualJourney?.id || actualJourney?.jid}
                        registerDayPosition={registerDayPosition}
                      />
                    </View>
                  </React.Fragment>
                );
              }

              if (isMiddleDay || (isFirstDay && !isFirstDayTransfer))
                return null;
              if (isLastDay && !isLastDayTransfer) return null;
            }

            return (
              <View
                key={`day-${day.dayNum}-${day.date}`}
                data-day-index={originalIndex}
                style={styles.dayCardWrapper}>
                <TripDayCard
                  index={originalIndex}
                  day={day}
                  jid={actualJourney?.id || actualJourney?.jid}
                  registerDayPosition={registerDayPosition}
                />
              </View>
            );
          },
        )}

      {hasOthersData && <VisaInsuranceContainer journeyData={journeyData} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.lightThemeColors.white},
  dayCardWrapper: {marginBottom: 16},
});

export default JourneyDayView;
