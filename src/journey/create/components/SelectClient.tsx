import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {
  CustomText,
  CustomRadioButton,
  CustomBottomSheet,
} from '../../../common/components';
import {Colors} from '../../../styles';
import {useBottomSheet} from '../../../common/hooks/useBottomSheet';
import {useTheme} from '../../../context/ThemeContext';
import {ClientDetailSection, CustomerDetailSection} from '..';
import {flex} from '../../../styles/typography';
import {Plus, Search} from 'lucide-react-native';
import shadows from '../../../styles/shadows';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

interface SelectClientProps {
  setClientDetails: React.Dispatch<React.SetStateAction<ClientDetailSection>>;
  clientDetailsData: any;
  setCustomerDetails: React.Dispatch<
    React.SetStateAction<CustomerDetailSection>
  >;
  customerDetails: CustomerDetailSection;
  isEditMode: boolean;
}

// Client Card Component
const ClientCard = ({client, isSelected, onPress, colors}: any) => (
  <TouchableOpacity
    style={[
      styles.clientCard,
      {
        borderColor: isSelected ? colors.neutral600 : colors.neutral200,
        backgroundColor: isSelected ? colors.neutral100 : colors.white,
      },
    ]}
    onPress={onPress}>
    <View style={styles.radioButtonContainer}>
      <CustomRadioButton
        selected={isSelected}
        size="medium"
        style={styles.radioButtonSpacing}
      />
      <View style={styles.clientInfo}>
        <CustomText
          variant="text-sm-medium"
          color="neutral900"
          style={[styles.clientName, isSelected && {color: colors.primary600}]}>
          {client.data.nm}
        </CustomText>
        <CustomText
          variant="text-xs-normal"
          color="neutral500"
          style={styles.tripDetails}>
          {client.data.lnm}
        </CustomText>
      </View>
    </View>
  </TouchableOpacity>
);

