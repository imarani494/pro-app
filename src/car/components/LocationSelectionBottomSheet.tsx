import React, {useRef, forwardRef, useImperativeHandle, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';
import {useTheme} from '../../context/ThemeContext';
import {X} from 'lucide-react-native';

interface LocationOption {
  id: string;
  name: string;
  isSelected?: boolean;
}

interface LocationSelectionBottomSheetProps {
  title: string;
  options: LocationOption[];
  onLocationSelect: (location: LocationOption) => void;
  selectedLocationId?: string;
}

export interface LocationSelectionBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

const LocationSelectionBottomSheet = forwardRef<
  LocationSelectionBottomSheetRef,
  LocationSelectionBottomSheetProps
>(({title, options, onLocationSelect, selectedLocationId}, ref) => {
  const {colors} = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedId, setSelectedId] = useState(selectedLocationId || '');

  useImperativeHandle(ref, () => ({
    present: () => {
      setSelectedId(selectedLocationId || '');
      bottomSheetModalRef.current?.present();
    },
    dismiss: () => {
      bottomSheetModalRef.current?.dismiss();
    },
  }));

  const handleLocationPress = (location: LocationOption) => {
    setSelectedId(location.id);
    onLocationSelect(location);
    bottomSheetModalRef.current?.dismiss();
  };

  const snapPoints = React.useMemo(() => ['40%', '60%'], []);

  const RadioButton = ({selected}: {selected: boolean}) => (
    <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
      {selected && <View style={styles.radioButtonInner} />}
    </View>
  );

  const Separator = () => (
    <View style={[styles.separator, {borderBottomColor: colors.neutral200}]} />
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={[styles.bottomSheetBackground, {backgroundColor: colors.white}]}
      handleIndicatorStyle={[styles.handleIndicator, {backgroundColor: colors.neutral300}]}>
      <BottomSheetView style={styles.contentContainer}>
        {/* Header */}
        <View style={[styles.header, {borderBottomColor: colors.neutral200}]}>
          <View style={styles.titleContainer}>
            <CustomText 
              variant="text-lg-semibold" 
              color="neutral900"
              style={styles.title}
            >
              {title}
            </CustomText>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => bottomSheetModalRef.current?.dismiss()}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <X size={16} color={colors.neutral900} />
          </TouchableOpacity>
        </View>

        {/* Location List */}
        <ScrollView 
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.list}>
            {options.map((option, index) => (
              <React.Fragment key={option.id}>
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => handleLocationPress(option)}
                  activeOpacity={0.7}>
                  <View style={styles.radioGroupItem}>
                    <RadioButton selected={selectedId === option.id} />
                  </View>
                  <CustomText
                    variant="text-base-normal"
                    color="neutral900"
                    style={styles.locationText}>
                    {option.name}
                  </CustomText>
                </TouchableOpacity>
                {index < options.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  bottomSheetBackground: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
  },
  title: {
    fontSize: 18,
    lineHeight: 28,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  list: {
    flex: 1,
  },
  listItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 16,
    gap: 10,
  },
  radioGroupItem: {
    padding: 0,
    gap: 12,
    alignItems: 'flex-start',
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  radioButtonSelected: {
    borderColor: Colors.lightThemeColors.neutral900,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lightThemeColors.neutral900,
  },
  locationText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    minWidth: 234,
  },
  separator: {
    borderBottomWidth: 1,
    height: 0,
  },
});

LocationSelectionBottomSheet.displayName = 'LocationSelectionBottomSheet';

export default LocationSelectionBottomSheet;