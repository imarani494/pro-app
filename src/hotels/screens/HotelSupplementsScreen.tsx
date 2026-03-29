import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {ArrowLeft, User, Edit3} from 'lucide-react-native';
import {useTheme} from '../../context/ThemeContext';
import {CustomText} from '../../common/components';
import {useNavigation} from '@react-navigation/native';

interface HotelSupplement {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  isAdded: boolean;
}

const UI_CONSTANTS = {
  activeOpacity: 0.7,
  statusBarHeight: 44,
  headerHeight: 54,
} as const;

const HotelSupplementsScreen: React.FC = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  // Static data - will be replaced with API data later
  const [supplements, setSupplements] = useState<HotelSupplement[]>([
    {
      id: 1,
      title: 'Flower Bed Decoration',
      description: 'Flower Bed Decoration',
      price: 5163,
      currency: '$',
      isAdded: false,
    },
    {
      id: 2,
      title: 'Candle Light Dinner (Includes Dinner for 2 Pax)',
      description: 'Candle Light Dinner (Includes Dinner for 2 Pax)',
      price: 5163,
      currency: '$',
      isAdded: false,
    },
    {
      id: 3,
      title: 'Birthday Decoration with Flower and Lights in Rooms',
      description: 'Birthday Decoration with Flower and Lights in Rooms',
      price: 8801,
      currency: '$',
      isAdded: false,
    },
    {
      id: 4,
      title: 'Birthday Cake',
      description: 'Cake',
      price: 3520,
      currency: '$',
      isAdded: false,
    },
    {
      id: 5,
      title: 'Late Check Out Charges as per the Convenience (3 Hrs)',
      description: 'Cake',
      price: 3520,
      currency: '$',
      isAdded: false,
    },
  ]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggleSupplement = useCallback((id: number) => {
    setSupplements(prev =>
      prev.map(item =>
        item.id === id ? {...item, isAdded: !item.isAdded} : item,
      ),
    );
  }, []);

  const renderSupplementItem = useCallback(
    (item: HotelSupplement) => (
      <View
        key={item.id}
        style={[
          styles.supplementItem,
          {
            backgroundColor: colors.white,
            borderColor: colors.neutral200,
          },
        ]}>
        <View style={styles.supplementContent}>
          <View style={styles.supplementInfo}>
            <CustomText
              variant="text-sm-medium"
              color="neutral900"
              style={styles.supplementTitle}>
              {item.title}
            </CustomText>
            <CustomText
              variant="text-xs-normal"
              color="neutral500"
              style={styles.supplementDescription}>
              {item.description}
            </CustomText>
          </View>
        </View>

        <View style={[styles.separator, {backgroundColor: colors.neutral200}]} />

        <View style={styles.supplementFooter}>
          <View style={styles.priceContainer}>
            <CustomText
              variant="text-xs-medium"
              color="neutral400"
              style={styles.priceLabel}>
              Total price
            </CustomText>
            <View style={styles.priceRow}>
              <CustomText
                variant="text-sm-semibold"
                color="neutral900"
                style={styles.currencySymbol}>
                {item.currency}
              </CustomText>
              <CustomText
                variant="text-lg-bold"
                color="neutral900"
                style={styles.priceAmount}>
                {item.price.toLocaleString()}
              </CustomText>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor: item.isAdded ? colors.neutral100 : colors.neutral100,
                borderColor: colors.neutral600,
              },
            ]}
            onPress={() => handleToggleSupplement(item.id)}
            activeOpacity={UI_CONSTANTS.activeOpacity}>
            <CustomText variant="text-sm-medium" color="neutral900">
              {item.isAdded ? 'Added to Package' : 'Add to Package'}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [colors, handleToggleSupplement],
  );

  const themeStyles = {
    container: {
      backgroundColor: colors.white,
    },
    header: {
      backgroundColor: colors.white,
      borderBottomColor: colors.neutral200,
    },
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={[styles.header, themeStyles.header]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={UI_CONSTANTS.activeOpacity}>
          <ArrowLeft size={20} color={colors.neutral900} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.headerInfo}>
            <CustomText variant="text-base-semibold" color="neutral900">
              Add Hotel Supplements
            </CustomText>
            <CustomText variant="text-xs-normal" color="neutral600">
              Port Blair (Day 1: Tue, 13 Jan, 2026
            </CustomText>
          </View>

          <View style={[styles.travelerCount, {backgroundColor: colors.white, borderColor: colors.neutral200}]}>
            <View style={styles.travelerInfo}>
              <User size={14} color={colors.neutral600} />
              <CustomText variant="text-xs-medium" color="neutral600">
                8
              </CustomText>
            </View>
            <Edit3 size={14} color={colors.neutral900} />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <CustomText
              variant="text-xl-medium"
              color="neutral900"
              style={styles.mainTitle}>
              Hotel Add-Ons
            </CustomText>
            <CustomText
              variant="text-sm-normal"
              color="neutral500"
              style={styles.subtitle}>
              Include optional hotel add-ons to enhance your customer's stay
            </CustomText>
          </View>

          <View style={styles.supplementsList}>
            {supplements.map(renderSupplementItem)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 6,
    minHeight: UI_CONSTANTS.headerHeight,
  },
  backButton: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  travelerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    height: 32,
    shadowColor: 'rgba(26,26,26,0.05)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  travelerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  titleSection: {
    gap: 4,
  },
  mainTitle: {
    lineHeight: 32,
    letterSpacing: -0.6,
  },
  subtitle: {
    lineHeight: 20,
  },
  supplementsList: {
    gap: 16,
  },
  supplementItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  supplementContent: {
    gap: 8,
    // marginTop: 20,
  },
  supplementInfo: {
    gap: 8,
  },
  supplementTitle: {
    lineHeight: 20,
  },
  supplementDescription: {
    lineHeight: 16,
    letterSpacing: 0.12,
  },
  separator: {
    height: 1,
    width: '100%',
  },
  supplementFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    gap: 6,
  },
  priceLabel: {
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  currencySymbol: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: -4,
  },
  priceAmount: {
    fontSize: 18,
    lineHeight: 22,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(26,26,26,0.05)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default HotelSupplementsScreen;