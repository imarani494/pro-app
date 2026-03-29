import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import {
  ClientDetailSection,
  CustomerDetailSection,
  Destination,
  TravelerDetailSection,
  TravelerSelection,
} from '..';
import {CustomText} from '../../../common/components';
import {Colors} from '../../../styles';
import SelectClient from './SelectClient';
import DateSelectionList from './DateSelectionList';
import {useTheme} from '../../../context/ThemeContext';
import TravelAssignmentTable from './TravelAssignmentTable';
import {divider} from '../../../styles/outlines';

interface ClientInfoProps {
  tripDetails: TravelerDetailSection;
  travelerSelection: TravelerSelection;
  setClientDetails: React.Dispatch<React.SetStateAction<ClientDetailSection>>;
  clientDetailsData: any;
  setIsFdFlow: React.Dispatch<React.SetStateAction<boolean>>;
  isFdFlow: boolean;
  setCustomerDetails: React.Dispatch<
    React.SetStateAction<CustomerDetailSection>
  >;
  customerDetails: CustomerDetailSection;
  isEditMode: boolean;
  isCopyMode: boolean;
  destinations: Destination[];
}

export interface DateOption {
  id: string;
  range: string;
  price: number;
  oldPrice: number;
  status: string;
  statusText: string;
  statusColor: string;
  ttl: string;
  priceDisplay: string;
}

export interface TravellerEntry {
  travellerId: string;
  travellerName: string;
  cityId: string;
  cityName: string;
  dateId: string;
  dateLabel: string;
}

