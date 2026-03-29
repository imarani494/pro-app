import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {ChevronDown, ChevronUp, Check} from 'lucide-react-native';
import {CustomText} from '../../../common/components';
import {useTheme} from '../../../context/ThemeContext';
import {Colors} from '../../../styles';
import {
  ErrorIcon,
  WarningIcon,
  InfoIcon,
} from '../../validation/ValidationSummary';
import Actions from './Actions';
import {useAppDispatch} from '../../../store';
import {useJournery} from '../../hooks/useJournery';
import {getMetaExecuteType, updateJourney} from '../../redux/journeySlice';
import {DateUtil} from '../../../utils';

export interface BlockValidation {
  msg: string;
  resA?: Array<{
    msg: string;
    actA: any[];
    prcD?: string;
    id?: string;
  }>;
  sev: string;
  id: string;
  isAccRq?: boolean;
  isAccAllw?: boolean;
  accO?: any;
}

interface BlockValidationBannerProps {
  validation: BlockValidation;
  date?: string;
  blockId?: string | null;
}

export function BlockValidationBanner({
  validation,
  date,
  blockId,
}: BlockValidationBannerProps) {
  const {colors} = useTheme();
  const dispatch = useAppDispatch();
  const journeyData = useJournery();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasResolutions = validation.resA && validation.resA.length > 0;
  const hasAcceptRequest = validation?.isAccAllw && !validation?.accO;
  const accepted = validation?.accO ? true : false;

  const handleAcceptRequest = (id: string) => {
    dispatch(
      updateJourney({
        type: getMetaExecuteType(journeyData),
        items: [{type: 'ACCEPT_ISSUE', issueId: id}],
      }) as any,
    );
  };

  const getTypeConfig = () => {
    switch (validation.sev) {
      case 'ERROR':
        return {
          icon: ErrorIcon,
          iconColor: '#DC3E42',
          borderColor: Colors.lightThemeColors.red200,
          backgroundColor: Colors.lightThemeColors.red50,
          textColor: Colors.lightThemeColors.red700,
        };
      case 'WARN':
        return {
          icon: WarningIcon,
          iconColor: '#C4860A',
          borderColor: '#E59C0B',
          backgroundColor: Colors.lightThemeColors.amber50,
          textColor: Colors.lightThemeColors.amber700,
        };
      case 'INFO':
        return {
          icon: InfoIcon,
          iconColor: '#0D74CE',
          borderColor: '#8EC8F6',
          backgroundColor: Colors.lightThemeColors.blue50,
          textColor: Colors.lightThemeColors.blue700,
        };
      default:
        return {
          icon: ErrorIcon,
          iconColor: '#DC3E42',
          borderColor: Colors.lightThemeColors.red200,
          backgroundColor: Colors.lightThemeColors.red50,
          textColor: Colors.lightThemeColors.red700,
        };
    }
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return DateUtil.formatDate(dateStr, 'dd MMM yyyy HH:mm');
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: config.borderColor,
          backgroundColor: config.backgroundColor,
        },
      ]}>
      {/* Main Message */}
      <View
        style={[
          styles.messageContainer,
          accepted && styles.messageContainerAccepted,
        ]}>
        <View style={styles.messageContent}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <IconComponent color={config.iconColor} />
          </View>

          {/* Message Text */}
          <View style={styles.textContainer}>
            <CustomText
              variant="text-sm-normal"
              style={[styles.messageText, {color: config.textColor}]}>
              {validation.msg}
            </CustomText>
            {accepted && validation?.accO && (
              <CustomText
                variant="text-xs-normal"
                color="neutral900"
                style={styles.acceptedText}>
                Accepted by: {validation.accO.unm},{' '}
                {formatDate(validation.accO.tm)}
              </CustomText>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        {accepted ? null : hasAcceptRequest ? (
          <TouchableOpacity
            onPress={() => handleAcceptRequest(validation.id)}
            style={[
              styles.approveButton,
              {
                borderColor: colors.neutral900,
                backgroundColor: colors.white,
              },
            ]}
            activeOpacity={0.7}>
            <Check size={12} color={colors.neutral900} />
            <CustomText
              variant="text-sm-medium"
              color="neutral900"
              style={styles.approveButtonText}>
              Approve
            </CustomText>
          </TouchableOpacity>
        ) : (
          hasResolutions && (
            <TouchableOpacity
              onPress={() => setIsExpanded(!isExpanded)}
              style={styles.toggleButton}
              activeOpacity={0.7}>
              <CustomText
                variant="text-sm-medium"
                color="neutral900"
                style={styles.toggleButtonText}>
                {isExpanded ? 'Hide' : 'View'}
              </CustomText>
              {isExpanded ? (
                <ChevronUp size={16} color={colors.neutral900} />
              ) : (
                <ChevronDown size={16} color={colors.neutral900} />
              )}
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Resolutions List - Expanded View */}
      {isExpanded && hasResolutions && (
        <View style={styles.resolutionsContainer}>
          {validation.resA?.map((resolution, index) => (
            <View
              key={resolution.id || index}
              style={[
                styles.resolutionItem,
                index > 0 && styles.resolutionItemBorder,
                {borderTopColor: colors.neutral200},
              ]}>
              {/* Description text on the left */}
              <View style={styles.resolutionTextContainer}>
                <CustomText variant="text-sm-medium" color="neutral900">
                  {index + 1}. {resolution.msg}
                </CustomText>
              </View>
              {/* Actions button on the right */}
              {resolution.actA && resolution.actA.length > 0 && (
                <View style={styles.resolutionActionsContainer}>
                  <Actions
                    date={date || null}
                    textColor="neutral900"
                    btnStyle={styles.actionButtonStyle}
                    actions={resolution.actA}
                    blockId={blockId || null}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 16,
    gap: 12,
  },
  messageContainerAccepted: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 8,
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  acceptedText: {
    marginTop: 4,
    fontSize: 12,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 2,
    borderWidth: 1,
    // height: 28,
  },
  approveButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleButtonText: {
    fontSize: 13,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  resolutionsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 20,
    backgroundColor: Colors.lightThemeColors.white,
  },
  resolutionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  resolutionItemBorder: {
    borderTopWidth: 1,
  },
  resolutionTextContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  resolutionActionsContainer: {
    flexShrink: 0,
  },
  actionButtonStyle: {
    // height: 32,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    backgroundColor: Colors.lightThemeColors.white,
  },
});

export default BlockValidationBanner;
