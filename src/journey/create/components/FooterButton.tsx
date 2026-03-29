import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useTheme} from '../../../context/ThemeContext';
import {CustomText} from '../../../common/components';
import {
  ClientDetailSection,
  CustomerDetailSection,
  Destination,
  TravelerDetailSection,
  TravelerSelection,
} from '..';
import {Colors, Shadows, Typography} from '../../../styles';
import {useDispatch} from 'react-redux';
import {createJourney} from '../redux/customTripSlice';
import SecureStorageUtil from '../../../utils/SecureStorageUtil';
import {setJourneyId, setJourneyJdid} from '../../redux/journeySlice';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {JourneyStackParamList} from '../../../navigators/types';

type FooterButtonProps = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  travelerSelection: TravelerSelection;
  destinations: Destination[];
  tripDetails: TravelerDetailSection;
  onClose: () => void;
  setShowError: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
  clientDetails: ClientDetailSection;
  setClientDetailsData: React.Dispatch<any>;
  isFdFlow: boolean;
  customerDetails: CustomerDetailSection;
  setShowMessage: React.Dispatch<React.SetStateAction<string>>;
  setMissingFields: React.Dispatch<any>;
  isEditMode: boolean;
  isCopyMode: boolean;
  isAgentRqd: boolean;
  skpTrvlrPref: boolean;
  routeProps: Readonly<{
    leadId?: number | null;
    pkgId?: number | null;
    travelDate?: string | null;
    excity?: any;
  }>;
  navigation: NativeStackNavigationProp<
    JourneyStackParamList,
    'JourneyCreation',
    undefined
  >;
};