// Header Section Component
const HeaderSection = ({
  colors,
  setAddNewClientMode,
  addNewClientMode,
  allLeadsBottomSheetOptions,
  hasMoreClients,
  newLeadBottomSheetOptions,
}: any) => (
  <View style={styles.headerContainer}>
    <CustomText
      variant="text-lg-semibold"
      color="neutral900"
      style={styles.HeaderText}>
      Select Lead
    </CustomText>

    <View style={styles.rowIconContainer}>
      {!addNewClientMode && (
        <TouchableOpacity
          onPress={() => allLeadsBottomSheetOptions.openBottomSheet()}
          style={styles.iconCard}>
          <Search size={18} color={colors.neutral900} />
        </TouchableOpacity>
      )}
      {!addNewClientMode && (
        <TouchableOpacity
          onPress={() => {
            newLeadBottomSheetOptions.openBottomSheet();
          }}
          style={[styles.iconCard, {...flex.rowItemCenter}]}>
          <Plus size={18} color={colors.neutral900} style={styles.plusIcon} />
          <CustomText variant="text-sm-medium" color="neutral900">
            Add
          </CustomText>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

// Add New Lead Form Component
const AddNewLeadForm = ({customerDetails, setCustomerDetails, colors}: any) => (
  <View style={styles.textInputBox}>
    <CustomText
      variant="text-base-medium"
      color="neutral900"
      style={[styles.HeaderText, {marginBottom: 16}]}>
      Add New Lead
    </CustomText>
    <View style={styles.formContainer}>
      {[
        {
          placeholder: 'Lead name*',
          value: customerDetails.custName,
          key: 'custName',
        },
        {
          placeholder: 'Email Address*',
          value: customerDetails.custEmail,
          key: 'custEmail',
          type: 'email-address',
        },
        {
          placeholder: 'Mobile number',
          value: customerDetails.custMobile,
          key: 'custMobile',
          type: 'phone-pad',
        },
      ].map((field, index) => (
        <TextInput
          key={index}
          style={[
            styles.textInput,
            {borderColor: colors.neutral200, color: colors.neutral900},
          ]}
          placeholder={field.placeholder}
          placeholderTextColor={colors.neutral400}
          value={field.value}
          onChangeText={text =>
            setCustomerDetails({...customerDetails, [field.key]: text})
          }
          keyboardType={(field.type as any) || 'default'}
          autoCapitalize={field.key === 'custEmail' ? 'none' : 'sentences'}
        />
      ))}
    </View>
  </View>
);

const SelectClient = ({
  setClientDetails,
  clientDetailsData,
  setCustomerDetails,
  customerDetails,
  isEditMode,
}: SelectClientProps) => {
  const {colors} = useTheme();
  const allLeadsBottomSheetOptions = useBottomSheet();
  const newLeadBottomSheetOptions = useBottomSheet();

  // Initialize leads array with dummy data or API data
  const [leadsArray, setLeadsArray] = useState(
    () => clientDetailsData._data.ldA || [],
  );

  const [selected, setSelected] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInBottomSheet, setSearchInBottomSheet] = useState('');
  const [addNewClientMode, setAddNewClientMode] = useState(false);

  // Computed values
  const filteredClients = leadsArray.filter((c: any) =>
    c.data.nm.toLowerCase().includes(search.toLowerCase()),
  );

  // For bottomsheet, use separate search
  const bottomSheetFilteredClients = leadsArray.filter((c: any) =>
    c.data.nm.toLowerCase().includes(searchInBottomSheet.toLowerCase()),
  );

  const clientsToShow = filteredClients.slice(0, 3);
  const hasMoreClients = filteredClients.length > 3;

  // Form validation
  const isFormValid =
    customerDetails.custName.trim() !== '' &&
    customerDetails.custEmail.trim() !== '';

  const handleAddNewLead = () => {
    if (!isFormValid) return;

    const newLead = {
      data: {
        id: Date.now(), // Generate unique ID
        nm: customerDetails.custName.trim(),
        lnm: `${customerDetails.custEmail.trim()}${
          customerDetails.custMobile.trim()
            ? ` | ${customerDetails.custMobile.trim()}`
            : ''
        }`,
      },
    };

    // Add to beginning of array
    const updatedLeads = [newLead, ...leadsArray];
    setLeadsArray(updatedLeads);

    // Select the newly added lead (index 0)
    setSelected(0);
    setClientDetails(prev => ({...prev, leadId: newLead.data.id}));

    // Clear form
    setCustomerDetails({
      custName: '',
      custEmail: '',
      custMobile: '',
    });

    // Close bottomsheet and exit add mode
    newLeadBottomSheetOptions.closeBottomSheet();
    setAddNewClientMode(false);
  };

  const handleClientSelect = (client: any, index: number) => {
    setSelected(index);
    setClientDetails(prev => ({...prev, leadId: client.data.id}));
  };

  const handleBottomSheetSelect = (client: any, index: number) => {
    handleClientSelect(client, index);
    allLeadsBottomSheetOptions.closeBottomSheet();
  };

  // Effects
  useEffect(() => {
    if (filteredClients.length === 0) {
      setAddNewClientMode(true);
      setSelected(-1);
    }
  }, [filteredClients]);

  useEffect(() => {
    if (addNewClientMode && selected === -1) {
      setClientDetails(prev => ({...prev, leadId: null}));
    }
  }, [addNewClientMode, selected]);

  useEffect(() => {
    if (clientDetailsData._data?.ldA?.length > 0) {
      setClientDetails(prev => ({
        ...prev,
        leadId: clientDetailsData._data.ldA[0].data.id,
      }));
    }
  }, [clientDetailsData._data.ldA, setClientDetails]);

  if (isEditMode) return null;

  return (
    <View style={styles.container}>
      <HeaderSection
        colors={colors}
        setAddNewClientMode={setAddNewClientMode}
        addNewClientMode={addNewClientMode}
        allLeadsBottomSheetOptions={allLeadsBottomSheetOptions}
        hasMoreClients={hasMoreClients}
        newLeadBottomSheetOptions={newLeadBottomSheetOptions}
      />

      {addNewClientMode && (
        <AddNewLeadForm
          customerDetails={customerDetails}
          setCustomerDetails={setCustomerDetails}
          colors={colors}
        />
      )}

      {clientsToShow.length === 0 && !addNewClientMode ? (
        <CustomText
          variant="text-sm-medium"
          color="neutral900"
          style={styles.noClientsText}>
          No clients are found
        </CustomText>
      ) : (
        <View style={styles.clientListContainer}>
          {clientsToShow.map((client: any, index: number) => (
            <ClientCard
              key={client.data.id}
              client={client}
              isSelected={selected === index}
              onPress={() => handleClientSelect(client, index)}
              colors={colors}
            />
          ))}

          {hasMoreClients && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => allLeadsBottomSheetOptions.openBottomSheet()}>
              <CustomText variant="text-sm-medium" color="neutral800">
                View all leads
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* All Leads Bottom Sheet */}
      <CustomBottomSheet
        ref={allLeadsBottomSheetOptions.bottomSheetRef}
        snapPoints={['70%']}
        title="All Leads"
        onClose={() => {
          allLeadsBottomSheetOptions.closeBottomSheet();
          setSearchInBottomSheet(''); // Reset search when closing
        }}>
        {/* Search Input in BottomSheet */}
        <View style={styles.bottomSheetSearchContainer}>
          <View style={styles.searchInputContainer}>
            <Search
              size={16}
              color={colors.neutral500}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, {color: colors.neutral900}]}
              placeholder="Search leads..."
              placeholderTextColor={colors.neutral400}
              value={searchInBottomSheet}
              onChangeText={setSearchInBottomSheet}
              autoCapitalize="none"
            />
          </View>
        </View>
        <BottomSheetScrollView style={styles.bottomSheetContent}>
          <View style={styles.allLeadsContainer}>
            {bottomSheetFilteredClients.length === 0 ? (
              <CustomText
                variant="text-sm-medium"
                color="neutral500"
                style={styles.noResultsText}>
                No leads found
              </CustomText>
            ) : (
              bottomSheetFilteredClients.map((client: any, index: number) => (
                <ClientCard
                  key={client.data.id}
                  client={client}
                  isSelected={selected === index}
                  onPress={() => handleBottomSheetSelect(client, index)}
                  colors={colors}
                />
              ))
            )}
          </View>
        </BottomSheetScrollView>
      </CustomBottomSheet>

      {/* New Lead Bottom Sheet - Placeholder for future use */}
      <CustomBottomSheet
        ref={newLeadBottomSheetOptions.bottomSheetRef}
        snapPoints={['70%']}
        title="Add New Lead"
        onClose={() => {
          newLeadBottomSheetOptions.closeBottomSheet();
        }}>
        <BottomSheetScrollView style={styles.bottomSheetContent}>
          <View style={[styles.formContainer, {padding: 20}]}>
            {[
              {
                placeholder: 'Lead name*',
                value: customerDetails.custName,
                key: 'custName',
              },
              {
                placeholder: 'Email Address*',
                value: customerDetails.custEmail,
                key: 'custEmail',
                type: 'email-address',
              },
              {
                placeholder: 'Mobile number',
                value: customerDetails.custMobile,
                key: 'custMobile',
                type: 'phone-pad',
              },
            ].map((field, index) => (
              <TextInput
                key={index}
                style={[
                  styles.textInput,
                  {borderColor: colors.neutral200, color: colors.neutral900},
                ]}
                placeholder={field.placeholder}
                placeholderTextColor={colors.neutral400}
                value={field.value}
                onChangeText={text =>
                  setCustomerDetails({...customerDetails, [field.key]: text})
                }
                keyboardType={(field.type as any) || 'default'}
                autoCapitalize={
                  field.key === 'custEmail' ? 'none' : 'sentences'
                }
              />
            ))}
          </View>
        </BottomSheetScrollView>
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, {borderColor: colors.neutral200}]}
            onPress={() => {
              newLeadBottomSheetOptions.closeBottomSheet();
            }}>
            <CustomText variant="text-base-medium" color="neutral600">
              Cancel
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor: isFormValid
                  ? colors.neutral900
                  : colors.neutral300,
                opacity: isFormValid ? 1 : 0.5,
              },
            ]}
            onPress={handleAddNewLead}
            disabled={!isFormValid}>
            <CustomText variant="text-base-medium" color="white">
              Add New Lead
            </CustomText>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>
    </View>
  );
};

