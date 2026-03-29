import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Platform} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {JourneyStackParamList} from '../../navigators/types';
import {Colors, Typography} from '../../styles';
import {CustomText} from '../../common/components';
import FooterButton from './components/FooterButton';
import {useDispatch} from 'react-redux';
import {createJourney, setJourneyModalOpen} from './redux/customTripSlice';
import {useJourneyCreation} from './hooks/useJourneyCreation';
import SecureStorageUtil from '../../utils/SecureStorageUtil';
import TripDetailsInfo from './components/TripDetailsInfo';
import ClientInfo from './components/ClientInfo';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {ArrowLeft, CircleX} from 'lucide-react-native';
import {useTheme} from '../../context/ThemeContext';
import User from '../../data/User';

export interface Destination {
  id: string;
  cky?: string;
  cityName: {
    value: string;
    data: {
      rnm: string;
      id: number;
      nm: string;
    };
  };
  nights: number;
  isEdit?: boolean;
  fdPkgId?: number;
  fdPkgNm?: string;
  dTyp?: string;
}
export interface Child {
  id: string;
  age: string;
}

export interface Room {
  id: string;
  adults: number;
  children: Child[];
}

export interface TravelerSelection {
  rooms: Room[];
  totalDisplay: string;
}
export interface ClientDetailSection {
  leadId: number | null;
  travelers: {
    paxIndex: number;
    customerId: number | string;
    name: string;
    age: number | null;
    exCityId: number;
    returnCityId: number;
    travelDate: string;
    returnDate: string;
    transportCategory: string;
  }[];
  leavingOn: string | null;
}
export interface TravelerDetailSection {
  leavingFrom: {
    id: string;
    cityName: {
      value: string;
      data: {
        rnm: string;
        id: number;
        nm: string;
      };
    };
  };
  nationality: string;
  leavingFromFdFlow: string;
  leavingOn: string;
  starRating: string;
  addTransfers: boolean;
  landOnly: boolean;
  travelerType: string;
  purpose: string;
  tripStage: string;
  agent: {
    value: string;
    data: {
      bnm: string;
      id: number;
      nm: string;
      rnm: string;
      uid: number;
      unm: string;
    };
  };
  addTours: boolean;
  addTxfrs: boolean;
}

export interface CustomerDetailSection {
  custName: string;
  custEmail: string;
  custMobile: string;
}

type Props = NativeStackScreenProps<JourneyStackParamList, 'JourneyCreation'>;

