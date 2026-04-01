import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Modal, FlatList} from 'react-native';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';
import {useTheme} from '../../context/ThemeContext';
import {ChevronDown} from 'lucide-react-native';
import CustomBottomSheet from '../../common/components/CustomBottomSheet';

interface SortHeaderMobileProps {
  totalResults: number;
  sortOrder: 'low-to-high' | 'high-to-low' | 'none';
  onSortChange: (value: 'low-to-high' | 'high-to-low' | 'none') => void;
  minPrice?: number;
  maxPrice?: number;
}

export default function SortHeaderMobile({
  totalResults,
  sortOrder,
  onSortChange,
  minPrice,
  maxPrice,
}: SortHeaderMobileProps) {
  const {colors} = useTheme();
  const [showSortModal, setShowSortModal] = useState(false);
  const sortBottomSheetRef = React.useRef<any>(null);

  const sortOptions = [
    {value: 'none', label: 'Original Order'},
    {value: 'low-to-high', label: 'Price - Low to High'},
    {value: 'high-to-low', label: 'Price - High to Low'},
  ];

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortOrder);
    return option?.label || 'Original Order';
  };

  const handleSortSelect = (value: 'low-to-high' | 'high-to-low' | 'none') => {
    onSortChange(value);
    setShowSortModal(false);
    if (sortBottomSheetRef.current) {
      sortBottomSheetRef.current.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <CustomText variant="text-sm-medium" color="neutral900">
          Showing {totalResults} results
        </CustomText>
        <CustomText variant="text-xs-normal" color="neutral600">
          Current sort: {getSortLabel()}
          {minPrice && maxPrice && (
            <CustomText variant="text-xs-normal" color="neutral600">
              {' '}
              (${minPrice} - ${maxPrice})
            </CustomText>
          )}
        </CustomText>
      </View>

      <TouchableOpacity
        style={[
          styles.sortButton,
          {
            backgroundColor: colors.white,
            borderColor: colors.neutral200,
          },
        ]}
        onPress={() => {
          setShowSortModal(true);
          if (sortBottomSheetRef.current) {
            sortBottomSheetRef.current.present();
          }
        }}
        activeOpacity={0.8}>
        <CustomText variant="text-sm-medium" color="neutral900">
          {getSortLabel()}
        </CustomText>
        <ChevronDown size={16} color={colors.neutral600} />
      </TouchableOpacity>

      {/* Sort Picker Bottom Sheet */}
      <CustomBottomSheet
        ref={sortBottomSheetRef}
        snapPoints={['40%']}
        title="Sort By"
        onClose={() => setShowSortModal(false)}
        enablePanDownToClose={true}>
        <View style={styles.sortOptionsContainer}>
          <FlatList
            data={sortOptions}
            keyExtractor={item => item.value}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  {
                    backgroundColor:
                      sortOrder === item.value ? colors.blue50 : colors.white,
                    borderColor: sortOrder === item.value ? colors.blue600 : colors.neutral200,
                  },
                ]}
                onPress={() => handleSortSelect(item.value as any)}>
                <CustomText
                  variant="text-base-medium"
                  color={sortOrder === item.value ? 'blue600' : 'neutral900'}>
                  {item.label}
                </CustomText>
              </TouchableOpacity>
            )}
          />
        </View>
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  leftSection: {
    flex: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
  },
  sortOptionsContainer: {
    padding: 16,
  },
  sortOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
});
