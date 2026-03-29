import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomText} from '../../../../../../common/components';
import {Info} from 'lucide-react-native';
import {useTheme} from '../../../../../../context/ThemeContext';

interface CruiseInfoBannerProps {
  infoText: string;
}

const ICON_SIZE = 16;

const CruiseInfoBanner: React.FC<CruiseInfoBannerProps> = ({infoText}) => {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <Info
        size={ICON_SIZE}
        color={colors.neutral500}
        style={styles.infoIcon}
      />
      <View style={styles.textContainer}>
        <CustomText variant="text-xs-normal" color="slate500">
          {infoText}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 14,
    alignItems: 'flex-start',
    width: '100%',
    gap: 8,
  },
  infoIcon: {
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
});

export default CruiseInfoBanner;