const JourneyCreationScreen: React.FC<Props> = ({navigation, route}) => {
  const {colors} = useTheme();

  const leadId = route.params?.leadId || null;
  const pkgId = route.params?.pkgId || null;
  const travelDate = route.params?.travelDate || null;
  const excity = route.params?.excity || null;
  const journeyId = route.params?.journeyId || '';

  const [currentStep, setCurrentStep] = useState(1);
  const [showError, setShowError] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>('');
  // Track missing fields for error highlighting and clearing
  const [missingFields, setMissingFields] = useState<any>({});

  const dispatch = useDispatch();

  const handleCloseModal = (): void => {
    dispatch(setJourneyModalOpen({isOpen: false, mode: 'EDIT'}));
  };
  // const isJourneyModal = useSelector(
  //   (state: any) => state.customTrip.journeyModal,
  // );

  // const isEditMode = isJourneyModal?.mode === 'EDIT' ? true : false;
  // const isCopyMode = isJourneyModal?.mode === 'COPY' ? true : false;
  const isEditMode = false;
  const isCopyMode = false;

  // Enhanced: supports clearing nested errors for destinationsError[index].city/nights
  const clearFieldError = (
    field: string,
    index?: number,
    subfield?: string,
  ) => {
    setMissingFields((prev: {[x: string]: any; destinationsError: any}) => {
      // For per-destination errors
      if (
        field === 'destinationsError' &&
        typeof index === 'number' &&
        subfield
      ) {
        const updated = Array.isArray(prev.destinationsError)
          ? [...prev.destinationsError]
          : [];
        if (updated[index] && updated[index][subfield]) {
          updated[index] = {...updated[index], [subfield]: false};
        }
        return {...prev, destinationsError: updated};
      }
      // For top-level fields
      if (prev[field]) {
        return {...prev, [field]: false};
      }
      return prev;
    });
  };

  React.useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
        setShowMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  React.useEffect(() => {
    setCurrentStep(1);
  }, []);

  const {journeyCreateLoading} = useJourneyCreation();

  const [destinations, setDestinations] = useState<Destination[]>([
    {
      id: '1',
      isEdit: true,
      cityName: {
        value: '',
        data: {rnm: '', id: 0, nm: ''},
      },
      nights: 1,
    },
  ]);

  const [travelerSelection, setTravelerSelection] = useState<TravelerSelection>(
    {
      rooms: [{id: '1', adults: 2, children: []}],
      totalDisplay: '1 room, 2 adults',
    },
  );

  const [tripDetails, setTripDetails] = useState({
    leavingFrom: {
      id: '1',
      cityName: {
        value: '',
        data: {rnm: '', id: 0, nm: ''},
      },
    },
    nationality: '',
    leavingFromFdFlow: '',
    leavingOn: '',
    starRating: '',
    addTxfrs: false,
    addTours: false,
    landOnly: false,
    travelerType: '',
    purpose: '',
    tripStage: '',
    agent: {
      value: '',
      data: {
        bnm: '',
        id: 0,
        nm: '',
        rnm: '',
        uid: 0,
        unm: '',
      },
    },
  } as TravelerDetailSection);

  const [clientDetails, setClientDetails] = useState({
    travelers: [
      {
        paxIndex: 0,
        customerId: 0,
        name: '',
        age: null,
        exCityId: 0,
        returnCityId: 0,
        travelDate: '',
        returnDate: '',
        transportCategory: '',
      },
    ],
    leadId: null,
    leavingOn: '',
  } as ClientDetailSection);

  const [customerDetails, setCustomerDetails] = useState({
    custName: '',
    custEmail: '',
    custMobile: '',
  } as CustomerDetailSection);

  const [tripDetailsData, setTripDetailsData] = useState<any>({});
  const [clientDetailsData, setClientDetailsData] = useState<any>({});
  const [isFdFlow, setIsFdFlow] = useState<boolean>(false);

  const initialCheck = async () => {
    try {
      const data = isEditMode
        ? {step: 'INITIALIZE', jid: journeyId ? journeyId : '', mode: 'EDIT'}
        : {
            leadId: leadId,
            pkgId: pkgId,
            travelDate: travelDate,
            excity: excity,
            data: null,
            _auth: await User.getAuthToken(),
          };
      const result = await dispatch(createJourney(data) as any);
      const payload = result?.payload || result;
      if (payload && payload._data) {
        await setTripDetailsData(payload._data);
        await setIsFdFlow(payload._data.isFD);
      }
    } catch (error) {
      console.error('City search failed:', error);
    }
  };

  useEffect(() => {
    const checkAuthAndInitialize = async () => {
      try {
        const authTokenValue = await User.getAuthToken();
        if (authTokenValue) {
          initialCheck();
        }
      } catch (error) {
        console.error('Error checking auth token:', error);
      }
    };

    checkAuthAndInitialize();
  }, []); // Empty dependency array - runs once on mount

  const goBack = async () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      navigation.goBack();
    }
  };

  const renderStepContent = (): React.ReactElement => {
    switch (currentStep) {
      case 1:
        return (
          // step 1: Trip Details
          <TripDetailsInfo
            destinations={destinations}
            tripDetails={tripDetails}
            travelerSelection={travelerSelection}
            setDestinations={setDestinations}
            setTripDetails={setTripDetails}
            setTravelerSelection={setTravelerSelection}
            tripDetailsData={tripDetailsData}
            setTripDetailsData={setTripDetailsData}
            setIsFdFlow={setIsFdFlow}
            isFdFlow={isFdFlow}
            missingFields={missingFields}
            clearFieldError={clearFieldError}
            isEditMode={isEditMode}
            isCopyMode={isCopyMode}
            navigation={navigation}
          />
        );
      case 2:
        return (
          // step 2: Client Info
          <ClientInfo
            tripDetails={tripDetails}
            travelerSelection={travelerSelection}
            setClientDetails={setClientDetails}
            clientDetailsData={clientDetailsData}
            setIsFdFlow={setIsFdFlow}
            isFdFlow={isFdFlow}
            setCustomerDetails={setCustomerDetails}
            customerDetails={customerDetails}
            isEditMode={isEditMode}
            isCopyMode={isCopyMode}
            destinations={destinations}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <BottomSheetModalProvider>
      <View
        style={{
          height: Platform.OS === 'ios' ? 100 : 55,
          width: '100%',
          backgroundColor: colors.neutral900,
          borderColor: colors.neutral900,
        }}>
        <View style={styles.headerContent}>
          <ArrowLeft color={colors.white} size={25} onPress={goBack} />
          <CustomText variant="text-lg-medium" color="white">
            Create Proposal
          </CustomText>
          {/* <Edit color={colors.white} size={25} onPress={() => {}} /> */}
          <View></View>
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1}}>{renderStepContent()}</View>
        </ScrollView>

        {/* Error Toast Message */}
        {showError && (
          <View style={styles.errorToast}>
            <View style={styles.errorToastContent}>
              <CircleX size={20} color={Colors.lightThemeColors.red700} />
              <CustomText
                variant="text-sm-normal"
                color="red700"
                style={styles.errorText}>
                {showMessage || 'Please fill all the required fields'}
              </CustomText>
            </View>
          </View>
        )}

        <FooterButton
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          travelerSelection={travelerSelection}
          destinations={destinations}
          tripDetails={tripDetails}
          onClose={handleCloseModal}
          setShowError={setShowError}
          isLoading={journeyCreateLoading}
          clientDetails={clientDetails}
          setClientDetailsData={setClientDetailsData}
          isFdFlow={isFdFlow}
          customerDetails={customerDetails}
          setShowMessage={setShowMessage}
          setMissingFields={setMissingFields}
          isEditMode={isEditMode}
          isCopyMode={isCopyMode}
          isAgentRqd={tripDetailsData?.isAgentRqd}
          skpTrvlrPref={tripDetailsData?.skpTrvlrPref}
          routeProps={route.params}
          navigation={navigation}
        />
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
    width: '100%',
    paddingVertical: 16,
  },
  errorToast: {
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.red200,
    backgroundColor: Colors.lightThemeColors.red50,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  errorToastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningIcon: {
    fontSize: 20,
  },
  errorText: {
    flex: 1,
  },
  headerContent: {
    ...Typography.flex.rowJustifyBetweenItemCenter,
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 45 : 10,
    paddingHorizontal: 20,
  },
});

export default JourneyCreationScreen;
