import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';
import {ChevronRight} from 'lucide-react-native';

export interface ValidationError {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  blockId?: string;
  blockType?: string;
  blockTypeData?: string;
  title?: string;
  dayNum?: number;
  isAcceptAllowed?: boolean;
  isAcceptRequest?: boolean;
  accO?: any;
  date?: string;
  description?: string;
  resolutions?: Array<{
    id: string;
    text: string;
    actionLabel?: string;
    actions?: any[];
  }>;
}

interface ValidationSummaryProps {
  errors?: ValidationError[];
  warnings?: ValidationError[];
  infos?: ValidationError[];
  onViewAllErrors?: () => void;
  onViewAllWarnings?: () => void;
  onViewAllInfos?: () => void;
}

// Error Icon Component
export const ErrorIcon = ({color = '#DC3E42'}: {color?: string}) => (
  <Svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <Path
      d="M8.75 0C3.875 0 0 3.875 0 8.75C0 13.625 3.875 17.5 8.75 17.5C13.625 17.5 17.5 13.625 17.5 8.75C17.5 3.875 13.625 0 8.75 0ZM12.125 13.125L8.75 9.75L5.375 13.125L4.375 12.125L7.75 8.75L4.375 5.375L5.375 4.375L8.75 7.75L12.125 4.375L13.125 5.375L9.75 8.75L13.125 12.125L12.125 13.125Z"
      fill={color}
    />
  </Svg>
);

// Warning Icon Component
export const WarningIcon = ({color = '#C4860A'}: {color?: string}) => (
  <Svg width="16" height="16" viewBox="0 0 18 15" fill="none">
    <Path
      d="M0.823245 15C0.670467 15 0.531579 14.9619 0.406579 14.8858C0.281579 14.8097 0.184356 14.7089 0.114912 14.5833C0.0454675 14.4578 0.00741201 14.3222 0.000745342 14.1767C-0.00592132 14.0311 0.0321342 13.8889 0.114912 13.75L7.82325 0.416667C7.90658 0.277778 8.01436 0.173611 8.14658 0.104167C8.2788 0.0347222 8.41408 0 8.55241 0C8.69075 0 8.8263 0.0347222 8.95908 0.104167C9.09186 0.173611 9.19936 0.277778 9.28158 0.416667L16.9899 13.75C17.0732 13.8889 17.1116 14.0314 17.1049 14.1775C17.0982 14.3236 17.0599 14.4589 16.9899 14.5833C16.9199 14.7078 16.8227 14.8086 16.6982 14.8858C16.5738 14.9631 16.4349 15.0011 16.2816 15H0.823245ZM8.55241 12.5C8.78852 12.5 8.98658 12.42 9.14658 12.26C9.30658 12.1 9.3863 11.9022 9.38575 11.6667C9.38519 11.4311 9.30519 11.2333 9.14575 11.0733C8.9863 10.9133 8.78852 10.8333 8.55241 10.8333C8.3163 10.8333 8.11852 10.9133 7.95908 11.0733C7.79963 11.2333 7.71963 11.4311 7.71908 11.6667C7.71852 11.9022 7.79852 12.1003 7.95908 12.2608C8.11963 12.4214 8.31741 12.5011 8.55241 12.5ZM8.55241 10C8.78852 10 8.98658 9.92 9.14658 9.76C9.30658 9.6 9.3863 9.40222 9.38575 9.16667V6.66667C9.38575 6.43056 9.30575 6.23278 9.14575 6.07333C8.98575 5.91389 8.78797 5.83389 8.55241 5.83333C8.31686 5.83278 8.11908 5.91278 7.95908 6.07333C7.79908 6.23389 7.71908 6.43167 7.71908 6.66667V9.16667C7.71908 9.40278 7.79908 9.60083 7.95908 9.76083C8.11908 9.92083 8.31686 10.0006 8.55241 10Z"
      fill={color}
    />
  </Svg>
);

// Info Icon Component
export const InfoIcon = ({color = '#0D74CE'}: {color?: string}) => (
  <Svg width="18" height="18" viewBox="0 0 14 14" fill="none">
    <Path
      d="M6 10H7.33333V6H6V10ZM6.66667 4.66667C6.85556 4.66667 7.014 4.60267 7.142 4.47467C7.27 4.34667 7.33378 4.18844 7.33333 4C7.33289 3.81156 7.26889 3.65333 7.14133 3.52533C7.01378 3.39733 6.85556 3.33333 6.66667 3.33333C6.47778 3.33333 6.31956 3.39733 6.192 3.52533C6.06445 3.65333 6.00045 3.81156 6 4C5.99956 4.18844 6.06356 4.34689 6.192 4.47533C6.32045 4.60378 6.47867 4.66756 6.66667 4.66667ZM6.66667 13.3333C5.74445 13.3333 4.87778 13.1582 4.06667 12.808C3.25556 12.4578 2.55 11.9829 1.95 11.3833C1.35 10.7838 0.875112 10.0782 0.525334 9.26667C0.175556 8.45511 0.000445288 7.58844 8.43882e-07 6.66667C-0.000443601 5.74489 0.174668 4.87822 0.525334 4.06667C0.876001 3.25511 1.35089 2.54956 1.95 1.95C2.54911 1.35044 3.25467 0.875556 4.06667 0.525333C4.87867 0.175111 5.74533 0 6.66667 0C7.588 0 8.45467 0.175111 9.26667 0.525333C10.0787 0.875556 10.7842 1.35044 11.3833 1.95C11.9824 2.54956 12.4576 3.25511 12.8087 4.06667C13.1598 4.87822 13.3347 5.74489 13.3333 6.66667C13.332 7.58844 13.1569 8.45511 12.808 9.26667C12.4591 10.0782 11.9842 10.7838 11.3833 11.3833C10.7824 11.9829 10.0769 12.458 9.26667 12.8087C8.45644 13.1593 7.58978 13.3342 6.66667 13.3333Z"
      fill={color}
    />
  </Svg>
);

