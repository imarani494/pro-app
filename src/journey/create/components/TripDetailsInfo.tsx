import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Child,
  Destination,
  Room,
  TravelerDetailSection,
  TravelerSelection,
} from '..';
import {Colors, Outlines} from '../../../styles';
import EnterDestination from './EnterDestination';
import SelectAgentAndPreference from './SelectAgentAndPreference';
import EnterTripDetails from './EnterTripDetails';
import EnterTripDetailsForFdFlow from './EnterTripDetailsForFdFlow';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {JourneyStackParamList} from '../../../navigators/types';

const nightOptions = Array.from({length: 50}, (_, i) => ({
  value: i + 1,
  label: `${i + 1} night${i === 0 ? '' : 's'}`,
}));

const starRatingOptions = [
  {value: '3', label: '3 Star'},
  {value: '4', label: '4 Star'},
  {value: '5', label: '5 Star'},
];

const travelerTypeOptions = ['Adult', 'Child', 'Infant'];

const purposeOption = ['Honeymoon', 'Business', 'Family', 'Adventure'];
const flightBookedOption = [
  {
    dnm: 'Booked',
    value: 'BOOKED',
  },
  {
    dnm: 'Not Booked',
    value: 'NOT_BOOKED',
  },
];

const childAgeOptions = [
  '<2 yrs',
  '2+ yrs',
  '3+ yrs',
  '4+ yrs',
  '5+ yrs',
  '6+ yrs',
  '7+ yrs',
  '8+ yrs',
  '9+ yrs',
  '10+ yrs',
  '11+ yrs',
  '12+ yrs',
  '13+ yrs',
  '14+ yrs',
  '15+ yrs',
  '16+ yrs',
  '17+ yrs',
];

type TripDetailsInfoProps = {
  tripDetails: TravelerDetailSection;
  travelerSelection: TravelerSelection;
  destinations: Destination[];
  setDestinations: React.Dispatch<React.SetStateAction<Destination[]>>;
  setTripDetails: React.Dispatch<React.SetStateAction<TravelerDetailSection>>;
  setTravelerSelection: React.Dispatch<React.SetStateAction<TravelerSelection>>;
  tripDetailsData: any;
  setTripDetailsData: React.Dispatch<any>;
  setIsFdFlow: React.Dispatch<React.SetStateAction<boolean>>;
  isFdFlow: boolean;
  missingFields: any;
  clearFieldError: (
    field: string,
    index?: number | undefined,
    subfield?: string | undefined,
  ) => void;
  isEditMode: boolean;
  isCopyMode: boolean;
  navigation: NativeStackNavigationProp<
    JourneyStackParamList,
    'JourneyCreation',
    undefined
  >;
};

