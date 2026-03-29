import React, {useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  CustomBottomSheet,
  CustomText,
  SelectableInput,
} from '../../../common/components';
import {Colors, Outlines} from '../../../styles';
import {useBottomSheet} from '../../../common/hooks/useBottomSheet';
import {useTheme} from '../../../context/ThemeContext';
import {ClientDetailSection, Destination, TravelerSelection} from '..';
import {flex} from '../../../styles/typography';
import {Check, DoorOpen, Edit2, UserPlus} from 'lucide-react-native';
import shadows from '../../../styles/shadows';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {CitySuggestion} from '../redux/customTripSlice';
import AutoCompleteBottomSheet from '../../../common/components/AutoCompleteBottomSheet';
import AnimatedInput from '../../../common/components/AnimatedInput';
import AddTravelersBottomSheet from './AddTravelersBottomSheet';
import TravellerFormBottomSheet from './TravellerFormBottomSheet';

export interface Traveller {
  id: string;
  name: string;
  paxType: 'Adult' | 'Child';
  age: number | '';
  departureCity: CitySuggestion;
  classPreference: string;
  returnCity: CitySuggestion;
  travelDate: string;
  returnDate: string;
  customerId?: number | string;
  destinationIndex?: number;
  departureLate?: boolean;
  returnEarly?: boolean;
  birthdayDay?: string;
  birthdayMonth?: string;
  birthdayYear?: string;
  custdayBirth?: number;
  custmonthBirth?: number;
  custyearBirth?: number;
}

