import {Dimensions, StyleSheet, View} from 'react-native';
import {Info} from 'lucide-react-native';
import CustomText from '../../../../../common/components/CustomText';
import {LocationSummary} from '../../../../../common/components/LocationSummary';
import TravelerSummary from '../../../../../common/components/TravelersTag';
import DashedLine from '../../../../../common/components/DashedLine';
import {useDate} from '../../../../../common/hooks/useDate';
import {Colors} from '../../../../../styles';

const {width} = Dimensions.get('window');

interface RoadTransportCardProps {
  txptName: string;
  txptType: string;
  pkCty: string; //pick-up
  pkDt: Date | string; //pick-up date
  dpDt: string;
  dpCty: string; //drop-off city
  depTm: string; // departure time
  dayNum: string; // days
  seats: string;
  subTxt: string;
  dCtyA: string[];
  paxD: string;
  tvlG: {
    tvlA: string[];
  };
}

export function JourneyRoadTransportCard({
  data,
}: {
  data: RoadTransportCardProps;
}) {
  return (
    <View style={{width: width * 0.9, padding: 16}}>
      {/* Title + Route */}
      <View style={{flexDirection: 'column', gap: 6}}>
        <CustomText color="neutral800" variant="text-base-semibold">
          {data.txptName}
        </CustomText>

        {data.dCtyA && <LocationSummary location={data.dCtyA.join(', ')} />}

        {/* Travelers */}
        {data.tvlG.tvlA.length > 0 && data.paxD.length > 0 && (
          <TravelerSummary travelers={data.tvlG.tvlA} paxD={data.paxD} />
        )}

        <View style={styles.separatorLine} />
      </View>

      {/* Pickup / Days / Drop */}
      <View style={{flexDirection: 'column', marginTop: 8}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <CustomText variant="text-xs-normal" color="neutral500">
            Pick up
          </CustomText>
          <CustomText variant="text-xs-normal" color="neutral500">
            Drop off
          </CustomText>
        </View>

        {/* Locations Row */}
        <View style={styles.locationRow}>
          {/* Pickup Block */}
          <View>
            <CustomText
              variant="text-sm-semibold"
              color="neutral800"
              style={styles.leftAlign}>
              {data.pkCty}
            </CustomText>
            <CustomText
              variant="text-sm-semibold"
              color="neutral800"
              style={styles.leftAlign}>
              {useDate(data.pkDt)}
            </CustomText>
          </View>

          {/* Days Badge */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              left: 0,
              right: 0,
            }}>
            {/* Left line */}
            <View style={styles.leftRightLine} />

            {/* Center label */}
            <View style={styles.centerLabel}>
              <CustomText variant="text-xs-normal" color="neutral900">
                {data.dayNum} days
              </CustomText>
            </View>

            {/* Right line */}
            <View style={styles.leftRightLine} />
          </View>

          {/* Drop Block */}
          <View>
            <CustomText
              variant="text-sm-semibold"
              color="neutral800"
              style={styles.rightAlign}>
              {data.dpCty}
            </CustomText>
            <CustomText
              variant="text-sm-semibold"
              color="neutral800"
              style={styles.rightAlign}>
              {useDate(data.dpDt)}
            </CustomText>
          </View>
        </View>
        {data.subTxt && (
          <View
            style={[
              styles.infoTab,
              {backgroundColor: Colors.lightThemeColors.neutral50},
            ]}>
            <Info size={16} color={Colors.lightThemeColors.neutral500} />
            <CustomText variant="text-xs-normal" style={{flexShrink: 1}}>
              {data.subTxt}
            </CustomText>
          </View>
        )}

        <DashedLine
          dashLength={8}
          dashGap={6}
          dashColor={Colors.lightThemeColors.neutral300}
          dashThickness={1}
          style={{
            width: '100%',
            marginTop: 24,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    position: 'relative',
  },
  durationBadgeLine: {
    height: 1,
    width: width * 0.06,
    position: 'absolute',
  },
  leftAlign: {
    textAlign: 'left',
  },
  rightAlign: {
    textAlign: 'right',
  },
  infoTab: {
    marginTop: 20,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    columnGap: 5,
    alignItems: 'stretch',
    borderRadius: 10,
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.lightThemeColors.neutral200,
    marginTop: 8,
  },
  centerLabel: {
    backgroundColor: Colors.lightThemeColors.neutral100,
    width: 60,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftRightLine: {
    width: 18,
    height: 1,
    backgroundColor: Colors.lightThemeColors.neutral300,
  },
});