export default SelectClient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
    paddingHorizontal: 20,
  },
  HeaderText: {
    textAlign: 'left',
  },
  headerContainer: {
    ...flex.rowJustifyBetweenItemCenter,
  },
  iconCard: {
    padding: 10,
    ...shadows['shadow-2xs'],
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    borderRadius: 8,
  },
  plusIcon: {
    marginRight: 4,
  },
  rowIconContainer: {
    ...flex.rowItemCenter,
    gap: 8,
  },
  formContainer: {
    gap: 16,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: Colors.lightThemeColors.white,
    height: 56,
  },
  textInputBox: {
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    backgroundColor: Colors.lightThemeColors.white,
    ...shadows['shadow-sm'],
  },
  clientListContainer: {
    marginTop: 20,
    gap: 12,
  },
  clientCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    ...shadows['shadow-2xs'],
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  radioButtonSpacing: {
    marginTop: 2,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    marginBottom: 4,
  },
  tripDetails: {
    lineHeight: 20,
  },
  viewAllButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.lightThemeColors.neutral100,
    borderRadius: 8,
  },
  noClientsText: {
    textAlign: 'center',
    marginVertical: 24,
  },
  bottomSheetContent: {
    flex: 1,
  },
  allLeadsContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
    gap: 12,
  },
  bottomSheetSearchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.lightThemeColors.white,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  noResultsText: {
    textAlign: 'center',
    marginVertical: 32,
  },
  buttonContainer: {
    ...flex.rowJustifyBetweenItemCenter,
    gap: 8,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightThemeColors.neutral200,
  },
  cancelButton: {
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: '50%',
    backgroundColor: Colors.lightThemeColors.white,
  },
  addButton: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: '50%',
    backgroundColor: Colors.lightThemeColors.neutral900,
  },
});
