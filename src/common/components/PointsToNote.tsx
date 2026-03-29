import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, ActivityIndicator } from 'react-native';
import { Info, ChevronDown } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import CustomText from './CustomText';
import axios from 'axios';

interface PointsToNoteProps {
  label?: string;
  count?: number;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  iconSize?: number;
  hotelId?: string; // Add hotelId to fetch notes for a specific hotel
}

const PointsToNote: React.FC<PointsToNoteProps> = ({
  label = 'Points to note',
  count,
  onPress,
  containerStyle,
  iconSize = 16,
  hotelId,
}) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) return;
    setLoading(true);
    axios
      .get(`/api/hotel/${hotelId}/points-to-note`)
      .then((res) => setNotes(res.data?.notes || null))
      .catch(() => setNotes(null))
      .finally(() => setLoading(false));
  }, [hotelId]);

  const displayText =
    count && count > 0
      ? `${label} (${count})`
      : notes
      ? `${label}: ${notes}`
      : label;

  return (
    <TouchableOpacity
      style={[
        styles.pointsCard,
        {
          backgroundColor: colors.white,
          borderColor: colors.neutral200,
        },
        containerStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={loading}
    >
      <View style={styles.pointsContent}>
        <Info size={iconSize} color={colors.neutral900} />
        {loading ? (
          <ActivityIndicator size="small" color={colors.neutral900} />
        ) : (
          <CustomText variant="text-sm-medium" color="neutral900">
            {displayText}
          </CustomText>
        )}
        <ChevronDown size={iconSize} color={colors.neutral900} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pointsCard: {
    alignSelf: 'flex-start',
    minHeight: 28,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  pointsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default PointsToNote;