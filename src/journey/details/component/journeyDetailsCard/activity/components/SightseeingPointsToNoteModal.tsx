import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Info, Check} from 'lucide-react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {
  CustomBottomSheet,
  CustomText,
} from '../../../../../../common/components';
import {useTheme} from '../../../../../../context/ThemeContext';
import {SightseeingApiData} from '../types/SightseeingTypes';

interface SightseeingPointsToNoteModalProps {
  bottomSheetRef: React.RefObject<any>;
  onClose: () => void;
  activityName?: string;
  apiData?: SightseeingApiData;
}

const SightseeingPointsToNoteModal: React.FC<
  SightseeingPointsToNoteModalProps
> = ({bottomSheetRef, onClose, activityName, apiData}) => {
  const {colors} = useTheme();

  const getPointsToNote = () => {
    const notes: string[] = [];
    if (apiData?.ntA && Array.isArray(apiData.ntA)) {
      apiData.ntA.forEach(note => {
        if (note && note.trim() !== '') {
          notes.push(note);
        }
      });
    }
    return notes;
  };

  const getExcluded = () => {
    const excluded: string[] = [];
    if (apiData?.exTA && Array.isArray(apiData.exTA)) {
      apiData.exTA.forEach(item => {
        if (item && item.trim() !== '') {
          excluded.push(item);
        }
      });
    }
    return excluded;
  };

  const pointsToNote = getPointsToNote();
  const excluded = getExcluded();
  const hasContent = pointsToNote.length > 0 || excluded.length > 0;

  const handleButtonPress = () => {
    onClose();
  };

  return (
    <CustomBottomSheet
      ref={bottomSheetRef}
      onClose={onClose}
      snapPoints={['30%', '90%']}
      index={-1}
      enablePanDownToClose={true}>
      <BottomSheetScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}>
        {hasContent ? (
          <> 
            {pointsToNote.length > 0 && (
              <View style={styles.section}>
                <CustomText variant="text-base-semibold" color="neutral900" style={{marginBottom: 8}}>
                  Points to Note
                </CustomText>
                <View style={styles.notesList}>
                  {pointsToNote.map((note, index) => (
                    <View key={`note-${index}`} style={styles.noteItem}>
                      <Check size={16} color={colors.green600} />
                      <CustomText
                        variant="text-sm-normal"
                        color="neutral500"
                        style={styles.noteText}>
                        {note}
                      </CustomText>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {excluded.length > 0 && (
              <View style={styles.section}>
                <CustomText variant="text-base-semibold" color="neutral900" style={{marginBottom: 8}}>
                  Excluded
                </CustomText>
                <View style={styles.exclusionsList}>
                  {excluded.map((item, index) => (
                    <View key={`excluded-${index}`} style={styles.exclusionItem}>
                      <CustomText
                        variant="text-sm-normal"
                        color="neutral500"
                        style={styles.exclusionText}>
                        {item}
                      </CustomText>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Info size={40} color={colors.neutral300} />
            <CustomText
              variant="text-sm-normal"
              color="neutral500"
              style={styles.emptyText}>
              No additional information available
            </CustomText>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.neutral900}]}
            onPress={handleButtonPress}
            activeOpacity={0.8}>
            <CustomText variant="text-base-medium" color="neutral50">
              Okay, got it
            </CustomText>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </CustomBottomSheet>
  );
};

const styles = StyleSheet.create({
  scrollView: {},
  scrollContentContainer: {
    paddingHorizontal: 20,
    width: '100%',
  },
  headerContainer: {
    marginBottom: 16,
  },
  
  section: {
    marginBottom: 20,
  },
  notesList: {
   
    gap: 8,
    alignItems: 'flex-start', 
    width: '100%',
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center', 
    gap: 8,
    width: '100%',
    justifyContent: 'flex-start', 
  },
  noteText: {
    flex: 1, 
    // lineHeight: 20,
    textAlign: 'left',
  },
  exclusionsList: {
    gap: 8,
  },
  exclusionItem: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  exclusionText: {
    flex: 1,
    
    textAlign: 'left',
  },
  buttonContainer: {
    // marginTop: 20,
    
  },
  button: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
  },
});

export default SightseeingPointsToNoteModal;