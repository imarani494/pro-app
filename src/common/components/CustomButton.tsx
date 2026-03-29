import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {ChevronRight} from 'lucide-react-native';
import {Typography} from '../../styles';
import {useTheme} from '../../context/ThemeContext';
import CustomText from './CustomText';

type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: string;
  textStyle?: any;
  handleOnPress?: () => void;
  buttonStyle?: any;
  icon?: boolean;
  iconComponent?: React.ComponentType<any>;
  iconLeft?: boolean;
  isLoading?: boolean;
  textColor?: string;
};

const CustomButton = ({
  title,
  textStyle,
  buttonStyle,
  handleOnPress,
  variant,
  icon,
  iconComponent: IconComponent,
  iconLeft,
  isLoading,
  textColor,
  ...rest
}: ButtonProps) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      style={[styles.cta, {backgroundColor: colors.neutral900}]}
      activeOpacity={0.6}
      onPress={handleOnPress}
      {...buttonStyle}
      {...rest}>
      <View
        style={{
          ...Typography.flex.row,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {iconLeft && IconComponent ? (
          <View style={{paddingRight: 10}}>
            <IconComponent size={18} color={colors.white} />
          </View>
        ) : null}

        {isLoading ? (
          <ActivityIndicator size="small" color={colors.white} style={{}} />
        ) : (
          <CustomText variant={variant} {...textStyle} color={textColor}>
            {title}
          </CustomText>
        )}

        {icon ? (
          <View style={{paddingLeft: 10, paddingTop: 2}}>
            {IconComponent ? (
              <IconComponent size={18} color={colors.white} />
            ) : (
              <ChevronRight size={18} color={colors.white} />
            )}
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  cta: {
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomButton;