const ClientInfo = ({
  tripDetails,
  travelerSelection,
  setClientDetails,
  clientDetailsData,
  isFdFlow,
  setCustomerDetails,
  customerDetails,
  isEditMode,
  isCopyMode,
  destinations,
}: ClientInfoProps) => {
  const datesArr = clientDetailsData._data?.pkgAvailO?.dtA || [];

  // Map real API date data to fdDatesArray format
  const fdDatesArray = datesArr.map((d: any, idx: number) => ({
    id: String(idx + 1),
    range: d.dt, // You may want to format this date string for display
    ttl: (() => {
      // Format start date
      const start = new Date(d.dt);
      // Calculate end date
      const end = new Date(start);
      end.setDate(
        start.getDate() +
          (clientDetailsData._data?.pkgAvailO?.tNts
            ? Number(clientDetailsData._data?.pkgAvailO?.tNts)
            : 0),
      );
      // Format: 'Mon D ddd'
      const fmt = (date: Date) =>
        `${date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
        })} ${date.toLocaleString('en-US', {weekday: 'short'})}`;
      return `${fmt(start)} – ${fmt(end)}`;
    })(),
    price: d.prc,
    oldPrice: d.prc, // No old price in API, so use price
    status: d.cls,
    statusText: d.ttl,
    statusColor: d.cls === 'avl' ? 'green' : d.cls,
    available: d.avl,
    priceDisplay: d.prcD,
  }));

  const [selectedDateId, setSelectedDateId] = useState(
    fdDatesArray[0]?.id || null,
  );
  const handleDateSelect = (date: DateOption) => {
    setSelectedDateId(date.id);
    // Update tripDetails in parent component
    setClientDetails(prev => ({
      ...prev,
      leavingOn: date.range || '',
    }));
  };

  const [lateJoiningTravellers, setLateJoiningTravellers] = useState<
    TravellerEntry[]
  >([]);
  const [earlyLeavingTravellers, setEarlyLeavingTravellers] = useState<
    TravellerEntry[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<'late' | 'early' | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedTraveller, setSelectedTraveller] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [localDestinations, setLocalDestinations] = useState<Destination[]>([
    {
      id: '1',
      cityName: {value: '', data: {rnm: '', id: 0, nm: ''}},
      nights: 1,
    },
  ]);

  const travellers = [
    {id: '1', name: 'Vinay Gupta'},
    {id: '2', name: 'Alex Glarson'},
    {id: '3', name: 'Maria Garcia'},
  ];
  const cities = localDestinations.map((d, i) => ({
    id: d.id,
    name:
      d.cityName?.data?.nm ||
      d.cityName?.data?.rnm ||
      d.cityName?.value ||
      `City ${i + 1}`,
  }));
  const dates = [
    {id: '1', label: '1st day (16 Apr 2025)'},
    {id: '2', label: '2nd day (17 Apr 2025)'},
    {id: '3', label: '3rd day (18 Apr 2025)'},
  ];

  const [assignTravellers, setAssignTravellers] = useState(false);

  // Auto-enable assignment toggle if traveller preferences exist
  React.useEffect(() => {
    if (clientDetailsData?._data?.hasTvlrPref) {
      setAssignTravellers(true);
    }
  }, [clientDetailsData?._data?.hasTvlrPref]);

  // Assign Travellers Toggle Component
  const AssignTravellersToggle = ({
    assignTravellers,
    setAssignTravellers,
  }: {
    assignTravellers: boolean;
    setAssignTravellers: (value: boolean) => void;
  }) => {
    const {colors} = useTheme();

    const handleToggleChange = (value: boolean) => {
      console.log('Toggle changed to:', value);
      setAssignTravellers(value);
    };

    return (
      <View style={styles.toggleContainer}>
        <View style={styles.toggleContent}>
          <View style={styles.toggleTextSection}>
            <CustomText
              variant="text-base-medium"
              color="neutral900"
              style={styles.toggleTitle}>
              Assign Travellers to Trip
            </CustomText>
            <View style={styles.optionalBadge}>
              <CustomText
                variant="text-xs-medium"
                color="red800"
                style={styles.optionalText}>
                Optional
              </CustomText>
            </View>
          </View>
          <Switch
            value={assignTravellers}
            onValueChange={handleToggleChange}
            trackColor={{
              false: colors.neutral300,
              true: colors.neutral900,
            }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.neutral300}
            style={styles.switch}
          />
        </View>
      </View>
    );
  };

  const handleAddTraveller = (): void => {
    if (!selectedTraveller || !selectedCity || !selectedDate) return;
    const travellerObj = travellers.find(t => t.id === selectedTraveller);
    const cityObj = cities.find(c => c.id === selectedCity);
    const dateObj = dates.find(d => d.id === selectedDate);
    if (activeModal === 'late') {
      if (editIndex !== null) {
        setLateJoiningTravellers(
          lateJoiningTravellers.map((item, idx) =>
            idx === editIndex
              ? {
                  travellerId: selectedTraveller,
                  travellerName: travellerObj?.name || '',
                  cityId: selectedCity,
                  cityName: cityObj?.name || '',
                  dateId: selectedDate,
                  dateLabel: dateObj?.label || '',
                }
              : item,
          ),
        );
      } else {
        setLateJoiningTravellers([
          ...lateJoiningTravellers,
          {
            travellerId: selectedTraveller,
            travellerName: travellerObj?.name || '',
            cityId: selectedCity,
            cityName: cityObj?.name || '',
            dateId: selectedDate,
            dateLabel: dateObj?.label || '',
          },
        ]);
      }
    } else if (activeModal === 'early') {
      if (editIndex !== null) {
        setEarlyLeavingTravellers(
          earlyLeavingTravellers.map((item, idx) =>
            idx === editIndex
              ? {
                  travellerId: selectedTraveller,
                  travellerName: travellerObj?.name || '',
                  cityId: selectedCity,
                  cityName: cityObj?.name || '',
                  dateId: selectedDate,
                  dateLabel: dateObj?.label || '',
                }
              : item,
          ),
        );
      } else {
        setEarlyLeavingTravellers([
          ...earlyLeavingTravellers,
          {
            travellerId: selectedTraveller,
            travellerName: travellerObj?.name || '',
            cityId: selectedCity,
            cityName: cityObj?.name || '',
            dateId: selectedDate,
            dateLabel: dateObj?.label || '',
          },
        ]);
      }
    }
    setModalOpen(false);
    setEditIndex(null);
    setActiveModal(null);
  };

  React.useEffect(() => {
    setClientDetails(prev => ({
      ...prev,
      travelers: clientDetailsData?._data?.travelers.map(
        (t: any, idx: number) => ({
          paxIndex: t.paxIndex || idx,
          customerId: '',
          name: t.name,
          age: null,
          exCityId: 0,
          returnCityId: 0,
          transportCategory: '',
          travelDate: t?.travelDate || '',
          returnDate: t?.returnDate || '',
        }),
      ),
    }));
  }, [clientDetailsData?._data?.travelers, setClientDetails]);

  return (
    <View style={styles.container}>
      {isFdFlow ? (
        <View>
          <DateSelectionList
            dates={fdDatesArray}
            selectedId={selectedDateId}
            onSelect={handleDateSelect}
            isFdflow={isFdFlow}
            setClientDetails={setClientDetails}
          />

          <View style={{...divider.base}} />
          <View>
            <SelectClient
              setClientDetails={setClientDetails}
              clientDetailsData={clientDetailsData}
              setCustomerDetails={setCustomerDetails}
              customerDetails={customerDetails}
              isEditMode={isEditMode}
            />
            <View style={{...divider.medium}} />
          </View>

          {/* Assign Travellers Toggle */}
          <View style={{marginTop: 16}}>
            <AssignTravellersToggle
              assignTravellers={assignTravellers}
              setAssignTravellers={setAssignTravellers}
            />
          </View>
        </View>
      ) : (
        <View>
          <SelectClient
            setClientDetails={setClientDetails}
            clientDetailsData={clientDetailsData}
            setCustomerDetails={setCustomerDetails}
            customerDetails={customerDetails}
            isEditMode={isEditMode}
          />
          <View style={styles.divider} />
          <AssignTravellersToggle
            assignTravellers={assignTravellers}
            setAssignTravellers={setAssignTravellers}
          />
        </View>
      )}
      {assignTravellers && (
        <View>
          <TravelAssignmentTable
            travelerSelection={travelerSelection}
            setClientDetails={setClientDetails}
            clientDetailsData={clientDetailsData}
            destinations={destinations}
            tripDepartureDate={tripDetails.leavingOn}
            leavingFromCity={tripDetails.leavingFrom?.cityName}
          />
        </View>
      )}
    </View>
  );
};

export default ClientInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
    paddingBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightThemeColors.neutral200,
    marginTop: 24,
    marginBottom: 24,
  },
  toggleContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  toggleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleTextSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 2,
  },
  toggleTitle: {
    textAlign: 'left',
  },
  optionalBadge: {
    backgroundColor: Colors.lightThemeColors.red100,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  optionalText: {
    textAlign: 'center',
  },
  switch: {},
});
