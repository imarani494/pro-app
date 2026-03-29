import React, {forwardRef, useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {useTheme} from '../../context/ThemeContext';
import CustomText from './CustomText';
import {Colors} from '../../styles';
import {Check} from 'lucide-react-native';
import 'react-native-reanimated';

export interface CustomBottomSheetProps {
  snapPoints?: string[] | number[];
  children: React.ReactNode;
  enablePanDownToClose?: boolean;
  onDismiss?: () => void;
  detached?: boolean;
  style?: any;
  handleStyle?: any;
  handleIndicatorStyle?: any;
  enableBackdrop?: boolean;
  onClose?: () => void;
  title?: string;
  multipleSelection?: boolean;
  onSelect?: () => void;
}

const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(
  (
    {
      snapPoints = ['50%', '75%'],
      children,
      enablePanDownToClose = true,
      onDismiss,
      detached = false,
      style,
      handleStyle,
      handleIndicatorStyle,
      enableBackdrop = true,
      onClose,
      title,
      multipleSelection = false,
      onSelect,
    },
    ref,
  ) => {
    const {colors} = useTheme();

    const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

    const Backdrop = (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={memoizedSnapPoints}
        enablePanDownToClose={enablePanDownToClose}
        onDismiss={onDismiss}
        detached={detached}
        backdropComponent={enableBackdrop ? Backdrop : undefined}
        enableDynamicSizing={false}
        style={[styles.bottomSheet, style]}
        handleStyle={[
          styles.handle,
          {backgroundColor: colors.white},
          handleStyle,
        ]}
        handleIndicatorStyle={[
          styles.handleIndicator,
          {backgroundColor: colors.neutral300},
          handleIndicatorStyle,
        ]}>
        <View style={{flex: 1}}>
          {multipleSelection ? (
            <View>
              {title && (
                <View style={styles.headerContent}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                    <CustomText variant="text-lg-semibold" color="neutral900">
                      {title}
                    </CustomText>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      if (multipleSelection && onSelect) {
                        onSelect();
                      } else {
                        onClose?.();
                      }
                    }}
                    style={styles.doneBtn}>
                    <Check size={14} color="white" />
                    <CustomText variant="text-xs-medium" color="white">
                      Done
                    </CustomText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View>
              {title && (
                <View style={styles.headerContent}>
                  <CustomText variant="text-lg-semibold" color="neutral900">
                    {title}
                  </CustomText>
                </View>
              )}
            </View>
          )}

          {children}
        </View>
      </BottomSheetModal>
    );
  },
);

CustomBottomSheet.displayName = 'CustomBottomSheet';

const styles = StyleSheet.create({
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {},
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomColor: Colors.lightThemeColors.neutral200,
    paddingHorizontal: 20,
  },
  handle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.lightThemeColors.neutral900,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});

export default CustomBottomSheet;
