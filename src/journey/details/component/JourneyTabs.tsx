import React from 'react';
import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {CustomText} from '../../../common/components';
import {useTheme} from '../../../context/ThemeContext';
import {Colors} from '../../../styles';
import {flex} from '../../../styles/typography';
import {layout} from '../../../styles/sizing';
import {borderRadius} from '../../../styles/outlines';

export type TabView = 'day' | 'summary' | 'detailed';

interface JourneyTabsProps {
  activeView: TabView;
  onTabChange: (view: TabView) => void;
  showMapTab?: boolean;
}

export function JourneyTabs({
  activeView,
  onTabChange,
  showMapTab = false,
}: JourneyTabsProps) {
  const {colors} = useTheme();

  // Figma tabs order and labels
  const tabs = [
    {id: 'day' as TabView, label: 'Day View'},
    {id: 'summary' as TabView, label: 'Summary view'},
    {id: 'detailed' as TabView, label: 'Details view'},
    // ...(showMapTab ? [{id: 'map' as TabView, label: 'Map View'}] : []),
    // {id: 'flights' as TabView, label: 'Flights'},
    // {id: 'visa' as TabView, label: 'Visa'},
    // {id: 'terms' as TabView, label: 'Terms and conditions'},
    // {id: 'insurance' as TabView, label: 'Travel insurance'},
  ];

  const getTabStyle = (tabId: TabView) => {
    const isActive = activeView === tabId;
    return [
      styles.tab,
      {
        backgroundColor: isActive ? colors.neutral900 : colors.neutral100,
        borderColor: isActive ? colors.neutral900 : colors.neutral200,
        borderWidth: 1,
        borderRadius: isActive ? 6 : 8,
        height: 36,
        paddingHorizontal: layout.x10 + 2,
        paddingVertical: 6,
        shadowColor: isActive ? undefined : colors.neutral900,
        shadowOpacity: isActive ? 0 : 0.04,
        shadowRadius: isActive ? 0 : 2,
        elevation: isActive ? 0 : 1,
      },
    ];
  };

  const getTextColor = (tabId: TabView) => {
    return activeView === tabId ? 'neutral50' : 'neutral900';
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={getTabStyle(tab.id)}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.85}>
            <CustomText variant="text-sm-medium" color={getTextColor(tab.id)}>
              {tab.label}
            </CustomText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: Colors.lightThemeColors.white,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',

    borderStyle: 'solid',
    marginRight: 0,
  },
});

export default JourneyTabs;
