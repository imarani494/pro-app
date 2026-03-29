import React from 'react';
import {View, StyleSheet} from 'react-native';
import {JourneyVisaDetailsCard} from '../visa/JourneyVisaDetailsCard';
import {VisaApiData} from '../visa/types/VisaTypes';

interface VisaCardWrapperProps {
  visa: any;
  jid?: string;
}

export function VisaCardWrapper({visa, jid}: VisaCardWrapperProps) {
  if (!visa) return null;

  // If itemA exists and has items, use it; otherwise, use the root visa object
  const items = Array.isArray(visa?.itemA) && visa.itemA.length > 0 ? visa.itemA : [visa];

  return (
    <View style={styles.container}>
      {items.map((item: any, index: number) => {
        const travelerAvatars = item?.tvlG?.tvlA || visa?.tvlG?.tvlA || visa?.rstTvlG?.tvlA || [];

        const visaData: VisaApiData = {
          bid: item?.bid || item?.srcBlockId || visa?.bid,
          cdnm: item?.cdnm || item?.text || item?.name || visa?.cdnm || visa?.text || visa?.name || '',
          title: item?.isInc ? (item?.text || item?.cdnm || item?.name) : (visa?.name || visa?.cdnm || visa?.text),
          nm: item?.nm || visa?.nm || visa?.name || '',
          paxD: item?.paxD || visa?.paxD || item?.pax || visa?.pax || '',
          tvlG: {tvlA: travelerAvatars},
          dsc: item?.dsc || item?.description || visa?.dsc || visa?.description || '',
          showBadge: !item?.isInc,
          isVisa4: true,
          isInc: item?.isInc ?? visa?.isInc ?? false,
        };

        // Debug output
        console.log('VisaCardWrapper visaData:', visaData);

        return (
          <View key={`visa-item-${index}`} style={styles.cardWrapper}>
            <JourneyVisaDetailsCard apiData={visaData} jid={jid} />
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