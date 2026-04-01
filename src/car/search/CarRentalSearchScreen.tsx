import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CarReantalStackParamList} from '../../navigators/types';
import {Colors, Typography} from '../../styles';
import {CustomText} from '../../common/components';
import {useDispatch, useSelector} from 'react-redux';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {
  ArrowLeft,
  CircleX,
  SlidersHorizontal,
  ChevronDown,
  Clock,
  Clock3,
  SquarePen,
  ArrowRight,
  Search,
  X,
} from 'lucide-react-native';
import {useTheme} from '../../context/ThemeContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useJournery} from '../../journey/hooks/useJournery';
import {useCarRental} from '../hooks/useCarPickupSearch';
import {
  carDropoffSearch,
  carPickupSearch,
  clearCarSearchResults,
  setCarRentalsDetails,
  carSearch,
  fetchCarDetails,
} from '../redux/carRentalSlice';
import {AppDispatch} from '../../store';
import CarResultCardMobile from '../components/CarResultCardMobile';
import LocationSearchInputMobile from '../components/LocationSearchInputMobile';
import DateTimePickerMobile from '../components/DateTimePickerMobile';
import VehicleTypeSelectorMobile from '../components/VehicleTypeSelectorMobile';
import NoCarsMobile from '../components/NoCarsMobile';
import SortHeaderMobile from '../components/SortHeaderMobile';
import SelectMobile from '../components/SelectMobile';
import FigmaSelectMobile from '../components/FigmaSelectMobile';
import DriverAgeInputMobile from '../components/DriverAgeInputMobile';
import {CarFilterSidebarMobile} from '../components/CarFilterSidebarMobile';
import {DateUtil} from '../../utils';
import FigmaStyleInput from '../components/FigmaStyleInput';
import Separator from '../components/Separator';
import LocationSelectionBottomSheet, {
  LocationSelectionBottomSheetRef,
} from '../components/LocationSelectionBottomSheet';
import TimeSelectionBottomSheet, {
  TimeSelectionBottomSheetRef,
} from '../components/TimeSelectionBottomSheet';

// Import types from the slice (we'll need to check if they're exported)
type CarSearchParams = {
  carCat: string;
  pkupLoc: string;
  dropLoc: string;
  pkupDate: string;
  dropDate: string;
  prCar: boolean;
  __xreq__: boolean;
  isPkgCfgMode?: boolean;
  journeyId?: string | number;
  dCityExId?: string | number;
  tvlG?: {
    tvlA: string[];
  };
  driverAge?: string;
  [key: string]: any;
};

export interface CarDataType {
  prc: number;
  dpLoc?: {loc?: string; isApt?: boolean; locTm: string};
  pkLoc?: {loc?: string; isApt?: boolean; locTm: string};
  fpl?: string;
  gk?: string;
  mpl?: string;
  prD?: string;
  optr?: {nm?: string; lg?: string};
  vd?: {
    vnm?: string;
    img?: string;
    vtyp?: string;
    isAutoTx?: boolean;
    hasAC?: boolean;
    ndr?: number;
    nst?: number;
    slg?: number;
    ftA?: string[];
  };
  key?: string;
  xpSmry?: string;
}

// Type for action data
export interface ActionData {
  ctype?: string;
  otherData?: {
    carRentalSearchData?: {
      dropLocations?: Array<{
        date?: string;
        maxTime?: string;
        acd?: string;
        nm?: string;
        dropCityId?: number;
        cid?: number;
      }>;
      pickupLocations?: Array<{
        date?: string;
        acd?: string;
        minTime?: string;
        nm?: string;
        cid?: number;
        dropCityId?: number;
      }>;
      selectedDropLocation?: {
        date?: string;
        maxTime?: string;
        acd?: string;
        nm?: string;
        dropCityId?: number;
        cid?: number;
      };
      selectedPickupLocation?: {
        date?: string;
        acd?: string;
        minTime?: string;
        nm?: string;
        cid?: number;
        dropCityId?: number;
      };
    };
  };
  name?: string;
  tvlG?: {
    tvlA?: string[];
  };
  type?: string;
  rstTvlG?: {
    tvlA?: string[];
  };
  isPackageFlow?: boolean;
  addPrms?: {
    carRentalSearchData?: {
      dropLocations: Array<{
        date?: string;
        maxTime?: string;
        acd?: string;
        nm?: string;
        dropCityId?: number;
        cid?: number;
      }>;
      pickupLocations: Array<{
        date?: string;
        acd?: string;
        minTime?: string;
        nm?: string;
        cid?: number;
      }>;
      selectedDropLocation?: {
        date?: string;
        maxTime?: string;
        acd?: string;
        nm?: string;
        dropCityId?: number;
        cid?: number;
      };
      selectedPickupLocation?: {
        date?: string;
        acd?: string;
        minTime?: string;
        nm?: string;
        cid?: number;
        dropCityId?: number;
      };
    };
  };
  [key: string]: unknown;
}

export interface CarLocation {
  data: {
    id: number;
    pnm: string;
    nm: string;
  };
  value: string;
  _scr: number;
}

type Props = NativeStackScreenProps<
  CarReantalStackParamList,
  'CarRentalSearch'
>;

