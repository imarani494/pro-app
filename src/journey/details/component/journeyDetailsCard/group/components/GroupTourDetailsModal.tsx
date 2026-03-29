// GroupTourDetailsModal.tsx
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {useTheme} from '../../../../../../context/ThemeContext';
import {CustomText} from '../../../../../../common/components';
import {GroupTourApiData} from '../types/GroupTourTypes';

interface GroupTourDetailsModalProps {
  bottomSheetRef: React.RefObject<any>;
  onClose: () => void;
  data: GroupTourApiData;
  buttonTitle?: string;
  onButtonPress?: () => void;
}

const GroupTourDetailsModal: React.FC<GroupTourDetailsModalProps> = ({
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
          
          {/* Title Section */}
          <View style={styles.modalSection}>
            <CustomText variant="text-lg-semibold" color="darkCharcoal">
              {data.pkgName}
            </CustomText>
          </View>

          {/* Description - Only show full description text */}
          {data.pkgDescription && (
            <View style={styles.descriptionSection}>
              <CustomText 
                variant="text-sm-normal" 
                color="neutral500"
                style={styles.descriptionText}>
                {data.pkgDescription}
              </CustomText>
            </View>
          )}

          {/* All Highlights Section - REMOVED */}
          {/* No highlights shown here anymore */}
          
        </BottomSheetScrollView>

        {/* Fixed Button at Bottom */}
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
    // flex: 1,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
  },
  scrollContentContainer: {
    paddingTop: 20,
    // paddingBottom: 112, // Button height + padding
  },
  modalSection: {
    marginBottom: 16,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionText: {
    lineHeight: 22,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    // borderTopWidth: 1,
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

export default GroupTourDetailsModal;
