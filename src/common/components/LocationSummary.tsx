import {MapPin} from 'lucide-react-native';
import {Dimensions, StyleSheet, View} from 'react-native';
import CustomText from './CustomText';
import {useTheme} from '../../context/ThemeContext';

const {width} = Dimensions.get('window');
export function LocationSummary({location}: {location: string}) {
  const {colors} = useTheme();
  return (
    <View style={styles.routeRow}>
      <MapPin size={16} color={colors.neutral500} style={{marginTop: 3}} />

      <View style={{flexShrink: 1}}>
        <CustomText variant="text-sm-normal" color="neutral500">
          {location}
        </CustomText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 6,
    width: width * 0.83,
    alignSelf: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    position: 'relative',
  },
});
