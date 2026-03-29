import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
const {width} = Dimensions.get('window');
export function Card({children}: {children: React.ReactNode}) {
  const {colors} = useTheme();
  return (
    <View
      style={[
        styles.card,
        {backgroundColor: colors.white, borderColor: colors.neutral200},
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    padding: 16,
    borderRadius: 14,
    
    gap: 10,
    marginHorizontal: 'auto',
  },
});
