import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import React, {useState} from 'react';

const BottomStack = () => {
  const [activeTab, setActiveTab] = useState('Open');
  const [isManageAppEnabled, setIsManageAppEnabled] = useState(true);

  const tabs = [
    {id: 'Open', label: 'Open', icon: 'https://cdn-icons-png.flaticon.com/128/8584/8584964.png'},
    {id: 'Archive', label: 'Archive', icon: 'https://cdn-icons-png.flaticon.com/128/8138/8138776.png'},
    {id: 'Uninstall', label: 'Uninstall', icon: 'https://cdn-icons-png.flaticon.com/128/484/484662.png'},
    {id: 'ForceStop', label: 'Force stop', icon: 'https://cdn-icons-png.flaticon.com/128/2550/2550319.png'},
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App info</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Info Card */}
        <View style={styles.appInfoCard}>
          <View style={styles.appIconContainer}>
            <Image
              source={{
                uri: 'data:image/png;base64,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',
              }}
              style={styles.appIcon}
            />
          </View>
          <View style={styles.appDetails}>
            <Text style={styles.appName}>DRiefcase</Text>
            <Text style={styles.appStatus}>Installed</Text>
          </View>
        </View>

        {/* Privacy Section */}
        <Text style={styles.sectionHeader}>Privacy</Text>

        <View style={styles.card}>
          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemContent}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>🔔</Text>
              </View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>Notifications</Text>
                <Text style={styles.listItemSubtitle}>Allowed</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemContent}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>🔐</Text>
              </View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>Permissions</Text>
                <Text style={styles.listItemSubtitle}>
                  Camera and Notifications
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemContent}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>⏱</Text>
              </View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>Screen time</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.listItem}>
            <View style={styles.toggleContainer}>
              <View style={styles.listItemContent}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>⚙️</Text>
                </View>
                <View style={styles.listTextContainer}>
                  <Text style={styles.listItemTitle}>Manage app if unused</Text>
                  <Text style={styles.listItemSubtitle}>
                    Remove permissions if app is unused
                  </Text>
                </View>
              </View>
              <Switch
                value={isManageAppEnabled}
                onValueChange={setIsManageAppEnabled}
                trackColor={{false: '#d1d1d1', true: '#1a73e8'}}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        {/* Defaults Section */}
        <Text style={styles.sectionHeader}>Defaults</Text>

        <View style={styles.card}>
          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemContent}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>⭐</Text>
              </View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>Set as default</Text>
                <Text style={styles.listItemSubtitle}>In this app</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Usage Section */}
        <Text style={styles.sectionHeader}>Usage</Text>

        <View style={styles.card}>
          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemContent}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>📊</Text>
              </View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>Mobile data</Text>
                <Text style={styles.listItemSubtitle}>
                  36.59 MB used since 1 Mar
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemContent}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>🔋</Text>
              </View>
              <View style={styles.listTextContainer}>
                <Text style={styles.listItemTitle}>Battery</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: 120}} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.id)}>
            <View
              style={[
                styles.iconContainer,
                activeTab === tab.id && styles.activeIcon,
              ]}>
              <Image
                source={{uri: tab.icon}}
                style={styles.iconImage}
              />
            </View>
            <Text
              style={[
                styles.label,
                activeTab === tab.id && styles.activeLabel,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Navigation Buttons */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>|||</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>⭘</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>‹</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 20,
  },
  backIcon: {
    fontSize: 28,
    color: '#202124',
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202124',
  },
  content: {
    flex: 1,
  },
  appInfoCard: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  appIconContainer: {
    marginRight: 16,
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  appDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4,
  },
  appStatus: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5f6368',
    paddingHorizontal: 32,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
  },
  listTextContainer: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    color: '#202124',
    fontWeight: '500',
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 13,
    color: '#1a73e8',
    fontWeight: '400',
  },
  chevron: {
    fontSize: 20,
    color: '#5f6368',
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f3f4',
    marginLeft: 56,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderRadius: 26,
  },
  activeIcon: {
    backgroundColor: '#e8f4fd',
  },
  icon: {
    fontSize: 24,
    color: '#5f6368',
  },
  iconImage: {
    width: 28,
    height: 28,
    tintColor: '#5f6368',
  },
  label: {
    fontSize: 11,
    color: '#5f6368',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#1a73e8',
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingBottom: 20,
  },
  navButton: {
    padding: 12,
    borderRadius: 20,
  },
  navIcon: {
    fontSize: 24,
    color: '#5f6368',
  },
});

export default BottomStack;
