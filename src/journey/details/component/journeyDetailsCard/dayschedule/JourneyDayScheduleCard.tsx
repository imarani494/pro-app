import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../../../../context/ThemeContext';
import {Card} from '../../../../../common/components/Card';
import CustomText from '../../../../../common/components/CustomText';
import TravelerSummary from '../../../../../common/components/TravelersTag';
import {DashedDivider} from '../../../../../common/components/DashedDivider';
import {useDate} from '../../../../../common/hooks/useDate';
import {ReadMoreDescText} from '../../../../../common/components/ReadMoreDesc';
import {useBottomSheet} from '../../../../../common/hooks/useBottomSheet'; // Import the hook
import SightseeingDetailsModal from '../activity/components/SightseeingDetailsModal'; // Import the modal

interface DayScheduleData {
  date: string;
  paxD: string;
  dcty: string;
  typ: string;
  tvlG: {
    tvlA: string[];
  };
  cdnm: string;
  dctyD: string;
  typD: string;
  cky: string;
  tagA: {
    st: string;
    icT: string;
    nm: string;
  }[];
  cdid: number;
  dcid: number;
  dsc: string;
  dayNum: number;
  subType: string;
  bid: string;
}

export function DayScheduleCard({data}: {data: DayScheduleData}) {
  const {colors} = useTheme();
  const {bottomSheetRef, openBottomSheet, closeBottomSheet, snapToIndex} = useBottomSheet(); // Use the hook

  const handleReadMorePress = () => {
    // Dynamically calculate the snap point based on the description length
    const descriptionLength = data.dsc?.length || 0;
    let snapIndex = 0;

    if (descriptionLength > 200) {
      snapIndex = 1; // Snap to the second point (e.g., '90%')
    } else {
      snapIndex = 0; // Snap to the first point (e.g., '54%')
    }

    openBottomSheet(); // Open the bottom sheet
    snapToIndex(snapIndex); // Snap to the calculated index
  };

  return (
    <Card>
      {/* Title + Date */}
      <View style={styles.header}>
        <CustomText variant="text-base-semibold">{data.cdnm}</CustomText>
        <CustomText variant="text-sm-normal" color="neutral500">
          {useDate(data.date)}
        </CustomText>
      </View>

      {/* Travelers */}
      <TravelerSummary travelers={data.tvlG.tvlA} paxD={data.paxD} />

      {/* Tag */}
      {data.tagA.map((item, idx) => (
        <View key={idx} style={[styles.tag, {backgroundColor: colors.cyan100}]}>
          <CustomText variant="text-xs-medium" color="cyan800">
            {item.nm}
          </CustomText>
        </View>
      ))}

      {/* Divider */}
      <View style={[styles.divider, {backgroundColor: colors.neutral200}]} />

      {/* Description */}
      <ReadMoreDescText
        description={data.dsc}
        maxLines={3}
        onReadMorePress={handleReadMorePress} // Trigger the bottom sheet with dynamic snap point
      />

      {/* SightseeingDetailsModal */}
      <SightseeingDetailsModal
        bottomSheetRef={bottomSheetRef}
        onClose={closeBottomSheet}
        data={{
          title: data.cdnm || 'Day Schedule Details',
          description: data.dsc || 'No description available.',
        }}
      />

      {/* Dashed Divider */}
      <DashedDivider style={styles.dashSpacing} />
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 2,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    marginTop: 6,
  },
  dashSpacing: {
    marginTop: 10,
  },
});