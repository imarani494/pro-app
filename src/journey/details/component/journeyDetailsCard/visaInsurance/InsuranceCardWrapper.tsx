import React from 'react';
import {View, StyleSheet} from 'react-native';
import JourneyInsuranceCard from '../insurance/JourneyInsuranceCard';

interface InsuranceCardWrapperProps {
  insurance: any;
  jid: string;
}

export function InsuranceCardWrapper({
  insurance,
  jid,
}: InsuranceCardWrapperProps): React.ReactElement | null {
  if (!insurance) return null;

  const items = insurance?.itemA || [];

  return (
    <View style={styles.container}>
      {items.map((item: any, index: number) => {
        const travelerAvatars = item?.tvlG?.tvlA || insurance?.rstTvlG?.tvlA || [];

        return (
          <View key={`ins-item-${index}`} style={styles.cardWrapper}>
            <JourneyInsuranceCard
              apiData={{
                nm: item?.isInc ? item?.text : insurance?.name,
                tvlG: {tvlA: travelerAvatars},
                dsc: item?.dsc || item?.description || insurance?.dsc || '',
                paxD: item?.paxD || insurance?.paxD || '',
                isInc: item?.isInc ?? false,
              }}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  cardWrapper: {
    marginBottom: 12,
  },
});

export default InsuranceCardWrapper;