const FooterButton = ({
  currentStep,
  setCurrentStep,
  travelerSelection,
  destinations,
  tripDetails,
  onClose,
  setShowError,
  isLoading = false,
  clientDetails,
  setClientDetailsData,
  isFdFlow,
  customerDetails,
  setShowMessage,
  setMissingFields,
  isEditMode,
  isCopyMode,
  isAgentRqd,
  skpTrvlrPref,
  routeProps,
  navigation,
}: FooterButtonProps) => {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const [isNavigating, setIsNavigating] = useState(false);

  const totalSteps = 2;

  // Get auth token
  const authToken = async () => {
    const authToken = await SecureStorageUtil.getSecretKey('authToken');
    if (authToken) {
      return authToken;
    } else {
      return '';
    }
  };

  function formatToApiDate(dateStr: string): string {
    // Expects input like "21 Nov 2025" or "2025-01-11"
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    // Format as yyyy-mm-dd in local time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Calculate progress percentage
  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Trip Details';
      case 2:
        return 'Client info';
      default:
        return 'Step';
    }
  };

  // Get button text
  const getButtonText = () => {
    const shouldSkipStep2 = skpTrvlrPref && isEditMode;
    if (currentStep === totalSteps || (currentStep === 1 && shouldSkipStep2)) {
      return 'Create Journey';
    }
    return 'Next Step';
  };

  // Get back button text
  const getBackButtonText = () => {
    return 'Back';
  };

  const handleClose = () => {
    // Reset step to initial state when canceling
    setCurrentStep(1);
    if (onClose) {
      onClose();
    }
  };

  const selectedPax = {
    rooms: travelerSelection.rooms.map(room => ({
      ad: room.adults,
      ch: room.children.length,
      chAge: room.children.map(child => {
        if (typeof child.age === 'string') {
          const match = child.age.match(/(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        }
        return child.age;
      }),
    })),
  };
  console.log('routeProps.leadId', routeProps);

  // Map TripDetailsInfo state for FD flow to API payload
  const buildTravelDetailsPayloadForFdFlow = () => {
    const payload: any = {
      step: 'TRAVEL_DETAILS',
      pkgId: routeProps.pkgId || null,
      // leadId: routeProps.leadId || null,
      travelDate: isFdFlow
        ? tripDetails.leavingOn // Already in correct format for FD flow
        : formatToApiDate(tripDetails.leavingOn),
      exCityId: tripDetails.leavingFromFdFlow,
      uid: tripDetails.agent.data?.uid || 0,
      paxData: selectedPax,
    };
    if (isEditMode) {
      // payload.jid = journeyId || '';
      payload.mode = 'EDIT';
    }
    return payload;
  };

  // Map TripDetailsInfo state to API payload
  const buildTravelDetailsPayload = () => {
    const payload: any = {
      step: 'TRAVEL_DETAILS',
      travelDate: formatToApiDate(tripDetails.leavingOn),
      // leadId: routeProps.leadId || null,
      pkgId: routeProps.pkgId || null,
      // excity,
      exCityId: tripDetails.leavingFrom?.cityName?.data?.id,
      ntnDestId: tripDetails.nationality,
      uid: tripDetails.agent.data?.uid || 0,
      cities: isEditMode
        ? destinations.map(dest => {
            // If id contains underscore (e.g., '34_t74'), use the full id as c value (as string)
            if (dest.id && dest.id.includes('_')) {
              return {
                c: dest.id, // Use full id like '34_t74' as c value (string)
                n: dest.nights,
                cky: dest.cky,
              };
            }

            // If cityName.data.id is 0, try to extract city ID from cky (format: "cityId-index")
            let cityId: any = dest.cityName?.data?.id;
            if (!cityId && dest.cky) {
              const ckyMatch = dest.cky.match(/^(\d+)-/);
              if (ckyMatch) {
                cityId = Number(ckyMatch[1]);
              }
            }
            return {
              c: String(cityId), // Convert to string
              n: dest.nights,
              cky: dest.cky,
            };
          })
        : destinations.map(dest => {
            // If id contains underscore (e.g., '34_t74'), use the full id as c value (as string)
            if (dest.id && dest.id.includes('_')) {
              return {
                c: dest.id, // Use full id like '34_t74' as c value (string)
                n: dest.nights,
              };
            }

            // If cityName.data.id is 0, try to extract city ID from cky (format: "cityId-index")
            let cityId: any = dest.cityName?.data?.id;
            if (!cityId && dest.cky) {
              const ckyMatch = dest.cky.match(/^(\d+)-/);
              if (ckyMatch) {
                cityId = Number(ckyMatch[1]);
              }
            }
            return {
              c: String(cityId), // Convert to string
              n: dest.nights,
            };
          }),
      paxData: selectedPax,
      tripStage: tripDetails.tripStage,
      tvlPref: {
        starRating: tripDetails.starRating,
        addTours: tripDetails.addTours,
        addTxfrs: tripDetails.addTxfrs,
      },
    };
    if (isEditMode) {
      // payload.jid = journeyId || '';
      payload.mode = 'EDIT';
    }
    return payload;
  };

  const buildClientDetailsPayload = () => {
    const payload: any = {
      step: 'FINALIZE',
      pkgId: routeProps.pkgId || null,
      // excity,
      leadId: routeProps.leadId ? routeProps.leadId : clientDetails.leadId,
      travelers:
        clientDetails.travelers.length > 0 ? clientDetails.travelers : [],
      travelDate: isFdFlow
        ? clientDetails.leavingOn
        : formatToApiDate(tripDetails.leavingOn),
      exCityId: tripDetails.leavingFrom?.cityName?.data?.id,
      ntnDestId: tripDetails.nationality,
      uid: tripDetails.agent.data?.uid || 0,
      cities: isEditMode
        ? destinations.map(dest => ({
            c: dest.cityName?.data?.id || '',
            n: dest.nights,
            cky: dest.cky,
          }))
        : destinations.map(dest => ({
            c: dest.cityName?.data?.id || '',
            n: dest.nights,
          })),
      paxData: selectedPax,
      tvlPref: {
        starRating: tripDetails.starRating,
        addTours: tripDetails.addTours,
        addTxfrs: tripDetails.addTxfrs,
      },
      custName: customerDetails.custName || null,
      custEmail: customerDetails.custEmail || null,
      custMobile: customerDetails.custMobile || null,
    };
    if (isEditMode) {
      // payload.jid = journeyId || '';
      payload.mode = 'EDIT';
    }
    return payload;
  };

  // Check if we should skip step 2 and go directly to finalize
  const shouldSkipStep2 = skpTrvlrPref && isEditMode;

  // Handle next step
  const handleNext = async () => {
    if (isLoading || isNavigating) return; // Prevent action if loading

    // If skipping step 2, treat step 1 as final step
    if (currentStep === 1 && shouldSkipStep2) {
      // Validate step 1 fields first
      let missing: any = {};
      if (isFdFlow) {
        missing = {
          rooms: travelerSelection.rooms.length === 0,
          // agent: isAgentRqd ? !tripDetails.agent.data?.uid : false,
          agent: false,
          leavingFromFdFlow: !tripDetails.leavingFromFdFlow,
        };
      } else {
        // Per-destination validation
        const destinationsError = destinations.map(dest => {
          // If id contains underscore (e.g., '34_t74'), it's valid (we use the full id)
          // Otherwise, check if cityName.data.id exists and is not 0
          const hasValidCity =
            (dest.id && dest.id.includes('_')) ||
            (dest.cityName?.data?.id && dest.cityName.data.id !== 0);
          return {
            city: !hasValidCity,
            nights: !dest.nights || dest.nights < 1,
          };
        });
        missing = {
          leavingFrom: !tripDetails.leavingFrom?.cityName?.data?.id,
          nationality: !tripDetails.nationality,
          leavingOn: !tripDetails.leavingOn,
          rooms: travelerSelection.rooms.length === 0,
          destinations: destinations.length === 0,
          ...(isEditMode
            ? {}
            : // : {agent: isAgentRqd ? !tripDetails.agent.data?.uid : false}),
              {agent: false}),

          destinationsError,
        };
      }
      setMissingFields(missing);
      // Check for any error in main fields or in any destination
      const hasError = Object.values(missing).some(val =>
        Array.isArray(val)
          ? val.some((err: any) => Object.values(err).some(Boolean))
          : Boolean(val),
      );
      if (hasError) {
        setShowError(true);
        return;
      }
      setShowError(false);

      // Directly call finalize API from step 1
      setIsNavigating(true);
      try {
        // Build finalize payload
        const finalizePayload = buildClientDetailsPayload();
        const data = {
          data: JSON.stringify(finalizePayload),
          _auth: await authToken(),
        };
        const result = await dispatch(createJourney(data) as any);
        const payload = result?.payload || result;

        if (!payload.success) {
          setIsNavigating(false);
          setShowError(true);
          setShowMessage(
            payload.error_msg ||
              'An error occurred while creating the journey.',
          );
        } else {
          setIsNavigating(false);
          await dispatch(setJourneyId(payload?._data?.jid));
          if (payload?._data?.jdid) {
            await dispatch(setJourneyJdid(payload?._data?.jdid));
          }
          // Reset navigation stack to clear JourneyCreation history
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'JourneyDetails',
                params: {journeyId: payload?._data?.jid},
              },
            ],
          });
          handleClose(); // Close modal on success
        }
      } catch (error) {
        setIsNavigating(false);
        setShowError(true);
        setShowMessage('An error occurred while creating the journey.');
      }
      return;
    }

    if (currentStep === 1) {
      let missing: any = {};
      if (isFdFlow) {
        missing = {
          rooms: travelerSelection.rooms.length === 0,
          // agent: isAgentRqd ? !tripDetails.agent.data?.uid : false,
          agent: false,
          leavingFromFdFlow: !tripDetails.leavingFromFdFlow,
        };
      } else {
        // Per-destination validation
        const destinationsError = destinations.map(dest => {
          // If id contains underscore (e.g., '34_t74'), it's valid (we use the full id)
          // Otherwise, check if cityName.data.id exists and is not 0
          const hasValidCity =
            (dest.id && dest.id.includes('_')) ||
            (dest.cityName?.data?.id && dest.cityName.data.id !== 0);
          return {
            city: !hasValidCity,
            nights: !dest.nights || dest.nights < 1,
          };
        });
        missing = {
          leavingFrom: !tripDetails.leavingFrom?.cityName?.data?.id,
          nationality: !tripDetails.nationality,
          leavingOn: !tripDetails.leavingOn,
          rooms: travelerSelection.rooms.length === 0,
          destinations: destinations.length === 0,
          ...(isEditMode
            ? {}
            : // : {agent: isAgentRqd ? !tripDetails.agent.data?.uid : false}),
              {agent: false}),

          destinationsError,
        };
      }
      setMissingFields(missing);
      // Check for any error in main fields or in any destination
      const hasError = Object.values(missing).some(val =>
        Array.isArray(val)
          ? val.some((err: any) => Object.values(err).some(Boolean))
          : Boolean(val),
      );
      if (hasError) {
        setShowError(true);
        return;
      } else {
        setShowError(false);

        // Call appropriate API based on flow type
        if (!isFdFlow) {
          try {
            const travelDetailsPayload = buildTravelDetailsPayload();
            const data = {
              data: JSON.stringify(travelDetailsPayload),
              _auth: await authToken(),
            };
            const result = await dispatch(createJourney(data) as any);
            const payload = result?.payload || result;

            if (!payload.success) {
              setShowError(true);
              setShowMessage(
                payload.error_msg ||
                  'An error occurred while creating the journey.',
              );
            } else {
              if (
                payload &&
                payload._data &&
                Array.isArray(payload._data.ldA)
              ) {
                setClientDetailsData(payload);
                setCurrentStep(currentStep + 1);
              } else if (
                payload &&
                payload._data &&
                payload._data.jid &&
                isEditMode
              ) {
                setClientDetailsData(payload);
                setCurrentStep(currentStep + 1);
              }
            }
          } catch (error) {
            setShowError(true);
            setShowMessage('An error occurred while processing your request.');
          }
        } else {
          try {
            const fdFlowPayload = buildTravelDetailsPayloadForFdFlow();
            const data = {
              data: JSON.stringify(fdFlowPayload),
              _auth: await authToken(),
            };
            const result = await dispatch(createJourney(data) as any);
            const payload = result?.payload || result;

            if (!payload.success) {
              setShowError(true);
              setShowMessage(
                payload.error_msg ||
                  'An error occurred while creating the journey.',
              );
            } else {
              if (
                payload &&
                payload._data &&
                payload._data.pkgAvailO.dtA.length > 0 &&
                isFdFlow
              ) {
                setClientDetailsData(payload);
                setCurrentStep(currentStep + 1);
              } else if (
                payload &&
                payload._data &&
                payload._data.jid &&
                isEditMode
              ) {
                setClientDetailsData(payload);
                setCurrentStep(currentStep + 1);
              }
            }
          } catch (error) {
            setShowError(true);
            setShowMessage('An error occurred while processing your request.');
          }
        }
      }
    } else if (currentStep === 2) {
      // Send client details payload
      setIsNavigating(true);
      try {
        const clientPayload = buildClientDetailsPayload();
        const data = {
          data: JSON.stringify(clientPayload),
          _auth: await authToken(),
        };
        const result = await dispatch(createJourney(data) as any);
        const payload = result?.payload || result;

        if (!payload.success) {
          setIsNavigating(false);
          setShowError(true);
          setShowMessage(
            payload.error_msg ||
              'An error occurred while creating the journey.',
          );
        } else {
          if (isEditMode && payload._data?.jurl && payload?._data?.jid) {
            // For edit mode, you might want to update journey state here
            setIsNavigating(false);
            handleClose(); // Close modal on success
          } else if (payload._data?.jurl && payload?._data?.jid) {
            await dispatch(setJourneyId(payload?._data?.jid));
            if (payload?._data?.jdid) {
              await dispatch(setJourneyJdid(payload?._data?.jdid));
            }
            Alert.alert('Success', 'Journey created successfully!');
            // Reset navigation stack to clear JourneyCreation history
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'JourneyDetails',
                  params: {journeyId: payload?._data?.jid},
                },
              ],
            });
            // For create mode, you might want to navigate to the journey
            setIsNavigating(false);
            handleClose(); // Close modal on success
          } else {
            setIsNavigating(false);
            handleClose(); // Close modal on success
          }
        }
      } catch (error) {
        setIsNavigating(false);
        setShowError(true);
        setShowMessage('An error occurred while creating the journey.');
      }
    }
  };

  // Handle back step
  const handleBack = () => {
    if (isLoading || isNavigating) return; // Prevent action if loading

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  return (
    <View>
      {/* Progress Bar */}
      <View
        style={[
          styles.progressBarContainer,
          {backgroundColor: colors.neutral100},
        ]}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: colors.neutral900,
              width: `${getProgressPercentage()}%`,
            },
          ]}
        />
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.stepInfo}>
          <CustomText variant="text-base-medium" color="neutral900">
            {getStepTitle()}
          </CustomText>
          <CustomText
            variant="text-sm-regular"
            color="neutral600"
            style={{paddingTop: 2}}>
            <CustomText color="neutral900" variant="text-sm-semibold">
              Step {currentStep}
            </CustomText>{' '}
            of {totalSteps}
          </CustomText>
        </View>
        <View style={styles.buttonContainer}>
          {isEditMode || isCopyMode ? (
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  borderColor: colors.neutral300,
                  backgroundColor: colors.white,
                },
              ]}
              onPress={handleClose}
              disabled={isLoading || isNavigating}>
              <CustomText variant="text-sm-medium" color="neutral700">
                Cancel
              </CustomText>
            </TouchableOpacity>
          ) : null}

          {currentStep > 1 && (
            <TouchableOpacity
              style={[styles.backButton, {borderColor: colors.neutral300}]}
              onPress={handleBack}
              disabled={isLoading || isNavigating}>
              <CustomText variant="text-sm-medium" color="neutral700">
                {getBackButtonText()}
              </CustomText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor:
                  isLoading || isNavigating
                    ? colors.neutral500
                    : colors.neutral900,
              },
            ]}
            onPress={handleNext}
            disabled={isLoading || isNavigating}>
            {isLoading || isNavigating ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator
                  size="small"
                  color={colors.white}
                  style={{marginRight: 8}}
                />
                <CustomText variant="text-sm-medium" color="white">
                  {isNavigating ? 'Processing...' : 'Loading...'}
                </CustomText>
              </View>
            ) : (
              <CustomText variant="text-sm-medium" color="white">
                {getButtonText()}
              </CustomText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FooterButton;

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: Colors.lightThemeColors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightThemeColors.neutral200,
    ...Typography.flex.rowJustifyBetweenItemCenter,
    padding: 16,
  },
  progressHeader: {
    padding: 20,
    paddingBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  stepInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingTop: 0,
    gap: 12,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: 'white',
    borderWidth: 1,
    ...Shadows.shadows['shadow-xs'],
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: 'white',
    borderWidth: 1,
    ...Shadows.shadows['shadow-xs'],
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  fullWidthButton: {
    flex: 1,
  },
  halfWidthButton: {
    flex: 1,
  },
});