const TripDetailsInfo = ({
  setTravelerSelection,
  setTripDetails,
  setDestinations,
  tripDetails,
  travelerSelection,
  destinations,
  tripDetailsData,
  setTripDetailsData,
  setIsFdFlow,
  isFdFlow,
  missingFields,
  clearFieldError,
  isEditMode,
  isCopyMode,
  navigation,
}: TripDetailsInfoProps) => {
  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);

  // Traveler selection helper functions
  const updateTravelerDisplay = (rooms: Room[]): string => {
    const totalRooms = rooms.length;
    const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
    const totalChildren = rooms.reduce(
      (sum, room) => sum + room.children.length,
      0,
    );

    let display = `${totalRooms} room${
      totalRooms > 1 ? 's' : ''
    }, ${totalAdults} adult${totalAdults > 1 ? 's' : ''}`;
    if (totalChildren > 0) {
      display += `, ${totalChildren} child${totalChildren > 1 ? 'ren' : ''}`;
    }
    return display;
  };

  const addRoom = (): void => {
    const newRoom: Room = {
      id: Date.now().toString(),
      adults: 2,
      children: [],
    };
    const newRooms = [...travelerSelection.rooms, newRoom];
    setTravelerSelection({
      rooms: newRooms,
      totalDisplay: updateTravelerDisplay(newRooms),
    });
  };

  const removeRoom = (roomId: string): void => {
    if (travelerSelection.rooms.length > 1) {
      const newRooms = travelerSelection.rooms.filter(
        room => room.id !== roomId,
      );
      setTravelerSelection({
        rooms: newRooms,
        totalDisplay: updateTravelerDisplay(newRooms),
      });
    }
  };

  const updateRoomAdults = (roomId: string, adults: number): void => {
    const newRooms = travelerSelection.rooms.map(room =>
      room.id === roomId
        ? {...room, adults: Math.max(1, Math.min(10, adults))}
        : room,
    );
    setTravelerSelection({
      rooms: newRooms,
      totalDisplay: updateTravelerDisplay(newRooms),
    });
  };

  const updateRoomChildren = (roomId: string, childrenCount: number): void => {
    const room = travelerSelection.rooms.find(r => r.id === roomId);
    if (!room) return;

    const currentChildren = room.children;
    let newChildren: Child[] = [...currentChildren];

    if (childrenCount > currentChildren.length) {
      // Add children
      for (
        let i = currentChildren.length;
        i < Math.min(4, childrenCount);
        i++
      ) {
        newChildren.push({
          id: `${roomId}-child-${Date.now()}-${i}`,
          age: '<2 yrs',
        });
      }
    } else {
      // Remove children
      newChildren = newChildren.slice(0, childrenCount);
    }

    const newRooms = travelerSelection.rooms.map(r =>
      r.id === roomId ? {...r, children: newChildren} : r,
    );
    setTravelerSelection({
      rooms: newRooms,
      totalDisplay: updateTravelerDisplay(newRooms),
    });
  };

  const updateChildAge = (
    roomId: string,
    childId: string,
    age: string,
  ): void => {
    const newRooms = travelerSelection.rooms.map(room =>
      room.id === roomId
        ? {
            ...room,
            children: room.children.map(child =>
              child.id === childId ? {...child, age} : child,
            ),
          }
        : room,
    );
    setTravelerSelection({
      rooms: newRooms,
      totalDisplay: updateTravelerDisplay(newRooms),
    });
  };

  const updateDestination = (
    id: string,
    field: keyof Destination,
    value: any,
  ): void => {
    setDestinations(
      destinations.map(dest =>
        dest.id === id ? {...dest, [field]: value} : dest,
      ),
    );
  };

  const removeDestination = (id: string): void => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter(dest => dest.id !== id));
    }
  };
  const addDestination = (): void => {
    const newDestination: Destination = {
      id: Date.now().toString(),
      cityName: {
        value: '',
        data: {rnm: '', id: 0, nm: ''},
      },
      nights: 1,
      isEdit: true,
    };
    setDestinations([...destinations, newDestination]);
  };

  //   const onDragEnd = (result: DropResult): void => {
  //     if (!result.destination) return;
  //     const reordered = Array.from(destinations);
  //     const [removed] = reordered.splice(result.source.index, 1);
  //     reordered.splice(result.destination.index, 0, removed);
  //     setDestinations(reordered);
  //   };

  useEffect(() => {
    const data = tripDetailsData;
    if (!data) return;

    setTripDetails((prev: any) => {
      let changed = false;
      const updated = {...prev};

      // Leaving from
      if (
        data.exCityNm &&
        data.exCityId &&
        !prev.leavingFrom?.cityName?.value
      ) {
        updated.leavingFrom = {
          ...prev.leavingFrom,
          id: '',
          cityName: {
            value: data.exCityNm,
            data: {
              rnm: data.exCityNm,
              id: data.exCityId,
              nm: data.exCityNm,
            },
          },
        };
        changed = true;
      }
      // Leaving on
      if (!prev.leavingOn && data.travelDate) {
        updated.leavingOn = data.travelDate;
        changed = true;
      }
      // Nationality
      if (!prev.nationality && data.ntnDestId && data.ntnDestNm) {
        updated.nationality = data.ntnDestId;
        changed = true;
      }
      // Star Rating
      if (!prev.starRating && data.starRating) {
        updated.starRating = data.starRating;
        changed = true;
      }
      if (
        !prev.leavingFromFdFlow &&
        data.exCityId &&
        data.exCityNm &&
        isFdFlow
      ) {
        updated.leavingFromFdFlow = data.exCityId;
        changed = true;
      }
      // Prepopulate addTransfers and addActivities
      if (!prev.addTxfrs && data.addTxfrs) {
        updated.addTxfrs = data.addTxfrs;
        changed = true;
      }
      if (!prev.addTours && data.addTours) {
        updated.addTours = data.addTours;
        changed = true;
      }
      // Only update if something changed
      return changed ? updated : prev;
    });

    // Prepopulate travelerSelection from paxData.rooms
    if (Array.isArray(data.paxData?.rooms) && data.paxData.rooms.length > 0) {
      const rooms = data.paxData.rooms.map((room: any, idx: number) => ({
        id: `${idx + 1}`,
        adults: room.ad || 1,
        children: Array.from({length: room.ch || 0}).map((_, i) => {
          // Convert child age from number to proper format
          let ageStr = '';
          if (room.chAge && room.chAge[i] !== undefined) {
            const ageNum =
              typeof room.chAge[i] === 'number'
                ? room.chAge[i]
                : parseInt(String(room.chAge[i]), 10);
            if (!isNaN(ageNum)) {
              // Format: <2 yrs for age 0-1, or "X+ yrs" for age 2+
              ageStr = ageNum < 2 ? '<2 yrs' : `${ageNum}+ yrs`;
            } else {
              ageStr = String(room.chAge[i]);
            }
          }
          return {
            id: `child-${idx + 1}-${i + 1}`,
            age: ageStr,
          };
        }),
      }));
      // Calculate totalDisplay string
      const totalRooms = rooms.length;
      const totalAdults = rooms.reduce(
        (sum: number, r: {adults: number}) => sum + r.adults,
        0,
      );
      const totalChildren = rooms.reduce(
        (sum: number, r: {children: Array<{age: string}>}) =>
          sum + (r.children?.length || 0),
        0,
      );
      const displayParts: string[] = [];
      displayParts.push(`${totalRooms} room${totalRooms > 1 ? 's' : ''}`);
      displayParts.push(`${totalAdults} adult${totalAdults > 1 ? 's' : ''}`);
      if (totalChildren > 0) {
        displayParts.push(
          `${totalChildren} child${totalChildren > 1 ? 'ren' : ''}`,
        );
      }
      const totalDisplay = displayParts.join(', ');
      setTravelerSelection((prev: TravelerSelection) => ({
        ...prev,
        rooms,
        totalDisplay,
      }));
    }

    // Prepopulate destinations from cities (backend may send varying keys)
    if (Array.isArray(data.cities) && data.cities.length > 0) {
      const newDestinations = data.cities.map((city: any) => {
        // Prefer `c` as the canonical id, fallback to cid or cky if necessary
        const idVal = city.c ?? city.cid ?? city.cky ?? Date.now();
        const ckyVal = city.cky !== undefined ? String(city.cky) : undefined;
        const name = city.cnm || city.nm || city.name || '';
        const cityId = Number(city.c ?? city.cid) || 0;
        const nights = city.n ?? city.nt ?? 1;
        return {
          id: String(idVal),
          ...(ckyVal ? {cky: ckyVal} : {}),
          cityName: {
            value: name,
            data: {rnm: name, id: cityId, nm: name},
          },
          nights,
          // Keep isEdit true by default unless backend explicitly provides a value
          isEdit: city.isEdit !== undefined ? city.isEdit : true,
          ...(city.fdPkgId !== undefined ? {fdPkgId: city.fdPkgId} : {}),
          ...(city.fdPkgNm !== undefined ? {fdPkgNm: city.fdPkgNm} : {}),
          ...(city.dTyp !== undefined ? {dTyp: city.dTyp} : {}),
        } as Destination;
      });
      setDestinations(newDestinations);
    }
  }, [setTripDetails, setTravelerSelection, tripDetailsData, setDestinations]);

  return (
    <View style={styles.container}>
      {isFdFlow ? null : (
        <View>
          <EnterDestination
            destinations={destinations}
            nightOptions={nightOptions}
            addDestination={addDestination}
            removeDestination={removeDestination}
            updateDestination={updateDestination}
            onDragEnd={() => {}}
            missingFields={missingFields}
            clearFieldError={clearFieldError}
            setDestinations={setDestinations}
            isEditMode={isEditMode}
            navigation={navigation}
          />
          <View style={styles.divider} />
        </View>
      )}
      {isFdFlow ? (
        <View>
          <EnterTripDetailsForFdFlow
            tripDetails={tripDetails}
            setTripDetails={setTripDetails}
            travelerSelection={travelerSelection}
            setShowTravelerDropdown={setShowTravelerDropdown}
            showTravelerDropdown={showTravelerDropdown}
            updateRoomAdults={updateRoomAdults}
            updateRoomChildren={updateRoomChildren}
            updateChildAge={updateChildAge}
            removeRoom={removeRoom}
            addRoom={addRoom}
            childAgeOptions={childAgeOptions}
            starRatingOptions={starRatingOptions}
            tripDetailsData={tripDetailsData}
            missingFields={missingFields}
            clearFieldError={clearFieldError}
            setTravelerSelection={setTravelerSelection}
          />
          <View style={styles.divider} />
        </View>
      ) : (
        <View>
          <EnterTripDetails
            tripDetails={tripDetails}
            setTripDetails={setTripDetails}
            travelerSelection={travelerSelection}
            setTravelerSelection={setTravelerSelection}
            setShowTravelerDropdown={setShowTravelerDropdown}
            showTravelerDropdown={showTravelerDropdown}
            updateRoomAdults={updateRoomAdults}
            updateRoomChildren={updateRoomChildren}
            updateChildAge={updateChildAge}
            removeRoom={removeRoom}
            addRoom={addRoom}
            childAgeOptions={childAgeOptions}
            starRatingOptions={starRatingOptions}
            tripDetailsData={tripDetailsData}
            missingFields={missingFields}
            clearFieldError={clearFieldError}
            isEditMode={isEditMode}
          />
          <View style={styles.divider} />
        </View>
      )}
      {tripDetailsData?.isAskAgent && (
        <SelectAgentAndPreference
          tripDetails={tripDetails}
          setTripDetails={setTripDetails}
          travelerTypeOptions={travelerTypeOptions}
          purposeOption={purposeOption}
          flightBookedOption={flightBookedOption}
          isFdFlow={isFdFlow}
          missingFields={missingFields}
          clearFieldError={clearFieldError}
          isEditMode={isEditMode}
        />
      )}
    </View>
  );
};

export default TripDetailsInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  divider: {
    ...Outlines.divider.base,
  },
});
