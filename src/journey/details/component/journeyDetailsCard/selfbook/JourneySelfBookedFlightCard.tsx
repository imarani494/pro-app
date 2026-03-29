import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import TravelerSummary from '../../../../../common/components/TravelersTag';
import {CustomText} from '../../../../../common/components';
import {useTheme} from '../../../../../context/ThemeContext';
import {Card} from '../../../../../common/components/Card';
import DashedLine from '../../../../../common/components/DashedLine';
import {PlaneTakeoff} from 'lucide-react-native';

interface FlightApiData {
  uTxptO: {
    t: string; // title
    dtm: string; // departure date/time
    dtml: string; // departure terminal
    dapt: string; // departure airport
    atml: string; // arrival terminal
    aapt: string; // arrival airport
    d: string; // description
  };
  tvlG: {
    tvlA: string[];
  };
  paxD: string;
}

interface Props {
  data: FlightApiData;
}
const {width} = Dimensions.get('window');
const SelfBookedFlightCard = ({data}: Props) => {
  const {colors} = useTheme();
  return (
    <View style={{padding: 16, width: width * 0.9}}>
      <View style={{marginBottom: 5}}>
        <View
          style={{
            flexDirection: 'column',
            rowGap: 8,
          }}>
          <CustomText color="neutral800" variant="text-base-semibold">
            {data.uTxptO.t}-{new Date(data.uTxptO.dtm).toDateString()}
          </CustomText>

          {/* Travelers Summary */}
          <TravelerSummary travelers={data.tvlG.tvlA} paxD={data.paxD} />

          {/* Description from API */}
          <CustomText color="neutral500" variant="textt-xs-normal">
            {data.uTxptO.d}
          </CustomText>
        </View>

        <DashedLine
          dashLength={8}
          dashGap={6}
          dashColor={colors.neutral300}
          dashThickness={1}
          style={styles.dashedBorder}
        />
      </View>
    </View>
  );
};

export default SelfBookedFlightCard;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center',
    marginBottom: 10,
  },

  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },

  divider: {
    height: 1,
    marginTop: 18,
  },

  dashedBorder: {
    width: '100%',
    marginTop: 24,
  },
});
