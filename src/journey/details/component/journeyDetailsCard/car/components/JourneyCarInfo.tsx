// components/JourneyCarInfo.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle, Image } from 'react-native';
import { useTheme } from '../../../../../../context/ThemeContext';
import { CustomText } from '../../../../../../common/components';
import TravelerSummary from '../../../../../../common/components/TravelersTag';
import { JourneyTraveler } from '../types/CarRentalTypes';

export interface JourneyCarInfoProps {
  carName: string;
  seats: number;
  features: string[];
  transmission: string;
  passengerInfo: string;
  travelers: JourneyTraveler[];
  logoImage?: any;
  showBorder?: boolean;
  containerStyle?: ViewStyle;
  fallbackLogoImage?: any;
}

const JourneyCarInfo: React.FC<JourneyCarInfoProps> = ({
  carName,
  seats,
  features,
  transmission,
  passengerInfo,
  travelers,
  logoImage,
  showBorder = true,
  containerStyle,
  fallbackLogoImage,
}) => {
  const { colors } = useTheme();
  const logoSource = logoImage || fallbackLogoImage;

  const formattedTravelers = travelers.map((t, index) => ({
    nm: t.name || t.id || `${t.type} ${index + 1}`,
    t: t.type || 'Adult',
    id: t.id || `T${index + 1}`,
  }));

  const showSeatsInfo = travelers.length === 0 && seats > 0;
  const showTravelersInfo = formattedTravelers.length > 0 && !!passengerInfo;

 const getCarDetailsText = () => {
  const details = [];
  
  if (seats > 0) {
    details.push(`${seats} seats`);
  }
  
  if (transmission) {
    details.push(transmission);
  }
  
  if (features && features.length > 0) {
    const filteredFeatures = features.filter(feature => {
      const lowerFeature = feature.toLowerCase();
      return !lowerFeature.includes('economy') && 
             !lowerFeature.includes('compact') &&
             !lowerFeature.includes('standard');
    });
    
    details.push(...filteredFeatures.slice(0, 1));
  }
  
  return details.join(' • ');
};


  return (
    <View style={[styles.card, containerStyle]}>
      <View style={styles.header}>
        <View style={styles.carText}>
          <CustomText variant="text-base-semibold" color="neutral900">
            {carName}
          </CustomText>
        </View>
        {logoSource && (
          <View style={styles.carLogo}>
            <Image
              source={logoSource}
              style={styles.imageLogo}
              resizeMode="contain"
            />
          </View>
        )}
      </View>

      <View style={styles.summaryRow}>
        <CustomText variant="text-sm-normal" color="neutral500">
          {getCarDetailsText()}
        </CustomText>
      </View>

      {showSeatsInfo ? (
        <View style={styles.seatsRow}>
          <View
            style={[
              styles.seatsIcon,
              { backgroundColor: colors.neutral200 },
            ]}
          />
          <CustomText variant="text-xs-normal" color="neutral500">
            Up to {seats} passengers
          </CustomText>
        </View>
      ) : showTravelersInfo ? (
        <TravelerSummary
          travelers={formattedTravelers}
          paxD={passengerInfo}
        />
      ) : null}

      <View
        style={[styles.separator, { backgroundColor: colors.neutral300 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingTop: 16,
  },
  header: {
    marginBottom: 8,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carText: {
    height: 24,
    width: '80%',
    justifyContent: 'center',
  },
  carLogo: {
    height: 24,
    width: '18%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  imageLogo: {
    width: '100%',
    height: '100%',
  },
  summaryRow: {
    marginBottom: 12,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  seatsIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  separator: {
    height: 1,
    marginTop: 20,
  },
});

export default JourneyCarInfo;
