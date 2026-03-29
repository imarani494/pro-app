import React, {useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ArrowLeft, Check, ChevronDown, ChevronUp} from 'lucide-react-native';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';
import {useTheme} from '../../context/ThemeContext';
import {
  ValidationError,
  ErrorIcon,
  WarningIcon,
  InfoIcon,
} from './ValidationSummary';
import {DateUtil} from '../../utils';
import DashedDrawLine from '../../common/components/DashedDrawLine';

interface ValidationErrorsModalProps {
  visible?: boolean;
  errors?: ValidationError[];
  warnings?: ValidationError[];
  infos?: ValidationError[];
  onClose?: () => void;
  onViewItem?: (item: ValidationError) => void;
  onResolutionAction?: (
    item: ValidationError,
    resolution: {
      id: string;
      text: string;
      actionLabel?: string;
      actions?: any[];
    },
  ) => void;
}

const ValidationErrorsModal: React.FC<ValidationErrorsModalProps> = ({
  visible = false,
  errors = [],
  warnings = [],
  infos = [],
  onClose,
  onViewItem,
  onResolutionAction,
}) => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Combine all items and determine the primary type
  const allItems = useMemo(() => {
    const items: Array<{
      item: ValidationError;
      type: 'error' | 'warning' | 'info';
    }> = [];
    errors.forEach(err => items.push({item: err, type: 'error'}));
    warnings.forEach(warn => items.push({item: warn, type: 'warning'}));
    infos.forEach(info => items.push({item: info, type: 'info'}));
    return items;
  }, [errors, warnings, infos]);

  const totalCount = errors.length + warnings.length + infos.length;
  const primaryType = useMemo(() => {
    if (errors.length > 0) return 'error';
    if (warnings.length > 0) return 'warning';
    if (infos.length > 0) return 'info';
    return 'error';
  }, [errors.length, warnings.length, infos.length]);

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getTypeConfig = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return {
          title: 'All Errors',
          icon: ErrorIcon,
          iconColor: '#DC3E42',
          bannerBg: Colors.lightThemeColors.red50,
          bannerBorder: Colors.lightThemeColors.red200,
          textColor: Colors.lightThemeColors.red700,
          label: 'Error',
        };
      case 'warning':
        return {
          title: 'All Warnings',
          icon: WarningIcon,
          iconColor: '#C4860A',
          bannerBg: Colors.lightThemeColors.amber50,
          bannerBorder: Colors.lightThemeColors.amber200,
          textColor: Colors.lightThemeColors.amber700,
          label: 'Warning',
        };
      case 'info':
        return {
          title: 'All Infos',
          icon: InfoIcon,
          iconColor: '#0D74CE',
          bannerBg: Colors.lightThemeColors.blue50,
          bannerBorder: Colors.lightThemeColors.blue200,
          textColor: Colors.lightThemeColors.blue700,
          label: 'Info',
        };
    }
  };

  const primaryConfig = getTypeConfig(primaryType);
  const formatDayTitle = (item: ValidationError) => {
    if (item.title) {
      return item.title;
    }
    if (item.dayNum) {
      return `Day ${item.dayNum}`;
    }
    return 'Unknown';
  };

  const renderBanner = () => {
    // If we have multiple types, show a combined banner
    if (errors.length > 0 && warnings.length > 0) {
      return (
        <View
          style={[
            styles.banner,
            {
              backgroundColor: Colors.lightThemeColors.neutral50,
              borderBottomColor: Colors.lightThemeColors.neutral200,
            },
          ]}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerIcon}>
              <ErrorIcon color="#DC3E42" />
            </View>
            <CustomText
              variant="text-base-medium"
              style={[
                styles.bannerText,
                {color: Colors.lightThemeColors.neutral900},
              ]}>
              {totalCount} Issue{totalCount !== 1 ? 's' : ''} found in your
              itinerary
            </CustomText>
          </View>
        </View>
      );
    }

    // Show type-specific banner
    const config = primaryConfig;
    const IconComponent = config.icon;
    const count = totalCount;

    return (
      <View
        style={[
          styles.banner,
          {
            backgroundColor: config.bannerBg,
            borderBottomColor: config.bannerBorder,
          },
        ]}>
        <View style={styles.bannerContent}>
          <View style={styles.bannerIcon}>
            <IconComponent color={config.iconColor} />
          </View>
          <CustomText
            variant="text-sm-normal"
            style={[styles.bannerText, {color: config.textColor}]}>
            {count} {config.label}
            {count !== 1 ? 's' : ''} found in your itinerary
          </CustomText>
        </View>
      </View>
    );
  };

  const renderResolutionItem = (
    resolution: {
      id: string;
      text: string;
      actionLabel?: string;
      actions?: any[];
    },
    index: number,
    item: ValidationError,
  ) => {
    const actionLabel = resolution.actionLabel || 'Action';
    const actionButtons = resolution.actions || [];

    return (
      <View key={resolution.id || index} style={styles.resolutionItem}>
        <View style={styles.resolutionTextContainer}>
          <CustomText variant="text-sm-normal" color="neutral900">
            {index + 1}. {resolution.text}
          </CustomText>
        </View>
        {actionButtons.length > 0 && (
          <View style={styles.actionButtonsContainer}>
            {actionButtons.map((action: any, actionIndex: number) => (
              <TouchableOpacity
                key={actionIndex}
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.neutral200,
                  },
                ]}
                onPress={() => onResolutionAction?.(item, resolution)}
                activeOpacity={0.7}>
                <CustomText variant="text-sm-medium" color="neutral900">
                  {action.name || actionLabel}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderErrorCard = (
    item: ValidationError,
    type: 'error' | 'warning' | 'info',
    index: number,
  ) => {
    const isExpanded = expandedItems.has(item.id);
    const hasResolutions = item.resolutions && item.resolutions.length > 0;
    const dayTitle = formatDayTitle(item);

    return (
      <View key={item.id || index} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderContent}>
            <CustomText
              variant="text-sm-medium"
              color="neutral900"
              style={{marginBottom: 2}}>
              {dayTitle}
            </CustomText>
            {item.message && (
              <CustomText
                variant="text-xs-normal"
                color="neutral500"
                style={styles.errorMessage}>
                {item.message}
              </CustomText>
            )}
          </View>
        </View>

        {item.resolutions && item.resolutions.length > 0 && (
          <>
            {isExpanded && (
              <View style={styles.resolutionsContainer}>
                {item.resolutions.map((resolution, resIndex) => (
                  <View
                    key={resolution.id || resIndex}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}>
                    <View style={{flex: 1, minWidth: 0}}>
                      <CustomText variant="text-sm-normal" color="neutral800">
                        {resIndex + 1}. {resolution.text}
                      </CustomText>
                    </View>
                    {resolution.actionLabel && (
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          {
                            backgroundColor: Colors.lightThemeColors.neutral100,
                            borderColor: Colors.lightThemeColors.neutral600,
                          },
                        ]}
                        onPress={() => onResolutionAction?.(item, resolution)}
                        activeOpacity={0.7}>
                        <CustomText
                          variant="text-sm-medium"
                          color="neutral900"
                          style={{lineHeight: 20}}>
                          {resolution.actionLabel}
                        </CustomText>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}
            <DashedDrawLine />
            <View style={styles.cardFooter}>
              <TouchableOpacity
                onPress={() => onViewItem?.(item)}
                activeOpacity={0.7}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 0,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  minWidth: 60,
                }}>
                <CustomText
                  variant="text-xs-semibold"
                  color="neutral600"
                  style={{
                    textDecorationLine: 'underline',
                  }}>
                  View
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleView,
                  {
                    backgroundColor: Colors.lightThemeColors.white,
                    borderColor: Colors.lightThemeColors.neutral200,
                  },
                ]}
                onPress={() => toggleExpanded(item.id)}
                activeOpacity={0.7}>
                <CustomText variant="text-xs-semibold" color="neutral900">
                  {isExpanded ? 'Hide Resolution' : 'Show Resolution'}
                </CustomText>
                {isExpanded ? (
                  <ChevronUp size={16} color={colors.neutral900} />
                ) : (
                  <ChevronDown size={16} color={colors.neutral900} />
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
        {!hasResolutions && (
          <View>
            <DashedDrawLine />
            <View style={styles.cardFooter}>
              <TouchableOpacity
                onPress={() => onViewItem?.(item)}
                activeOpacity={0.7}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 0,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  minWidth: 60,
                }}>
                <CustomText
                  variant="text-xs-semibold"
                  color="neutral600"
                  style={{
                    textDecorationLine: 'underline',
                  }}>
                  View
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.viewApprove,
                  {
                    backgroundColor: Colors.lightThemeColors.white,
                    borderColor: Colors.lightThemeColors.neutral200,
                  },
                ]}
                onPress={() => {
                  /* Approve action here */
                }}
                activeOpacity={0.7}>
                {/* Lucide Check icon */}
                <Check size={16} color={colors.neutral900} />
                <CustomText variant="text-xs-semibold" color="neutral900">
                  Approve
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  const getModalTitle = () => {
    if (errors.length > 0 && warnings.length === 0 && infos.length === 0) {
      return 'All Errors';
    }
    if (warnings.length > 0 && errors.length === 0 && infos.length === 0) {
      return 'All Warnings';
    }
    if (infos.length > 0 && errors.length === 0 && warnings.length === 0) {
      return 'All Infos';
    }
    return 'All Issues';
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}>
      <SafeAreaView
        style={[
          styles.container,
          Platform.OS === 'ios' && {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
        edges={Platform.OS === 'android' ? ['top', 'bottom'] : []}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.neutral900} />
          </TouchableOpacity>
          <CustomText variant="text-lg-semibold" color="neutral900">
            {getModalTitle()}
          </CustomText>
          <View style={styles.headerSpacer} />
        </View>

        {/* Banner */}
        {renderBanner()}

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}>
          {allItems.length > 0 ? (
            allItems.map(({item, type}, index) =>
              renderErrorCard(item, type, index),
            )
          ) : (
            <View style={styles.emptyContainer}>
              <ErrorIcon color="#DC3E42" />
              <CustomText
                variant="text-base-medium"
                color="neutral500"
                style={styles.emptyText}>
                No issues found
              </CustomText>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    gap: 4,
    paddingVertical: 12,

    borderBottomColor: Colors.lightThemeColors.neutral200,
  },
  backButton: {
    padding: 4,
  },
  headerSpacer: {
    width: 32,
  },
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bannerIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: Colors.lightThemeColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#1A1A1A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    alignSelf: 'center',
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardHeaderContent: {
    gap: 4,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitleIcon: {
    // width: 18,
    // height: 18,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  errorMessage: {
    marginTop: 4,
    marginBottom: 8,
  },
  resolutionsContainer: {
    marginTop: 12,
    marginBottom: 8,
    gap: 12,
  },
  resolutionItem: {
    gap: 8,
  },
  viewApprove: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#1A1A1A',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resolutionTextContainer: {
    marginBottom: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    // paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    shadowColor: '#1A1A1A',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,

    borderTopColor: Colors.lightThemeColors.neutral100,
  },
  viewLink: {
    textDecorationLine: 'underline',
  },
  toggleView: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#1A1A1A',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    textAlign: 'center',
  },
});

export default ValidationErrorsModal;