const CarRentalSearchScreen: React.FC<Props> = ({navigation, route}) => {
  const action = route.params?.action;
  const {colors} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const scrollViewRef = useRef<ScrollView>(null);

  const [showError, setShowError] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [showModifySearch, setShowModifySearch] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const handleToggleFilter = (): void => {
    setIsFilterOpen(!isFilterOpen);
  };
  const [selectedVehicleType, setSelectedVehicleType] = useState<
    'car' | 'motorhome'
  >('car');
  const [pickupSearchTerm, setPickupSearchTerm] = useState<string>('');
  const [dropoffSearchTerm, setDropoffSearchTerm] = useState<string>('');
  const [selectedPickupLocation, setSelectedPickupLocation] =
    useState<string>('');
  const [selectedDropoffLocation, setSelectedDropoffLocation] =
    useState<string>('');
  const [pickupDate, setPickupDate] = useState<string>('');
  const [dropoffDate, setDropoffDate] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('09:00');
  const [dropoffTime, setDropoffTime] = useState<string>('09:00');
  const [driverAge, setDriverAge] = useState<string>('');

  const [selectedTvlG, setSelectedTvlG] = useState<number>(
    parseInt(action?.tvlG?.tvlA?.[0]) || 1,
  );
  const [travellersError, setTravellersError] = useState<string>('');

  // Bottom sheet refs and state
  const locationBottomSheetRef = useRef<LocationSelectionBottomSheetRef>(null);
  const [bottomSheetLocationOptions, setBottomSheetLocationOptions] = useState<
    Array<{id: string; name: string}>
  >([]);
  const [bottomSheetTitle, setBottomSheetTitle] = useState<string>('');
  const [bottomSheetSelectedLocationId, setBottomSheetSelectedLocationId] =
    useState<string>('');
  const [bottomSheetOnSelect, setBottomSheetOnSelect] = useState<
    ((location: {id: string; name: string}) => void) | null
  >(null);

  // Time selection bottomsheet refs
  const pickupTimeBottomSheetRef = useRef<TimeSelectionBottomSheetRef>(null);
  const dropoffTimeBottomSheetRef = useRef<TimeSelectionBottomSheetRef>(null);

  const handlePickupTimeChange = (newTime: string): void => {
    setPickupTime(newTime);
  };

  const handleDropoffTimeChange = (newTime: string): void => {
    setDropoffTime(newTime);
  };

  const [showPickupDropdown, setShowPickupDropdown] = useState<boolean>(false);
  const [showDropoffDropdown, setShowDropoffDropdown] =
    useState<boolean>(false);

  const [sortOrder, setSortOrder] = useState<
    'low-to-high' | 'high-to-low' | 'none'
  >('none');

  const [displayedCount, setDisplayedCount] = useState<number>(100);

  const [filteredCarData, setFilteredCarData] = useState<CarDataType[]>([]);
  const [carSearchTerm, setCarSearchTerm] = useState<string>('');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);

  const showMoreButtonRef = useRef<any>(null);

  const defaultPayload = useSelector(
    (state: {carRental?: {defaultPayload?: unknown}}) =>
      state.carRental?.defaultPayload,
  );

  // Get actionData from Redux (set by CarRentalActionHandler via executeAction)
  const reduxActionData = useSelector(
    (state: {carRental?: {actionData?: any}}) => state.carRental?.actionData,
  );

  // Use action from route params as primary source, fallback to Redux actionData
  // Route params action should have otherData.carRentalSearchData from the backend
  // Redux actionData is set by CarRentalActionHandler.handleAdd
  const actionData = action || reduxActionData;

  console.log('CarRentalSearchScreen - actionData sources:', {
    hasRouteAction: !!action,
    hasReduxActionData: !!reduxActionData,
    routeActionKeys: action ? Object.keys(action) : [],
    reduxActionDataKeys: reduxActionData ? Object.keys(reduxActionData) : [],
  });

  // Determine isPackageFlow based on whether otherData.carRentalSearchData exists
  // (same logic as web version - if we have carRentalSearchData, it's package flow)
  const isPackageFlow = !!(
    actionData?.isPackageFlow || actionData?.otherData?.carRentalSearchData
  );

  console.log(
    'CarRentalSearchScreen - actionData check:',
    JSON.stringify({
      actionData: actionData,
      hasAction: !!action,
      isPackageFlow,
      hasOtherData: !!actionData?.otherData,
      hasCarRentalSearchData: !!actionData?.otherData?.carRentalSearchData,
      hasPickupLocations:
        !!actionData?.otherData?.carRentalSearchData?.pickupLocations,
      pickupLocations:
        actionData?.otherData?.carRentalSearchData?.pickupLocations,
    }),
  );

  // Set actionData in Redux for other components that might need it
  //   useEffect(() => {
  //     if (action) {
  //       console.log('CarRentalSearchScreen - Setting actionData from route params to Redux:', action);
  //       dispatch(
  //         setCarRentalsDetails({
  //           open: true,
  //           actionData: action,
  //           isPackageFlow: action.isPackageFlow || false,
  //         })
  //       );
  //     }
  //   }, [action, dispatch]);

  const journeyState = useJournery();
  const journeyId = journeyState.id;

  // Hydrate form from actionData (same logic as web SearchForm component)
  const hydratedFromActionRef = useRef(false);
  useEffect(() => {
    // Use actionData from route params
    const dataToUse = actionData;

    // Debug logging
    console.log('CarRentalSearchScreen - Hydration check:', {
      hasActionData: !!actionData,
      hasAction: !!action,
      pkTm: dataToUse?.pkTm,
      dpTm: dataToUse?.dpTm,
      pkLoc: dataToUse?.pkLoc,
      dpLoc: dataToUse?.dpLoc,
      isPackageFlow,
      alreadyHydrated: hydratedFromActionRef.current,
      fullActionData: actionData,
      fullAction: action,
    });

    // Same logic as web SearchForm component
    if (hydratedFromActionRef.current) {
      console.log('CarRentalSearchScreen - Already hydrated, skipping');
      return;
    }

    // Check if we have the required data (same check as web version)
    if (!dataToUse?.pkTm || !dataToUse?.dpTm) {
      console.log(
        'CarRentalSearchScreen - Missing pkTm or dpTm, skipping hydration',
      );
      return;
    }

    hydratedFromActionRef.current = true;
    console.log('CarRentalSearchScreen - Starting hydration with:', dataToUse);

    // Parse function (same as web version - line 364-367)
    const parse = (dt: string) => {
      const [date, time] = dt.split(' ');
      return {date, time: time ? time.slice(0, 5) : '09:00'};
    };

    const pk = parse(String(dataToUse.pkTm));
    const dp = parse(String(dataToUse.dpTm));

    console.log('CarRentalSearchScreen - Parsed dates:', {pk, dp});

    // In package flow, prioritize selectedPickupLocation and selectedDropLocation
    const carRentalSearchData = dataToUse?.otherData?.carRentalSearchData;
    const selectedPickupLocationData =
      carRentalSearchData?.selectedPickupLocation;
    const selectedDropLocationData = carRentalSearchData?.selectedDropLocation;

    // Set dates and times (same as web version - keeps YYYY-MM-DD format)
    // DateTimePickerMobile's formatDateDisplay will convert to dd MMM yyyy for display
    // For package flow, use selectedPickupLocation/selectedDropLocation if available
    if (isPackageFlow && selectedPickupLocationData?.date) {
      setPickupDate(selectedPickupLocationData.date);
      console.log(
        'CarRentalSearchScreen - Using pickupDate from selectedPickupLocation:',
        selectedPickupLocationData.date,
      );
    } else {
      setPickupDate(pk.date);
    }

    if (isPackageFlow && selectedPickupLocationData?.minTime) {
      const timeValue = selectedPickupLocationData.minTime;
      const formattedTime =
        timeValue.length > 5 ? timeValue.slice(0, 5) : timeValue;
      setPickupTime(formattedTime);
      console.log(
        'CarRentalSearchScreen - Using pickupTime from selectedPickupLocation.minTime:',
        formattedTime,
      );
    } else {
      setPickupTime(pk.time);
    }

    if (isPackageFlow && selectedDropLocationData?.date) {
      setDropoffDate(selectedDropLocationData.date);
      console.log(
        'CarRentalSearchScreen - Using dropoffDate from selectedDropLocation:',
        selectedDropLocationData.date,
      );
    } else {
      setDropoffDate(dp.date);
    }

    setDropoffTime(dp.time);

    console.log('CarRentalSearchScreen - Set state values:', {
      pickupDate: pk.date,
      pickupTime: pk.time,
      dropoffDate: dp.date,
      dropoffTime: dp.time,
    });

    // Set driver age if available
    if (dataToUse.driverAge || (dataToUse as any).driver_age) {
      const age = String(
        dataToUse.driverAge || (dataToUse as any).driver_age || '25',
      );
      setDriverAge(age);
      console.log('CarRentalSearchScreen - Set driverAge:', age);
    }

    // Update selectedTvlG if available
    if (dataToUse.tvlG?.tvlA?.[0]) {
      const travellers = parseInt(dataToUse.tvlG.tvlA[0]) || 1;
      setSelectedTvlG(travellers);
      console.log('CarRentalSearchScreen - Set selectedTvlG:', travellers);
      // Validate travellers count
      validateTravellersCount(travellers);
    }

    // Handle locations (same as web version)
    if (!isPackageFlow) {
      if (dataToUse.pkLoc) {
        const pkLocStr = String(dataToUse.pkLoc);
        setPickupSearchTerm(pkLocStr);
        console.log('CarRentalSearchScreen - Set pickupSearchTerm:', pkLocStr);
        // Location ID will be set in a separate effect when apiLocations are loaded
      }

      if (dataToUse.dpLoc) {
        const dpLocStr = String(dataToUse.dpLoc);
        setDropoffSearchTerm(dpLocStr);
        console.log('CarRentalSearchScreen - Set dropoffSearchTerm:', dpLocStr);
        // Location ID will be set in a separate effect when dropoffApiLocations are loaded
      }
    }
    // Note: apiLocations and dropoffApiLocations are used inside the effect
    // but not in dependencies to avoid circular dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actionData?.pkTm,
    actionData?.dpTm,
    actionData?.pkLoc,
    actionData?.dpLoc,
    actionData?.tvlG?.tvlA,
    actionData?.otherData?.carRentalSearchData?.selectedPickupLocation,
    actionData?.otherData?.carRentalSearchData?.selectedDropLocation,
    action?.pkTm,
    action?.dpTm,
    action?.pkLoc,
    action?.dpLoc,
    action?.tvlG?.tvlA,
    isPackageFlow,
    pickupDate,
    pickupTime,
  ]);

  // Auto-select first values when in package flow mode
  useEffect(() => {
    console.log('CarRentalSearchScreen - Auto-select effect running:', {
      isPackageFlow,
      hasActionData: !!actionData,
      hasCarRentalSearchData: !!actionData?.otherData?.carRentalSearchData,
      currentPickupSearchTerm: pickupSearchTerm,
      currentDropoffSearchTerm: dropoffSearchTerm,
    });

    if (!isPackageFlow || !actionData) {
      console.log('CarRentalSearchScreen - Auto-select effect early return');
      return;
    }

    const carRentalSearchData = actionData?.otherData?.carRentalSearchData;
    const selectedPickupLocationData =
      carRentalSearchData?.selectedPickupLocation;
    const selectedDropLocationData = carRentalSearchData?.selectedDropLocation;
    const pickupLocations = carRentalSearchData?.pickupLocations || [];
    const dropoffLocations = carRentalSearchData?.dropLocations || [];

    console.log('CarRentalSearchScreen - Auto-select effect data:', {
      hasSelectedPickupLocationData: !!selectedPickupLocationData,
      selectedPickupLocationName: selectedPickupLocationData?.nm,
      hasSelectedDropLocationData: !!selectedDropLocationData,
      selectedDropLocationName: selectedDropLocationData?.nm,
      pickupLocationsCount: pickupLocations.length,
      dropoffLocationsCount: dropoffLocations.length,
    });

    if (pickupLocations.length === 0 || dropoffLocations.length === 0) {
      console.log(
        'CarRentalSearchScreen - Auto-select effect: no locations available',
      );
      return;
    }

    // Get unique locations
    const uniquePickupLocations = new Map();
    pickupLocations.forEach((loc: any) => {
      const key = loc.acd || loc.cid?.toString() || '';
      if (key && !uniquePickupLocations.has(key)) {
        uniquePickupLocations.set(key, {
          value: key,
          label: loc.nm,
        });
      }
    });

    const uniqueDropoffLocations = new Map();
    dropoffLocations.forEach((loc: any) => {
      const key = loc.cid?.toString() || loc.acd || '';
      if (key && !uniqueDropoffLocations.has(key)) {
        uniqueDropoffLocations.set(key, {
          value: key,
          label: loc.nm,
        });
      }
    });

    const pickupLocationOptions: Array<{value: string; label: string}> =
      Array.from(uniquePickupLocations.values());
    const dropoffLocationOptions: Array<{value: string; label: string}> =
      Array.from(uniqueDropoffLocations.values());

    // Auto-select pickup location - prioritize selectedPickupLocation if available
    if (pickupLocationOptions.length > 0 && !pickupSearchTerm) {
      let pickupLocation: {value: string; label: string} | undefined =
        undefined;

      // First, try to find the location matching selectedPickupLocation
      if (selectedPickupLocationData?.nm) {
        pickupLocation = pickupLocationOptions.find(
          (opt: any) => opt.label === selectedPickupLocationData.nm,
        );
      }

      // Fallback to preferred location or first option
      if (!pickupLocation) {
        const preferredLocation = 'Auckland Arpt';
        pickupLocation =
          pickupLocationOptions.find(
            (opt: any) => opt.label === preferredLocation,
          ) || pickupLocationOptions[0];
      }

      if (pickupLocation) {
        setPickupSearchTerm(pickupLocation.label);
        handlePickupLocationSelect({
          city: pickupLocation.label,
          region: pickupLocation.label,
          code: pickupLocation.value,
        });

        // Auto-select date from selectedPickupLocation if available, otherwise first date from array
        if (selectedPickupLocationData?.date && !pickupDate) {
          setPickupDate(selectedPickupLocationData.date);
          console.log(
            'CarRentalSearchScreen - Auto-select pickupDate from selectedPickupLocation:',
            selectedPickupLocationData.date,
          );
        } else {
          const firstPickupDate = pickupLocations
            .filter((loc: any) => loc.nm === pickupLocation!.label)
            .map((loc: any) => loc.date)
            .filter((date: string) => date)[0];
          if (firstPickupDate && !pickupDate) {
            setPickupDate(firstPickupDate);
          }
        }
      }
    }

    // Auto-select dropoff location - prioritize selectedDropLocation if available
    if (dropoffLocationOptions.length > 0 && !dropoffSearchTerm) {
      let dropoffLocation: {value: string; label: string} | undefined =
        undefined;

      // First, try to find the location matching selectedDropLocation
      if (selectedDropLocationData?.nm) {
        dropoffLocation = dropoffLocationOptions.find(
          (opt: any) => opt.label === selectedDropLocationData.nm,
        );
      }

      // Fallback to preferred location or first option
      if (!dropoffLocation) {
        const preferredLocation = 'Auckland Arpt';
        dropoffLocation =
          dropoffLocationOptions.find(
            (opt: any) => opt.label === preferredLocation,
          ) || dropoffLocationOptions[0];
      }

      if (dropoffLocation) {
        setDropoffSearchTerm(dropoffLocation.label);
        handleDropoffLocationSelect({
          city: dropoffLocation.label,
          region: dropoffLocation.label,
          code: dropoffLocation.value,
        });

        // Priority 1: Auto-select date from selectedDropLocation if it matches the location name
        if (
          selectedDropLocationData?.nm === dropoffLocation.label &&
          selectedDropLocationData?.date &&
          !dropoffDate
        ) {
          setDropoffDate(selectedDropLocationData.date);
          // Also set time from selectedDropLocation.maxTime if available
          if (selectedDropLocationData.maxTime) {
            const timeValue = selectedDropLocationData.maxTime;
            const formattedTime =
              timeValue.length > 5 ? timeValue.slice(0, 5) : timeValue;
            setDropoffTime(formattedTime);
          }
          console.log(
            'CarRentalSearchScreen - Auto-select dropoffDate from selectedDropLocation:',
            selectedDropLocationData.date,
            'for location:',
            dropoffLocation.label,
          );
        } else {
          // Priority 2: Auto-select first date from the date array for the selected location
          const dates = dropoffLocations
            .filter((loc: any) => loc.nm === dropoffLocation!.label)
            .map((loc: any) => loc.date)
            .filter((date: string) => date);
          const availableDates = [...new Set(dates)].sort() as string[];
          if (availableDates.length > 0 && !dropoffDate) {
            setDropoffDate(availableDates[0]);
            console.log(
              'CarRentalSearchScreen - Auto-select first date from array:',
              availableDates[0],
              'for location:',
              dropoffLocation.label,
            );
          }
        }
      }
    }
  }, [
    isPackageFlow,
    actionData?.otherData?.carRentalSearchData?.selectedPickupLocation,
    actionData?.otherData?.carRentalSearchData?.selectedDropLocation,
    actionData?.otherData?.carRentalSearchData?.pickupLocations,
    actionData?.otherData?.carRentalSearchData?.dropLocations,
    pickupSearchTerm,
    dropoffSearchTerm,
    pickupDate,
    dropoffDate,
  ]);

  // Extract and set pickup time from minTime and dropoff date from selectedDropLocation
  useEffect(() => {
    console.log('CarRentalSearchScreen - Extract effect running:', {
      isPackageFlow,
      hasActionData: !!actionData,
      hasCarRentalSearchData: !!actionData?.otherData?.carRentalSearchData,
    });

    if (!isPackageFlow || !actionData) {
      console.log('CarRentalSearchScreen - Extract effect early return:', {
        isPackageFlow,
        hasActionData: !!actionData,
      });
      return;
    }

    const carRentalSearchData = actionData?.otherData?.carRentalSearchData;
    const selectedPickupLocationData =
      carRentalSearchData?.selectedPickupLocation;
    const selectedDropLocationData = carRentalSearchData?.selectedDropLocation;
    const pickupLocations = carRentalSearchData?.pickupLocations || [];
    const dropoffLocations = carRentalSearchData?.dropLocations || [];

    console.log('CarRentalSearchScreen - Extract effect data:', {
      hasSelectedPickupLocationData: !!selectedPickupLocationData,
      selectedPickupLocationData,
      hasSelectedDropLocationData: !!selectedDropLocationData,
      selectedDropLocationData,
      pickupLocationsCount: pickupLocations.length,
      dropoffLocationsCount: dropoffLocations.length,
    });

    // Set pickup time from selectedPickupLocation.minTime (preferred) or from matching location
    if (selectedPickupLocationData?.minTime) {
      // Use minTime directly from selectedPickupLocation
      const timeValue = selectedPickupLocationData.minTime;
      const formattedTime =
        timeValue.length > 5 ? timeValue.slice(0, 5) : timeValue;
      console.log(
        'CarRentalSearchScreen - Found selectedPickupLocation.minTime:',
        {
          timeValue,
          formattedTime,
          currentPickupTime: pickupTime,
          willUpdate: pickupTime !== formattedTime,
        },
      );
      if (pickupTime !== formattedTime) {
        setPickupTime(formattedTime);
        console.log(
          'CarRentalSearchScreen - Set pickupTime from selectedPickupLocation.minTime:',
          formattedTime,
        );
      }
    } else if (pickupSearchTerm && pickupDate && pickupLocations.length > 0) {
      // Fallback: find matching location in array
      const matchingPickupLocation = pickupLocations.find(
        (loc: any) => loc.nm === pickupSearchTerm && loc.date === pickupDate,
      );

      if (matchingPickupLocation?.minTime) {
        const timeValue = matchingPickupLocation.minTime;
        const formattedTime =
          timeValue.length > 5 ? timeValue.slice(0, 5) : timeValue;
        if (pickupTime !== formattedTime) {
          setPickupTime(formattedTime);
          console.log(
            'CarRentalSearchScreen - Set pickupTime from matching location minTime:',
            formattedTime,
          );
        }
      }
    }

    // Set dropoff date from selectedDropLocation.date (preferred) or from matching location
    // This effect runs when dropoffSearchTerm changes to ensure date is always set
    if (!dropoffSearchTerm) {
      // If no location selected, don't set date
      return;
    }

    // Priority 1: Check if selectedDropLocation matches the current dropoffSearchTerm
    if (
      selectedDropLocationData?.nm === dropoffSearchTerm &&
      selectedDropLocationData?.date
    ) {
      // Use date directly from selectedDropLocation if location name matches
      console.log(
        'CarRentalSearchScreen - useEffect: Found selectedDropLocation.date matching location:',
        {
          selectedDropLocationDate: selectedDropLocationData.date,
          locationName: selectedDropLocationData.nm,
          currentDropoffDate: dropoffDate,
        },
      );
      setDropoffDate(selectedDropLocationData.date);
      // Also set time from selectedDropLocation.maxTime if available
      if (selectedDropLocationData.maxTime) {
        const timeValue = selectedDropLocationData.maxTime;
        const formattedTime =
          timeValue.length > 5 ? timeValue.slice(0, 5) : timeValue;
        setDropoffTime(formattedTime);
      }
      console.log(
        'CarRentalSearchScreen - useEffect: Set dropoffDate from selectedDropLocation.date:',
        selectedDropLocationData.date,
      );
    } else if (dropoffLocations.length > 0) {
      // Priority 2: Get all dates for the selected location from the array and use the first one
      const dates = dropoffLocations
        .filter((loc: any) => loc.nm === dropoffSearchTerm)
        .map((loc: any) => loc.date)
        .filter((date: string) => date);

      const availableDates = [...new Set(dates)].sort() as string[];

      console.log(
        'CarRentalSearchScreen - useEffect: Available dates for location',
        dropoffSearchTerm,
        ':',
        availableDates,
      );

      if (availableDates.length > 0) {
        const firstDate = availableDates[0];
        setDropoffDate(firstDate);
        console.log(
          'CarRentalSearchScreen - useEffect: Set dropoffDate from first available date in array:',
          firstDate,
          'for location:',
          dropoffSearchTerm,
        );
      } else {
        console.log(
          'CarRentalSearchScreen - useEffect: No dates found for location:',
          dropoffSearchTerm,
        );
        setDropoffDate(''); // Clear date if no dates available
      }
    }
  }, [
    isPackageFlow,
    actionData?.otherData?.carRentalSearchData?.selectedPickupLocation,
    actionData?.otherData?.carRentalSearchData?.selectedDropLocation,
    actionData?.otherData?.carRentalSearchData?.pickupLocations,
    actionData?.otherData?.carRentalSearchData?.dropLocations,
    pickupSearchTerm,
    pickupDate,
    dropoffSearchTerm,
    pickupTime,
    // Note: dropoffDate removed from dependencies to avoid re-running when date changes
    // This effect should only run when location changes, not when date changes
  ]);

  useEffect(() => {
    if (isPackageFlow && !hasSearched) {
      setShowModifySearch(true);
    }
  }, [isPackageFlow, hasSearched]);

  const clearCarSearchData = useCallback(() => {
    dispatch(clearCarSearchResults());
    setFilteredCarData([]);
    setDisplayedCount(100);
    setHasSearched(false);
    setShowModifySearch(false);
  }, [dispatch]);

  //   const onClose = useCallback(() => {
  //     clearCarSearchData();
  //     dispatch(
  //       setCarRentalsDetails({
  //         open: false,
  //         actionData: {},
  //         isPackageFlow: false,
  //       })
  //     );
  //   }, [clearCarSearchData, dispatch]);

  const {
    locations: apiLocations,
    locationsLoading,
    searchError,
    dropoffLocations: dropoffApiLocations,
    dropoffLocationsLoading,
    dropoffSearchError,
    carSearchResults,
    carSearchLoading,
    carSearchError,
  } = useCarRental();

  console.log('pickupLocationOptions computed:', {
    isPackageFlow,
    hasActionData: !!actionData,
    hasOtherData: !!actionData?.otherData,
    hasCarRentalSearchData: !!actionData?.otherData?.carRentalSearchData,
    hasPickupLocations:
      !!actionData?.otherData?.carRentalSearchData?.pickupLocations,
    pickupLocationsCount:
      actionData?.otherData?.carRentalSearchData?.pickupLocations?.length || 0,
    //   uniqueLocationsCount: uniqueLocations.size,
    //   result,
  });

  // Get pickup location options from actionData (same as web version)
  // Get pickup location options from actionData
  const pickupLocationOptions = React.useMemo(() => {
    if (
      !isPackageFlow ||
      !actionData?.otherData?.carRentalSearchData?.pickupLocations
    )
      return [];

    // Get unique locations (since same location can have multiple dates)
    const uniqueLocations = new Map();
    actionData.otherData.carRentalSearchData.pickupLocations.forEach(
      (location: any) => {
        const key = location.acd || location.cid?.toString() || '';
        if (key && !uniqueLocations.has(key)) {
          uniqueLocations.set(key, {
            value: key,
            label: location.nm,
          });
        }
      },
    );

    const result = Array.from(uniqueLocations.values());
    return result;
  }, [isPackageFlow, actionData]);

  // Get pickup date options from the selected pickup location's dates (same as web version)
  const pickupDateOptions = useMemo(() => {
    if (
      !isPackageFlow ||
      !actionData?.otherData?.carRentalSearchData?.pickupLocations
    )
      return [];

    // Find the currently selected pickup location
    const selectedPickupLocation = pickupLocationOptions.find(
      (opt: any) => opt.label === pickupSearchTerm,
    );

    let availableDates: Array<{value: string; label: string}> = [];

    if (!selectedPickupLocation) {
      // If no location selected, return dates from first location as fallback
      const firstLocation =
        actionData.otherData.carRentalSearchData.pickupLocations[0];
      if (firstLocation) {
        const dates = actionData.otherData.carRentalSearchData.pickupLocations
          .filter((loc: any) => loc.nm === firstLocation.nm)
          .map((loc: any) => loc.date || '')
          .filter((date: string) => date); // Remove empty dates

        // Remove duplicates using Set and sort chronologically
        const uniqueDates = [...new Set(dates)].sort() as string[];
        availableDates = uniqueDates.map((date: string) => ({
          value: date,
          label: DateUtil.formatDate(date, 'dd MMM yyyy'),
        }));
      }
    } else {
      // Find dates for the selected pickup location
      const dates = actionData.otherData.carRentalSearchData.pickupLocations
        .filter((loc: any) => loc.nm === selectedPickupLocation.label)
        .map((loc: any) => loc.date || '')
        .filter((date: string) => date); // Remove empty dates

      // Remove duplicates using Set and sort chronologically
      const uniqueDates = [...new Set(dates)].sort() as string[];
      availableDates = uniqueDates.map((date: string) => ({
        value: date,
        label: DateUtil.formatDate(date, 'dd MMM yyyy'),
      }));
    }

    return availableDates;
  }, [isPackageFlow, pickupSearchTerm, pickupLocationOptions, actionData]);

  // Get dropoff location options from actionData (same as web version)
  const dropoffLocationOptions = useMemo(() => {
    if (
      !isPackageFlow ||
      !actionData?.otherData?.carRentalSearchData?.dropLocations
    )
      return [];

    // Get unique locations (since same location can have multiple dates)
    const uniqueLocations = new Map();
    actionData.otherData.carRentalSearchData.dropLocations.forEach(
      (location: any) => {
        const key = location.cid?.toString() || location.acd || '';
        if (key && !uniqueLocations.has(key)) {
          uniqueLocations.set(key, {
            value: key,
            label: location.nm,
          });
        }
      },
    );

    return Array.from(uniqueLocations.values());
  }, [isPackageFlow, actionData]);

  // Get dropoff date options from the selected dropoff location's dates (same as web version)
  const dropoffDateOptions = useMemo(() => {
    if (
      !isPackageFlow ||
      !actionData?.otherData?.carRentalSearchData?.dropLocations
    )
      return [];

    // Find the currently selected dropoff location
    const selectedDropoffLocation = dropoffLocationOptions.find(
      (opt: any) => opt.label === dropoffSearchTerm,
    );

    let availableDates: Array<{value: string; label: string}> = [];

    if (!selectedDropoffLocation) {
      // If no location selected, return dates from first location as fallback
      const firstLocation =
        actionData.otherData.carRentalSearchData.dropLocations[0];
      if (firstLocation) {
        const dates = actionData.otherData.carRentalSearchData.dropLocations
          .filter((loc: any) => loc.nm === firstLocation.nm)
          .map((loc: any) => loc.date || '')
          .filter((date: string) => date); // Remove empty dates

        // Remove duplicates using Set and sort chronologically
        const uniqueDates = [...new Set(dates)].sort() as string[];
        availableDates = uniqueDates.map((date: string) => ({
          value: date,
          label: DateUtil.formatDate(date, 'dd MMM yyyy'),
        }));
      }
    } else {
      // Find dates for the selected dropoff location
      const dates = actionData.otherData.carRentalSearchData.dropLocations
        .filter((loc: any) => loc.nm === selectedDropoffLocation.label)
        .map((loc: any) => loc.date || '')
        .filter((date: string) => date); // Remove empty dates

      // Remove duplicates using Set and sort chronologically
      const uniqueDates = [...new Set(dates)].sort() as string[];
      availableDates = uniqueDates.map((date: string) => ({
        value: date,
        label: DateUtil.formatDate(date, 'dd MMM yyyy'),
      }));
    }

    return availableDates;
  }, [isPackageFlow, dropoffSearchTerm, dropoffLocationOptions, actionData]);

  // Generate pickup time options based on minTime for selected pickup location and date (same as web version)
  const pickupTimeOptions = useMemo(() => {
    if (
      !isPackageFlow ||
      !actionData?.otherData?.carRentalSearchData?.pickupLocations
    ) {
      // Default time options for non-package flow
      return [
        {value: '09:00', label: '09:00 AM'},
        {value: '10:00', label: '10:00 AM'},
        {value: '11:00', label: '11:00 AM'},
        {value: '12:00', label: '12:00 PM'},
        {value: '13:00', label: '01:00 PM'},
        {value: '14:00', label: '02:00 PM'},
        {value: '15:00', label: '03:00 PM'},
        {value: '16:00', label: '04:00 PM'},
        {value: '17:00', label: '05:00 PM'},
        {value: '18:00', label: '06:00 PM'},
      ];
    }

    // Find the minTime for the currently selected pickup location and date
    let minTimeForSelection = '09:00'; // Default min time

    if (pickupSearchTerm && pickupDate) {
      const matchingPickupLocations =
        actionData.otherData.carRentalSearchData.pickupLocations.filter(
          (loc: any) => loc.nm === pickupSearchTerm && loc.date === pickupDate,
        );

      if (matchingPickupLocations.length > 0) {
        // If multiple entries exist for the same location/date, take the latest (most restrictive) minTime
        const minTimes = matchingPickupLocations
          .map((loc: any) => loc.minTime)
          .filter((time: string) => time)
          .sort()
          .reverse(); // Sort in reverse to get the latest (most restrictive) time first

        if (minTimes.length > 0 && minTimes[0]) {
          minTimeForSelection = minTimes[0]; // Use the latest minTime
        }
      }
    }

    // Convert minTime to 24-hour format for comparison
    const [minHour, minMinute] = minTimeForSelection
      .split(':')
      .map(num => parseInt(num, 10));
    const minTotalMinutes = minHour * 60 + minMinute;

    // For pickup: Always end at 23:30 (11:30 PM)
    const maxTotalMinutes = 23 * 60 + 30;

    // Generate pickup time options from minTime to 23:30
    const timeOptions = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // 30-minute intervals
        const totalMinutes = hour * 60 + minute;

        // Skip times before minTime or after 23:30
        if (totalMinutes < minTotalMinutes || totalMinutes > maxTotalMinutes)
          continue;

        const hourString = hour.toString().padStart(2, '0');
        const minuteString = minute.toString().padStart(2, '0');
        const timeValue = `${hourString}:${minuteString}`;

        // Format for display (12-hour format)
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 ? 'AM' : 'PM';
        const displayMinute = minuteString;
        const timeLabel = `${displayHour}:${displayMinute} ${period}`;

        timeOptions.push({
          value: timeValue,
          label: timeLabel,
        });
      }
    }

    return timeOptions;
  }, [isPackageFlow, actionData, pickupSearchTerm, pickupDate]);

  // Generate time options for non-package flow (30-minute intervals)
  const defaultTimeOptions = useMemo(() => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourString = hour.toString().padStart(2, '0');
        const minuteString = minute.toString().padStart(2, '0');
        options.push(`${hourString}:${minuteString}`);
      }
    }
    return options;
  }, []);

  // Generate dropoff time options based on maxTime for selected dropoff location and date (same as web version)
  const dropoffTimeOptions = useMemo(() => {
    if (
      !isPackageFlow ||
      !actionData?.otherData?.carRentalSearchData?.dropLocations
    ) {
      // Default time options for non-package flow
      return [
        {value: '09:00', label: '09:00 AM'},
        {value: '10:00', label: '10:00 AM'},
        {value: '11:00', label: '11:00 AM'},
        {value: '12:00', label: '12:00 PM'},
        {value: '13:00', label: '01:00 PM'},
        {value: '14:00', label: '02:00 PM'},
        {value: '15:00', label: '03:00 PM'},
        {value: '16:00', label: '04:00 PM'},
        {value: '17:00', label: '05:00 PM'},
        {value: '18:00', label: '06:00 PM'},
      ];
    }

    // Find the maxTime for the currently selected dropoff location and date
    let maxTimeForSelection = '23:30'; // Default max time

    if (dropoffSearchTerm && dropoffDate) {
      const matchingDropoffLocations =
        actionData.otherData.carRentalSearchData.dropLocations.filter(
          (loc: any) =>
            loc.nm === dropoffSearchTerm && loc.date === dropoffDate,
        );

      if (matchingDropoffLocations.length > 0) {
        // If multiple entries exist for the same location/date, take the most restrictive (minimum) maxTime
        const maxTimes = matchingDropoffLocations
          .map((loc: any) => loc.maxTime)
          .filter((time: string) => time)
          .sort(); // Sort to get the earliest (most restrictive) time first

        if (maxTimes.length > 0 && maxTimes[0]) {
          maxTimeForSelection = maxTimes[0]; // Use the earliest maxTime
        }
      }
    }

    // Convert maxTime to 24-hour format for comparison
    const [maxHour, maxMinute] = maxTimeForSelection
      .split(':')
      .map(num => parseInt(num, 10));
    const maxTotalMinutes = maxHour * 60 + maxMinute;

    // Generate dropoff time options from 00:00 to maxTime (always start from midnight for dropoff)
    const timeOptions = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // 30-minute intervals
        const totalMinutes = hour * 60 + minute;

        // Stop when we reach the maxTime
        if (totalMinutes > maxTotalMinutes) break;

        const hourString = hour.toString().padStart(2, '0');
        const minuteString = minute.toString().padStart(2, '0');
        const timeValue = `${hourString}:${minuteString}`;

        // Format for display (12-hour format)
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 ? 'AM' : 'PM';
        const displayMinute = minuteString;
        const timeLabel = `${displayHour}:${displayMinute} ${period}`;

        timeOptions.push({
          value: timeValue,
          label: timeLabel,
        });
      }
    }

    return timeOptions;
  }, [isPackageFlow, actionData, dropoffSearchTerm, dropoffDate]);

  // Set location IDs after apiLocations are loaded (for non-package flow)
  useEffect(() => {
    if (isPackageFlow || !actionData) return;

    const dataToUse = actionData;

    if (
      dataToUse?.pkLoc &&
      apiLocations.length > 0 &&
      !selectedPickupLocation
    ) {
      const pkLocStr = String(dataToUse.pkLoc);
      console.log(
        'CarRentalSearchScreen - Looking for pickup location:',
        pkLocStr,
        'in',
        apiLocations.length,
        'locations',
      );
      const locationData = apiLocations.find(
        (loc: CarLocation) =>
          loc.data?.nm === pkLocStr || loc.value === pkLocStr,
      );
      if (locationData) {
        const locationId = locationData.data?.id.toString() || '';
        setSelectedPickupLocation(locationId);
        console.log(
          'CarRentalSearchScreen - Set selectedPickupLocation:',
          locationId,
        );
      } else {
        console.log(
          'CarRentalSearchScreen - Pickup location not found in apiLocations',
        );
      }
    }

    if (
      dataToUse?.dpLoc &&
      dropoffApiLocations.length > 0 &&
      !selectedDropoffLocation
    ) {
      const dpLocStr = String(dataToUse.dpLoc);
      console.log(
        'CarRentalSearchScreen - Looking for dropoff location:',
        dpLocStr,
        'in',
        dropoffApiLocations.length,
        'locations',
      );
      const locationData = dropoffApiLocations.find(
        (loc: CarLocation) =>
          loc.data?.nm === dpLocStr || loc.value === dpLocStr,
      );
      if (locationData) {
        const locationId = locationData.data?.id.toString() || '';
        setSelectedDropoffLocation(locationId);
        console.log(
          'CarRentalSearchScreen - Set selectedDropoffLocation:',
          locationId,
        );
      } else {
        console.log(
          'CarRentalSearchScreen - Dropoff location not found in dropoffApiLocations',
        );
      }
    }
  }, [
    isPackageFlow,
    actionData?.pkLoc,
    actionData?.dpLoc,
    action?.pkLoc,
    action?.dpLoc,
    apiLocations,
    dropoffApiLocations,
    selectedPickupLocation,
    selectedDropoffLocation,
  ]);

  const handleFilterChange = useCallback(
    (filtered: CarDataType[] | any[]): void => {
      // Convert filtered results to CarDataType format
      const converted = filtered.map((item: any) => ({
        ...item,
        dpLoc: item.dpLoc
          ? {
              ...item.dpLoc,
              locTm: item.dpLoc.locTm || dropoffTime || pickupTime,
            }
          : undefined,
        pkLoc: item.pkLoc
          ? {...item.pkLoc, locTm: item.pkLoc.locTm || pickupTime}
          : undefined,
      })) as CarDataType[];
      setFilteredCarData(converted);
      setDisplayedCount(100);
    },
    [dropoffTime, pickupTime],
  );

  const handleFilterCountChange = useCallback((count: number): void => {
    setFilterCount(count);
  }, []);

  // Search cars by name
  const handleCarSearch = useCallback((searchTerm: string): void => {
    setCarSearchTerm(searchTerm);
  }, []);

  const toggleSearchInput = useCallback((): void => {
    setShowSearchInput(prev => !prev);
    if (showSearchInput && carSearchTerm) {
      setCarSearchTerm('');
    }
  }, [showSearchInput, carSearchTerm]);

  // Validate travellers count based on available cars
  const validateTravellersCount = useCallback(
    (count: number): void => {
      setTravellersError('');

      if (count < 1) {
        setTravellersError('At least 1 traveller is required');
        return;
      }

      if (count > 8) {
        setTravellersError('Maximum 8 travellers allowed');
        return;
      }

      // If we have car search results, validate against car capacity
      if (carSearchResults.length > 0) {
        const maxSeats = Math.max(
          ...carSearchResults.map(car => car.vd?.nst || 5),
        );
        if (count > maxSeats) {
          setTravellersError(
            `Only cars with maximum ${maxSeats} seats are available`,
          );
          return;
        }
      }
    },
    [carSearchResults],
  );

  // Validate travellers count when car search results change
  useEffect(() => {
    if (carSearchResults.length > 0) {
      validateTravellersCount(selectedTvlG);
    }
  }, [carSearchResults, selectedTvlG, validateTravellersCount]);

  const showTravellersBottomSheet = useCallback(() => {
    // Generate traveller options from 1 to 8
    const travellersOptions = Array.from({length: 8}, (_, index) => {
      const count = index + 1;
      return {
        id: count.toString(),
        name: count === 1 ? '1 Traveller' : `${count} Travellers`,
      };
    });

    setBottomSheetLocationOptions(travellersOptions);
    setBottomSheetTitle('Number of Travellers');
    setBottomSheetSelectedLocationId(selectedTvlG.toString());
    setBottomSheetOnSelect(() => (option: {id: string; name: string}) => {
      const travellers = parseInt(option.id);
      setSelectedTvlG(travellers);
      validateTravellersCount(travellers);
    });

    locationBottomSheetRef.current?.present();
  }, [selectedTvlG, validateTravellersCount]);

  const handleLocationSearch = useCallback(
    (searchTerm: string): void => {
      setPickupSearchTerm(searchTerm);

      if (searchTerm && !isPackageFlow) {
        dispatch(
          carPickupSearch({
            q: searchTerm,
            __xreq__: true,
            incArp: true,
          }),
        );
      }
    },
    [dispatch, isPackageFlow],
  );

  const handleDropoffLocationChange = useCallback(
    (searchTerm: string): void => {
      setDropoffSearchTerm(searchTerm);

      if (searchTerm && !isPackageFlow) {
        dispatch(
          carDropoffSearch({
            q: searchTerm,
            __xreq__: true,
            incArp: true,
          }),
        );
      }
    },
    [dispatch, isPackageFlow],
  );

  const handlePickupLocationSelect = (location: {
    city: string;
    region: string;
    code?: string;
  }): void => {
    setPickupSearchTerm(location.city);

    if (isPackageFlow) {
      setSelectedPickupLocation(location.code || '');
    } else {
      const locationData = apiLocations.find(
        (loc: CarLocation) => loc.data?.nm === location.city,
      );
      setSelectedPickupLocation(locationData?.data?.id.toString() || '');
    }

    setShowPickupDropdown(false);
  };

  const handleDropoffLocationSelect = (location: {
    city: string;
    region: string;
    code?: string;
  }): void => {
    setDropoffSearchTerm(location.city);

    if (isPackageFlow) {
      setSelectedDropoffLocation(location.code || '');
    } else {
      const locationData = dropoffApiLocations.find(
        (loc: CarLocation) => loc.data?.nm === location.city,
      );
      setSelectedDropoffLocation(locationData?.data?.id.toString() || '');
    }

    setShowDropoffDropdown(false);
  };

  // Bottom sheet handlers
  const showPickupLocationBottomSheet = useCallback(() => {
    let options: Array<{id: string; name: string}> = [];

    if (
      isPackageFlow &&
      actionData?.otherData?.carRentalSearchData?.pickupLocations
    ) {
      // Package flow: use pickup locations from action data
      const uniqueLocations = new Map();
      actionData.otherData.carRentalSearchData.pickupLocations.forEach(
        (location: any) => {
          const key = location.acd || location.cid?.toString() || '';
          if (key && !uniqueLocations.has(key)) {
            uniqueLocations.set(key, {
              id: key,
              name: location.nm,
            });
          }
        },
      );
      options = Array.from(uniqueLocations.values());
    } else {
      // Non-package flow: use apiLocations from useCarRental
      options = apiLocations.map((loc: CarLocation) => ({
        id: loc.data?.id.toString() || '',
        name: loc.data?.nm || '',
      }));
    }

    if (options.length === 0) {
      return;
    }

    setBottomSheetLocationOptions(options);
    setBottomSheetTitle('Pick-up from');
    setBottomSheetSelectedLocationId(selectedPickupLocation);
    setBottomSheetOnSelect(() => (location: {id: string; name: string}) => {
      setSelectedPickupLocation(location.id);
      setPickupSearchTerm(location.name);
      handlePickupLocationSelect({
        city: location.name,
        region: location.name,
        code: location.id,
      });

      if (
        isPackageFlow &&
        actionData?.otherData?.carRentalSearchData?.pickupLocations
      ) {
        // Auto-select first date from the selected pickup location
        const dates =
          actionData.otherData.carRentalSearchData.pickupLocations
            ?.filter((loc: any) => loc.nm === location.name)
            ?.map((loc: any) => loc.date)
            ?.filter((date: string) => date) || [];
        const availableDates = [...new Set(dates)] as string[];
        if (availableDates.length > 0) {
          if (!pickupDate || !availableDates.includes(pickupDate)) {
            setPickupDate(availableDates[0] || '');
          }
        }
      }
    });

    locationBottomSheetRef.current?.present();
  }, [
    isPackageFlow,
    actionData,
    selectedPickupLocation,
    pickupDate,
    apiLocations,
  ]);

  const showDropoffLocationBottomSheet = useCallback(() => {
    let options: Array<{id: string; name: string}> = [];

    if (
      isPackageFlow &&
      actionData?.otherData?.carRentalSearchData?.dropLocations
    ) {
      // Package flow: use drop locations from action data
      const uniqueLocations = new Map();
      actionData.otherData.carRentalSearchData.dropLocations.forEach(
        (location: any) => {
          const key = location.cid?.toString() || location.acd || '';
          if (key && !uniqueLocations.has(key)) {
            uniqueLocations.set(key, {
              id: key,
              name: location.nm,
            });
          }
        },
      );
      options = Array.from(uniqueLocations.values());
    } else {
      // Non-package flow: use dropoffApiLocations from useCarRental
      options = dropoffApiLocations.map((loc: CarLocation) => ({
        id: loc.data?.id.toString() || '',
        name: loc.data?.nm || '',
      }));
    }

    if (options.length === 0) {
      return;
    }

    setBottomSheetLocationOptions(options);
    setBottomSheetTitle('Drop off to');
    setBottomSheetSelectedLocationId(selectedDropoffLocation);
    setBottomSheetOnSelect(() => (location: {id: string; name: string}) => {
      const newLocationName = location.name;
      setSelectedDropoffLocation(location.id);
      setDropoffSearchTerm(newLocationName);
      handleDropoffLocationSelect({
        city: newLocationName,
        region: newLocationName,
        code: location.id,
      });

      if (isPackageFlow && actionData?.otherData?.carRentalSearchData) {
        // Auto-select date logic for package flow
        const carRentalSearchData = actionData.otherData.carRentalSearchData;
        const selectedDropLocationData =
          carRentalSearchData?.selectedDropLocation;

        // Priority 1: Use date from selectedDropLocation if it matches the selected location
        if (
          selectedDropLocationData?.nm === newLocationName &&
          selectedDropLocationData?.date
        ) {
          setDropoffDate(selectedDropLocationData.date);
          // Also set time from selectedDropLocation.maxTime if available
          if (selectedDropLocationData.maxTime) {
            const timeValue = selectedDropLocationData.maxTime;
            const formattedTime =
              timeValue.length > 5 ? timeValue.slice(0, 5) : timeValue;
            setDropoffTime(formattedTime);
          }
        } else {
          // Priority 2: Auto-select first date from the date array for the selected location
          const dropLocations = carRentalSearchData?.dropLocations || [];
          const dates = dropLocations
            .filter((loc: any) => loc.nm === newLocationName)
            .map((loc: any) => loc.date)
            .filter((date: string) => date);
          const availableDates = [...new Set(dates)].sort() as string[];
          if (availableDates.length > 0) {
            setDropoffDate(availableDates[0]);
          } else {
            setDropoffDate('');
          }
        }
      }
    });

    locationBottomSheetRef.current?.present();
  }, [isPackageFlow, actionData, selectedDropoffLocation, dropoffApiLocations]);

  const showPickupTimeBottomSheet = useCallback(() => {
    pickupTimeBottomSheetRef.current?.present();
  }, []);

  const showDropoffTimeBottomSheet = useCallback(() => {
    dropoffTimeBottomSheetRef.current?.present();
  }, []);

  const showDriverAgeBottomSheet = useCallback(() => {
    // Generate age options from 18 to 99
    const ageOptions = Array.from({length: 82}, (_, index) => {
      const age = index + 18;
      return {
        id: age.toString(),
        name: `${age} years`,
      };
    });

    setBottomSheetLocationOptions(ageOptions);
    setBottomSheetTitle("Driver's Age");
    setBottomSheetSelectedLocationId(driverAge?.toString() || '');
    setBottomSheetOnSelect(() => (ageOption: {id: string; name: string}) => {
      const selectedAge = parseInt(ageOption.id, 10);
      setDriverAge(selectedAge.toString());
    });

    locationBottomSheetRef.current?.present();
  }, [driverAge]);

  const showPickupDateBottomSheet = useCallback(() => {
    let availableDates: string[] = [];

    if (
      isPackageFlow &&
      actionData?.otherData?.carRentalSearchData?.pickupLocations
    ) {
      // Package flow: get dates from the selected pickup location
      const selectedLocationName = pickupSearchTerm;
      if (!selectedLocationName) {
        Alert.alert('Please select a pickup location first');
        return;
      }

      const dates = actionData.otherData.carRentalSearchData.pickupLocations
        .filter((loc: any) => loc.nm === selectedLocationName)
        .map((loc: any) => loc.date)
        .filter((date: string) => date && date.trim() !== '');

      availableDates = [...new Set(dates)] as string[];
    } else {
      // Non-package flow: generate default date options (next 30 days)
      const today = new Date();
      availableDates = Array.from({length: 30}, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);
        return DateUtil.formatDate(date, 'yyyy-MM-dd');
      });
    }

    if (availableDates.length === 0) {
      Alert.alert('No dates available for the selected location');
      return;
    }

    const dateOptions = availableDates.map(date => ({
      id: date,
      name: DateUtil.formatDate(date, 'dd MMM yyyy'), // Format for display
    }));

    setBottomSheetLocationOptions(dateOptions);
    setBottomSheetTitle('Pick up Date');
    setBottomSheetSelectedLocationId(pickupDate);
    setBottomSheetOnSelect(() => (date: {id: string; name: string}) => {
      setPickupDate(date.id);
    });

    locationBottomSheetRef.current?.present();
  }, [isPackageFlow, actionData, pickupSearchTerm, pickupDate]);

  const showDropoffDateBottomSheet = useCallback(() => {
    let availableDates: string[] = [];

    if (
      isPackageFlow &&
      actionData?.otherData?.carRentalSearchData?.dropLocations
    ) {
      // Package flow: get dates from the selected dropoff location
      const selectedLocationName = dropoffSearchTerm;
      if (!selectedLocationName) {
        Alert.alert('Please select a dropoff location first');
        return;
      }

      const dates = actionData.otherData.carRentalSearchData.dropLocations
        .filter((loc: any) => loc.nm === selectedLocationName)
        .map((loc: any) => loc.date)
        .filter((date: string) => date && date.trim() !== '');

      availableDates = [...new Set(dates)] as string[];
    } else {
      // Non-package flow: generate default date options (next 30 days)
      const today = new Date();
      availableDates = Array.from({length: 30}, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);
        return DateUtil.formatDate(date, 'yyyy-MM-dd');

      
      });
    }

    if (availableDates.length === 0) {
      Alert.alert('No dates available for the selected location');
      return;
    }

    const dateOptions = availableDates.map(date => ({
      id: date,
      name: DateUtil.formatDate(date, 'dd MMM yyyy'), // Format for display
    }));

    setBottomSheetLocationOptions(dateOptions);
    setBottomSheetTitle('Drop off Date');
    setBottomSheetSelectedLocationId(dropoffDate);
    setBottomSheetOnSelect(() => (date: {id: string; name: string}) => {
      setDropoffDate(date.id);
    });

    locationBottomSheetRef.current?.present();
  }, [isPackageFlow, actionData, dropoffSearchTerm, dropoffDate]);

  const formatDate = (dateStr: string, timeStr: string = '09:00'): string => {
    if (dateStr) {
      if (dateStr.includes('-')) {
        return `${dateStr} ${timeStr}:00`;
      }
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} ${timeStr}:00`;
      }
    }
    return '';
  };

  const handleSearch = (): void => {
    if (!selectedPickupLocation) {
      Alert.alert('Please select a pickup location');
      return;
    }
    if (!selectedDropoffLocation) {
      Alert.alert('Please select a drop-off location');
      return;
    }
    if (!pickupDate) {
      Alert.alert('Please select a pickup date');
      return;
    }
    if (!dropoffDate) {
      Alert.alert('Please select a drop-off date');
      return;
    }

    const formattedPickupDate = formatDate(pickupDate, pickupTime);
    const formattedDropoffDate = formatDate(dropoffDate, dropoffTime);

    const searchPayload = isPackageFlow
      ? {
          carCat: selectedVehicleType === 'car' ? 'CAR' : 'MOTORHOME',
          pkupLoc: selectedPickupLocation,
          dropLoc: selectedDropoffLocation,
          pkupDate: formattedPickupDate,
          dropDate: formattedDropoffDate,
          tvlG: {
            tvlA: [selectedTvlG.toString()],
          },
          prCar: true,
          __xreq__: true,
          isPkgCfgMode: true,
          jid: journeyId,
          dCityExId: undefined,
          ...(driverAge && {driverAge: driverAge}),
        }
      : {
          carCat: selectedVehicleType === 'car' ? 'CAR' : 'MOTORHOME',
          pkupLoc: selectedPickupLocation,
          dropLoc: selectedDropoffLocation,
          pkupDate: formattedPickupDate,
          dropDate: formattedDropoffDate,
          prCar: true,
          __xreq__: true,
          ...(driverAge && {driverAge: driverAge}),
          tvlG: {
            tvlA: [selectedTvlG.toString()],
          },
        };

    dispatch(carSearch(searchPayload));

    setHasSearched(true);
    setShowModifySearch(false); // Hide form and show results after search
  };

  const handleCarSelect = (_carName: string): void => {
    const formattedPickupDate = formatDate(pickupDate, pickupTime);
    const formattedDropoffDate = formatDate(dropoffDate, dropoffTime);
    try {
      const params: any = {
        carkey: _carName,
        carCat: selectedVehicleType === 'car' ? 'CAR' : 'MOTORHOME',
        pkupLoc: selectedPickupLocation,
        dropLoc: selectedDropoffLocation,
        pkupDate: formattedPickupDate,
        dropDate: formattedDropoffDate,
        isPkgCfgMode: true,
        jid: journeyId,
        dCityExId: undefined,
        __xreq__: true,
        tvlG: {
          tvlA: [selectedTvlG.toString()],
        },
      };

      dispatch(fetchCarDetails(params));
      // Navigate to details screen
      navigation.navigate('CarRentalDetails', {
        carkey: _carName,
        selectedTvlG: [selectedTvlG.toString()],
        pickupLocation: pickupSearchTerm,
        dropoffLocation: dropoffSearchTerm,
        pickupTime: pickupTime,
        dropoffTime: dropoffTime,
      });
    } catch (error) {
      console.warn('Failed to fetch car details:', error);
    }
  };

  const sortedCarData = useMemo(() => {
    let dataToSort =
      filteredCarData.length > 0 ? filteredCarData : carSearchResults;

    // Apply search filter
    if (carSearchTerm.trim()) {
      dataToSort = dataToSort.filter(car => {
        const carName = car.vd?.vnm || '';
        const supplier = car.optr?.nm || '';
        return (
          carName.toLowerCase().includes(carSearchTerm.toLowerCase()) ||
          supplier.toLowerCase().includes(carSearchTerm.toLowerCase())
        );
      });
    }

    if (dataToSort.length > 0) {
      const carData = [...dataToSort];

      if (sortOrder === 'low-to-high') {
        return carData.sort((a, b) => a.prc - b.prc);
      } else if (sortOrder === 'high-to-low') {
        return carData.sort((a, b) => b.prc - a.prc);
      } else {
        return carData;
      }
    }
    return [];
  }, [sortOrder, carSearchResults, filteredCarData, carSearchTerm]);

  const displayedCarData = useMemo(() => {
    return sortedCarData.slice(0, displayedCount);
  }, [sortedCarData, displayedCount]);

  const hasMoreResults = sortedCarData.length > displayedCount;

  const handleShowMore = (): void => {
    setDisplayedCount(prev => prev + 100);
    // Scroll to show more button after state update
    setTimeout(() => {
      if (showMoreButtonRef.current && scrollViewRef.current) {
        showMoreButtonRef.current.measureLayout(
          scrollViewRef.current as any,
          (x: number, y: number) => {
            scrollViewRef.current?.scrollTo({y: y - 50, animated: true});
          },
          () => {},
        );
      }
    }, 100);
  };

  useEffect(() => {
    setDisplayedCount(100);
    setFilteredCarData([]);
    setCarSearchTerm('');
    setShowSearchInput(false);
  }, [carSearchResults]);

  useEffect(() => {
    const payload = defaultPayload as CarSearchParams;
    if (
      payload &&
      payload.pkupLoc &&
      payload.dropLoc &&
      payload.carCat &&
      payload.pkupDate &&
      payload.dropDate
    ) {
      dispatch(carSearch(payload));
    }
  }, [defaultPayload, dispatch]);

  const handleSortChange = (
    value: 'low-to-high' | 'high-to-low' | 'none',
  ): void => {
    setSortOrder(value);
  };

  const callCarRentalsList = useCallback(() => {
    const payload = defaultPayload as CarSearchParams;
    if (
      payload &&
      payload.pkupLoc &&
      payload.dropLoc &&
      payload.carCat &&
      payload.pkupDate &&
      payload.dropDate
    ) {
      dispatch(carSearch(payload));
    }
  }, [dispatch, defaultPayload]);

  useEffect(() => {
    callCarRentalsList();
  }, [callCarRentalsList]);

  useEffect(() => {
    // Log action data when component mounts or action changes
    if (action) {
      console.log('CarRentalSearchScreen - Action received:', action);
    }
  }, [action]); // Empty dependency array - runs once on mount

  const goBack = async () => {
    navigation.goBack();
  };
  console.log('pickupLocationOptions', pickupLocationOptions);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        style={[styles.safeArea, {backgroundColor: colors.white}]}
        edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <View
          style={[styles.headerContainer, {
            backgroundColor: colors.white,
            borderColor: colors.neutral200,
          }]}>
          <View style={styles.headerContent}>
            <ArrowLeft color={colors.neutral900} size={25} onPress={goBack} />
            <CustomText variant="text-lg-medium" color="neutral900">
              {hasSearched
                ? `Add Car Rental - ${pickupSearchTerm}`
                : 'Search result for Car Rentals'}
            </CustomText>
            {/* <Edit color={colors.white} size={25} onPress={() => {}} /> */}
            <View></View>
          </View>
        </View>
        <View style={styles.container}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Search Form - Show when showModifySearch is true or before first search */}
            {(showModifySearch || !hasSearched) && (
              <View style={styles.searchFormContainer}>
                <CustomText
                  variant="text-lg-semibold"
                  color="neutral900"
                  style={styles.sectionTitle}>
                  Search Car Rental
                </CustomText>

                {/* Vehicle Type Selector */}
                <VehicleTypeSelectorMobile
                  selectedType={selectedVehicleType}
                  onTypeChange={setSelectedVehicleType}
                />

                {isPackageFlow ? (
                  <>
                    {/* Figma-based Package Flow Layout - Updated to match exact Figma design */}
                    <View
                      style={[styles.packageFlowContainer, {
                        backgroundColor: colors.white,
                      }]}>
                      {/* Pickup Info Section */}
                      <View style={styles.fullWidth}>
                        <CustomText
                          variant="text-lg-semibold"
                          color="neutral900"
                          style={styles.sectionHeading}>
                          Pickup Info
                        </CustomText>
                        <View style={styles.fieldGap}>
                          {/* Pickup Location */}
                          <TouchableOpacity
                            onPress={showPickupLocationBottomSheet}
                            activeOpacity={0.7}>
                            <View
                              style={[styles.inputContainer, {
                                borderColor: colors.neutral200,
                              }]}>
                              <View style={styles.inputContent}>
                                <View
                                  style={styles.labelRow}>
                                  <CustomText
                                    variant="text-xs-normal"
                                    color="neutral500"
                                  >
                                    Pick-up Location
                                  </CustomText>
                                  <CustomText
                                    variant="text-xs-normal"
                                    color="neutral500"
                              >
                                    *
                                  </CustomText>
                                </View>
                                <CustomText
                                  variant="text-sm-medium"
                                  color={
                                    pickupSearchTerm
                                      ? 'neutral900'
                                      : 'neutral400'
                                  }
                                  
                                  numberOfLines={1}>
                                  {pickupSearchTerm || 'Pick-up from'}
                                </CustomText>
                              </View>
                              <View
                                style={styles.iconContainer}>
                                <ChevronDown
                                  color={colors.neutral500}
                                  size={12}
                                />
                              </View>
                            </View>
                          </TouchableOpacity>

                          {/* Pickup Date & Time Row */}
                          <View style={styles.rowContainer}>
                            {/* Pickup Date */}
                            <View style={styles.flexOne}>
                              <TouchableOpacity
                                onPress={showPickupDateBottomSheet}
                                activeOpacity={0.7}>
                                <View
                                  style={[styles.inputContainer, {
                                    borderColor: colors.neutral200,
                                  }]}>
                                  <View style={styles.inputContent}>
                                    <View
                                      style={styles.labelRow}>
                                      <CustomText
                                        variant="text-xs-normal"
                                        color="neutral500"
                                      >
                                        Pick up Date
                                      </CustomText>
                                      <CustomText
                                        variant="text-xs-normal"
                                        color="neutral500"
                                      >
                                        *
                                      </CustomText>
                                    </View>
                                    <CustomText
                                      variant="text-sm-medium"
                                      color={
                                        pickupDate ? 'neutral900' : 'neutral400'
                                      }
                                      style={{fontSize: 14}}
                                      numberOfLines={1}>
                                      {pickupDate
                                        ? DateUtil.formatDate(
                                            pickupDate,
                                            'dd MMM yyyy',
                                          )
                                        : 'Pick a date'}
                                    </CustomText>
                                  </View>
                                  <View
                                    style={styles.iconContainer}>
                                    <ChevronDown
                                      color={colors.neutral900}
                                      size={12}
                                    />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>

                            {/* Pickup Time */}
                            <View style={styles.flexOne}>
                              <TouchableOpacity
                                onPress={showPickupTimeBottomSheet}
                                activeOpacity={0.7}>
                                <View
                                  style={[styles.inputContainer, {
                                    borderColor: colors.neutral200,
                                  }]}>
                                  <View style={styles.inputContent}>
                                    <View
                                      style={styles.labelRow}>
                                      <CustomText
                                        variant="text-xs-normal"
                                        color="neutral500"
                                      >
                                        Pick up Time
                                      </CustomText>
                                      <CustomText
                                        variant="text-xs-normal"
                                        color="neutral500"
                                      >
                                        *
                                      </CustomText>
                                    </View>
                                    <CustomText
                                      variant="text-sm-medium"
                                      color={
                                        pickupTime ? 'neutral900' : 'neutral400'
                                      }
                                      style={{fontSize: 14}}
                                      numberOfLines={1}>
                                      {pickupTime
                                        ? pickupTimeOptions.find(
                                            opt => opt.value === pickupTime,
                                          )?.label || pickupTime
                                        : 'Select time'}
                                    </CustomText>
                                  </View>
                                  <View
                                    style={{
                                      width: 16,
                                      height: 16,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Clock3
                                      color={colors.neutral500}
                                      size={12}
                                    />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* Separator */}
                      <View
                        style={[styles.separator, {
                          backgroundColor: colors.neutral200,
                        }]}
                      />

                      {/* Drop-off Info Section */}
                      <View style={styles.fullWidth}>
                        <CustomText
                          variant="text-lg-semibold"
                          color="neutral900"
                          style={styles.sectionHeading}>
                          Drop-off Info
                        </CustomText>
                        <View style={styles.fieldGap}>
                          {/* Dropoff Location */}
                          <TouchableOpacity
                            onPress={showDropoffLocationBottomSheet}
                            activeOpacity={0.7}>
                            <View
                              style={[styles.dropoffInputContainer, {
                                borderColor: colors.neutral200,
                              }]}>
                              <View style={styles.inputContent}>
                                <View
                                  style={styles.labelRow}>
                                  <CustomText
                                    variant="text-xs-normal"
                                    color="neutral500"
                                  >
                                    Drop off Location
                                  </CustomText>
                                  <CustomText
                                    variant="text-xs-normal"
                                    color="neutral500"
                                  >
                                    *
                                  </CustomText>
                                </View>
                                <CustomText
                                  variant="text-sm-medium"
                                  color={
                                    dropoffSearchTerm
                                      ? 'neutral900'
                                      : 'neutral400'
                                  }
                                
                                  numberOfLines={1}>
                                  {dropoffSearchTerm || 'Same as pick-up'}
                                </CustomText>
                              </View>
                              <View
                                style={{
                                  width: 16,
                                  height: 16,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <ChevronDown
                                  color={colors.neutral900}
                                  size={12}
                                />
                              </View>
                            </View>
                          </TouchableOpacity>

                          {/* Dropoff Date & Time Row */}
                          <View style={styles.rowContainer}>
                            {/* Dropoff Date */}
                            <View style={styles.flexOne}>
                              <TouchableOpacity
                                onPress={showDropoffDateBottomSheet}
                                activeOpacity={0.7}>
                                <View
                                  style={{
                                    height: 56,
                                    borderWidth: 1,
                                    borderColor: colors.neutral200,
                                    borderRadius: 8,
                                    paddingHorizontal: 10,
                                    paddingVertical: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}>
                                  <View style={{flex: 1, gap: 4}}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-end',
                                        gap: 2,
                                      }}>
                                      <CustomText
                                        variant="text-xs-normal"
                                        color="neutral500"
                                      >
                                        Drop off Date
                                      </CustomText>
                                      <CustomText
                                        variant="text-xs-normal"
                                        color="neutral500"
                                      >
                                        *
                                      </CustomText>
                                    </View>
                                    <CustomText
                                      variant="text-sm-medium"
                                      color={
                                        dropoffDate
                                          ? 'neutral900'
                                          : 'neutral400'
                                      }
                                    
                                      numberOfLines={1}>
                                      {dropoffDate
                                        ? DateUtil.formatDate(
                                            dropoffDate,
                                            'dd MMM yyyy',
                                          )
                                        : 'Pick a date'}
                                    </CustomText>
                                  </View>
                                  <View
                                    style={{
                                      width: 16,
                                      height: 16,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <ChevronDown
                                      color={colors.neutral900}
                                      size={12}
                                    />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>

                            {/* Dropoff Time */}
                            <View style={{flex: 1}}>
                              <TouchableOpacity
                                onPress={showDropoffTimeBottomSheet}
                                activeOpacity={0.7}>
                                <View
                                  style={{
                                    height: 56,
                                    borderWidth: 1,
                                    borderColor: colors.neutral200,
                                    borderRadius: 8,
                                    paddingHorizontal: 10,
                                    paddingVertical: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}>
                                  <View style={{flex: 1, gap: 4}}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-end',
                                        gap: 2,
                                      }}>
                                      <CustomText
                                        variant="text-xs-normal"
                                        color="neutral500"
                                      >
                                        Drop off Time
                                      </CustomText>
                                      <CustomText
                                        variant="text-xs-normal"
                                        color="neutral500"
                          >
                                        *
                                      </CustomText>
                                    </View>
                                    <CustomText
                                      variant="text-sm-medium"
                                      color={
                                        dropoffTime
                                          ? 'neutral900'
                                          : 'neutral400'
                                      }
                                      style={{fontSize: 14}}
                                      numberOfLines={1}>
                                      {dropoffTime
                                        ? dropoffTimeOptions.find(
                                            opt => opt.value === dropoffTime,
                                          )?.label || dropoffTime
                                        : 'Select time'}
                                    </CustomText>
                                  </View>
                                  <View
                                    style={{
                                      width: 16,
                                      height: 16,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Clock3
                                      color={colors.neutral500}
                                      size={12}
                                    />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>

                      <Separator />

                      {/* Travellers & Driver Age Section */}
                      <View style={styles.fullWidth}>
                        <View style={styles.rowContainer}>
                          <View style={styles.flexOne}>
                            <TouchableOpacity
                              onPress={showTravellersBottomSheet}
                              activeOpacity={0.7}>
                              <View
                                style={[styles.travellersContainer, {
                                  borderColor: travellersError
                                    ? colors.red500
                                    : colors.neutral200,
                                }]}>
                                <View style={styles.inputContent}>
                                  <View
                                    style={styles.labelRow}>
                                    <CustomText
                                      variant="text-xs-normal"
                                      color={
                                        travellersError
                                          ? 'red500'
                                          : 'neutral500'
                                      }
                                    >
                                      Travellers
                                    </CustomText>
                                    <CustomText
                                      variant="text-xs-normal"
                                      color={
                                        travellersError
                                          ? 'red500'
                                          : 'neutral500'
                                      }
                                      style={{fontSize: 11}}>
                                      *
                                    </CustomText>
                                  </View>
                                  <CustomText
                                    variant="text-sm-medium"
                                    color={
                                      travellersError ? 'red500' : 'neutral900'
                                    }
                                    style={{fontSize: 14}}
                                    numberOfLines={1}>
                                    {selectedTvlG > 1
                                      ? `${selectedTvlG} Travellers`
                                      : `${selectedTvlG} Traveller`}
                                  </CustomText>
                                </View>
                                <View
                                  style={{
                                    width: 16,
                                    height: 16,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <ChevronDown
                                    color={
                                      travellersError
                                        ? colors.red500
                                        : colors.neutral900
                                    }
                                    size={12}
                                  />
                                </View>
                              </View>
                            </TouchableOpacity>
                            {travellersError ? (
                              <CustomText
                                variant="text-xs-normal"
                                color="red500"
                            >
                                {travellersError}
                              </CustomText>
                            ) : null}
                          </View>

                          {/* Driver Age */}
                          <View style={styles.flexOne}>
                            <TouchableOpacity
                              onPress={showDriverAgeBottomSheet}
                              activeOpacity={0.7}>
                              <View
                                style={{
                                  height: 56,
                                  borderWidth: 1,
                                  borderColor: colors.neutral200,
                                  borderRadius: 8,
                                  paddingHorizontal: 10,
                                  paddingVertical: 8,
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <View style={{flex: 1, gap: 4}}>
                                  <CustomText
                                    variant="text-xs-normal"
                                    color="neutral500">
                                    Driver's Age
                                  </CustomText>
                                  <CustomText
                                    variant="text-sm-medium"
                                    color={
                                      driverAge ? 'neutral900' : 'neutral400'
                                    }
                                    style={{fontSize: 14}}
                                    numberOfLines={1}>
                                    {driverAge ? `${driverAge} years` : ''}
                                  </CustomText>
                                </View>
                                <View
                                  style={{
                                    width: 16,
                                    height: 16,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <ChevronDown
                                    color={colors.neutral900}
                                    size={12}
                                  />
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <LocationSearchInputMobile
                      label="PICK-UP"
                      placeholder="Pick-up from"
                      value={pickupSearchTerm}
                      onChange={handleLocationSearch}
                      onLocationSelect={handlePickupLocationSelect}
                      locations={apiLocations as CarLocation[]}
                      loading={locationsLoading}
                      error={searchError as string | null}
                      showDropdown={showPickupDropdown}
                      setShowDropdown={setShowPickupDropdown}
                      useApiSearch={true}
                    />

                    {/* Pickup Date & Time */}
                    <DateTimePickerMobile
                      label="PICK-UP DATE"
                      date={pickupDate}
                      onDateChange={setPickupDate}
                      selectedTime={pickupTime}
                      onTimeChange={handlePickupTimeChange}
                      timeOptions={defaultTimeOptions}
                    />

                    {/* Dropoff Location */}
                    <LocationSearchInputMobile
                      label="DROP OFF"
                      placeholder="Same as pick-up"
                      value={dropoffSearchTerm}
                      onChange={handleDropoffLocationChange}
                      onLocationSelect={handleDropoffLocationSelect}
                      locations={dropoffApiLocations as CarLocation[]}
                      loading={dropoffLocationsLoading}
                      error={dropoffSearchError as string | null}
                      showDropdown={showDropoffDropdown}
                      setShowDropdown={setShowDropoffDropdown}
                      useApiSearch={true}
                    />

                    {/* Dropoff Date & Time */}
                    <DateTimePickerMobile
                      label="DROP OFF DATE"
                      date={dropoffDate}
                      onDateChange={setDropoffDate}
                      selectedTime={dropoffTime}
                      onTimeChange={handleDropoffTimeChange}
                      timeOptions={defaultTimeOptions}
                    />

                    {/* Driver Age */}
                    <DriverAgeInputMobile
                      label="Driver Age"
                      value={driverAge}
                      onChange={setDriverAge}
                      min={25}
                      max={99}
                    />
                  </>
                )}

                <View>
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                    activeOpacity={0.8}>
                    <CustomText variant="text-base-medium" color="neutral50">
                      Search
                    </CustomText>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Results Section - Only show when hasSearched is true AND showModifySearch is false */}
            {hasSearched && !showModifySearch && (
              <View style={styles.resultsContainer}>
                {carSearchLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.blue600} />
                    <CustomText
                      variant="text-sm-normal"
                      color="neutral600"
                      style={styles.loadingText}>
                      Searching for cars...
                    </CustomText>
                  </View>
                ) : carSearchError ? (
                  <View style={styles.errorContainer}>
                    <CircleX size={24} color={Colors.lightThemeColors.red700} />
                    <CustomText variant="text-sm-normal" color="red700">
                      {String(carSearchError)}
                    </CustomText>
                  </View>
                ) : displayedCarData.length === 0 ? (
                  <NoCarsMobile />
                ) : (
                  <>
                    {/* Results Header with Sort and Filter */}
                    <View style={styles.resultsHeader}>
                      {/* <SortHeaderMobile
                        totalResults={sortedCarData.length}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                        minPrice={
                          displayedCarData.length > 0
                            ? displayedCarData[0].prc
                            : undefined
                        }
                        maxPrice={
                          displayedCarData.length > 0
                            ? displayedCarData[displayedCarData.length - 1].prc
                            : undefined
                        }
                      /> */}
                      <View style={styles.rowView}>

                        {showSearchInput ? (
                          <View style={[styles.searchView, {flex: 1, marginRight: 12}]}>
                            <View style={[styles.viewButton, {paddingHorizontal: 8}]}>
                              <View style={styles.searchWrapper}>
                                <Search size={16} color={colors.neutral500} />
                              </View>
                              <TextInput
                                style={[
                                  styles.searchPlaceholder, 
                                  {
                                    flex: 1, 
                                    marginLeft: 4,
                                    color: colors.neutral900, // Ensure text is visible
                                
                                  }
                                ]}
                                placeholder="Search cars..."
                                placeholderTextColor={colors.neutral400}
                                value={carSearchTerm}
                                onChangeText={handleCarSearch}
                                autoFocus
                                returnKeyType="search"
                                selectionColor={colors.blue600} // Add selection color
                                onBlur={() => {
                                  if (!carSearchTerm.trim()) {
                                    setShowSearchInput(false);
                                  }
                                }}
                              />
                              {carSearchTerm.length > 0 && (
                                <TouchableOpacity
                                  onPress={() => {
                                    setCarSearchTerm('');
                                    setShowSearchInput(false);
                                  }}
                                  style={{padding: 4}}
                                >
                                  <X size={14} color={colors.neutral500} />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        ) : (
                          <View style={styles.searchView}>
                            <TouchableOpacity
                              style={styles.viewButton}
                              onPress={toggleSearchInput}
                              activeOpacity={0.7}
                            >
                              <View style={styles.searchWrapper}>
                                <Search size={16} color={colors.neutral500} />
                              </View>
                              <CustomText 
                                style={styles.searchPlaceholder}
                                numberOfLines={1}
                              >
                                {carSearchTerm.trim() ? `"${carSearchTerm}"` : 'Search'}
                              </CustomText>
                            </TouchableOpacity>
                          </View>
                        )}

                      
                        <TouchableOpacity
                          style={[
                            styles.filterButton,
                            {borderColor: colors.neutral200},
                          ]}
                          onPress={handleToggleFilter}
                          activeOpacity={0.8}>
                          <SlidersHorizontal
                            size={18}
                            color={colors.neutral600}
                          />
                          {filterCount > 0 && (
                            <View
                              style={[
                                styles.filterBadge,
                                {backgroundColor: colors.blue600},
                              ]}>
                              <CustomText
                                variant="text-xs-semibold"
                                color="white">
                                {filterCount}
                              </CustomText>
                            </View>
                          )}
                        </TouchableOpacity>


                           </View>
                      <View style={styles.headerActions}>
                      {/* Route Row and Change button in the same row */}
                      <View
                        style={styles.routeInfoContainer}
                      >
                        <View style={styles.routeInfoTextContainer}>
                          <View
                            style={styles.routeInfoRow}
                          >
                            <CustomText
                              style={[, {
                                color: colors.neutral900,
                              }]}
                              numberOfLines={1}
                            >
                              {pickupSearchTerm || selectedPickupLocation || 'Pick-up'}
                            </CustomText>
                            <ArrowRight size={16} color={colors.neutral900} />
                            <CustomText
                              style={[, {
                                color: colors.neutral900,
                              }]}
                              numberOfLines={1}
                            >
                              {dropoffSearchTerm || selectedDropoffLocation || 'Drop-off'}
                            </CustomText>
                          </View>
                          {/* Details Row */}
                          <View
                            style={styles.routeDetailsRow}
                          >
                            <CustomText
                              style={[, {
                                color: colors.neutral600,
                              }]}
                              numberOfLines={1}
                            >
                              {pickupDate && dropoffDate 
                                ? `${DateUtil.formatDate(pickupDate, 'dd MMM')} - ${DateUtil.formatDate(dropoffDate, 'dd MMM')}`
                                : 'Select dates'
                              }
                            </CustomText>
                            <CustomText
                              style={[, {
                                color: colors.neutral500,
                              }]}
                            >
                              •
                            </CustomText>
                            <CustomText
                              style={[, {
                                color: colors.neutral600,
                              }]}
                              numberOfLines={1}
                            >
                              {selectedTvlG > 1 ? `${selectedTvlG} Travellers` : `${selectedTvlG} Traveller`}
                            </CustomText>
                            {driverAge && (
                              <>
                                <CustomText
                                  style={{
                                   
                                  }}
                                >
                                  •
                                </CustomText>
                                <CustomText
                                  style={{
                                   
                                  }}
                                  numberOfLines={1}
                                >
                                  Age {driverAge}
                                </CustomText>
                              </>
                            )}
                          </View>
                        </View>
                        <TouchableOpacity
                          style={[
                            styles.changeButton,
                            {
                              backgroundColor: colors.white,
                              borderColor: colors.neutral200,
                            },
                          ]}
                          onPress={() => setShowModifySearch(true)}
                        >
                          <SquarePen size={16} color={colors.neutral900} />
                          <CustomText variant="text-sm-medium" color="neutral900">
                            Change
                          </CustomText>
                        </TouchableOpacity>
                      </View>
                      </View>
                    </View>

                    {/* Car Results List */}
                    {displayedCarData.map((carData, index) => {
                      const uniqueKey =
                        (carData as any).key || `car-${index}-${carData.prc}`;
                      const carDataTyped = carData as CarDataType;
                      return (
                        <CarResultCardMobile
                          key={uniqueKey}
                          carName={carDataTyped.vd?.vnm || 'Car'}
                          seats={carDataTyped.vd?.nst || 5}
                          doors={carDataTyped.vd?.ndr || 4}
                          bags={carDataTyped.vd?.slg || 2}
                          transmission={
                            carDataTyped.vd?.isAutoTx ? 'Automatic' : 'Manual'
                          }
                          airConditioning={carDataTyped.vd?.hasAC || true}
                          price={carDataTyped.prc}
                          displayPrice={
                            carDataTyped.prD || `$${carDataTyped.prc}`
                          }
                          imageUrl={
                            carDataTyped.vd?.img ||
                            'https://www.globalmediaserver.com/images/cars/default.jpg'
                          }
                          features={
                            carDataTyped.vd?.ftA || [
                              carDataTyped.fpl || 'Fuel policy not specified',
                            ]
                          }
                          pickupLocation={{
                            loc: carDataTyped.pkLoc?.loc,
                            isApt: carDataTyped.pkLoc?.isApt,
                            locTm: pickupTime,
                          }}
                          dropoffLocation={{
                            loc: carDataTyped.dpLoc?.loc,
                            isApt: carDataTyped.dpLoc?.isApt,
                            locTm: dropoffTime || pickupTime,
                          }}
                          onSelect={() =>
                            handleCarSelect((carDataTyped as any).key || 'Car')
                          }
                          supplier={carDataTyped.optr}
                          refundabletxt={(carDataTyped as any)?.xpSmry}
                        />
                      );
                    })}

                    {/* Show More Button */}
                    {hasMoreResults && (
                      <TouchableOpacity
                        ref={showMoreButtonRef}
                        style={[
                          styles.showMoreButton,
                          {borderColor: colors.neutral300},
                        ]}
                        onPress={handleShowMore}
                        activeOpacity={0.8}>
                        <CustomText variant="text-sm-medium" color="neutral900">
                          Show{' '}
                          {Math.min(100, sortedCarData.length - displayedCount)}{' '}
                          more ▼
                        </CustomText>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            )}
          </ScrollView>
        </View>

        {/* Error Toast Message */}
        {showError && (
          <View style={styles.errorToast}>
            <View style={styles.errorToastContent}>
              <CircleX size={20} color={Colors.lightThemeColors.red700} />
              <CustomText
                variant="text-sm-normal"
                color="red700"
              >
                {showMessage || 'Please fill all the required fields'}
              </CustomText>
            </View>
          </View>
        )}

        {/* Filter Sidebar Modal */}
        <CarFilterSidebarMobile
          isOpen={isFilterOpen}
          onClose={handleToggleFilter}
          carSearchResults={carSearchResults}
          onFilterChange={handleFilterChange}
          onFilterCountChange={handleFilterCountChange}
        />

        {/* Location Selection Bottom Sheet */}
        <LocationSelectionBottomSheet
          ref={locationBottomSheetRef}
          title={bottomSheetTitle}
          options={bottomSheetLocationOptions}
          onLocationSelect={bottomSheetOnSelect || (() => {})}
          selectedLocationId={bottomSheetSelectedLocationId}
        />

        {/* Pickup Time Selection Bottom Sheet */}
        <TimeSelectionBottomSheet
          ref={pickupTimeBottomSheetRef}
          title="Pick up Time"
          options={pickupTimeOptions}
          selectedValue={pickupTime}
          onTimeSelect={handlePickupTimeChange}
        />

        {/* Dropoff Time Selection Bottom Sheet */}
        <TimeSelectionBottomSheet
          ref={dropoffTimeBottomSheetRef}
          title="Drop off Time"
          options={dropoffTimeOptions}
          selectedValue={dropoffTime}
          onTimeSelect={handleDropoffTimeChange}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  // Header styles
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    borderBottomWidth: 1,
  },
  
  // Package flow styles
  packageFlowContainer: {
    gap: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  fullWidth: {
    width: '100%',
  },
  sectionHeading: {
    marginBottom: 10,
    fontSize: 18,
  },
  inputContainer: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContent: {
    flex: 1,
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  iconContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  flexOne: {
    flex: 1,
  },
  fieldGap: {
    gap: 20,
  },
  dropoffInputContainer: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // textInput: {
  //   fontSize: 14,
  // },
  // labelTextSmall: {
  //   fontSize: 11,
  // },
  travellersContainer: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // errorText: {
  //   fontSize: 10,
  //   marginTop: 4,
  //   marginLeft: 10,
  // },
  routeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    minHeight: 40,
  },
  routeInfoTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  routeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'nowrap',
    minWidth: 0,
  },
  // routeInfoText: {
  //   fontSize: 14,
  //   fontWeight: '600',
  //   lineHeight: 16,
  //   flexShrink: 1,
  //   minWidth: 0,
  // },
  routeDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    flexWrap: 'nowrap',
    minWidth: 0,
  },
  // routeDetailsText: {
  //   fontSize: 12,
  //   lineHeight: 14,
  //   flexShrink: 1,
  //   minWidth: 0,
  // },
  // routeDetailsDot: {
  //   fontSize: 14,
  //   lineHeight: 20,
  // },
  changeButton: {
    width: 91,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 1,
  },
 
  figmaHeader: {
    backgroundColor: Colors.lightThemeColors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
  },
  statusBar: {
    height: 44,
    backgroundColor: Colors.lightThemeColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  statusTime: {
    marginTop: 13,
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // timeText: {
  //   fontSize: 15,
  //   fontWeight: '600',
  //   letterSpacing: -0.17,
  //   textAlign: 'center',
  // },
  statusIcons: {
    marginTop: 16,
    width: 66.5,
    height: 12,
  },
  rowView:{
    flexDirection:'row',
    gap:8,

  },
  navigationHeader: {
    height: 56,
    backgroundColor: Colors.lightThemeColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 6,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.lightThemeColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  // headerTitle: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   lineHeight: 24,
  //   color: Colors.lightThemeColors.neutral900,
  // },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: 'normal',
    lineHeight: 12,
    letterSpacing: 0.11,
    color: Colors.lightThemeColors.neutral600,
  },
  figmaFormContainer: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
  },
  scrollView: {
    flex: 1,
  },
  figmaFieldSet: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 24,
    alignItems: 'center',
    width: 375,
    backgroundColor: Colors.lightThemeColors.white,
  },
  figmaSection: {
    width: 335,
    alignSelf: 'center',
  },
  figmaSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
    color: Colors.lightThemeColors.neutral900,
    marginBottom: 10,
  },
  figmaFieldGroup: {
    gap: 20,
  },
  figmaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  figmaRowItem: {
    flex: 1,
  },
  figmaBottomBar: {
    backgroundColor: Colors.lightThemeColors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightThemeColors.neutral100,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    maxWidth: 384,
    minWidth: 320,
    width: 375,
    alignSelf: 'center',
  },
  editButton:{
flexDirection:'row',
gap:6,
alignItems:'center',
  },
  figmaCancelButton: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1a1a1a',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  figmaSearchButton: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.neutral900,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1a1a1a',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Existing styles (preserved)
  packageFlowRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  packageFlowColumn: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
    width: '100%',
  },
  searchFormContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.lightThemeColors.white,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  vehicleTypeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  vehicleTypeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: Colors.lightThemeColors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteText: {
    marginBottom: 16,
    fontStyle: 'italic',
  },
  searchButton: {
    backgroundColor: Colors.lightThemeColors.neutral900,
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(26, 26, 26, 0.05)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  resultsHeader: {
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
    gap: 8,
  },
  filterBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showMoreButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.lightThemeColors.white,
  },
  errorToast: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.red200,
    backgroundColor: Colors.lightThemeColors.red50,
    borderRadius: 8,
    padding: 12,
  },
  errorToastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // warningIcon: {
  //   fontSize: 20,
  // },
  // errorText: {
  //   flex: 1,
  // },
  headerContent: {
    ...Typography.flex.row,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 16,
  },
  selectInput: {
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightThemeColors.white,
    gap: 4,
  },
  // selectLabel: {
  //   fontSize: 12,
  //   lineHeight: 16,
  //   textTransform: 'uppercase',
  //   letterSpacing: 0.5,
  // },
  // selectValue: {
  //   fontSize: 16,
  //   lineHeight: 24,
  // },
  searchView: {
    flex: 1,
  },
   viewButton: {
   backgroundColor: Colors.lightThemeColors.white,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    borderRadius: 8,
    paddingHorizontal: 12,
     paddingVertical: 8,
   flexDirection: 'row',
  alignItems: 'center',
    gap: 0,
     flex: 1,
    height: 40,
   },
  searchWrapper: {
    paddingRight: 8,
  },
  searchPlaceholder: {
    flex: 1,
   
    color: Colors.lightThemeColors.neutral100,
   
  },
});

export default CarRentalSearchScreen;
