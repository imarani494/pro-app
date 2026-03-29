import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomText} from '../../../../../../common/components';
import {
  Hotel,
  Activity,
  Car,
  UtensilsCrossed,
  Ticket,
  FileText,
  Users,
  MapPin,
  PlaneLanding,
  HandPlatter,
  TicketCheck,
} from 'lucide-react-native';
import {useTheme} from '../../../../../../context/ThemeContext';

type SectionType =
  | 'FLIGHT'
  | 'HOTEL_ROOM'
  | 'SIGHTSEEING'
  | 'TRANSFERS'
  | 'CAR_RENTAL'
  | 'ROAD_VEHICLE'
  | 'MEALS'
  | 'TRAVEL_PASS'
  | 'ITINERARY'
  | 'FIXED_PACKAGE'
  | 'GROUP_TOUR'
  | 'BASE'
  | 'SELF_BOOKED_TOUR'
  | 'TRAIN'
  | 'CRUISE';

type SectionLabelProps = {
  type: SectionType;
  title: string;
  city?: string;
};

const SectionLabel: React.FC<SectionLabelProps> = ({type, title, city}) => {
  const {colors, theme} = useTheme();

 
  const iconColor = colors.sky800;
  const textColor = 'sky800';
  const cityTextColor = 'sky800';

  const renderIcon = () => {
    const iconProps = {size: 16, color: iconColor}; 

    switch (type) {
      case 'FLIGHT':
        return <PlaneLanding {...iconProps} />;
      case 'HOTEL_ROOM':
        return <Hotel {...iconProps} />;
      case 'SIGHTSEEING':
        return <TicketCheck {...iconProps} />;
      case 'TRANSFERS':
        return <Car {...iconProps} />;
      case 'CAR_RENTAL':
      case 'ROAD_VEHICLE':
        return <Activity {...iconProps} />;
      case 'MEALS':
        return <HandPlatter {...iconProps} />; // ✅ MEALS icon
      case 'TRAVEL_PASS':
        return <Ticket {...iconProps} />;
      case 'ITINERARY':
        return <FileText {...iconProps} />;
      case 'FIXED_PACKAGE':
        return <Users {...iconProps} />;
      case 'GROUP_TOUR':
      case 'BASE':
      case 'SELF_BOOKED_TOUR':
        return <MapPin {...iconProps} />;
      default:
        return <Activity {...iconProps} />;
    }
  };

  const getDisplayTitle = () => {
    return type === 'ITINERARY' ? 'Day Schedule' : title;
  };

  const shouldShowCity = () => {
    return (
      city &&
      type !== 'FLIGHT' &&
      type !== 'FIXED_PACKAGE' &&
      type !== 'GROUP_TOUR' &&
      type !== 'TRAIN' &&
      type !== 'CRUISE' &&
      type !== 'SELF_BOOKED_TOUR'
    );
  };

  return (
    <View style={styles.container}>
      {renderIcon()}
      <View style={styles.textContainer}>
        {/* ✅ FIXED: Sky800 text color */}
        <CustomText variant="text-sm-medium" color={textColor}>
          {getDisplayTitle()}
        </CustomText>
        {shouldShowCity() && (
          <CustomText variant="text-sm-semibold" color={cityTextColor}>
            - {city}
          </CustomText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 2,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 0,
  },
});

export default SectionLabel;
