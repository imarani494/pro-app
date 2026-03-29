import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {X, ChevronDown} from 'lucide-react-native';
import CustomText from '../../../../../common/components/CustomText';
import TravelerSummary from '../../../../../common/components/TravelersTag';
import {useTheme} from '../../../../../context/ThemeContext';

export interface CustomInclusionData {
  name?: string;
  nm?: string;
  cdnm?: string;
  dsc?: string;
  paxD?: string;
  isInc?: boolean;
  tvlG?: {
    tvlA?: Array<{
      id?: string;
      type?: string;
      [key: string]: any;
    }>;
  };
  actions?: any[];
  [key: string]: any;
}

interface CustomInclusionCardProps {
  data: CustomInclusionData;
  jid?: string;
}

const CustomInclusionCard: React.FC<CustomInclusionCardProps> = ({
  data,
  jid,
}) => {
  const {colors} = useTheme();
  const [showFullDesc, setShowFullDesc] = useState(false);

  const travelers = data?.tvlG?.tvlA || [];
  const paxD = data?.paxD || '';
  const isIncluded = data?.isInc === true;
  const description = data?.dsc || '';

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.white,
          borderColor: colors.neutral200,
        },
      ]}>
      <View style={styles.container}>
        <View style={styles.contentRow}>
          <View style={styles.leftColumn}>
            <CustomText variant="text-base-semibold" color="neutral900">
              {data?.title ||
                data?.nm ||
                data?.name ||
                data?.cdnm ||
                'Extra Service'}
            </CustomText>

            {!isIncluded && (
              <View style={styles.badgeWrapper}>
                <View
                  style={[
                    styles.notIncludedBadge,
                    {backgroundColor: colors.red50},
                  ]}>
                  <X size={12} color={colors.red600} />
                  <CustomText variant="text-xs-medium" color="red600">
                    Not included
                  </CustomText>
                </View>
              </View>
            )}

            {description && (
              <View style={styles.descriptionContainer}>
                <CustomText variant="text-xs-normal" color="neutral500">
                  {description}
                </CustomText>
              </View>
            )}
          </View>

          <View style={styles.rightColumn}>
            {(data?.actions?.length > 0 || data.actions) && (
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.neutral200,
                  },
                ]}>
                <CustomText variant="text-sm-medium" color="neutral900">
                  Actions
                </CustomText>
                <ChevronDown size={16} color={colors.neutral900} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {travelers.length > 0 && (
        <View style={styles.travelersContainer}>
          {paxD && (
            <CustomText
              variant="text-sm-normal"
              color="neutral500"
              style={styles.paxText}>
              {paxD}
            </CustomText>
          )}
          <TravelerSummary
            travelers={travelers.filter((t: any) => t.type !== 'adult')}
            showProfileIcon={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  container: {
    padding: 14,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  leftColumn: {
    // flex: 1,
    gap: 8,
  },
  rightColumn: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
    // flexShrink: 0,
  },
  badgeWrapper: {
    width: '100%',
  },
  notIncludedBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    gap: 4,
  },
  descriptionContainer: {
    gap: 4,
    width: '100%',
  },
  travelersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  paxText: {
    marginLeft: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 4,
  },
});

export default CustomInclusionCard;
