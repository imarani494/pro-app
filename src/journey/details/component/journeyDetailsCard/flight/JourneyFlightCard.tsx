import {Dimensions, StyleSheet, View, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import {CustomText} from '../../../../../common/components';
import {formatTime, useDate} from '../../../../../common/hooks/useDate';
import TravelerSummary from '../../../../../common/components/TravelersTag';
import {Colors} from '../../../../../styles';
import {ChevronDown, Info, Luggage} from 'lucide-react-native';
import {Image} from 'react-native';
import DashedLine from '../../../../../common/components/DashedLine';
import {AddOnCard} from '../../../../../common/components/AddOnCard';
import {
  getAirlineLogo,
  PreocessImageUrl,
} from '../../../../../common/hooks/getAirLineLogo';
import {CommonButtons} from '../../../../../common/components/CommonButtons';
import PointsToNote from '../../../../../common/components/PointsToNote';

export interface Legs {
  arr: string;
  dur: number;
  bgg: string;
  fromA: string;
  toA: string;
  toC: string;
  fromC: string;
  upg: boolean;
  stp: number;
  dep: string;
  cbn: string;
  flt: string;
  zrf: boolean;
  car: string;
  mls: string;
  fromT: string;
  toT: string;
  from: string;
  to: string;
  crn: string;
  [key: string]: any;
}

export interface FlightData {
  date: string | Date;
  paxD: string;
  typ: string;
  tvlG: {
    tvlA: string[];
  };
  aCtyId: number;
  isInb: boolean;
  numFltGrp: number;
  typD: string;
  fltO: {
    dur: number;
    legs: Legs[];
    frnm: string;
    key: string;
    spl: boolean;
    isOHF: boolean;
    zrf: boolean;
  };
  fSctNm: string;
  dCtyId: number;
  arrTm: string;
  depTm: string;
  dayNum: number;
  bid: string;
  tGrpId: string;
  otherFltA: {txt: string}[];
  isMnFlt?: boolean;
  pnr?: string;
  gdsPnr?: string;

  flightOptions?: Array<{
    key: string;
    label: string;
    price?: number;
    details?: string;
  }>;

  addons?: {
    title?: string;
    description?: string;
    buttonText?: string;
    items?: Array<{
      id: string;
      name: string;
      price: number;
      selected?: boolean;
    }>;
  };

  otherFlightSegments?: {
    title?: string;
    count: number;
    buttonText?: string;
    segments?: Array<{
      from: string;
      to: string;
      date: string;
      flightNumber: string;
    }>;
  };

  pointsToNote?: {
    label?: string;
    notes: string[];
    visible?: boolean;
    expandable?: boolean;
  };

  hotelId?: string;
  notesApiEndpoint?: string;
  notesCount?: number;

  [key: string]: any;
}

const {width} = Dimensions.get('window');

export default function JourneyFlightCard({data}: {data: FlightData}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    data?.flightOptions?.[0]?.key || null,
  );

  const totalStops =
    data.fltO?.legs?.reduce((sum, leg) => sum + (leg.stp || 0), 0) +
    data.fltO?.legs?.length -
    1;

  function splitSectorName(fSctNm: string) {
    const [from, to] = fSctNm.split('-').map(s => s.trim());
    return {from, to};
  }

  const stop = () => {
    if (totalStops == 0) {
      return 'Non Stop';
    }
    return `${totalStops} stop${totalStops > 1 ? 's' : ''}`;
  };

  const totalFlightDuration = (durationMinutes: number) => {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const {from, to} = splitSectorName(data.fSctNm);

  const AirlineLogo = getAirlineLogo(
    data?.fltO?.legs.map(leg => leg.car),
    true,
  );

  return (
    <View style={styles.wrapper}>
      {/* Header Section */}
      <View style={{gap: 8, marginBottom: 6}}>
        <CustomText variant="text-base-semibold" color="neutral800">
          {from} → {to}
        </CustomText>
        {data && !data?.fltO ? (
          <CustomText variant="text-sm-normal" color="neutral500">
            No Flights Included
          </CustomText>
        ) : (
          <CustomText variant="text-sm-normal" color="neutral500">
            {useDate(data?.date)} • {stop()} •{' '}
            {totalFlightDuration(data?.fltO?.dur)} • {data.fltO?.legs[0]?.cbn}
          </CustomText>
        )}

        <TravelerSummary paxD={data.paxD} travelers={data.tvlG.tvlA} />
      </View>

      {/* Separator Line */}
      <View
        style={{
          height: 1,
          backgroundColor: Colors.lightThemeColors.neutral300,
          marginVertical: 18,
        }}
      />

      {data && !data.fltO ? null : (
        <>
          {(data?.isMnFlt || data?.pnr || data?.gdsPnr) && (
            <View style={styles.pnrRow}>
              {data?.isMnFlt && (
                <View
                  style={[
                    styles.manualFlightBadge,
                    {backgroundColor: Colors.lightThemeColors.neutral100},
                  ]}>
                  <CustomText variant="text-xs-medium" color="neutral900">
                    Manual Flight
                  </CustomText>
                </View>
              )}
              {(data?.pnr || data?.gdsPnr) && (
                <CustomText variant="text-xs-medium" color="neutral600">
                  PNR: {data?.pnr || data?.gdsPnr}
                </CustomText>
              )}
            </View>
          )}

          {/* Airline Details Row */}
          <View style={[styles.airlineRow, {marginBottom: 8}]}>
            <View style={[styles.airlineInfo]}>
              <View style={styles.logoContainer}>
                <Image
                  source={{uri: PreocessImageUrl(AirlineLogo)}}
                  style={styles.airlineLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.airlineTextContainer}>
                <CustomText variant="text-sm-medium" color="neutral900">
                  {data.fltO?.legs[0]?.crn}
                </CustomText>

                <View style={styles.flightClassRow}>
                  <CustomText variant="text-xs-normal" color="neutral500">
                    {data?.fltO?.legs[0]?.car} - {data?.fltO?.legs[0]?.flt} •{' '}
                    {data.fltO?.legs[0]?.cbn}
                  </CustomText>
                </View>
              </View>
              {data?.fltO?.zrf && (
                <View
                  style={[
                    styles.refundableBadge,
                    {
                      backgroundColor: Colors.lightThemeColors.red50,
                      position: 'absolute',
                      right: 0,
                      top: 0,
                    },
                  ]}>
                  <Info size={14} color={Colors.lightThemeColors.red600} />
                  <CustomText variant="text-xs-medium" color="red600">
                    Non-Refundable
                  </CustomText>
                </View>
              )}
            </View>
          </View>

          <View style={styles.timelineContainer}>
            <View style={styles.departureSection}>
              <CustomText variant="text-xs-normal" color="neutral500">
                {useDate(data.date)}
              </CustomText>
              <CustomText variant="text-sm-semibold" color="neutral900">
                {formatTime(data.depTm)}
              </CustomText>
              <CustomText variant="text-xs-normal" color="neutral700">
                {data?.fltO?.legs?.[0]?.fromA || data?.fltO?.legs?.[0]?.fromC},{' '}
                {data?.fltO?.legs?.[0]?.from}
              </CustomText>
              {data?.fltO?.legs?.[0]?.fromT && (
                <CustomText variant="text-xs-normal" color="neutral600">
                  Terminal {data?.fltO?.legs?.[0]?.fromT}
                </CustomText>
              )}
            </View>

            {/* Duration Section */}
            <View style={styles.durationSection}>
              <CustomText variant="text-xs-normal" color="neutral500">
                {totalFlightDuration(data?.fltO?.dur)}
              </CustomText>

              <View style={styles.durationVisualLine}>
                <View
                  style={[
                    styles.connectionLine,
                    {backgroundColor: Colors.lightThemeColors.neutral200},
                  ]}
                />
                <View
                  style={[
                    styles.connectionDot,
                    {
                      backgroundColor: Colors.lightThemeColors.neutral800,
                      borderColor: Colors.lightThemeColors.neutral400,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.connectionLine,
                    {backgroundColor: Colors.lightThemeColors.neutral200},
                  ]}
                />
              </View>
              <CustomText variant="text-xs-normal" color="neutral500">
                {stop()}
              </CustomText>
            </View>

            <View style={styles.arrivalSection}>
              <CustomText variant="text-xs-normal" color="neutral500">
                {useDate(data?.fltO?.legs[data?.fltO?.legs.length - 1]?.arr)}
              </CustomText>

              <View style={styles.arrivalTimeWithBadge}>
                <CustomText variant="text-sm-semibold" color="neutral900">
                  {formatTime(
                    data?.fltO?.legs[data?.fltO?.legs.length - 1]?.arr,
                  )}
                </CustomText>
              </View>

              <CustomText
                variant="text-xs-normal"
                color="neutral700"
                style={styles.rightAlignedText}>
                {data?.fltO?.legs[data?.fltO?.legs.length - 1]?.toA ||
                  data?.fltO?.legs[data?.fltO?.legs.length - 1]?.toC}
                , {data?.fltO?.legs[data?.fltO?.legs.length - 1]?.to}
              </CustomText>
              {data?.fltO?.legs?.[data?.fltO?.legs.length - 1]?.toT && (
                <CustomText variant="text-xs-normal" color="neutral600">
                  Terminal{' '}
                  {data?.fltO?.legs?.[data?.fltO?.legs.length - 1]?.toT}
                </CustomText>
              )}
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: Colors.lightThemeColors.neutral300,
              marginVertical: 20,
            }}
          />

          {data?.fltO?.legs?.[0]?.bgg && (
            <View style={styles.baggageContainer}>
              <View style={styles.baggageItem}>
                <Luggage size={16} color={Colors.lightThemeColors.neutral500} />
                <CustomText
                  variant="text-sm-normal"
                  color="neutral600"
                  style={styles.baggageText}>
                  Baggage: {data.fltO.legs[0].bgg}
                </CustomText>
              </View>
            </View>
          )}

          {data?.flightOptions && data.flightOptions.length > 0 && (
            <View style={styles.optionsRow}>
              {data.flightOptions.map((option, index) => (
                <TouchableOpacity
                  key={option.key || `option-${index}`}
                  style={[
                    styles.optionCard,
                    selectedOption === option.key
                      ? styles.optionCardSelected
                      : styles.optionCardUnselected,
                  ]}
                  onPress={() => setSelectedOption(option.key)}
                  activeOpacity={0.8}>
                  <View style={styles.radioOuter}>
                    {selectedOption === option.key && (
                      <View style={styles.radioInner} />
                    )}
                  </View>

                  <View style={styles.optionTextContainer}>
                    <CustomText
                      style={[
                        styles.optionText,
                        selectedOption === option.key
                          ? styles.optionTextSelected
                          : styles.optionTextUnselected,
                      ]}
                      variant="text-xs-normal">
                      {option.label}
                    </CustomText>

                    {option.price && (
                      <CustomText
                        variant="text-xs-normal"
                        color={
                          selectedOption === option.key
                            ? 'neutral900'
                            : 'neutral500'
                        }
                        style={{marginTop: 4}}>
                        ₹{option.price}
                      </CustomText>
                    )}

                    {option.details && (
                      <CustomText
                        variant="text-xs-normal"
                        color="neutral500"
                        style={{marginTop: 2}}>
                        {option.details}
                      </CustomText>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {(data?.addons || data?.otherFlightSegments) && (
            <View style={styles.addonsContainer}>
              {/* Addons Card - Show only if addons exist */}
              {data?.addons && (
                <AddOnCard marginTop={18}>
                  <View style={styles.addonCardContent}>
                    <View style={styles.addonTextContainer}>
                      <CustomText variant="text-sm-semibold" color="neutral900">
                        {data.addons.title || 'Addons'}
                      </CustomText>
                      <CustomText variant="text-sm-normal" color="neutral500">
                        {data.addons.description ||
                          `${data.addons.items?.length || 0} addon${
                            (data.addons.items?.length || 0) > 1 ? 's' : ''
                          } available`}
                      </CustomText>
                    </View>
                    <CommonButtons
                      title={data.addons.buttonText || 'Add'}
                      onPress={() => {
                        console.log('Addon button pressed', data.addons);
                      }}
                    />
                  </View>
                </AddOnCard>
              )}

              {data?.otherFlightSegments &&
                data.otherFlightSegments.count > 0 && (
                  <AddOnCard marginTop={18}>
                    <View style={styles.addonCardContent}>
                      <View style={styles.addonTextContainer}>
                        <CustomText
                          variant="text-sm-semibold"
                          color="neutral900">
                          {data.otherFlightSegments.title ||
                            'See other flight segments'}
                        </CustomText>
                        <CustomText variant="text-sm-normal" color="neutral500">
                          {data.otherFlightSegments.count} more flight
                          {data.otherFlightSegments.count > 1 ? 's' : ''} in
                          your itinerary
                        </CustomText>
                      </View>
                      <CommonButtons
                        title={
                          data.otherFlightSegments.buttonText || 'View all'
                        }
                        onPress={() => {
                          console.log(
                            'View all flights pressed',
                            data.otherFlightSegments,
                          );
                        }}
                      />
                    </View>
                  </AddOnCard>
                )}
            </View>
          )}

          {/* ✅ DYNAMIC Points to Note - Multiple patterns supported */}

          {/* Pattern 1: Notes from parent data */}
          {data?.pointsToNote?.notes && data.pointsToNote.notes.length > 0 && (
            <PointsToNote
              label={data.pointsToNote.label || 'Points to note'}
              notes={data.pointsToNote.notes}
              expandable={data.pointsToNote.expandable !== false}
              visible={data.pointsToNote.visible !== false}
            />
          )}

          {!data?.pointsToNote?.notes &&
            (data?.hotelId || data?.notesApiEndpoint) && (
              <PointsToNote
                label="Important Information"
                hotelId={data.hotelId}
                apiEndpoint={data.notesApiEndpoint}
                expandable={true}
              />
            )}

          {!data?.pointsToNote?.notes &&
            !data?.hotelId &&
            data?.notesCount &&
            data.notesCount > 0 && (
              <PointsToNote
                label="Points to note"
                count={data.notesCount}
                expandable={false}
                onPress={() => {
                  console.log('Navigate to notes screen');
                }}
              />
            )}

          <DashedLine
            style={{marginTop: 16}}
            dashLength={10}
            dashColor={Colors.lightThemeColors.neutral300}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: 14,
    flex: 1,
  },
  pnrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    marginBottom: 8,
  },
  manualFlightBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  airlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
    width: '100%',
  },
  airlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    marginRight: 12,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  airlineLogo: {
    width: 32,
    height: 32,
    borderRadius: 3.2,
  },
  airlineTextContainer: {
    flex: 1,
    gap: 4,
  },
  flightClassRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refundableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9,
    marginLeft: 8,
    gap: 6,
    flexShrink: 0,
  },
  timelineContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
    gap: 6,
    marginTop: 20,
    marginBottom: 4,
  },
  departureSection: {
    maxWidth: '32%',
    alignItems: 'flex-start',
    gap: 4,
  },
  durationSection: {
    width: 68,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 24,
    height: 50,
  },
  durationVisualLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
  },
  connectionLine: {
    width: 24,
    height: 1,
  },
  connectionDot: {
    width: 4,
    height: 4,
    borderRadius: 3,
    borderWidth: 1,
  },
  arrivalSection: {
    maxWidth: '32%',
    alignItems: 'flex-end',
    gap: 4,
  },
  arrivalTimeWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rightAlignedText: {
    textAlign: 'right',
  },
  baggageContainer: {
    gap: 8,
  },
  baggageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  baggageText: {
    marginLeft: 0,
  },

  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  optionCard: {
    flex: 1,
    minHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionCardSelected: {
    backgroundColor: Colors.lightThemeColors.neutral100,
    borderColor: Colors.lightThemeColors.neutral600,
  },
  optionCardUnselected: {
    backgroundColor: Colors.lightThemeColors.white || '#FFFFFF',
    borderColor: Colors.lightThemeColors.neutral200,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.lightThemeColors.neutral50,
    borderWidth: 1.5,
    borderColor: Colors.lightThemeColors.neutral300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lightThemeColors.neutral900,
  },
  optionTextContainer: {
    flex: 1,
    gap: 4,
  },
  optionText: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
  },
  optionTextSelected: {
    color: Colors.lightThemeColors.neutral900,
  },
  optionTextUnselected: {
    color: Colors.lightThemeColors.neutral500,
  },

  addonsContainer: {
    rowGap: 20,
    marginTop: 20,
  },
  addonCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingRight: 16,
  },
  addonTextContainer: {
    paddingHorizontal: 10,
    paddingVertical: 18,
    flex: 1,
  },
});
