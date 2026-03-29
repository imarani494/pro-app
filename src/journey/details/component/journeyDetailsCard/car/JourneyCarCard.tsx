// JourneyCarCard.tsx
import React from 'react';
import {View, StyleSheet, Image, ViewStyle} from 'react-native';

import JourneyCarInfo from './components/JourneyCarInfo';
import DepartureCity from './components/DepartureCity';
import {useTheme} from '../../../../../context/ThemeContext';

import {CarRentalApiData, JourneyCarData} from './types/CarRentalTypes';
import {transformCarApiData} from './utils/carDataTransformer';

export interface JourneyCarCardProps {
  carData?: JourneyCarData;
  apiData?: CarRentalApiData;
  showBorder?: boolean;
  containerStyle?: ViewStyle;
  onSeeDetailsPress?: () => void;
  onRemovePress?: () => void;
  onOtherActionsPress?: () => void;
  pickupLabel?: string;
  dropoffLabel?: string;
}

const JourneyCarCard: React.FC<JourneyCarCardProps> = ({
  carData,
  apiData,
  showBorder = true,
  containerStyle,
  pickupLabel,
  dropoffLabel,
}) => {
  const {colors} = useTheme();

  const currentCarData: JourneyCarData | null = React.useMemo(() => {
    if (apiData) {
      try {
        return transformCarApiData(apiData);
      } catch (e) {
        console.error('Car data transform error', e);
        return null;
      }
    }
    return carData || null;
  }, [apiData, carData]);

  if (!currentCarData) return null;

  const getImageSource = (src?: string) =>
    src && src.startsWith('http') ? {uri: src} : null;

  const carImageSource = getImageSource(currentCarData.image);
  const logoImageSource = getImageSource(currentCarData.logoImage);

  return (
    <View style={styles.wrapper}>
      {carImageSource && (
        <View
          style={[
            styles.imageWrapper,
            {backgroundColor: colors.white, overflow: 'hidden'},
          ]}>
          <Image
            source={carImageSource}
            style={[styles.image, {width: '100%', height: '100%'}]}
            resizeMode="center"
            onError={() => console.warn('Failed to load car image')}
          />
        </View>
      )}

      <JourneyCarInfo
        carName={currentCarData.name}
        seats={currentCarData.seats}
        features={currentCarData.features}
        transmission={currentCarData.transmission}
        passengerInfo={currentCarData.passengerInfo}
        travelers={currentCarData.travelers}
        logoImage={logoImageSource}
        showBorder={showBorder}
      />

      <DepartureCity
        pickupLocation={currentCarData.pickupLocation}
        dropoffLocation={currentCarData.dropoffLocation}
        pickupDate={currentCarData.pickupDate}
        dropoffDate={currentCarData.dropoffDate}
        pickupTime={currentCarData.pickupTime}
        dropoffTime={currentCarData.dropoffTime}
        days={currentCarData.days}
        inclusions={currentCarData.inclusions || []}
        exclusions={currentCarData.exclusions || []} // ✅ ADD - exclusions prop
        carFeatures={currentCarData.features}
        price={currentCarData.price}
        currency={currentCarData.currency}
        mileage={currentCarData.mileage}
        fuelPolicy={currentCarData.fuelPolicy}
        availability={currentCarData.availability}
        pickupLabel={pickupLabel || 'Pick up'}
        dropoffLabel={dropoffLabel || 'Drop off'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: 14,
    paddingTop: 16,
  },
  imageWrapper: {
    borderRadius: 8,
    height: 128,
    overflow: 'hidden',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default JourneyCarCard;
