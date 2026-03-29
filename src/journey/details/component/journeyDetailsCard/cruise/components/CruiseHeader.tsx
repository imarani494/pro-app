import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {CustomText} from '../../../../../../common/components';
import {useTheme} from '../../../../../../context/ThemeContext';
import {CRUISE_SHIP} from '../../../../../../utils/assetUtil';

interface CruiseHeaderProps {
  imageUrl?: string;
  hotelName: string;
}

const CruiseHeader: React.FC<CruiseHeaderProps> = ({imageUrl, hotelName}) => {
  const {colors} = useTheme();

  return (
    <>
      <View style={[styles.imageWrapper, {backgroundColor: colors.white}]}>
        <Image
          source={imageUrl ? {uri: imageUrl} : CRUISE_SHIP}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.titleContainer}>
        <CustomText variant="text-base-semibold" color="darkCharcoal">
          {hotelName}
        </CustomText>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    borderRadius: 8,
    height: 128,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 16,
  },
});

export default CruiseHeader;
