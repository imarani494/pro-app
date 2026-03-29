// SightseeingDetailsModal.tsx
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {useTheme} from '../../../../../../context/ThemeContext';
import {
  CustomBottomSheet,
  CustomText,
} from '../../../../../../common/components';

import {JourneySightseeingData} from '../types/SightseeingTypes';

interface SightseeingDetailsModalProps {
  bottomSheetRef: React.RefObject<any>;
  onClose: () => void;
  data: JourneySightseeingData;
  buttonTitle?: string;
  onButtonPress?: () => void;
}

const SightseeingDetailsModal: React.FC<SightseeingDetailsModalProps> = ({
  bottomSheetRef,
  onClose,
  data,
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

  return (
    <CustomBottomSheet
      ref={bottomSheetRef}
      onClose={onClose}
      snapPoints={['38%', '90%']}>
      <View style={styles.container}>
        <BottomSheetScrollView
          style={styles.bottomSheetContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}>
          {/* Title Section */}
          <View style={styles.modalSection}>
            <CustomText variant="text-lg-semibold" color="neutral900">
              {data.title}
            </CustomText>
          </View>

          {/* Description */}
          {data.description && (
            <View style={[styles.modalSection, styles.descriptionSection]}>
              <CustomText variant="text-sm-normal" color="neutral500">
                {data.description}
              </CustomText>
            </View>
          )}

          {/* Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: colors.neutral900}]}
              onPress={handleButtonPress}
              activeOpacity={0.8}>
              <CustomText variant="text-base-medium" color="neutral50">
                {buttonTitle}
              </CustomText>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </View>
    </CustomBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    flex: 1,
  },
  scrollContentContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  buttonContainer: {
    paddingTop: 20,
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
  modalSection: {
    marginTop: 0,
  },
  descriptionSection: {
    marginTop: 16,
    marginBottom: 8,
  },
});

export default SightseeingDetailsModal;
