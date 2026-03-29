import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Info} from 'lucide-react-native';
import { useTheme } from '../../../../../../context/ThemeContext';
import { CustomText } from '../../../../../../common/components';


interface PointsToNoteProps {
  notes?: string[];
}

const PointsToNote: React.FC<PointsToNoteProps> = ({notes = []}) => {
  const {colors} = useTheme();

 
  if (!notes || notes.length === 0) {
    return null;
  }

 
  const previewNotes = notes.slice(0, 2);
  const hasMoreNotes = notes.length > 2;

  return (
    <View style={styles.container}>
      <CustomText variant="text-sm-semibold" color="darkCharcoal">
        Points to Note
      </CustomText>
      <View style={styles.notesList}>
        {previewNotes.map((note, index) => (
          <View key={`note-${index}`} style={styles.noteItem}>
            <Info size={14} color={colors.neutral600} />
            <CustomText
              variant="text-xs-normal"
              color="neutral700"
              style={styles.noteText}
              numberOfLines={2}>
              {note}
            </CustomText>
          </View>
        ))}
        {hasMoreNotes && (
          <CustomText
            variant="text-xs-medium"
            color="neutral900"
            style={styles.viewMore}>
            Tap to view all {notes.length} points
          </CustomText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 8,
    width: '100%',
  },
  notesList: {
    gap: 8,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  noteText: {
    flex: 1,
    flexShrink: 1,
  },
  viewMore: {
    marginTop: 4,
  },
});

export default PointsToNote;
