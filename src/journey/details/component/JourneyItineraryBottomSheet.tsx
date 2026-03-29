import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {CustomText} from '../../../common/components';
import {Colors} from '../../../styles';
import {ChevronRight, MapPin, X} from 'lucide-react-native';
import {DateUtil} from '../../../utils';

interface JourneyDay {
  dayNum: number;
  dayNumD?: number;
  date: string;
  ttl: string;
  ctyA?: Array<{nm: string}>;
  itA?: Array<{
    nm: string;
    desc?: string;
  }>;
}

interface JourneyItineraryModalProps {
  visible: boolean;
  journey?: {
    dyA?: JourneyDay[];
    ttl?: string;
  };
  onDaySelect?: (dayNumber: number) => void;
  onClose?: () => void;
}

const JourneyItineraryModal: React.FC<JourneyItineraryModalProps> = ({
  visible,
  journey,
  onDaySelect,
  onClose,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const weekday = date.toLocaleDateString('en-US', {weekday: 'short'});
      const day = date.toLocaleDateString('en-US', {day: '2-digit'});
      const year = date.getFullYear();
      return `${weekday}, ${day}, ${year}`;
    } catch (error) {
      return DateUtil.getDisplayDate(dateString);
    }
  };

  const handleDayPress = (dayNumber: number) => {
    onDaySelect?.(dayNumber);
    onClose?.();
  };

  const renderDayItem = (day: JourneyDay, index: number) => {
    const dayNumber = day.dayNumD || day.dayNum;
    const location = day.ctyA?.[0]?.nm || 'Unknown Location';
    const activities = day.itA || [];
    const mainActivity = activities.length > 0 ? activities[0].nm : day.ttl;

    return (
      <TouchableOpacity
        key={index}
        style={styles.dayItem}
        onPress={() => handleDayPress(dayNumber)}
        activeOpacity={0.7}>
        <View style={styles.dayItemContent}>
          <View style={styles.dayInfo}>
            <CustomText variant="text-sm-medium" color="neutral900">
              Day {dayNumber}
            </CustomText>
            {mainActivity && (
              <CustomText
                variant="text-xs-normal"
                color="neutral700"
                style={styles.activityText}
                numberOfLines={2}>
                {mainActivity}
              </CustomText>
            )}
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
            <CustomText
              variant="text-xs-normal"
              color="neutral600"
              style={styles.dateText}>
              {formatDate(day.date)}
            </CustomText>
            <ChevronRight
              size={20}
              color={Colors.lightThemeColors.neutral400}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={e => e.stopPropagation()}>
          {/* Modal Handle */}
          {/* <View style={styles.modalHandle} /> */}

          {/* Header */}
          {/* <View style={styles.modalHeader}>
            <CustomText variant="text-lg-semibold" color="neutral900">
              Itinerary
            </CustomText>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <X size={24} color={Colors.lightThemeColors.neutral600} />
            </TouchableOpacity>
          </View> */}

          <ScrollView style={styles.modalScrollView}>
            {journey?.dyA && journey.dyA.length > 0 ? (
              <View style={styles.container}>
                {journey.dyA.map((day, index) => renderDayItem(day, index))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <MapPin size={48} color={Colors.lightThemeColors.neutral400} />
                <CustomText
                  variant="text-base-medium"
                  color="neutral500"
                  style={styles.emptyText}>
                  No itinerary available
                </CustomText>
              </View>
            )}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 30,
    paddingRight: 16,
  },
  modalContent: {
    backgroundColor: Colors.lightThemeColors.white,
    borderRadius: 16,
    width: '85%',
    maxHeight: '65%',
    paddingTop: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: 'flex-end',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.lightThemeColors.neutral300,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollView: {
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
  },
  dayItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral100,
  },
  dayItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayInfo: {
    flex: 1,
    marginRight: 16,
  },
  dateText: {
    marginTop: 4,
  },
  activityText: {
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    textAlign: 'center',
  },
});

JourneyItineraryModal.displayName = 'JourneyItineraryModal';

export default JourneyItineraryModal;
