import {User} from 'lucide-react-native';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../../../../context/ThemeContext';
import {CustomText} from '../../../../../common/components';
import {TravelerInfo} from './types/GroupTourTypes';

interface SummeryDataProps {
  travelers: TravelerInfo[];
  paxD: string;
}

const SummeryData: React.FC<SummeryDataProps> = ({travelers, paxD}) => {
  const {colors} = useTheme();
  const firstFive = travelers.slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.travelerInfo}>
        <User
          color={colors.neutral500}
          size={16}
          style={styles.travelerIcon}
        />
        <CustomText variant="text-sm-normal" color="neutral500">
          {paxD}
        </CustomText>
      </View>

      <View style={styles.circleRow}>
        {firstFive.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.circle,
              {
                backgroundColor: colors.neutral100,
                borderColor: colors.neutral200,
              },
            ]}>
            <CustomText color="neutral800" style={styles.circleText}>
              T{index + 1}
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
    marginTop: 2,
  },
  travelerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  travelerIcon: {
    marginRight: 5,
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
  circleText: {
    fontSize: 9,
    fontFamily: 'Geist-Medium',
  },
});

export default SummeryData;
