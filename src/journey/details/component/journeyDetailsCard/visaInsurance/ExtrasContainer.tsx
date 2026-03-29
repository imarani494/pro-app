
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../../../context/ThemeContext';


interface ExtrasContainerProps {
  journeyData: any;
}

export function ExtrasContainer({
  journeyData,
}: ExtrasContainerProps): React.ReactElement | null {
  const { colors } = useTheme();

 
  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={styles.section}>
        <View
          style={[
            styles.staticCardWrapper,
            {
              borderColor: colors.neutral200,
              backgroundColor: colors.red100,
            },
          ]}
        >
         
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  section: {
    gap: 16,
  },
  staticCardWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
});