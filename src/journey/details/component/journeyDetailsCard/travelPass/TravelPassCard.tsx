import React from 'react';
import {Dimensions, View} from 'react-native';
import {CustomText} from '../../../../../common/components';
import TravelerSummary from '../../../../../common/components/TravelersTag';
import {Colors} from '../../../../../styles';
import {ReadMoreDescText} from '../../../../../common/components/ReadMoreDesc';

import {useBottomSheet} from '../../../../../common/hooks/useBottomSheet';
import SightseeingDetailsModal from '../activity/components/SightseeingDetailsModal';

export interface TravelPassItem {
  date?: string;
  grpNm?: any;
  paxD: string | undefined;
  typ: string;
  tvlG: {
    tvlA: string[];
  };
  ttl: string;
  cdnm: string;
  typD: string;
  cky: string;
  cdid: number;
  dsc: string;
  dayNum: number;
  subType: string;
  drH: number;
  bid: string;
}

export default function TravelPassCard({
  data,
}: {
  data: Partial<TravelPassItem>;
}) {
  const {width} = Dimensions.get('window');
  const {bottomSheetRef, openBottomSheet, closeBottomSheet, snapToIndex} = useBottomSheet(); // Use the hook

  const handleReadMorePress = () => {
   
    const descriptionLength = data.dsc?.length || 0;
    let snapIndex = 0;

    if (descriptionLength > 200) {
      snapIndex = 1; 
    } else {
      snapIndex = 0; 
    }

    openBottomSheet(); 
    snapToIndex(snapIndex); 
  };

  return (
    <View
      style={{
        width: width * 0.9,
        paddingHorizontal: 14,
        paddingVertical: 18,
        rowGap: 6,
      }}>
      <CustomText color="neutral900" variant="text-base-semibold">
        {data.cdnm}
      </CustomText>
      <TravelerSummary
        travelers={data.tvlG?.tvlA as string[]}
        paxD={data.paxD as string}
      />

     
      <View
        style={{
          height: 1,
          backgroundColor: Colors.lightThemeColors.neutral300,
          marginVertical: 5,
        }}
      />

     
      <ReadMoreDescText
        description={data.dsc as string}
        maxLines={3}
        onReadMorePress={handleReadMorePress} // Trigger the bottom sheet with dynamic snap point
      />

    
      <SightseeingDetailsModal
        bottomSheetRef={bottomSheetRef}
        onClose={closeBottomSheet}
        data={{
          title: data.cdnm || 'Travel Pass Details',
          description: data.dsc || 'No description available.',
        }}
      />
    </View>
  );
}