// Eye Icon Component (for View All button)
const EyeIcon = ({color = '#000'}: {color?: string}) => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M1.37468 8.23224C1.31912 8.08256 1.31912 7.91792 1.37468 7.76824C1.91581 6.45614 2.83435 5.33427 4.01386 4.54484C5.19336 3.75541 6.58071 3.33398 8.00001 3.33398C9.41932 3.33398 10.8067 3.75541 11.9862 4.54484C13.1657 5.33427 14.0842 6.45614 14.6253 7.76824C14.6809 7.91792 14.6809 8.08256 14.6253 8.23224C14.0842 9.54434 13.1657 10.6662 11.9862 11.4556C10.8067 12.2451 9.41932 12.6665 8.00001 12.6665C6.58071 12.6665 5.19336 12.2451 4.01386 11.4556C2.83435 10.6662 1.91581 9.54434 1.37468 8.23224Z"
      stroke={color}
      strokeWidth="1.33"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 10.0002C9.10457 10.0002 10 9.10473 10 8.00016C10 6.89559 9.10457 6.00016 8 6.00016C6.89543 6.00016 6 6.89559 6 8.00016C6 9.10473 6.89543 10.0002 8 10.0002Z"
      stroke={color}
      strokeWidth="1.33"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface SummaryItemProps {
  count: number;
  label: string;
  IconComponent: React.ComponentType<{color?: string}>;
  colors: {
    border: string;
    background: string;
    text: string;
  };
  onViewAll?: () => void;
  hasResolutions?: boolean;
}

const SummaryItem = ({
  count,
  label,
  IconComponent,
  colors,
  onViewAll,
  hasResolutions,
}: SummaryItemProps) => {
  const {colors: themeColors} = useTheme();

  if (count === 0 || !hasResolutions) return null;

  return (
    <View
      style={[
        styles.summaryItem,
        {
          borderColor: colors.border,
          backgroundColor: colors.background,
        },
      ]}>
      <View style={styles.summaryItemContent}>
        <View style={styles.summaryItemLeft}>
          <View style={styles.iconContainer}>
            <IconComponent color={colors.text} />
          </View>
          <View style={styles.textContainer}>
            <CustomText
              variant="text-sm-normal"
              style={[styles.summaryText, {color: colors.text}]}>
              {count} {label}
              {count !== 1 ? 's' : ''} found in your itinerary
            </CustomText>
          </View>
        </View>
        {onViewAll && (
          <TouchableOpacity
            style={[styles.viewAllButton]}
            onPress={onViewAll}
            activeOpacity={0.7}>
            <ChevronRight size={16} color={colors.text} />
            {/* <CustomText variant="text-sm-medium" color="neutral900">
              View all
            </CustomText> */}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export function ValidationSummary({
  errors = [],
  warnings = [],
  infos = [],
  onViewAllErrors,
  onViewAllWarnings,
  onViewAllInfos,
}: ValidationSummaryProps) {
  const {colors} = useTheme();

  const totalErrors = errors.length;
  const totalWarnings = warnings.length;
  const totalInfos = infos.length;
  const totalIssues = totalErrors + totalWarnings + totalInfos;

  if (totalIssues === 0) return null;

  const hasErrorResolutions = errors?.some(
    error => error?.resolutions && error?.resolutions?.length > 0,
  );

  const hasWarningAcceptence = warnings?.some(
    warning => warning?.isAcceptAllowed && !warning?.accO,
  );

  const hasInfoAcceptence = infos?.some(
    info => info?.isAcceptAllowed && !info?.accO,
  );

  return (
    <View style={styles.container}>
      <SummaryItem
        count={totalErrors}
        label="Error"
        IconComponent={ErrorIcon}
        colors={{
          border: Colors.lightThemeColors.red200,
          background: Colors.lightThemeColors.red50,
          text: Colors.lightThemeColors.red700,
        }}
        onViewAll={onViewAllErrors}
        hasResolutions={hasErrorResolutions}
      />

      <SummaryItem
        count={totalWarnings}
        label="Warning"
        IconComponent={WarningIcon}
        colors={{
          border: '#C4860A',
          background: Colors.lightThemeColors.amber50,
          text: Colors.lightThemeColors.amber700,
        }}
        onViewAll={onViewAllWarnings}
        hasResolutions={hasWarningAcceptence}
      />

      <SummaryItem
        count={totalInfos}
        label="Info"
        IconComponent={InfoIcon}
        colors={{
          border: '#0D74CE',
          background: Colors.lightThemeColors.blue50,
          text: Colors.lightThemeColors.blue700,
        }}
        onViewAll={onViewAllInfos}
        hasResolutions={hasInfoAcceptence}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  summaryItem: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    gap: 12,
  },
  summaryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
     gap: 4,
    paddingRight: 8,
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    gap: 12,
  },
});

export default ValidationSummary;
