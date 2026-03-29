import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';

import {Trash2, ChevronDown, Plus} from 'lucide-react-native';
import {useTheme} from '../../../context/ThemeContext';
import {CustomText} from '../../../common/components';
import {BlkA, ContentCardQueryType, ContentCardType} from '../../types/journey';
import {useAppDispatch} from '../../../store';
import {
  fetchGuidedTourDetails,
  setFdOpen,
  setLayoutsetting,
  setSelectedTourId,
} from '../../../guidedTour/redux/guidedTourSlice';
import {
  setDetailsHotel,
  setHotelAlternativesOpen,
  setPaxD,
  setViewDetailsOnly,
  setLayoutsetting as setHotelLayoutSetting,
} from '../../../hotels/redux/hotelSlice';
import {
  contentOptionDetails,
  openContentCardSlider,
} from '../../../contentCard/redux/contentCardSlice';
import {openFlightSlider} from '../../../flights/redux/flightSlice';
import Actions from './Actions';
import {Colors} from '../../../styles';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {JourneyStackParamList} from '../../../navigators/types';
import {BlockValidationBanner, BlockValidation} from './BlockValidationBanner';

interface ActionFooterProps {
  inclusion: BlkA;
  date: string;
  dayNum: number;
}

const ActionFooter: React.FC<ActionFooterProps> = ({
  inclusion,
  date,
  dayNum,
}) => {
  const {colors} = useTheme();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<JourneyStackParamList>>();

  const [inclusionStatus, setInclusionStatus] = useState<
    'included' | 'not-included'
  >('not-included');

  useEffect(() => {
    // Check for REMOVE action (means included - can only remove what exists)
    const hasRemoveAction = inclusion?.actions?.some(action => {
      return action.type === 'REMOVE';
    });
    setInclusionStatus(hasRemoveAction ? 'included' : 'not-included');
  }, [inclusion?.actions]);

  // Determine if "View Details" should be shown
  const shouldShowViewDetails = useMemo(() => {
    const blockType = inclusion?.typ;

    // For FLIGHT blocks, also check if fltO is present (flights are actually added)
    if (blockType === 'FLIGHT') {
      return inclusionStatus === 'included' && !!inclusion?.fltO;
    }
    // Show for: FLIGHT, HOTEL_ROOM, FIXED_PACKAGE, and activity blocks (SIGHTSEEING, TRANSFERS, etc.)
    return (
      inclusionStatus === 'included' &&
      !inclusion?.isSelfBookedTour &&
      (blockType === 'HOTEL_ROOM' ||
        blockType === 'FIXED_PACKAGE' ||
        blockType === 'SIGHTSEEING')
    );
  }, [
    inclusion?.fltO,
    inclusion?.isSelfBookedTour,
    inclusion?.typ,
    inclusionStatus,
  ]);

  // Handle "View Details" click
  const handleViewDetails = () => {
    const blockType = inclusion?.typ;

    if (blockType === 'FIXED_PACKAGE' || blockType === 'GROUP_TOUR') {
      // For FD blocks, open GuidedTourSidebar and fetch details if we have package ID
      dispatch(setFdOpen(true));
      dispatch(setLayoutsetting('details'));

      // If inclusion has a package ID (check prid or other fields), fetch details
      const pkgId = (inclusion as any)?.pkgId;

      if (pkgId) {
        // Convert to number for selectedTourId and string for API
        const numericId =
          typeof pkgId === 'number' ? pkgId : parseInt(String(pkgId), 10);

        if (!isNaN(numericId) && numericId > 0) {
          dispatch(setSelectedTourId(numericId));
          dispatch(
            fetchGuidedTourDetails({
              pkgId: String(numericId),
              blockId: (inclusion as any)?.bid || '',
              exactDateMatch: !!(inclusion as any)?.bid, // Enable exact date match if replacing self-booked tour
            }),
          );
        }
      }
    } else if (blockType === 'HOTEL_ROOM') {
      // Open hotel details side panel
      if (inclusion?.url) {
        // Extract hotel slug from URL (format: /hotels/d/{hotel-slug})
        const urlMatch = inclusion.url.match(/\/hotels\/d\/([^/?]+)/);
        if (urlMatch && urlMatch[1]) {
          const hotelPath = `/hotels/d/${urlMatch[1]}`;
          console.log('hotel dets ----->', hotelPath);
          dispatch(setDetailsHotel(hotelPath));
          dispatch(setHotelLayoutSetting('details'));
          dispatch(setHotelAlternativesOpen(true));
          dispatch(setViewDetailsOnly(true));
          dispatch(setPaxD(inclusion?.paxD || ''));
        }
        navigation.navigate('HotelDetail');
      }
    } else if (blockType === 'SIGHTSEEING') {
      // Open activity details side panel
      if (inclusion?.cdid) {
        const contentType = ContentCardType.SIGHTSEEING;
        dispatch(
          openContentCardSlider({
            open: true,
            query: {
              qt: ContentCardQueryType.OPTION_DETAIL,
              type: contentType,
              blockId: inclusion?.bid || null,
              onDate: date || null,
              tvlG: inclusion?.tvlG || null,
            },
            skipDetailCall: false,
          }),
        );
        dispatch(contentOptionDetails({id: inclusion.cdid}) as any);
      }
    } else if (blockType === 'FLIGHT') {
      // Open flight details sidebar
      dispatch(
        openFlightSlider({
          open: true,
          flow: 'FLIGHT_DETAILS',
          flightDetailsData: inclusion,
          query: {
            type: ContentCardType.FLIGHT,
            srchO: inclusion?.fSrchO || null,
            blockId: inclusion?.bid || null,
            onDate: date || null,
            tvlG: inclusion?.tvlG || null,
          },
        } as any),
      );
    }
  };

  const removeinclusion = useMemo(() => {
    const removeAction = inclusion?.actions?.find(
      action => action.type === 'REMOVE',
    );
    return removeAction;
  }, [inclusion?.actions]);

  const addInclusion = useMemo(() => {
    if (inclusionStatus === 'not-included') {
      const addAction = inclusion?.actions?.find(action => {
        return (
          (action.type === 'UPDATE' || action.type === 'ADD') &&
          (action.ctype === 'FLIGHT' || action.ctype === 'HOTEL_ROOM')
        );
      });
      return addAction;
    }
    return null;
  }, [inclusion?.actions, inclusionStatus]);

  const otherInclusions = useMemo(() => {
    return inclusion?.actions?.filter(action => {
      // Filter out remove action if included, or add/update actions if not included
      if (
        (inclusionStatus === 'included' && action.type === 'REMOVE') ||
        (inclusionStatus === 'not-included' &&
          (action.type === 'UPDATE' || action.type === 'ADD') &&
          (action.ctype === 'FLIGHT' || action.ctype === 'HOTEL_ROOM'))
      ) {
        return false;
      }

      // Filter out EARLY_CHECKIN_OPTIONS and LATE_CHECKOUT_OPTIONS for FLIGHT blocks
      if (
        inclusion?.typ === 'FLIGHT' &&
        (action.type === 'EARLY_CHECKIN_OPTIONS' ||
          action.type === 'LATE_CHECKOUT_OPTIONS')
      ) {
        return false;
      }

      // Filter out EARLY_CHECKIN_OPTIONS and LATE_CHECKOUT_OPTIONS for self-booked transport
      // (train, bus, flight - since they are already displayed in the UI)
      if (
        inclusion?.typ === 'TRANSPORT' &&
        inclusion?.uTxptO &&
        (action.type === 'EARLY_CHECKIN_OPTIONS' ||
          action.type === 'LATE_CHECKOUT_OPTIONS')
      ) {
        return false;
      }

      return true;
    });
  }, [inclusion?.actions, inclusion?.typ, inclusionStatus]);

  // Get day-level validations (collect all block validations) grouped by severity
  const groupedValidations = useMemo(() => {
    const errors: any[] = [];
    const warnings: any[] = [];
    const infos: any[] = [];

    if (inclusion.vldA && inclusion.vldA.length > 0) {
      inclusion.vldA.forEach((vld: any) => {
        if (vld.sev === 'ERROR') {
          errors.push(vld);
        } else if (vld.sev === 'WARN') {
          warnings.push(vld);
        } else if (vld.sev === 'INFO') {
          infos.push(vld);
        }
      });
    }

    return {errors, warnings, infos};
  }, [inclusion?.vldA]);

  const hasValidations =
    groupedValidations.errors.length > 0 ||
    groupedValidations.warnings.length > 0 ||
    groupedValidations.infos.length > 0;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: 14,
        },
      ]}>
      {/* Validation Banners */}
      {hasValidations && (
        <View style={styles.validationsContainer}>
          {/* Errors Group */}
          {groupedValidations.errors.length > 0 && (
            <View style={styles.validationGroup}>
              {groupedValidations.errors.map(
                (validation: BlockValidation, index: number) => (
                  <BlockValidationBanner
                    key={`error-${validation.id || index}`}
                    validation={validation}
                    date={date}
                    blockId={inclusion.bid}
                  />
                ),
              )}
            </View>
          )}

          {/* Warnings Group */}
          {groupedValidations.warnings.length > 0 && (
            <View style={styles.validationGroup}>
              {groupedValidations.warnings.map(
                (validation: BlockValidation, index: number) => (
                  <BlockValidationBanner
                    key={`warning-${validation.id || index}`}
                    validation={validation}
                    date={date}
                    blockId={inclusion.bid}
                  />
                ),
              )}
            </View>
          )}

          {/* Info Group */}
          {groupedValidations.infos.length > 0 && (
            <View style={styles.validationGroup}>
              {groupedValidations.infos.map(
                (validation: BlockValidation, index: number) => (
                  <BlockValidationBanner
                    key={`info-${validation.id || index}`}
                    validation={validation}
                    date={date}
                    blockId={inclusion.bid}
                  />
                ),
              )}
            </View>
          )}
        </View>
      )}

      {shouldShowViewDetails ? (
        <TouchableOpacity
          style={[
            styles.seeDetailsButton,
            {
              backgroundColor: colors.neutral100,
              borderColor: colors.neutral200,
            },
          ]}
          onPress={handleViewDetails}
          activeOpacity={0.6}>
          <CustomText variant="text-sm-medium" color="neutral900">
            See Details
          </CustomText>
        </TouchableOpacity>
      ) : null}

      <View style={styles.actionsContainer}>
        {/* Other Actions */}
        {otherInclusions && otherInclusions.length > 0 && (
          <Actions
            date={date}
            actions={otherInclusions}
            blockId={inclusion.bid}
            sid={null}
            grpName="Other options"
            onCloseBottomSheet={() => null}
            rightIcon={<ChevronDown size={16} color={colors.neutral900} />}
            btnStyle={styles.otherActionsButton}
            dayNum={dayNum}
          />
        )}
        <View style={{width: '48%'}}>
          {/* Add Inclusion */}
          {addInclusion && (
            <Actions
              date={date}
              actions={[addInclusion]}
              blockId={inclusion.bid}
              leftIcon={<Plus size={16} color="white" />}
              sid={null}
              btnStyle={styles.addButton}
              textColor="white"
              dayNum={dayNum}
            />
          )}

          {/* Remove Inclusion */}
          {removeinclusion && (
            <Actions
              date={date}
              actions={[removeinclusion]}
              blockId={inclusion.bid}
              sid={null}
              leftIcon={<Trash2 size={16} color={colors.red600} />}
              btnStyle={styles.removeButton}
              textColor="red600"
              dayNum={dayNum}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  seeDetailsButton: {
    width: '100%',
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightThemeColors.neutral100,
    borderColor: Colors.lightThemeColors.neutral200,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  otherActionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 6,
    borderWidth: 1,
    height: 40,
    width: '48%',
    paddingVertical: 6,
    backgroundColor: Colors.lightThemeColors.white,
    borderColor: Colors.lightThemeColors.neutral200,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
    borderRadius: 6,
    borderWidth: 0,
    backgroundColor: Colors.lightThemeColors.neutral900,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 6,
    borderWidth: 1,
    height: 40,
    width: '100%',
    paddingVertical: 6,
    backgroundColor: Colors.lightThemeColors.white,
    borderColor: Colors.lightThemeColors.neutral200,
  },
  removeButtonText: {
    color: Colors.lightThemeColors.red600,
    fontSize: 14,
    fontWeight: '500',
  },
  validationsContainer: {
    marginTop: 16,
    marginBottom: 16,
    gap: 16,
  },
  validationGroup: {
    gap: 12,
  },
});

export default ActionFooter;
