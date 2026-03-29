import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomText} from '../../../common/components';
import {Colors} from '../../../styles';
import {useBottomSheet} from '../../../common/hooks/useBottomSheet';
import {useTheme} from '../../../context/ThemeContext';
import AutoCompleteBottomSheet from '../../../common/components/AutoCompleteBottomSheet';
import SelectableInput from '../../../common/components/SelectableInput';

export interface SelectAgentAndPreferenceProps {
  tripDetails: any;
  setTripDetails: (details: any) => void;
  travelerTypeOptions: string[];
  purposeOption: string[];
  flightBookedOption: {
    dnm: string;
    value: string;
  }[];
  isFdFlow: boolean;
  missingFields: any;
  clearFieldError: (
    field: string,
    index?: number | undefined,
    subfield?: string | undefined,
  ) => void;
  isEditMode: boolean;
}

const SelectAgentAndPreference = ({
  tripDetails,
  setTripDetails,
  travelerTypeOptions,
  purposeOption,
  flightBookedOption,
  isFdFlow,
  missingFields,
  clearFieldError,
  isEditMode,
}: SelectAgentAndPreferenceProps) => {
  const {colors} = useTheme();
  const bottomSheetOptions = useBottomSheet();

  // Set default "not booking" value when tripStage is not set
  useEffect(() => {
    if (
      !tripDetails.tripStage &&
      flightBookedOption &&
      flightBookedOption.length > 0
    ) {
      // Find "not booking" option (case-insensitive match)
      const notBookingOption = flightBookedOption.find(
        option =>
          option.dnm.toLowerCase().includes('not booking') ||
          option.dnm.toLowerCase().includes('no') ||
          option.value === 'false' ||
          option.value === '0' ||
          option.value === 'n',
      );

      // If found, set it as default; otherwise use first option
      const defaultValue =
        notBookingOption?.value || flightBookedOption[0]?.value;

      if (defaultValue && defaultValue !== tripDetails.tripStage) {
        setTripDetails({
          ...tripDetails,
          tripStage: defaultValue,
        });
      }
    }
  }, [tripDetails.tripStage, flightBookedOption, setTripDetails]);

  return (
    <View style={styles.container}>
      {isEditMode ? null : (
        <View>
          <CustomText
            variant="text-lg-semibold"
            color="neutral900"
            style={styles.HeaderText}>
            Select Agent to Quote
          </CustomText>
          <SelectableInput
            label="Search Agents"
            displayValue={
              tripDetails.agent?.data?.nm || tripDetails.agent?.data?.unm || ''
            }
            hasValue={!!tripDetails.agent?.data?.nm}
            onPress={() => bottomSheetOptions.openBottomSheet()}
            required={true}
            hasError={!!missingFields.agent}
          />
        </View>
      )}
      <AutoCompleteBottomSheet
        bottomSheetOptions={bottomSheetOptions}
        value={
          tripDetails.agent && tripDetails.agent.value !== undefined
            ? tripDetails.agent
            : {
                value: '',
                data: {
                  rnm: '',
                  id: 0,
                  nm: '',
                  bnm: '',
                  uid: 0,
                  unm: '',
                },
              }
        }
        onChange={agent => {
          clearFieldError('agent');
          setTripDetails({...tripDetails, agent: agent});
        }}
        onSelectItem={agent => {
          clearFieldError('agent');
          setTripDetails({...tripDetails, agent: agent});
          bottomSheetOptions.closeBottomSheet();
        }}
        title="Select Agent"
        type="customTripAgent"
        placeholder="Search for an agent..."
      />
    </View>
  );
};

export default SelectAgentAndPreference;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
    paddingHorizontal: 20,
  },
  HeaderText: {
    textAlign: 'left',
    marginBottom: 16,
  },
});
