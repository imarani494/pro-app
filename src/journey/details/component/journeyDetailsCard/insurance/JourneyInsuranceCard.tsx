import React, {useState} from 'react';
import {View, StyleSheet, ViewStyle, TouchableOpacity} from 'react-native';
import {ChevronDown, X} from 'lucide-react-native';
import CustomText from '../../../../../common/components/CustomText';
import {useTheme} from '../../../../../context/ThemeContext';
import TravelerSummary from '../../../../../common/components/TravelersTag';
import {InsuranceApiData} from './types/InsuranceTypes';

interface JourneyInsuranceProps {
  containerStyle?: ViewStyle;
  apiData: InsuranceApiData;
  onOtherActionsPress?: () => void;
  onViewChecklistPress?: () => void;
  onAddInsurancePress?: () => void;
}

const ICON_SIZE = 12;

const isInsuranceIncluded = (apiData: InsuranceApiData): boolean => {
  if (typeof apiData?.isInc === 'boolean') return apiData.isInc;
  return false;
};

const getInsuranceTitle = (apiData: InsuranceApiData): string => {
  return (
    apiData?.nm ||
    apiData?.cdnm ||
    apiData?.ttl ||
    apiData?.title ||
    apiData?.typD ||
    'Travel Insurance'
  );
};

const getTravelersFromApi = (tvlA: string[] = [], paxD: string = '') => {
  let adultIndex = 1;
  let childIndex = 1;
  return tvlA.map(travelerId => {
    if (travelerId.toUpperCase().includes('ADULT')) {
      return {
        id: travelerId,
        t: 'Adult',
        nm: `T${adultIndex++}`,
        label: paxD,
      };
    } else {
      return {
        id: travelerId,
        t: 'Child',
        nm: `T${childIndex++}`,
        label: paxD,
      };
    }
  });
};

const JourneyInsuranceCard: React.FC<JourneyInsuranceProps> = ({
  containerStyle,
  apiData,
  onOtherActionsPress = () => {},
  onViewChecklistPress = () => {},
  onAddInsurancePress = () => {},
}) => {
  const {colors} = useTheme();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const title = getInsuranceTitle(apiData);
  const paxD = apiData?.paxD || '';
  const travelers = getTravelersFromApi(apiData?.tvlG?.tvlA || [], paxD);
  const isIncluded = isInsuranceIncluded(apiData);
  const description = apiData?.dsc || '';

  return (
    <View style={containerStyle}>
     
      <View style={[styles.cardContainer, {
        backgroundColor: colors.white,
        borderColor: colors.neutral200,
      }]}>
        <View style={styles.container}>
          <View style={styles.contentRow}>
           
            <View style={styles.leftColumn}>
            
              <CustomText variant="text-base-semibold" color="neutral900">
                {title}
              </CustomText>

             
              {!isIncluded && (
                <View style={styles.badgeWrapper}>
                  <View style={[styles.notIncludedBadge, {backgroundColor: colors.red50}]}>
                    <X size={ICON_SIZE} color={colors.red600} />
                    <CustomText variant="text-xs-medium" color="red600">
                      Not included
                    </CustomText>
                  </View>
                </View>
              )}

             
              {description && (
                <View style={styles.descriptionContainer}>
                  <CustomText
                    variant="text-sm-normal"
                    color="neutral600"
                    numberOfLines={showFullDescription ? 0 : 3}>
                    {description}
                  </CustomText>
                  {description.length > 250 && (
                    <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                      <CustomText variant="text-xs-medium" color="sky600">
                        {showFullDescription ? 'Show less' : 'Show more'}
                      </CustomText>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

          
            <View style={styles.rightColumn}>
             
              {(apiData?.actions?.length > 0) && (
                <TouchableOpacity
                  style={[styles.otherActionsButton, {
                    backgroundColor: colors.white,
                    borderColor: colors.neutral200,
                  }]}
                  onPress={onOtherActionsPress}>
                  <CustomText variant="text-sm-medium" color="neutral900">
                    Actions
                  </CustomText>
                  <ChevronDown size={16} color={colors.neutral900} />
                </TouchableOpacity>
              )}

            
              {travelers.length > 0 && (
                <View style={styles.travelersContainer}>
                  <TravelerSummary travelers={travelers} showProfileIcon={false} />
                  {paxD && (
                    <CustomText variant="text-xs-normal" color="neutral600" style={styles.paxText}>
                      {paxD}
                    </CustomText>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  container: {
    padding: 16,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  leftColumn: {
    flex: 1,
    gap: 8,
  },
  rightColumn: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
    flexShrink: 0,
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
    borderRadius: 4,
    gap: 4,
  },
  descriptionContainer: {
    gap: 4,
  },
  travelersContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  paxText: {
    marginTop: 4,
  },
  otherActionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 4,
  },
});

export default JourneyInsuranceCard;
