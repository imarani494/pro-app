import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  ClipboardList,
  Box,
  ChevronRight,
  Settings,
  Map,
  Calendar,
} from 'lucide-react-native';

import {CustomText} from '../../../../../../common/components';
import {useTheme} from '../../../../../../context/ThemeContext';

type FeatureIcon = 'clipboard' | 'box' | 'settings' | 'map' | 'calendar';

interface FeatureRowProps {
  icon: FeatureIcon;
  label: string;
  isFirst?: boolean;
  isLast?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  showChevron?: boolean;
  iconBackgroundColor?: string; // Add this prop
}

const FeatureRow: React.FC<FeatureRowProps> = ({
  icon,
  label,
  isFirst = false,
  isLast = false,
  onPress,
  disabled = false,
  showChevron = true,
  iconBackgroundColor, // Add this prop
}) => {
  const {colors} = useTheme();

  const showDivider = !isLast;

  const renderIcon = () => {
    const iconProps = {size: 16, color: colors.neutral900};

    switch (icon) {
      case 'clipboard':
        return <ClipboardList {...iconProps} />;
      case 'box':
        return <Box {...iconProps} />;
      case 'settings':
        return <Settings {...iconProps} />;
      case 'map':
        return <Map {...iconProps} />;
      case 'calendar':
        return <Calendar {...iconProps} />;
      default:
        return <Box {...iconProps} />;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.6}
      onPress={disabled ? undefined : onPress}
      style={[
        styles.featureRow,
        {
          backgroundColor: colors.neutral100,
        },
        showDivider && {
          borderBottomWidth: 1,
          borderBottomColor: colors.neutral200,
        },
        disabled && {opacity: 0.6},
      ]}>
      {/* Icon Section */}
      <View
        style={[
          styles.featureIconBox,
          {
            backgroundColor: iconBackgroundColor || colors.white, // Use the prop or default to white
            borderColor: colors.neutral200,
          },
        ]}>
        {renderIcon()}
      </View>

      {/* Text Section */}
      <View style={styles.featureTextWrapper}>
        <CustomText
          variant="text-sm-medium"
          color="neutral900"
          numberOfLines={2}>
          {label}
        </CustomText>
      </View>

      {/* Chevron Section */}
      {showChevron && (
        <View style={styles.featureRightIcon}>
          <ChevronRight size={16} color={colors.neutral600} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 64,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 12,
  },
  featureIconBox: {
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
  },
  featureRightIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeatureRow;
