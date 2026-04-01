import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

interface SeparatorProps {
  style?: any;
}

const Separator: React.FC<SeparatorProps> = ({style}) => {
  const {colors} = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.line, {backgroundColor: colors.neutral200}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    height: 1,
    width: '100%',
  },
});

export default Separator;