import React, {useState, useRef} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {CustomText} from '../../../common/components';
import {useTheme} from '../../../context/ThemeContext';
import {MessageCircleMore, Plus} from 'lucide-react-native';
import {Colors} from '../../../styles';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import ActionItem from './ActionItem';
import {DateUtil} from '../../../utils';

interface ActionsProps {
  date: string | null;
  actions: any[];
  blockId: string | null;
  sid?: string | null;
  grpName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  btnStyle?: any;
  textColor?: string;
  textStyle?: any;
  hideText?: boolean;
  onCloseBottomSheet?: () => void;
  dayNum?: number;
}

export default function Actions({
  date,
  actions,
  blockId,
  sid,
  grpName,
  leftIcon,
  rightIcon,
  btnStyle,
  textColor = 'neutral900',
  textStyle,
  hideText,
  dayNum,
  onCloseBottomSheet,
}: ActionsProps) {
  const {colors} = useTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
    onCloseBottomSheet?.();
  };

  const handleActionSelect = () => {
    handleCloseBottomSheet();
  };

  // If only one action, render it directly
  if (actions && actions.length === 1) {
    return (
      <View>
        {actions.map((action: any, index: number) => (
          <ActionItem
            key={index}
            date={date || ''}
            action={action}
            blockId={blockId || ''}
            sid={sid || ''}
            leftIcon={leftIcon}
            grpName={grpName}
            rightIcon={rightIcon}
            hideText={hideText}
            btnStyle={btnStyle}
            textColor={textColor}
            textStyle={textStyle}
          />
        ))}
      </View>
    );
  }

  // If multiple actions, render with bottom sheet
  if (actions && actions.length > 0) {
    return (
      <>
        <TouchableOpacity
          style={[styles.actionButton, btnStyle || styles.defaultButton]}
          onPress={handleOpenBottomSheet}>
          {leftIcon}
          {!hideText && (
            <CustomText
              variant="text-sm-medium"
              color={textColor as any}
              style={textStyle}>
              {grpName || 'Add'}
            </CustomText>
          )}
          {rightIcon}
        </TouchableOpacity>

        <CustomBottomSheet
          ref={bottomSheetRef}
          snapPoints={['40%', '60%']}
          title={
            grpName?.toLowerCase() === 'add' || !grpName
              ? `Add to Day ${dayNum || 1}`
              : `${grpName} for Day ${dayNum || 1}`
          }
          onDismiss={handleCloseBottomSheet}
          onClose={handleCloseBottomSheet}
          enablePanDownToClose={true}>
          <View style={styles.bottomSheetContent}>
            {actions.map((action: any, index: number) => (
              <ActionItem
                key={index}
                date={date || ''}
                action={action}
                blockId={blockId || ''}
                sid={sid || ''}
                hideText={hideText}
                onSelect={handleActionSelect}
                isBottomSheetItem={true}
              />
            ))}
          </View>
        </CustomBottomSheet>
      </>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  defaultButton: {
    backgroundColor: Colors.lightThemeColors.white,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral400,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    // height: 32,
  },
  bottomSheetContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightThemeColors.neutral200,
    marginVertical: 4,
  },
});
