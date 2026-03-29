
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Check} from 'lucide-react-native';

import {useTheme} from '../../../../../../context/ThemeContext';
import {CustomText} from '../../../../../../common/components';

interface MoreHighlightsModalProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  onClose: () => void;
  highlights: string[];
  packageName: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
}

const MoreHighlightsModal: React.FC<MoreHighlightsModalProps> = ({
  bottomSheetRef,
  onClose,
  highlights,
  packageName,
  buttonTitle = 'Okay, got it',
  onButtonPress,
}) => {
  const {colors} = useTheme();

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    }
    onClose();
  };

 
  React.useEffect(() => {
    console.log('MoreHighlightsModal rendered with', highlights.length, 'highlights');
  }, [highlights]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={['50%', '75%']}
      onDismiss={onClose}
      enablePanDownToClose={true}
      backgroundStyle={{backgroundColor: colors.white}}
      handleIndicatorStyle={{backgroundColor: colors.neutral300}}>
      <View style={styles.container}>
        <BottomSheetScrollView
          style={styles.bottomSheetContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={true}>
          
       
          <View style={styles.modalSection}>
            <CustomText variant="text-lg-semibold" color="darkCharcoal">
              More Highlights
            </CustomText>
            <CustomText 
              variant="text-sm-normal" 
              color="neutral500"
              style={styles.packageName}>
              {packageName}
            </CustomText>
          </View>

        
          {highlights && highlights.length > 0 ? (
            <View style={styles.highlightsSection}>
              {highlights.map((highlight, index) => (
                <View key={`remaining-highlight-${index}`} style={styles.highlightRow}>
                  <Check 
                    size={16} 
                    color={colors.green700} 
                    style={styles.modalCheckIcon} 
                  />
                  <CustomText 
                    variant="text-sm-normal" 
                    color="neutral500" 
                    style={styles.modalHighlightText}>
                    {highlight}
                  </CustomText>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <CustomText variant="text-sm-normal" color="neutral500">
                No additional highlights available
              </CustomText>
            </View>
          )}
        </BottomSheetScrollView>

     
        <View style={[styles.buttonContainer, {backgroundColor: colors.white}]}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.neutral900}]}
            onPress={handleButtonPress}
            activeOpacity={0.8}>
            <CustomText variant="text-base-medium" color="neutral50">
              {buttonTitle}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
   
     paddingHorizontal: 20,
  },
  bottomSheetContent: {
   
  },
  scrollContentContainer: {
    paddingTop: 20,
   
  },
  modalSection: {
    marginBottom: 20,
  },
  packageName: {
    marginTop: 12,
  },
  highlightsSection: {
    marginBottom: 20,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  modalCheckIcon: {
    flexShrink: 0,
    marginTop: 2,
  },
  modalHighlightText: {
    flex: 1,
    lineHeight: 20,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20, 
    paddingBottom: 40,
  
    borderTopColor: '#E5E5E5',
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
});

export default MoreHighlightsModal;
