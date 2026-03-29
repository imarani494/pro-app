import {TouchableOpacity, StyleProp, ViewStyle, View} from 'react-native';
import CustomText from './CustomText';
import {Colors} from '../../styles';

export function CommonButtons({
  title,
  onPressAction,
  style,
  textColor = 'neutral900',
  leftIcon,
  ...props
}: {
  title: string;
  onPressAction?: () => void;
  style?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  textColor?: string;
  [key: string]: any;
}) {
  return (
    <TouchableOpacity
      {...props}
      onPress={onPressAction}
      style={[
        {
          borderWidth: 1,
          borderColor: Colors.lightThemeColors.neutral300,
          alignSelf: 'center',
          marginLeft: 20,
          paddingVertical: 10,
          paddingHorizontal: 16,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
        },
        style, // merge custom styles
      ]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          columnGap: 6,
        }}>
        {leftIcon && <View>{leftIcon}</View>}
        {/* @ts-ignore */}
        <CustomText variant="text-xs-medium" color={textColor}>
          {title}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
}
