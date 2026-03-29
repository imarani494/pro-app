import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {CustomRadioButton, CustomText} from '../../../common/components';
import {Colors} from '../../../styles';
import {useTheme} from '../../../context/ThemeContext';
import {ClientDetailSection, CustomerDetailSection} from '..';
import {DateOption} from './ClientInfo';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

interface DateSelectionListProps {
  dates: DateOption[];
  selectedId: string;
  onSelect: (dt: DateOption) => void;
  isFdflow?: boolean;
  setClientDetails: React.Dispatch<React.SetStateAction<ClientDetailSection>>;
}

const statusStyles: Record<
  string,
  {backgroundColor: string; textColor: string}
> = {
  'almost-full': {
    backgroundColor: Colors.lightThemeColors.blue50,
    textColor: Colors.lightThemeColors.blue700,
  },
  'few-seats': {
    backgroundColor: Colors.lightThemeColors.red50,
    textColor: Colors.lightThemeColors.red600,
  },
  'fast-filling': {
    backgroundColor: Colors.lightThemeColors.orange50,
    textColor: Colors.lightThemeColors.orange600,
  },
  avl: {
    backgroundColor: Colors.lightThemeColors.green50,
    textColor: Colors.lightThemeColors.green700,
  },
};

const DateSelectionList: React.FC<DateSelectionListProps> = ({
  dates,
  selectedId,
  onSelect,
  isFdflow,
  setClientDetails,
}) => {
  const {colors} = useTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  if (!isFdflow) return null;

  // Parse month and year from date string (assume format 'YYYY-MM-DD' or similar)
  const getMonthYear = (dateStr: string) => {
    // Try to parse ISO date
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString('default', {month: 'long', year: 'numeric'});
    }
    // Fallback: try to extract from string
    const match = dateStr.match(/(\d{4})-(\d{2})/);
    if (match) {
      const year = match[1];
      const month = new Date(`${year}-${match[2]}-01`).toLocaleString(
        'default',
        {month: 'long'},
      );
      return `${month} ${year}`;
    }
    return dateStr;
  };

  // Build month tabs from dates
  const monthList = Array.from(new Set(dates.map(d => getMonthYear(d.range))));
  const tabs = ['All', ...monthList];
  const [activeTab, setActiveTab] = React.useState('All');

  const filteredDates =
    activeTab === 'All'
      ? dates
      : dates.filter(date => getMonthYear(date.range) === activeTab);

  // Show only first 3 dates initially
  const initialDates = filteredDates.slice(0, 3);
  const hasMoreDates = filteredDates.length > 3;

  const handleViewAllDates = () => {
    bottomSheetRef.current?.present();
  };

  const getBottomSheetTitle = () => {
    if (activeTab === 'All') {
      return 'All Available Dates';
    }
    return `Available Dates - ${activeTab}`;
  };

  const handleSelectFromBottomSheet = (date: DateOption) => {
    onSelect(date);
    bottomSheetRef.current?.dismiss();
  };

  const renderDateCard = (
    date: DateOption,
    onSelectDate: (date: DateOption) => void,
  ) => (
    <TouchableOpacity
      key={date.id}
      style={[
        styles.dateCard,
        selectedId === date.id ? styles.selectedCard : styles.unselectedCard,
      ]}
      onPress={() => onSelectDate(date)}>
      <View style={styles.leftSection}>
        <CustomRadioButton
          selected={selectedId === date.id}
          size="medium"
          style={styles.radioButtonSpacing}
        />
        <View style={styles.dateInfo}>
          <CustomText variant="text-sm-semibold" color="neutral900">
            {date.ttl}
          </CustomText>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  statusStyles[date.status]?.backgroundColor ||
                  colors.neutral100,
              },
            ]}>
            <CustomText
              variant="text-xs-medium"
              style={{
                color:
                  statusStyles[date.status]?.textColor || colors.neutral600,
              }}>
              {date.statusText}
            </CustomText>
          </View>
        </View>
      </View>

      <View style={styles.priceSection}>
        {date.oldPrice && (
          <CustomText
            variant="text-xs-normal"
            color="neutral400"
            style={styles.oldPrice}>
            ₹{date.oldPrice.toLocaleString()}
          </CustomText>
        )}
        <CustomText variant="text-lg-bold" color="neutral900">
          {date.priceDisplay}
        </CustomText>
        <CustomText variant="text-xs-normal" color="neutral500">
          Price per person
        </CustomText>
      </View>
    </TouchableOpacity>
  );

  React.useEffect(() => {
    if (filteredDates && filteredDates.length > 0) {
      setClientDetails(prev => ({
        ...prev,
        leavingOn: filteredDates[0].range || '',
      }));
    }
  }, []);

  return (
    <>
      <View style={styles.container}>
        <CustomText
          variant="text-lg-semibold"
          color="neutral900"
          style={styles.title}>
          Select Dates
        </CustomText>
        <CustomText
          variant="text-sm-normal"
          color="neutral500"
          style={styles.subtitle}>
          Who's coming? (Late joins/early exits will be captured per-city in the
          next steps)
        </CustomText>

        {/* Month Filter Tabs */}
        <View style={styles.tabContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContainer}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  tab === activeTab ? styles.activeTab : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab(tab)}>
                <CustomText
                  variant="text-sm-medium"
                  style={{
                    color: tab === activeTab ? colors.white : colors.neutral900,
                  }}>
                  {tab}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Initial 3 Date Cards */}
        <View style={styles.dateListContainer}>
          {filteredDates.length === 0 ? (
            <View style={styles.emptyContainer}>
              <CustomText variant="text-sm-normal" color="neutral400">
                No dates available for this month.
              </CustomText>
            </View>
          ) : (
            <>
              {initialDates.map(date => renderDateCard(date, onSelect))}
              {/* View All Dates Button */}
              {hasMoreDates && (
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={handleViewAllDates}>
                  <CustomText variant="text-sm-medium" color="neutral800">
                    View all dates ({filteredDates.length})
                  </CustomText>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      {/* Bottom Sheet for All Dates */}
      <CustomBottomSheet
        ref={bottomSheetRef}
        snapPoints={['80%']}
        title={getBottomSheetTitle()}
        onClose={() => bottomSheetRef.current?.dismiss()}
        enablePanDownToClose={true}>
        <View style={styles.bottomSheetContent}>
          {/* Month Filter Tabs in Bottom Sheet */}
          {/* <View style={[styles.tabContainer, {marginTop: 16}]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabScrollContainer}>
              {tabs.map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tab,
                    tab === activeTab ? styles.activeTab : styles.inactiveTab,
                  ]}
                  onPress={() => setActiveTab(tab)}>
                  <CustomText
                    variant="text-sm-medium"
                    style={{
                      color:
                        tab === activeTab ? colors.white : colors.neutral900,
                    }}>
                    {tab}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View> */}

          {/* All Date Cards in Bottom Sheet */}
          <ScrollView
            style={styles.bottomSheetDateList}
            showsVerticalScrollIndicator={false}>
            {filteredDates.length === 0 ? (
              <View style={styles.emptyContainer}>
                <CustomText variant="text-sm-normal" color="neutral400">
                  No dates available for this month.
                </CustomText>
              </View>
            ) : (
              filteredDates.map(date =>
                renderDateCard(date, handleSelectFromBottomSheet),
              )
            )}
          </ScrollView>
        </View>
      </CustomBottomSheet>
    </>
  );
};

export default DateSelectionList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'left',
  },
  subtitle: {
    marginVertical: 16,
  },
  tabContainer: {
    marginBottom: 16,
  },
  tabScrollContainer: {
    paddingRight: 20,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  activeTab: {
    backgroundColor: Colors.lightThemeColors.neutral900,
    borderColor: Colors.lightThemeColors.neutral900,
  },
  inactiveTab: {
    backgroundColor: Colors.lightThemeColors.neutral100,
    borderColor: Colors.lightThemeColors.neutral200,
  },
  dateListContainer: {
    // minHeight: 200,
    // maxHeight: 250,
    // marginBottom: 20,
  },
  dateListContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  selectedCard: {
    borderColor: Colors.lightThemeColors.neutral600,
    backgroundColor: Colors.lightThemeColors.neutral100,
  },
  unselectedCard: {
    borderColor: Colors.lightThemeColors.neutral200,
    backgroundColor: Colors.lightThemeColors.white,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  radioButtonSpacing: {
    marginRight: 12,
    marginBottom: 20,
  },

  dateInfo: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  viewAllButton: {
    backgroundColor: Colors.lightThemeColors.neutral100,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bottomSheetDateList: {
    flex: 1,
    paddingVertical: 20,
  },
});
