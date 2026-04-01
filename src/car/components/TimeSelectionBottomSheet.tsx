import React, {forwardRef, useImperativeHandle, useMemo} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {X} from 'lucide-react-native';
import {CustomText} from '../../common/components';
import {useTheme} from '../../context/ThemeContext';

interface TimeOption {
  value: string;
  label: string;
}

interface TimeSelectionBottomSheetProps {
  title: string;
  options: TimeOption[];
  selectedValue: string;
  onTimeSelect: (time: string) => void;
}

export interface TimeSelectionBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

const TimeSelectionBottomSheet = forwardRef<TimeSelectionBottomSheetRef, TimeSelectionBottomSheetProps>(
  ({title, options, selectedValue, onTimeSelect}, ref) => {
    const {colors} = useTheme();
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ['50%', '70%'], []);

    useImperativeHandle(ref, () => ({
      present: () => bottomSheetModalRef.current?.present(),
      dismiss: () => bottomSheetModalRef.current?.dismiss(),
    }));

    const handleTimePress = (timeValue: string) => {
      onTimeSelect(timeValue);
      bottomSheetModalRef.current?.dismiss();
    };

    const handleClose = () => {
      bottomSheetModalRef.current?.dismiss();
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.white,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral200,
      },
      closeButton: {
        padding: 8,
        borderRadius: 8,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
      },
      content: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
      },
      timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        backgroundColor: colors.white,
      },
      radioButton: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.neutral200,
        backgroundColor: colors.white,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
      },
      radioButtonSelected: {
        borderColor: colors.neutral900,
        backgroundColor: colors.white,
      },
      radioButtonInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.neutral900,
      },
      timeText: {
        flex: 1,
      },
      separator: {
        height: 1,
        backgroundColor: colors.neutral200,
        marginHorizontal: 0,
      },
    });

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{backgroundColor: colors.white}}
        handleIndicatorStyle={{backgroundColor: colors.neutral300}}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{flex: 1}}>
              <CustomText variant="text-lg-semibold" color="neutral900">
                {title}
              </CustomText>
            </View>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <X size={16} color={colors.neutral900} />
            </TouchableOpacity>
          </View>

          {/* Time Options List */}
          <BottomSheetScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option, index) => {
              const isSelected = option.value === selectedValue;
              
              return (
                <View key={option.value}>
                  <TouchableOpacity
                    style={styles.timeItem}
                    onPress={() => handleTimePress(option.value)}
                    activeOpacity={0.7}
                  >
                    {/* Radio Button */}
                    <View style={[
                      styles.radioButton, 
                      isSelected && styles.radioButtonSelected
                    ]}>
                      {isSelected && <View style={styles.radioButtonInner} />}
                    </View>
                    
                    {/* Time Label */}
                    <CustomText 
                      variant="text-base-normal" 
                      color="neutral900"
                      style={styles.timeText}
                    >
                      {option.label}
                    </CustomText>
                  </TouchableOpacity>
                  
                  {/* Separator (except for last item) */}
                  {index < options.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              );
            })}
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    );
  }
);

TimeSelectionBottomSheet.displayName = 'TimeSelectionBottomSheet';

export default TimeSelectionBottomSheet;