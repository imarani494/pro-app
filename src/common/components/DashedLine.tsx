import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../styles';

const DashedLine = ({
  dashLength = 6,
  dashGap = 3,
  dashColor = Colors.lightThemeColors.neutral500,
  dashThickness = 1,
  style = {},
}) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({length: 100}).map((_, i) => (
        <View
          key={i}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
  },
});

export default DashedLine;
