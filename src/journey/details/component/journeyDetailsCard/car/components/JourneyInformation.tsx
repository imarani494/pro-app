import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Info, Box, ChevronRight, ClipboardList } from 'lucide-react-native';
import { useTheme } from '../../../../../../context/ThemeContext';
import { CustomText } from '../../../../../../common/components';


interface JourneyInformationProps {
  containerStyle?: any;
  payAtPickupLabel?: string;
  customTermsText?: string;
}

const JourneyInformation: React.FC<JourneyInformationProps> = ({
  containerStyle,
  payAtPickupLabel = 'Points to note',
  customTermsText = 'Explore Other Variants',
}) => {
  const { colors } = useTheme();

  const handlePointsToNote = () => {
    console.log('Points to note pressed');
  };

  const handleExploreVariants = () => {
    console.log('Explore Other Variants pressed');
  };

  return (
    <View style={containerStyle}>
      {/* First Row */}
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handlePointsToNote}
        style={[
          styles.featureRow,
          { borderBottomColor: colors.neutral200 },
        ]}
      >
        <View
          style={[
            styles.iconBox,
            { backgroundColor: colors.neutral100, borderColor: colors.neutral200 },
          ]}
        >
          <ClipboardList size={16} color={colors.neutral900} />
        </View>
        <View style={styles.featureTextWrapper}>
          <CustomText
            variant="text-sm-medium"
            color="neutral900"
            numberOfLines={1}
          >
            {payAtPickupLabel}
          </CustomText>
        </View>
        <View style={styles.chevronContainer}>
          <ChevronRight size={16} color={colors.neutral600} />
        </View>
      </TouchableOpacity>

      {/* Second Row */}
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleExploreVariants}
        style={[
          styles.featureRow,
          { borderBottomWidth: 0 },
        ]}
      >
        <View
          style={[
            styles.iconBox,
            { backgroundColor: colors.neutral100, borderColor: colors.neutral200 },
          ]}
        >
          <Box size={16} color={colors.neutral900} />
        </View>
        <View style={styles.featureTextWrapper}>
          <CustomText
            variant="text-sm-medium"
            color="neutral900"
          >
            {customTermsText}
          </CustomText>
        </View>
        <View style={styles.chevronContainer}>
          <ChevronRight size={16} color={colors.neutral600} />
        </View>
      </TouchableOpacity>

      <View
        style={[
          styles.dashedLine,
          { borderColor: colors.neutral200 },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 64,
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 16,
  },
  chevronContainer: {
    width: 16,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedLine: {
    width: '100%',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    opacity: 1,
  },
});

export default JourneyInformation;