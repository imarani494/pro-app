
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

interface DashedDrawLineProps {
  dashLength?: number;
  dashGap?: number;
  dashColor?: string;
  dashThickness?: number;
  style?: StyleProp<ViewStyle>;
  dashCount?: number;
}

const DashedDrawLine: React.FC<DashedDrawLineProps> = ({
  dashLength = 4,
  dashGap = 4,
  dashColor = '#D1D5DB',
  dashThickness = 1,
  dashCount = 40,
  style,
}) => {
  return (
    <View
      style={[
        {
          height: dashThickness,
          flexDirection: 'row',
          overflow: 'hidden',
        },
        style,
      ]}>
      {Array.from({ length: dashCount }).map((_, index) => (
        <View
          key={index}
          style={{
            width: dashLength,
            height: dashThickness,
            marginRight: dashGap,
            backgroundColor: dashColor,
          }}
        />
      ))}
    </View>
  );
};

export default DashedDrawLine;
