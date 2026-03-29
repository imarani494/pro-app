import {
  Dimensions,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import {useTheme} from '../../../context/ThemeContext';
import {ArrowLeft, CircleHelp, Download, PencilLine} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {CustomText} from '../../../common/components';
import {Colors, Typography} from '../../../styles';
import {flex} from '../../../styles/typography';

const {width} = Dimensions.get('window');

interface HeaderData {
  onEditPress?: () => void;
  showEditButton?: boolean;
}

export function JourneyHeader({
  onEditPress,
  showEditButton = true,
}: HeaderData) {
  const navigation = useNavigation();
  const {colors} = useTheme();

  return (
    <View
      style={[styles.headerContainer, {backgroundColor: colors.neutral900}]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.neutral100} />
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <CircleHelp color={colors.neutral50} />
          <Download color={colors.neutral50} />
          {showEditButton && (
            <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
              <PencilLine size={14} color={colors.neutral50} />
              <CustomText variant="text-sm-medium" color="neutral50">
                Edit
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  headerContainer: {
    // height: 100,
    // justifyContent: 'flex-end',
    paddingBottom: 4,
    paddingHorizontal: 20,
    marginVertical: 10,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerIcons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  editButton: {
    ...flex.rowItemCenter,
    gap: 8,
    backgroundColor: Colors.lightThemeColors.neutral800,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral700,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