interface TravelAssignmentProps {
  travelerSelection: TravelerSelection;
  setClientDetails: React.Dispatch<React.SetStateAction<ClientDetailSection>>;
  clientDetailsData: any;
  destinations?: Destination[];
  tripDepartureDate?: string;
  leavingFromCity?: any;
}
const TravelAssignmentTable: React.FC<TravelAssignmentProps> = ({
  travelerSelection,
  setClientDetails,
  clientDetailsData,
  destinations = [],
  tripDepartureDate,
  leavingFromCity,
}) => {
  const {colors} = useTheme();
  const deCityBottomSheetOptions = useBottomSheet();
  const reCityBottomSheetOptions = useBottomSheet();
  const classPreferenceBottomSheetOptions = useBottomSheet();
  const travelDateBottomSheetOptions = useBottomSheet();
  const returnDateBottomSheetOptions = useBottomSheet();
  const AddTravelerBottomSheetRef = useRef<BottomSheetModalMethods>(null);

  // State to track focus for each traveller's age input
  const [ageFocusStates, setAgeFocusStates] = useState<{
    [key: string]: boolean;
  }>({});

  // State to track which traveller is being edited for class preference
  const [
    activeClassPreferenceTravellerId,
    setActiveClassPreferenceTravellerId,
  ] = useState<string | null>(null);

  // State to track which traveller is being edited for date selection
  const [activeDateTravellerId, setActiveDateTravellerId] = useState<
    string | null
  >(null);
  const [activeDateField, setActiveDateField] = useState<
    'travelDate' | 'returnDate' | null
  >(null);

  // State to track which traveller is being edited
  const [activeTravellerId, setActiveTravellerId] = useState<string | null>(
    null,
  );
  const [activeCityField, setActiveCityField] = useState<
    'departureCity' | 'returnCity' | null
  >(null);

  const formatDate = React.useCallback((date: string): string => {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, []);

  // Removed legacy date calculators; dates are now derived from tripDateOptions

  const getDepartureCityForDestination = React.useCallback(
    (destinationIndex: number): CitySuggestion => {
      return (
        leavingFromCity || {
          value: 'Bangalore, India',
          data: {rnm: 'Bangalore', id: 1, nm: 'Bangalore'},
        }
      );
    },
    [leavingFromCity],
  );

  const getReturnCityForDestination = React.useCallback(
    (destinationIndex: number): CitySuggestion => {
      return (
        leavingFromCity || {
          value: 'Bangalore, India',
          data: {rnm: 'Bangalore', id: 1, nm: 'Bangalore'},
        }
      );
    },
    [leavingFromCity],
  );

  const createCitySuggestion = React.useCallback(
    (
      cityNm: string | undefined,
      cityId: number | undefined,
    ): CitySuggestion | null => {
      if (!cityNm || !cityId) return null;
      return {
        value: cityNm,
        data: {
          rnm: cityNm,
          id: cityId,
          nm: cityNm,
        },
        _scr: 0,
      };
    },
    [],
  );

  // Build trip-wide date options from start date through total nights (inclusive)
  const tripDateOptions = React.useMemo(() => {
    if (!tripDepartureDate) return [] as string[];
    const totalNights = (destinations || []).reduce(
      (sum, d) => sum + (d?.nights || 0),
      0,
    );
    const adjustedNights = totalNights + 2; // add 2 extra nights beyond backend-provided nights
    const dates: string[] = [];
    const start = new Date(tripDepartureDate);
    if (isNaN(start.getTime())) return [];
    for (let i = 0; i <= adjustedNights; i++) {
      const dt = new Date(start);
      dt.setDate(start.getDate() + i);
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      dates.push(`${yyyy}-${mm}-${dd}`);
    }
    return dates;
  }, [tripDepartureDate, destinations]);

  // Prefill default departure/return dates from trip range
  React.useEffect(() => {
    if (tripDateOptions.length === 0) return;
    const first = tripDateOptions[0];
    const last = tripDateOptions[tripDateOptions.length - 3] || '';
    setTravellers(prev =>
      prev.map(t => ({
        ...t,
        travelDate: t.travelDate || first,
        returnDate: t.returnDate || last,
      })),
    );
  }, [tripDateOptions]);

  const generateTravellers = React.useCallback(() => {
    const result: Traveller[] = [];
    let idx = 1;
    let destinationCounter = 0;
    const serverTravelers: any[] = clientDetailsData?._data?.travelers || [];

    // If no destinations, use defaults
    if (destinations.length === 0) {
      const defaultDepartureCity = leavingFromCity || {
        value: 'Bangalore, India',
        data: {rnm: 'Bangalore', id: 1, nm: 'Bangalore'},
        _scr: 0,
      };
      const defaultReturnCity = {
        value: 'Singapore, Singapore',
        data: {rnm: 'Singapore', id: 2, nm: 'Singapore'},
        _scr: 0,
      };

      travelerSelection.rooms.forEach((room, roomIndex) => {
        for (let i = 0; i < room.adults; i++) {
          const serverTraveler = serverTravelers[idx - 1] || {};
          const travelDate =
            serverTraveler.travelDate || tripDateOptions[0] || '';
          const returnDate =
            serverTraveler.returnDate ||
            tripDateOptions[tripDateOptions.length - 3] ||
            '';

          // Use server city data if available
          const serverDepartureCity = createCitySuggestion(
            serverTraveler.exCityNm,
            serverTraveler.exCityId,
          );
          const serverReturnCity = createCitySuggestion(
            serverTraveler.returnCityNm,
            serverTraveler.returnCityId,
          );

          result.push({
            id: `room-${roomIndex}-adult-${i}`, // Always use room-based ID
            name: serverTraveler.name || `Traveller ${idx}`,
            paxType: 'Adult',
            age:
              typeof serverTraveler.age === 'number'
                ? serverTraveler.age
                : typeof serverTraveler.age === 'string' && serverTraveler.age
                ? parseInt(serverTraveler.age, 10) || 0
                : 0,
            departureCity: serverDepartureCity || defaultDepartureCity,
            classPreference: serverTraveler.transportCategory || 'VALUE',
            returnCity: serverReturnCity || defaultReturnCity,
            travelDate,
            returnDate,
            destinationIndex: 0,
            departureLate:
              !!(
                serverTraveler.travelDate &&
                serverTraveler.travelDate.trim() !== ''
              ) || !!(serverTraveler.departureLate || serverTraveler.depLate),
            returnEarly:
              !!(
                serverTraveler.returnDate &&
                serverTraveler.returnDate.trim() !== ''
              ) || !!(serverTraveler.returnEarly || serverTraveler.retEarly),
          });
          idx++;
        }

        if (Array.isArray(room.children)) {
          room.children.forEach((child, childIndex) => {
            let ageNum: number | '' = '';
            if (typeof child.age === 'string') {
              const match = child.age.match(/^(\d+)/);
              ageNum = match ? parseInt(match[1], 10) : 8;
            }
            const serverTraveler = serverTravelers[idx - 1] || {};
            const travelDate =
              serverTraveler.travelDate || tripDateOptions[0] || '';
            const returnDate =
              serverTraveler.returnDate ||
              tripDateOptions[tripDateOptions.length - 3] ||
              '';

            // Use server city data if available
            const serverDepartureCity = createCitySuggestion(
              serverTraveler.exCityNm,
              serverTraveler.exCityId,
            );
            const serverReturnCity = createCitySuggestion(
              serverTraveler.returnCityNm,
              serverTraveler.returnCityId,
            );

            result.push({
              id: `room-${roomIndex}-child-${childIndex}`, // Always use room-based ID
              name: serverTraveler.name || `Traveller ${idx}`,
              paxType: 'Child',
              age:
                typeof serverTraveler.age === 'number'
                  ? serverTraveler.age
                  : typeof serverTraveler.age === 'string' && serverTraveler.age
                  ? parseInt(serverTraveler.age, 10) || ageNum
                  : ageNum,
              departureCity: serverDepartureCity || defaultDepartureCity,
              classPreference: serverTraveler.transportCategory || 'VALUE',
              travelDate,
              returnCity: serverReturnCity || defaultReturnCity,
              returnDate,
              destinationIndex: 0,
              departureLate:
                !!(
                  serverTraveler.travelDate &&
                  serverTraveler.travelDate.trim() !== ''
                ) || !!(serverTraveler.departureLate || serverTraveler.depLate),
              returnEarly:
                !!(
                  serverTraveler.returnDate &&
                  serverTraveler.returnDate.trim() !== ''
                ) || !!(serverTraveler.returnEarly || serverTraveler.retEarly),
            });
            idx++;
          });
        }
      });
      return result;
    }

    travelerSelection.rooms.forEach((room, roomIndex) => {
      for (let i = 0; i < room.adults; i++) {
        const destinationIndex = destinationCounter % destinations.length;
        const serverTraveler = serverTravelers[idx - 1] || {};

        // Use server city data if available, otherwise use defaults
        const serverDepartureCity = createCitySuggestion(
          serverTraveler.exCityNm,
          serverTraveler.exCityId,
        );
        const serverReturnCity = createCitySuggestion(
          serverTraveler.returnCityNm,
          serverTraveler.returnCityId,
        );

        const departureCity =
          serverDepartureCity ||
          getDepartureCityForDestination(destinationIndex);
        const returnCity =
          serverReturnCity || getReturnCityForDestination(destinationIndex);

        const travelDate =
          serverTraveler.travelDate || tripDateOptions[0] || '';
        const returnDate =
          serverTraveler.returnDate ||
          tripDateOptions[tripDateOptions.length - 3] ||
          '';

        result.push({
          id: `room-${roomIndex}-adult-dest-${i}`, // Always use room-based ID
          name: serverTraveler.name || `Traveller ${idx}`,
          paxType: 'Adult',
          age:
            typeof serverTraveler.age === 'number'
              ? serverTraveler.age
              : typeof serverTraveler.age === 'string' && serverTraveler.age
              ? parseInt(serverTraveler.age, 10) || 0
              : 0,
          departureCity,
          classPreference: serverTraveler.transportCategory || 'VALUE',
          travelDate,
          returnCity,
          returnDate,
          destinationIndex,
          departureLate:
            !!(
              serverTraveler.travelDate &&
              serverTraveler.travelDate.trim() !== ''
            ) || !!(serverTraveler.departureLate || serverTraveler.depLate),
          returnEarly:
            !!(
              serverTraveler.returnDate &&
              serverTraveler.returnDate.trim() !== ''
            ) || !!(serverTraveler.returnEarly || serverTraveler.retEarly),
        });
        idx++;
        destinationCounter++;
      }

      if (Array.isArray(room.children)) {
        room.children.forEach((child, childIndex) => {
          let ageNum: number | '' = '';
          if (typeof child.age === 'string') {
            const match = child.age.match(/^(\d+)/);
            ageNum = match ? parseInt(match[1], 10) : 8;
          }

          const destinationIndex = destinationCounter % destinations.length;
          const destination = destinations[destinationIndex];
          const nights = destination?.nights || 0;

          const serverTraveler = serverTravelers[idx - 1] || {};

          // Use server city data if available, otherwise use defaults
          const serverDepartureCity = createCitySuggestion(
            serverTraveler.exCityNm,
            serverTraveler.exCityId,
          );
          const serverReturnCity = createCitySuggestion(
            serverTraveler.returnCityNm,
            serverTraveler.returnCityId,
          );

          const departureCity =
            serverDepartureCity ||
            getDepartureCityForDestination(destinationIndex);
          const returnCity =
            serverReturnCity || getReturnCityForDestination(destinationIndex);

          const travelDate =
            serverTraveler.travelDate || tripDateOptions[0] || '';
          const returnDate =
            serverTraveler.returnDate ||
            tripDateOptions[tripDateOptions.length - 3] ||
            '';

          result.push({
            id: `room-${roomIndex}-child-dest-${childIndex}`, // Always use room-based ID
            name: serverTraveler.name || `Traveller ${idx}`,
            paxType: 'Child',
            age:
              typeof serverTraveler.age === 'number'
                ? serverTraveler.age
                : typeof serverTraveler.age === 'string' && serverTraveler.age
                ? parseInt(serverTraveler.age, 10) || ageNum
                : ageNum,
            departureCity,
            classPreference: serverTraveler.transportCategory || 'VALUE',
            travelDate,
            returnCity,
            returnDate,
            destinationIndex,
            departureLate:
              !!(
                serverTraveler.travelDate &&
                serverTraveler.travelDate.trim() !== ''
              ) || !!(serverTraveler.departureLate || serverTraveler.depLate),
            returnEarly:
              !!(
                serverTraveler.returnDate &&
                serverTraveler.returnDate.trim() !== ''
              ) || !!(serverTraveler.returnEarly || serverTraveler.retEarly),
          });
          idx++;
          destinationCounter++;
        });
      }
    });
    return result;
  }, [
    destinations,
    travelerSelection.rooms,
    leavingFromCity,
    getDepartureCityForDestination,
    getReturnCityForDestination,
    tripDateOptions,
    clientDetailsData?._data?.travelers,
    createCitySuggestion,
  ]);

  const [travellers, setTravellers] = useState<Traveller[]>(
    generateTravellers(),
  );

  React.useEffect(() => {
    if (!tripDepartureDate || tripDateOptions.length === 0) return;
    const first = tripDateOptions[0] || '';
    const last = tripDateOptions[tripDateOptions.length - 3] || '';
    const serverTravelers: any[] = clientDetailsData?._data?.travelers || [];

    setTravellers(prev =>
      prev.map((traveller, idx) => {
        const serverTraveler = serverTravelers[idx] || {};
        const travelDate =
          serverTraveler.travelDate || traveller.travelDate || first;
        const returnDate =
          serverTraveler.returnDate || traveller.returnDate || last;
        // Use dates from server if available, otherwise use tripDateOptions
        return {
          ...traveller,
          travelDate,
          returnDate,
          departureLate:
            serverTraveler.travelDate && serverTraveler.travelDate.trim() !== ''
              ? true
              : traveller.departureLate,
          returnEarly:
            serverTraveler.returnDate && serverTraveler.returnDate.trim() !== ''
              ? true
              : traveller.returnEarly,
        };
      }),
    );
  }, [
    tripDepartureDate,
    tripDateOptions,
    destinations,
    clientDetailsData?._data?.travelers,
  ]);

  React.useEffect(() => {
    if (leavingFromCity || destinations.length > 0) {
      const serverTravelers: any[] = clientDetailsData?._data?.travelers || [];
      const hasPrefs = !!clientDetailsData?._data?.hasTvlrPref;

      setTravellers(prev =>
        prev.map((traveller, idx) => {
          const destinationIndex = traveller.destinationIndex ?? 0;
          const serverTraveler = serverTravelers[idx] || {};

          // If server has preferences, use server city data, otherwise use defaults
          const serverDepartureCity = hasPrefs
            ? createCitySuggestion(
                serverTraveler.exCityNm,
                serverTraveler.exCityId,
              )
            : null;
          const serverReturnCity = hasPrefs
            ? createCitySuggestion(
                serverTraveler.returnCityNm,
                serverTraveler.returnCityId,
              )
            : null;

          const departureCity =
            serverDepartureCity ||
            getDepartureCityForDestination(destinationIndex);
          const returnCity =
            serverReturnCity || getReturnCityForDestination(destinationIndex);

          // Use dates from server if available, otherwise use tripDateOptions or existing traveller dates
          const travelDate =
            serverTraveler.travelDate ||
            traveller.travelDate ||
            tripDateOptions[0] ||
            '';
          const returnDate =
            serverTraveler.returnDate ||
            traveller.returnDate ||
            tripDateOptions[tripDateOptions.length - 3] ||
            '';

          return {
            ...traveller,
            departureCity,
            returnCity,
            travelDate,
            returnDate,
            departureLate:
              hasPrefs &&
              serverTraveler.travelDate &&
              serverTraveler.travelDate.trim() !== ''
                ? true
                : hasPrefs &&
                  (serverTraveler.departureLate !== undefined ||
                    serverTraveler.depLate !== undefined)
                ? !!(serverTraveler.departureLate || serverTraveler.depLate)
                : traveller.departureLate,
            returnEarly:
              hasPrefs &&
              serverTraveler.returnDate &&
              serverTraveler.returnDate.trim() !== ''
                ? true
                : hasPrefs &&
                  (serverTraveler.returnEarly !== undefined ||
                    serverTraveler.retEarly !== undefined)
                ? !!(serverTraveler.returnEarly || serverTraveler.retEarly)
                : traveller.returnEarly,
          };
        }),
      );
    }
  }, [
    leavingFromCity,
    destinations,
    getDepartureCityForDestination,
    getReturnCityForDestination,
    tripDepartureDate,
    tripDateOptions,
    clientDetailsData?._data?.travelers,
    clientDetailsData?._data?.hasTvlrPref,
    createCitySuggestion,
  ]);

  const [editingTraveller, setEditingTraveller] = useState<Traveller | null>(
    null,
  );
  const [assigningTraveller, setAssigningTraveller] =
    useState<Traveller | null>(null);

  const handleSelectTraveller = (travellerOption: {
    id: string;
    name: string;
    customerId?: number | string;
    age?: number;
  }) => {
    if (assigningTraveller) {
      // Update existing traveller with selected traveller data
      const updatedTraveller: Traveller = {
        ...assigningTraveller,
        name: travellerOption.name,
        customerId: travellerOption.customerId,
        age:
          travellerOption.age !== undefined
            ? travellerOption.age
            : assigningTraveller.age,
      };

      setTravellers(
        travellers.map(t =>
          t.id === assigningTraveller.id ? updatedTraveller : t,
        ),
      );
      setAssigningTraveller(null);
    }
    // Close the AddTravelersBottomSheet after selection
    AddTravelerBottomSheetRef.current?.dismiss();
  };

  const handleEditTravellerSave = (travellerData: any, custID: any) => {
    if (!editingTraveller) return;

    const ageValue: number | '' =
      travellerData.age !== undefined && travellerData.age !== null
        ? typeof travellerData.age === 'number'
          ? travellerData.age
          : parseInt(travellerData.age, 10) || ''
        : editingTraveller.age;

    const updatedTraveller: Traveller = {
      ...editingTraveller,
      name:
        `${travellerData.firstName || ''} ${
          travellerData.lastName || ''
        }`.trim() ||
        travellerData.firstName ||
        editingTraveller.name,
      customerId: custID || editingTraveller.customerId,
      age: ageValue,

      birthdayDay: travellerData.birthdayDay ?? editingTraveller.birthdayDay,
      birthdayMonth:
        travellerData.birthdayMonth ?? editingTraveller.birthdayMonth,
      birthdayYear: travellerData.birthdayYear ?? editingTraveller.birthdayYear,
      custdayBirth: travellerData.birthdayDay
        ? Number(travellerData.birthdayDay)
        : editingTraveller.custdayBirth,
      custmonthBirth: travellerData.birthdayMonth
        ? Number(travellerData.birthdayMonth)
        : editingTraveller.custmonthBirth,
      custyearBirth: travellerData.birthdayYear
        ? Number(travellerData.birthdayYear)
        : editingTraveller.custyearBirth,
    };

    setTravellers(prev =>
      prev.map(t => (t.id === editingTraveller.id ? updatedTraveller : t)),
    );
    setEditingTraveller(null);
  };

  // Inline field change handler for traveller table
  const handleTravellerFieldChange = (
    id: string,
    field: keyof Traveller,
    value: string | number | CitySuggestion | boolean,
  ) => {
    const serverTravelers: any[] = clientDetailsData?._data?.travelers || [];
    const defaultTravelDate = tripDateOptions[0] || '';
    const defaultReturnDate = tripDateOptions[tripDateOptions.length - 3] || '';

    setTravellers(prev =>
      prev.map((t, idx) => {
        if (t.id !== id) return t;

        // Get server data for this traveller if available
        // Try to match by customerId first, then fall back to index
        const serverTraveler =
          t.customerId !== undefined
            ? serverTravelers.find(
                (st: any) =>
                  st.id === t.customerId || st.paxIndex === t.customerId,
              ) ||
              serverTravelers[idx] ||
              {}
            : serverTravelers[idx] || {};

        if (field === 'age') {
          const ageNum = value === '' ? '' : Number(value);
          return {...t, age: ageNum};
        }

        if (field === 'classPreference') {
          return {
            ...t,
            classPreference: typeof value === 'string' ? value : '',
          };
        }

        if (
          field === 'departureCity' &&
          typeof value === 'object' &&
          value !== null
        ) {
          return {
            ...t,
            departureCity: value as CitySuggestion,
          };
        }

        if (
          field === 'returnCity' &&
          typeof value === 'object' &&
          value !== null
        ) {
          return {
            ...t,
            returnCity: value as CitySuggestion,
          };
        }

        if (field === 'travelDate') {
          return {
            ...t,
            travelDate: value as string,
            returnDate: tripDateOptions[tripDateOptions.length - 3] || '',
          };
        }

        if (field === 'departureLate') {
          // When unchecking, restore to API data if available, otherwise use default
          const restoredTravelDate =
            value === false
              ? serverTraveler.travelDate || defaultTravelDate
              : t.travelDate;
          return {
            ...t,
            departureLate: value as boolean,
            travelDate: restoredTravelDate,
          };
        }

        if (field === 'returnEarly') {
          // When unchecking, restore to API data if available, otherwise use default
          const restoredReturnDate =
            value === false
              ? serverTraveler.returnDate || defaultReturnDate
              : t.returnDate;
          return {
            ...t,
            returnEarly: value as boolean,
            returnDate: restoredReturnDate,
          };
        }

        return {
          ...t,
          [field]: value,
        };
      }),
    );
  };

  React.useEffect(() => {
    setClientDetails(prev => {
      const serverTravelers = clientDetailsData?._data?.travelers || [];
      return {
        ...prev,
        travelers: travellers.map((t, idx) => {
          const serverTraveler = serverTravelers[idx] || {};
          const travelerObj: any = {
            id: idx,
            paxIndex: serverTraveler.paxIndex ?? idx,
            roomNum: serverTraveler.roomNum ?? undefined,
            customerId: t.customerId ?? '',
            name: t.name,
            age:
              typeof t.age === 'string'
                ? t.age
                  ? parseInt(t.age, 10)
                  : null
                : t.age || null,
            exCityId:
              t.departureCity && t.departureCity.data
                ? t.departureCity.data.id
                : 0,
            returnCityId:
              t.returnCity && t.returnCity.data ? t.returnCity.data.id : 0,
            transportCategory: t.classPreference || '',
          };

          // Only include travelDate and departureLate if "Depart late" checkbox is selected
          if (t.departureLate === true) {
            travelerObj.departureLate = true;
            // Only include travelDate if it has a valid value
            if (t.travelDate && t.travelDate.trim() !== '') {
              travelerObj.travelDate = t.travelDate;
            }
          }

          // Only include returnDate and returnEarly if "Return Early" checkbox is selected
          if (t.returnEarly === true) {
            travelerObj.returnEarly = true;
            // Only include returnDate if it has a valid value
            if (t.returnDate && t.returnDate.trim() !== '') {
              travelerObj.returnDate = t.returnDate;
            }
          }

          return travelerObj;
        }),
      };
    });
  }, [travellers, setClientDetails, clientDetailsData]);

  // Group travellers by room
  let travellerIdx = 0;
  const rooms = travelerSelection.rooms.map((room, roomIdx) => {
    const roomTravellers = [];
    for (let i = 0; i < room.adults; i++) {
      if (travellerIdx < travellers.length) {
        roomTravellers.push(travellers[travellerIdx]);
        travellerIdx++;
      }
    }
    for (let i = 0; i < room.children.length; i++) {
      if (travellerIdx < travellers.length) {
        roomTravellers.push(travellers[travellerIdx]);
        travellerIdx++;
      }
    }
    return {roomIdx, roomTravellers};
  });

  return (
    <View style={styles.container}>
      <CustomText
        variant="text-lg-semibold"
        color="neutral900"
        style={styles.headerText}>
        Traveller Assignment
      </CustomText>
      {rooms.map(({roomIdx, roomTravellers}) => (
        <View key={roomIdx}>
          <View style={styles.roomHeader}>
            <DoorOpen
              size={18}
              color={colors.blue500}
              style={styles.iconContainer}
            />
            <CustomText variant="text-sm-semibold" color="blue500">
              Room {roomIdx + 1}
            </CustomText>
          </View>
          {roomTravellers.map(t => {
            // Create handlers with captured traveller ID to avoid closure issues
            const travellerId = t.id;

            // Create focus state management for this specific traveller
            const isTravellerFocused = ageFocusStates[travellerId] || false;
            const setTravellerFocused = (
              value: React.SetStateAction<boolean>,
            ) => {
              setAgeFocusStates(prev => ({
                ...prev,
                [travellerId]:
                  typeof value === 'function'
                    ? value(prev[travellerId] || false)
                    : value,
              }));
            };

            const handleDepartureCityPress = () => {
              setActiveTravellerId(travellerId);
              setActiveCityField('departureCity');
              deCityBottomSheetOptions.openBottomSheet();
            };

            const handleReturnCityPress = () => {
              setActiveTravellerId(travellerId);
              setActiveCityField('returnCity');
              reCityBottomSheetOptions.openBottomSheet();
            };

            return (
              <View key={t.id} style={styles.roomCard}>
                <View style={styles.roomHeaderTxt}>
                  <CustomText variant="text-base-medium" color="neutral900">
                    {t.name}
                  </CustomText>
                  <View style={styles.actionButtonsContainer}>
                    {t.customerId ? (
                      <TouchableOpacity
                        onPress={() => {
                          setEditingTraveller(t);
                        }}>
                        <Edit2 size={18} color={colors.neutral900} />
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      onPress={() => {
                        setAssigningTraveller(t);
                        AddTravelerBottomSheetRef.current?.present();
                      }}>
                      <UserPlus size={18} color={colors.neutral900} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.destinationRow}>
                  {/* Pax Type*/}
                  <View style={styles.destinationInput}>
                    <SelectableInput
                      label="Pax Type"
                      displayValue={t.paxType || '-'}
                      hasValue={!!t.paxType}
                      onPress={() => {}}
                      containerStyle={styles.containerNoMargin}
                    />
                  </View>
                  {/* age */}
                  <View style={styles.leavingOnInput}>
                    <View style={[styles.inputText, styles.ageInputContainer]}>
                      <AnimatedInput
                        label="Age"
                        setFocused={setTravellerFocused}
                        textStyle={styles.textInputStyle}
                        isFocused={isTravellerFocused}
                        value={t.age === '' || t.age === 0 ? '' : String(t.age)}
                        onChangeText={value => {
                          if (value === '') {
                            handleTravellerFieldChange(t.id, 'age', '');
                          } else {
                            const numericValue = parseInt(value, 10);
                            if (
                              !isNaN(numericValue) &&
                              numericValue >= 0 &&
                              numericValue <= 110
                            ) {
                              handleTravellerFieldChange(
                                t.id,
                                'age',
                                numericValue,
                              );
                            }
                          }
                        }}
                        keyboardType="numeric"
                        maxLength={3}
                        openBottomSheet={undefined}
                        autoComplete="off"
                        textContentType="none"
                      />
                    </View>
                  </View>
                </View>
                <View style={[styles.destinationRow, styles.sectionSpacing]}>
                  {/* Departure City */}
                  <View style={styles.destinationInput}>
                    <SelectableInput
                      label="Departure City"
                      displayValue={t.departureCity.value || ''}
                      hasValue={!!t.departureCity}
                      onPress={handleDepartureCityPress}
                      required={true}
                      containerStyle={styles.containerNoMargin}
                    />
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => {
                        handleTravellerFieldChange(
                          travellerId,
                          'departureLate',
                          !t.departureLate,
                        );
                      }}>
                      <View
                        style={[
                          styles.checkbox,
                          t.departureLate
                            ? styles.checkboxActive
                            : styles.checkboxInactive,
                        ]}>
                        {t.departureLate && (
                          <Check
                            size={16}
                            color={colors.white}
                            strokeWidth={3}
                          />
                        )}
                      </View>
                      <CustomText variant="text-sm-normal" color="neutral600">
                        Depart late
                      </CustomText>
                    </TouchableOpacity>
                    {t.departureLate && (
                      <SelectableInput
                        label="Departure Date"
                        displayValue={formatDate(t.travelDate) || ''}
                        hasValue={!!t.travelDate}
                        onPress={() => {
                          setActiveDateTravellerId(travellerId);
                          setActiveDateField('travelDate');
                          travelDateBottomSheetOptions.openBottomSheet();
                        }}
                        containerStyle={styles.containerZero}
                      />
                    )}
                  </View>

                  {/* Return City */}
                  <View style={styles.leavingOnInput}>
                    <SelectableInput
                      label="Return City"
                      displayValue={t.returnCity.value || ''}
                      hasValue={!!t.returnCity}
                      onPress={handleReturnCityPress}
                      required={true}
                      containerStyle={styles.containerNoMargin}
                    />
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => {
                        handleTravellerFieldChange(
                          travellerId,
                          'returnEarly',
                          !t.returnEarly,
                        );
                      }}>
                      <View
                        style={[
                          styles.checkbox,
                          t.returnEarly
                            ? styles.checkboxActive
                            : styles.checkboxInactive,
                        ]}>
                        {t.returnEarly && (
                          <Check
                            size={16}
                            color={colors.white}
                            strokeWidth={3}
                          />
                        )}
                      </View>
                      <CustomText variant="text-sm-normal" color="neutral600">
                        Return early
                      </CustomText>
                    </TouchableOpacity>
                    {t.returnEarly && (
                      <SelectableInput
                        label="Return Date"
                        displayValue={formatDate(t.returnDate) || ''}
                        hasValue={!!t.returnDate}
                        onPress={() => {
                          setActiveDateTravellerId(travellerId);
                          setActiveDateField('returnDate');
                          returnDateBottomSheetOptions.openBottomSheet();
                        }}
                        containerStyle={styles.containerZero}
                      />
                    )}
                  </View>
                </View>
                {/* Class Preference */}
                <View style={[styles.leavingOnInput]}>
                  <SelectableInput
                    label="Class"
                    displayValue={
                      t.classPreference
                        ? (clientDetailsData?._data?.txptCatA || [])?.find(
                            (option: any) => option.id === t.classPreference,
                          )?.text || t.classPreference
                        : ''
                    }
                    hasValue={!!t.classPreference}
                    onPress={() => {
                      setActiveClassPreferenceTravellerId(travellerId);
                      classPreferenceBottomSheetOptions.openBottomSheet();
                    }}
                    containerStyle={styles.containerNoMargin}
                  />
                </View>
              </View>
            );
          })}
        </View>
      ))}

      {/* Single AutoCompleteBottomSheet instances outside the loop */}
      <AutoCompleteBottomSheet
        bottomSheetOptions={deCityBottomSheetOptions}
        value={
          activeTravellerId && activeCityField === 'departureCity'
            ? travellers.find(t => t.id === activeTravellerId)
                ?.departureCity || {
                value: '',
                data: {rnm: '', id: 0, nm: ''},
                _scr: 0,
              }
            : {
                value: '',
                data: {rnm: '', id: 0, nm: ''},
                _scr: 0,
              }
        }
        onChange={city => {
          deCityBottomSheetOptions.closeBottomSheet();
          if (activeTravellerId && activeCityField === 'departureCity') {
            handleTravellerFieldChange(
              activeTravellerId,
              'departureCity',
              city || {
                value: '',
                data: {rnm: '', id: 0, nm: ''},
                _scr: 0,
              },
            );
          }
          setActiveTravellerId(null);
          setActiveCityField(null);
        }}
        title="Search Departure City"
        type="customTripLeaving"
        placeholder="Search and select departure city..."
      />

      <AutoCompleteBottomSheet
        bottomSheetOptions={reCityBottomSheetOptions}
        value={
          activeTravellerId && activeCityField === 'returnCity'
            ? travellers.find(t => t.id === activeTravellerId)?.returnCity || {
                value: '',
                data: {rnm: '', id: 0, nm: ''},
                _scr: 0,
              }
            : {
                value: '',
                data: {rnm: '', id: 0, nm: ''},
                _scr: 0,
              }
        }
        onChange={city => {
          reCityBottomSheetOptions.closeBottomSheet();
          if (activeTravellerId && activeCityField === 'returnCity') {
            handleTravellerFieldChange(
              activeTravellerId,
              'returnCity',
              city || {
                value: '',
                data: {rnm: '', id: 0, nm: ''},
                _scr: 0,
              },
            );
          }
          setActiveTravellerId(null);
          setActiveCityField(null);
        }}
        title="Search Return City"
        type="customTripLeaving"
        placeholder="Search and select return city..."
      />

      <CustomBottomSheet
        ref={classPreferenceBottomSheetOptions.bottomSheetRef}
        snapPoints={['80%']}
        title="Class Preference"
        onClose={() => {
          classPreferenceBottomSheetOptions.closeBottomSheet();
          setActiveClassPreferenceTravellerId(null);
        }}
        enablePanDownToClose={true}>
        <BottomSheetScrollView
          style={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.nationalitySheetContainer}>
            {(clientDetailsData?._data?.txptCatA).map((option: any) => {
              const currentTraveller = activeClassPreferenceTravellerId
                ? travellers.find(
                    t => t.id === activeClassPreferenceTravellerId,
                  )
                : null;
              const isSelected =
                currentTraveller?.classPreference === option.id;

              return (
                <TouchableOpacity
                  key={option?.id}
                  style={[
                    styles.nationalityOption,
                    isSelected && styles.selectedNationalityOption,
                  ]}
                  onPress={() => {
                    if (activeClassPreferenceTravellerId) {
                      handleTravellerFieldChange(
                        activeClassPreferenceTravellerId,
                        'classPreference',
                        option.id,
                      );
                    }
                    classPreferenceBottomSheetOptions.closeBottomSheet();
                    setActiveClassPreferenceTravellerId(null);
                  }}>
                  <CustomText
                    variant={
                      isSelected ? 'text-base-medium' : 'text-base-normal'
                    }
                    color={isSelected ? 'neutral900' : 'neutral900'}>
                    {option?.text}
                  </CustomText>
                  {isSelected && <Check size={20} color={colors.neutral900} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </CustomBottomSheet>

      {/* Travel Date Selection Bottomsheet */}
      <CustomBottomSheet
        ref={travelDateBottomSheetOptions.bottomSheetRef}
        snapPoints={['80%']}
        title="Select Departure Date"
        onClose={() => {
          travelDateBottomSheetOptions.closeBottomSheet();
          setActiveDateTravellerId(null);
          setActiveDateField(null);
        }}
        enablePanDownToClose={true}>
        <BottomSheetScrollView
          style={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.nationalitySheetContainer}>
            {tripDateOptions.map((date, index) => {
              const currentTraveller = activeDateTravellerId
                ? travellers.find(t => t.id === activeDateTravellerId)
                : null;
              const isSelected = currentTraveller?.travelDate === date;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.nationalityOption,
                    isSelected && styles.selectedNationalityOption,
                  ]}
                  onPress={() => {
                    if (
                      activeDateTravellerId &&
                      activeDateField === 'travelDate'
                    ) {
                      handleTravellerFieldChange(
                        activeDateTravellerId,
                        'travelDate',
                        date,
                      );
                    }
                    travelDateBottomSheetOptions.closeBottomSheet();
                    setActiveDateTravellerId(null);
                    setActiveDateField(null);
                  }}>
                  <CustomText
                    variant={
                      isSelected ? 'text-base-medium' : 'text-base-normal'
                    }
                    color="neutral900">
                    {formatDate(date)}
                  </CustomText>
                  {isSelected && <Check size={20} color={colors.neutral900} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </CustomBottomSheet>

      {/* Return Date Selection Bottomsheet */}
      <CustomBottomSheet
        ref={returnDateBottomSheetOptions.bottomSheetRef}
        snapPoints={['80%']}
        title="Select Return Date"
        onClose={() => {
          returnDateBottomSheetOptions.closeBottomSheet();
          setActiveDateTravellerId(null);
          setActiveDateField(null);
        }}
        enablePanDownToClose={true}>
        <BottomSheetScrollView
          style={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.nationalitySheetContainer}>
            {tripDateOptions.map((date, index) => {
              const currentTraveller = activeDateTravellerId
                ? travellers.find(t => t.id === activeDateTravellerId)
                : null;
              const isSelected = currentTraveller?.returnDate === date;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.nationalityOption,
                    isSelected && styles.selectedNationalityOption,
                  ]}
                  onPress={() => {
                    if (
                      activeDateTravellerId &&
                      activeDateField === 'returnDate'
                    ) {
                      handleTravellerFieldChange(
                        activeDateTravellerId,
                        'returnDate',
                        date,
                      );
                    }
                    returnDateBottomSheetOptions.closeBottomSheet();
                    setActiveDateTravellerId(null);
                    setActiveDateField(null);
                  }}>
                  <CustomText
                    variant={
                      isSelected ? 'text-base-medium' : 'text-base-normal'
                    }
                    color="neutral900">
                    {formatDate(date)}
                  </CustomText>
                  {isSelected && <Check size={20} color={colors.neutral900} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </CustomBottomSheet>
      {/* Traveller Form Modals */}
      <AddTravelersBottomSheet
        AddTravelerBottomSheetRef={AddTravelerBottomSheetRef}
        onSelectTraveller={handleSelectTraveller}
        existingTravellers={travellers.map(t => ({
          id: t.id,
          name: t.name,
          customerId: t.customerId,
          age: typeof t.age === 'number' ? t.age : undefined,
        }))}
      />

      {/* Edit Traveller Modal - Only show when editing existing customer */}
      {editingTraveller && editingTraveller.customerId && (
        <TravellerFormBottomSheet
          visible={!!(editingTraveller && editingTraveller.customerId)}
          initialData={editingTraveller}
          onSave={handleEditTravellerSave}
          onClose={() => setEditingTraveller(null)}
          sectionTitle="Edit Traveler"
        />
      )}
    </View>
  );
};

export default TravelAssignmentTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.neutral50,
    paddingHorizontal: 20,
  },
  headerText: {
    textAlign: 'left',
    paddingTop: 24,
  },
  roomHeader: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomCard: {
    backgroundColor: Colors.lightThemeColors.white,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral100,
    borderRadius: 16,
    ...shadows['shadow-sm'],
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginTop: 10,
  },
  roomHeaderTxt: {
    ...flex.rowJustifyBetweenItemCenter,
    // paddingBottom: 12,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // marginTop: 16,
    gap: 12,
    backgroundColor: Colors.lightThemeColors.white,
    borderRadius: 8,
    // padding: 4,
  },
  destinationInput: {
    flex: 1,
  },
  leavingOnInput: {
    flex: 1,
  },
  ageInputContainer: {
    marginBottom: 0,
    borderColor: Colors.lightThemeColors.neutral200,
    backgroundColor: Colors.lightThemeColors.white,
  },
  ageInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    backgroundColor: Colors.lightThemeColors.white,
    overflow: 'hidden',
  },
  ageButton: {
    width: 36,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  animatedInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  ageAnimatedInput: {
    height: 48,
    borderWidth: 0,
    fontSize: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  inputText: {
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: Colors.lightThemeColors.white,
  },
  nationalitySheetContainer: {
    paddingHorizontal: 20,
  },
  nationalityOption: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
  },
  selectedNationalityOption: {
    backgroundColor: Colors.lightThemeColors.neutral100,
    marginTop: 16,
    borderRadius: 8,
    ...flex.rowJustifyBetweenItemCenter,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  divider: {
    ...Outlines.divider.medium,
  },
  sectionSpacing: {
    marginTop: 20,
  },
  textInputStyle: {
    fontSize: 14,
    fontFamily: 'Geist-Medium',
    lineHeight: 20,
  },
  containerNoMargin: {
    marginBottom: 0,
  },
  containerZero: {
    marginTop: 0,
  },
  dateInputContainer: {
    marginTop: 8,
    marginBottom: 0,
  },
  checkboxActive: {
    backgroundColor: Colors.lightThemeColors.neutral900,
    borderColor: Colors.lightThemeColors.neutral900,
  },
  checkboxInactive: {
    backgroundColor: 'transparent',
    borderColor: Colors.lightThemeColors.neutral300,
  },
  bottomSheetContent: {
    backgroundColor: Colors.lightThemeColors.white,
    paddingBottom: 20,
  },
});
