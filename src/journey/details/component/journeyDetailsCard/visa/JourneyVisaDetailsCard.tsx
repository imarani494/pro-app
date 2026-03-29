import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {X, ChevronDown} from 'lucide-react-native';
import CustomText from '../../../../../common/components/CustomText';
import TravelerSummary from '../../../../../common/components/TravelersTag';
import {useTheme} from '../../../../../context/ThemeContext';
import {VisaApiData} from './types/VisaTypes';

interface Traveler {
  id: string;
  type?: string;
  [key: string]: any;
}

interface JourneyVisaDetailsCardProps {
  apiData: VisaApiData;
  jid?: string;
}

const ICON_SIZE = 12;

const getVisaTitle = (apiData: VisaApiData): string => {
  return (
    apiData?.nm ||
    apiData?.ttl ||
    apiData?.typD ||
    apiData?.title ||
    'Visa'
  );
};

const getTravelersArray = (tvlA: any[] = []): Traveler[] => {
  if (tvlA.length > 0 && typeof tvlA[0] === 'object') {
    return tvlA;
  }
  return tvlA.map(id => ({id}));
};

const JourneyVisaDetailsCard: React.FC<JourneyVisaDetailsCardProps> = ({
  apiData,
  jid,
}) => {
  const {colors} = useTheme();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const title = getVisaTitle(apiData);
  const description = apiData?.dsc || apiData?.description || '';
  const paxD = apiData?.paxD || '';
  const travelers = getTravelersArray(apiData?.tvlG?.tvlA || []);
  const isIncluded = apiData?.isInc ?? false;
  const showBadge = apiData?.showBadge ?? false;

  const shouldShowNotIncluded = !isIncluded && showBadge;

  return (
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

           
            {shouldShowNotIncluded && (
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

        
          
        </View>
      </View>
      <View style={styles.rightColumn}>
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
   
    gap: 8,
    padding:14,
   
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
});

export {JourneyVisaDetailsCard};