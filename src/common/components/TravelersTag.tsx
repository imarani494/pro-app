// common/components/TravelersTag.tsx
import { User } from 'lucide-react-native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import CustomText from './CustomText';

type Traveler = {
  t?: 'Adult' | 'Child' | string;
  nm?: string;
  fnm?: string;
  id?: string;
};

interface TravelerSummaryProps {
  travelers: Traveler[]; 
  paxD: string;
  showProfileIcon?: boolean; // ✅ NEW PROP
}

const TravelerSummary = ({
  travelers,
  paxD,
  showProfileIcon = true, // ✅ Default true
}: TravelerSummaryProps) => {
  const { colors } = useTheme();

  function formatTravelerCodes(codes: Traveler[]): string[] {
    return codes.map((_, index) => `T${index + 1}`);
  }

  return (
    <View style={styles.container}>
      {/* ✅ Profile Icon - Conditional */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showProfileIcon && (
          <User color={colors.neutral500} size={16} style={{ marginRight: 5 }} />
        )}
        <CustomText variant="text-sm-normal" color="neutral500">
          {paxD}
        </CustomText>
      </View>

      <View style={styles.circleRow}>
        {formatTravelerCodes(travelers).slice(0, 4).map((item, index) => (
          <View
            key={index}
            style={[
              styles.circle,
              {
                zIndex: travelers.length - index,
                backgroundColor: colors.neutral100,
                borderColor: colors.neutral200,
              },
            ]}
          >
            <CustomText
              color="neutral800"
              style={{ fontSize: 9, fontFamily: 'Geist-Medium' }}
            >
              {item}
            </CustomText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleRow: {
    flexDirection: 'row',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -5,
    borderWidth: 2,
  },
});

export default TravelerSummary;
