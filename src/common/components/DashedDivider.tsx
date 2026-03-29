import {StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

interface DashedDividerProps {
  style?: ViewStyle | ViewStyle[];
}
export const DashedDivider = ({style}: DashedDividerProps) => {
  const {colors} = useTheme();
  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.border, {borderColor: colors.neutral300}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 1,
    width: '100%',
    overflow: 'hidden',
    marginTop: 20,
  },
  border: {
    width: '200%',
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 2,
  },
});
