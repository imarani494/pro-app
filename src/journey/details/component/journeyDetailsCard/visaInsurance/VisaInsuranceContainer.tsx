import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import CustomText from '../../../../../common/components/CustomText';
import {Box, IdCard, Shield} from 'lucide-react-native';
import {useTheme} from '../../../../../context/ThemeContext';

import {InsuranceCardWrapper} from './InsuranceCardWrapper';
import CustomInclusionCard from './CustomInclusionCard';
import JourneyExtrasCard from '../extras/JourneyExtrasCard';
import {IJourney, GBlkA} from '../../../../types/journey';
import { VisaCardWrapper } from '../visaInsurance/VisaCardWrapper';

interface VisaInsuranceContainerProps {
  journeyData: IJourney;
}

function getExtrasFromGBlkA(gBlkA: GBlkA[]) {
  const extrasTypes = [
    'STAY_EXTRA_SERVICE',
    'GROUP_TOUR_EXTRA',
    'TRANSFER_EXTRA',
    'EXTRA_SERVICE'
  ];
  
  return gBlkA
    .filter(item => extrasTypes.includes(item?.typ || ''))
    .map((item, idx) => ({
      id: item?.bid || item?.cdid || item?.id || `extra-${idx}`,
      name: item?.cdnm || item?.nm || item?.name || item?.typD || item?.text || 'Extra Service',
      isIncluded: item?.isInc !== false,
    }));
}


function getCustomInclusionType(item: any): 'visa' | 'insurance' | 'other' {
  const type = item?.typ?.toUpperCase() || '';
  const name = (item?.name || item?.nm || item?.cdnm || '').toLowerCase();
  
  
  if (type.includes('VISA')) return 'visa';
  if (type.includes('INSURANCE') || type === 'TRAVEL_INSURANCE') return 'insurance';
  
 
  if (name.includes('visa')) return 'visa';
  if (name.includes('insurance')) return 'insurance';
  
  return 'other';
}


const VisaInsuranceContainer: React.FC<VisaInsuranceContainerProps> = ({
  journeyData,
}) => {
  const {colors} = useTheme();

  const visaArray = journeyData?.visa && journeyData.visa.length > 0 
    ? journeyData.visa 
    : [];

  // Debug: log the visa array to check data
  console.log('VisaInsuranceContainer visaArray:', visaArray);
  
  const insuranceArray = journeyData?.insurance && journeyData.insurance.length > 0
    ? journeyData.insurance
    : [];
  
  const gBlkA = journeyData?.gBlkA && journeyData.gBlkA.length > 0
    ? journeyData.gBlkA
    : [];

  const hasVisa = visaArray.length > 0;
  const hasInsurance = insuranceArray.length > 0;
  
  const customInclusions = gBlkA.filter(item => {
    if (item.typ === 'STAY_EXTRA_SERVICE') return false;
    if (item.typ === 'TRAVEL_INSURANCE' && item.cdid) return false;
    return true;
  });
  
  const hasCustomInclusions = customInclusions.length > 0;
  const extras = getExtrasFromGBlkA(gBlkA);
  const hasExtras = extras.length > 0;

  const shouldShowContainer = hasVisa || hasInsurance || hasCustomInclusions || hasExtras;

  if (!shouldShowContainer) return null;

 
  const headerParts = [];
  if (hasVisa) headerParts.push('Visa');
  if (hasInsurance) headerParts.push('Insurance');
 
  if (hasExtras) headerParts.push('Extras');

  return (
    <ScrollView
      style={[styles.scrollView, {backgroundColor: colors.white}]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
       
        <View style={styles.othersHeader}>
          <CustomText variant="text-lg-semibold" color="neutral900">
            Others
          </CustomText>
          {headerParts.length > 0 && (
            <CustomText variant="text-sm-normal"
            color="neutral700">
              {headerParts.join(', ')}
            </CustomText>
          )}
        </View>

      
        {hasVisa && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IdCard size={16} color={colors.sky800} />
              <CustomText variant="text-sm-medium" color="sky800">
                VISA
              </CustomText>
            </View>
            {visaArray.map((item: any, _index: number) => (
              <View key={item?.name || `visa-${_index}`}>
                <VisaCardWrapper
                  visa={item}
                  jid={journeyData?.id || journeyData?.jid}
                />
              </View>
            ))}
          </View>
        )}

     
        {hasInsurance && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={18} color={colors.sky800} />
              <CustomText variant="text-sm-medium" color="sky800">
                INSURANCE
              </CustomText>
            </View>
            {insuranceArray.map((item: any, _index: number) => (
              <View key={item?.name || `ins-${_index}`}>
                <InsuranceCardWrapper
                  insurance={item}
                  jid={journeyData?.id || journeyData?.jid}
                />
              </View>
            ))}
          </View>
        )}

        {/* CUSTOM INCLUSIONS - Dynamic Icons */}
         {hasCustomInclusions && (
          <View style={styles.section}>
            {customInclusions.map((item, index) => {
              const inclusionType = getCustomInclusionType(item);
              
              return (
                <View key={`global-custom-inclusion-${index}`} style={styles.customInclusionItem}>
                
                  <View style={styles.sectionHeader}>
                    {inclusionType === 'visa' && (
                      <>
                        <IdCard size={16} color={colors.sky800} />
                        <CustomText variant="text-sm-medium" color="sky800">
                          VISA
                        </CustomText>
                      </>
                    )}
                    {inclusionType === 'insurance' && (
                      <>
                        <Shield size={16} color={colors.sky800} />
                        <CustomText variant="text-sm-medium" color="sky800">
                          INSURANCE
                        </CustomText>
                      </>
                    )}
                    {inclusionType === 'other' && (
                      <>
                        <Box size={16} color={colors.sky800} />
                        <CustomText variant="text-sm-medium" color="sky800">
                          CUSTOM INCLUSION
                        </CustomText>
                      </>
                    )}
                  </View>
                  
                  <CustomInclusionCard
                    data={item}
                    jid={journeyData?.id || journeyData?.jid}
                  />
                </View>
              );
            })}
          </View>
        )}

      
        {hasExtras && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Box size={16} color={colors.sky800} />
              <CustomText variant="text-sm-medium" color="sky800">
                EXTRAS
              </CustomText>
            </View>
            <JourneyExtrasCard
              location={journeyData?.destNm || undefined}
              extras={extras}
              onAddExtras={extras.length > 0 ? () => console.log('Add extras') : undefined}
              onDeleteExtra={extras.length > 0 ? (id) => console.log('Delete:', id) : undefined}
            />
          </View>
        )} 
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {},
  container: {width: '100%', paddingHorizontal: 16, paddingVertical: 20},
  othersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  section: {marginBottom: 24},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  customInclusionItem: {
    marginBottom: 16,
  },
});

export default VisaInsuranceContainer; 