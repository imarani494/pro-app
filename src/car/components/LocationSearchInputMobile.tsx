import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';
import {useTheme} from '../../context/ThemeContext';

interface Location {
  data?: {
    id: number;
    pnm: string;
    nm: string;
  };
  value: string;
  _scr: number;
}

interface LocationSearchInputMobileProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: {city: string; region: string; code?: string}) => void;
  locations: Location[];
  loading: boolean;
  error: string | null;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  useApiSearch?: boolean;
  staticLocations?: {city: string; region: string; code?: string}[];
}

export default function LocationSearchInputMobile({
  label,
  placeholder,
  value,
  onChange,
  onLocationSelect,
  locations,
  loading,
  error,
  showDropdown,
  setShowDropdown,
  useApiSearch = false,
  staticLocations = [],
}: LocationSearchInputMobileProps) {
  const {colors} = useTheme();
  const inputRef = useRef<TextInput>(null);

  // Filter static locations if not using API search
  const displayLocations = useApiSearch
    ? locations
    : staticLocations.filter(
        location =>
          location.city.toLowerCase().includes(value.toLowerCase()) ||
          location.region.toLowerCase().includes(value.toLowerCase()),
      );

  const shouldShowDropdown = useApiSearch
    ? showDropdown &&
      (value || locations.length > 0) &&
      (loading ||
        (!error && locations.length > 0) ||
        (!loading && !error && value && locations.length === 0))
    : showDropdown && displayLocations.length > 0;

  const handleInputChange = (text: string) => {
    onChange(text);

    if (useApiSearch) {
      if (text) {
        setShowDropdown(true);
      }
    } else {
      setShowDropdown(true);
    }
  };

  const handleInputFocus = () => {
    if (useApiSearch) {
      if (value || locations.length > 0 || loading) {
        setShowDropdown(true);
      }
    } else {
      setShowDropdown(true);
    }
  };

  const handleLocationPress = (location: Location | {city: string; region: string; code?: string}) => {
    if ('data' in location) {
      // API location
      onLocationSelect({
        city: location.data?.nm || location.value,
        region: location.data?.pnm || '',
        code: location.data?.id?.toString(),
      });
    } else {
      // Static location
      onLocationSelect(location);
    }
    setShowDropdown(false);
  };

  const renderLocationItem = ({item}: {item: Location | {city: string; region: string; code?: string}}) => {
    if ('data' in item) {
      // API location
      return (
        <TouchableOpacity
          style={[styles.dropdownItem, {borderBottomColor: colors.neutral200}]}
          onPress={() => handleLocationPress(item)}>
          <CustomText variant="text-sm-medium" color="neutral900">
            {item.data?.nm || item.value}
          </CustomText>
          {item.data?.pnm && (
            <CustomText variant="text-xs-normal" color="neutral600">
              {item.data.pnm}
            </CustomText>
          )}
        </TouchableOpacity>
      );
    } else {
      // Static location
      return (
        <TouchableOpacity
          style={[styles.dropdownItem, {borderBottomColor: colors.neutral200}]}
          onPress={() => handleLocationPress(item)}>
          <CustomText variant="text-sm-medium" color="neutral900">
            {item.city}
          </CustomText>
          {item.region && (
            <CustomText variant="text-xs-normal" color="neutral600">
              {item.region}
            </CustomText>
          )}
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <CustomText variant="text-xs-semibold" color="neutral900" style={styles.label}>
        {label}
      </CustomText>
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            backgroundColor: colors.white,
            borderColor: colors.neutral200,
            color: colors.neutral900,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral400}
        value={value}
        onChangeText={handleInputChange}
        onFocus={handleInputFocus}
      />

      {/* Dropdown */}
      {shouldShowDropdown && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.white,
              borderColor: colors.neutral200,
            },
          ]}>
          {useApiSearch && loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.blue600} />
              <CustomText variant="text-sm-normal" color="neutral600" style={styles.loadingText}>
                Searching locations...
              </CustomText>
            </View>
          )}

          {useApiSearch && !loading && !error && locations.length > 0 && (
            <FlatList
              data={locations}
              keyExtractor={(item, index) =>
                `${item.data?.id || item.value}-${index}-${item._scr}`
              }
              renderItem={renderLocationItem}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            />
          )}

          {!useApiSearch && displayLocations.length > 0 && (
            <FlatList
              data={displayLocations}
              keyExtractor={(item, index) => `${item.city}-${item.region}-${index}`}
              renderItem={renderLocationItem}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            />
          )}

          {useApiSearch && !loading && locations.length === 0 && !error && (
            <View style={styles.emptyContainer}>
              <CustomText variant="text-sm-normal" color="neutral600">
                No locations found
              </CustomText>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    height: 36,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 14,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
});
