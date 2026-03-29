import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {ArrowLeft, X} from 'lucide-react-native';
import CustomText from '../../common/components/CustomText';
import {useTheme} from '../../context/ThemeContext';
import {getTransportInfo, formatDisplayDate} from '../utils/transportUtils';
import {useContentCard} from '../../contentCard/hooks/useContentCard';

interface RoadTransportHeaderProps {
  onBack: () => void;
  onClose?: () => void;
  contentCardState: any;
  searchParams?: any;
  title?: string;
  subtitle?: string;
  travellers?: number;
  tvlG?: any;
  rstTvlG?: any;
  onConfirm?: (data: any[]) => void;
  hasRoomConfig?: boolean;
  isDivergence?: boolean;
}

const RoadTransportHeader: React.FC<RoadTransportHeaderProps> = ({
  onBack,
  onClose,
  contentCardState,
  searchParams,
  title = 'Add Road Vehicle',
  subtitle,
  travellers,
  tvlG,
  rstTvlG,
  onConfirm,
  hasRoomConfig = true,
  isDivergence = false,
}) => {
  const {colors} = useTheme();
  const transportInfo = getTransportInfo(contentCardState, searchParams);

  const contentCard = useContentCard();
  const actionCtype = contentCard?.context?.query?.actionData?.ctype;
  const isRoadVehicleFlow = actionCtype === 'ROAD_VEHICLE';

  return (
    <View
      style={[
        styles.header,
        {
          borderBottomColor: colors.neutral200,
          backgroundColor: colors.white,
        },
      ]}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={20} color={colors.neutral900} />
      </TouchableOpacity>

      <View style={styles.headerText}>
        <CustomText variant="text-base-semibold" color="neutral900">
          {title && title.length > 45 ? `${title.slice(0, 45)}...` : title}
        </CustomText>
        {subtitle && subtitle !== 'undefined' && (
          <CustomText variant="text-xs-normal" color="neutral600">
            {subtitle}
          </CustomText>
        )}
        {!subtitle && transportInfo.pickupCity && (
          <CustomText variant="text-xs-normal" color="neutral600">
            {transportInfo.pickupCity || 'City'} (Day {transportInfo.dayNum}
            {transportInfo.onDate
              ? `: ${formatDisplayDate(transportInfo.onDate)}`
              : ''}
            )
          </CustomText>
        )}
      </View>

      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={20} color={colors.neutral900} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  headerText: {
    marginLeft: 10,
    gap: 4,
  },
});

export default RoadTransportHeader;
