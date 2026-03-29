import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import {X, ChevronDown} from 'lucide-react-native';
import {useTheme} from '../../../context/ThemeContext';
import {Colors} from '../../../styles';
import {CustomText} from '../../../common/components';
import AnimatedInput from '../../../common/components/AnimatedInput';
import {useAppDispatch} from '../../../store';
import {fetchProfileSave} from '../redux/customTripSlice';
import {User} from '../../../data';
import SecureStorageUtil from '../../../utils/SecureStorageUtil';
import {divider} from '../../../styles/outlines';

const {height: screenHeight} = Dimensions.get('window');

export interface TravellerFormBottomSheetProps {
  visible: boolean;
  onSave: (traveller: any, custID: any) => void;
  onClose: () => void;
  initialData?: any;
  sectionTitle: string;
}
export interface TravellerOption {
  id: string;
  name: string;
  customerId?: number | string;
  age?: number;
}

const TravellerFormBottomSheet = ({
  visible,
  onSave,
  onClose,
  initialData,
  sectionTitle,
}: TravellerFormBottomSheetProps) => {
  const {colors} = useTheme();
  const dispatch = useAppDispatch();

  const authToken = async () => {
    const authToken = await SecureStorageUtil.getSecretKey('authToken');
    if (authToken) {
      return authToken;
    } else {
      return '';
    }
  };

  const [showError, setShowError] = useState(false);
  const [showMessage, setShowMessage] = useState('');

  // Focus states for each input
  const [focusStates, setFocusStates] = useState({
    firstName: false,
    lastName: false,
    email: false,
    mobile: false,
    age: false,
    specialRequest: false,
    customerNotes: false,
    allergies: false,
    birthdayYear: false,
    anniversaryYear: false,
  });

  type FocusFieldName = keyof typeof focusStates;

  // Define valid dropdown field names
  type DropdownFieldName =
    | 'gender'
    | 'flightSeatPref'
    | 'flightMealPref'
    | 'localMealPref'
    | 'accommodationPref'
    | 'birthdayDay'
    | 'birthdayMonth'
    | 'anniversaryDay'
    | 'anniversaryMonth';

  // Dropdown modal state
  const [showDropdownModal, setShowDropdownModal] = useState(false);
  const [dropdownType, setDropdownType] = useState<DropdownFieldName | null>(
    null,
  );
  const [dropdownTitle, setDropdownTitle] = useState<string>('');
  const [dropdownData, setDropdownData] = useState<string[]>([]);

  // Dropdown data arrays
  const genderOptions = ['Male', 'Female', 'Other'];
  const dayOptions = Array.from({length: 31}, (_, i) => (i + 1).toString());
  const monthOptions = Array.from({length: 12}, (_, i) => (i + 1).toString());
  const flightSeatOptions = ['Window', 'Aisle', 'Middle'];
  const flightMealOptions = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain'];
  const localMealOptions = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain'];
  const accommodationOptions = ['Hotel', 'Apartment', 'Villa'];

  const openDropdown = (
    type: DropdownFieldName,
    title: string,
    options: string[],
  ) => {
    setDropdownType(type);
    setDropdownTitle(title);
    setDropdownData(options);
    setShowDropdownModal(true);
  };

  const handleDropdownSelect = (value: string) => {
    if (dropdownType !== null) {
      setForm(prev => ({...prev, [dropdownType]: value}));
    }
    setShowDropdownModal(false);
  };

  const [form, setForm] = useState({
    title: '',
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    mobile: '',
    nationality: '',
    specialRequest: '',
    customerNotes: '',
    gender: '',
    flightSeatPref: '',
    flightMealPref: '',
    localMealPref: '',
    accommodationPref: '',
    allergies: '',
    birthdayDay: '',
    birthdayMonth: '',
    birthdayYear: '',
    anniversaryDay: '',
    anniversaryMonth: '',
    anniversaryYear: '',
  });
  // (removed duplicate showAdvanced)

  const setFieldFocused = (
    fieldName: FocusFieldName,
  ): React.Dispatch<React.SetStateAction<boolean>> => {
    return (value: React.SetStateAction<boolean>) => {
      setFocusStates(prev => ({
        ...prev,
        [fieldName]:
          typeof value === 'function' ? value(prev[fieldName]) : value,
      }));
    };
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

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        firstName:
          initialData.firstName ||
          (initialData.name ? initialData.name.split(' ')[0] : ''),
        lastName:
          initialData.lastName ||
          (initialData.name
            ? initialData.name.split(' ').slice(1).join(' ')
            : ''),
        age: initialData.age || '',
        email: initialData.email || '',
        mobile: initialData.mobile || '',
        nationality: initialData.nationality || '',
        specialRequest: initialData.specialRequest || '',
        customerNotes: initialData.customerNotes || '',
        gender: initialData.gender || '',
        flightSeatPref: initialData.flightSeatPref || '',
        flightMealPref: initialData.flightMealPref || '',
        localMealPref: initialData.localMealPref || '',
        accommodationPref: initialData.accommodationPref || '',
        allergies: initialData.allergies || '',

        birthdayDay:
          initialData.birthdayDay ||
          (initialData.custdayBirth ? String(initialData.custdayBirth) : ''),
        birthdayMonth:
          initialData.birthdayMonth ||
          (initialData.custmonthBirth
            ? String(initialData.custmonthBirth)
            : ''),
        birthdayYear:
          initialData.birthdayYear ||
          (initialData.custyearBirth ? String(initialData.custyearBirth) : ''),

        anniversaryDay: initialData.anniversaryDay || '',
        anniversaryMonth: initialData.anniversaryMonth || '',
        anniversaryYear: initialData.anniversaryYear || '',
      });
    } else {
      setForm({
        title: '',
        firstName: '',
        lastName: '',
        age: '',
        email: '',
        mobile: '',
        nationality: '',
        specialRequest: '',
        customerNotes: '',
        gender: '',
        flightSeatPref: '',
        flightMealPref: '',
        localMealPref: '',
        accommodationPref: '',
        allergies: '',
        birthdayDay: '',
        birthdayMonth: '',
        birthdayYear: '',
        anniversaryDay: '',
        anniversaryMonth: '',
        anniversaryYear: '',
      });
    }
  }, [initialData]);

  const handleSelectChange = (name: string, value: string): void => {
    setForm(form => ({...form, [name]: value}));
  };
  // Advanced view state
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setIsSaving(true);
    try {
      const data = {
        ...(initialData?.customerId && {
          cid: initialData.customerId.toString(),
        }),
        cpsnStr: {
          pxpA: [
            {
              pn: '',
              nt: '',
              doi: '',
              doe: '',
            },
          ],
          ffA: [],
        },
        idStr: [],
        isRtnJSON: true,
        title: form.title,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        mobile: form.mobile,
        spReq: '',
        notes: '',
        notifPref: '',
        isMktAllwd: true,
        gender: '',
        seatPref: 'Any',
        mealPref: '',
        mealReq: '',
        allergies: '',
        hstPref: '',
        age: form.age ? parseInt(form.age.toString(), 10) : null,
        custdayBirth: form.birthdayDay ? Number(form.birthdayDay) : 0,
        custmonthBirth: form.birthdayMonth ? Number(form.birthdayMonth) : 0,
        custyearBirth: form.birthdayYear ? Number(form.birthdayYear) : 0,
        custdayAnnv: 0,
        custmonthAnnv: 0,
        custyearAnnv: 0,
        ppNum: '',
        ppNat: 0,
        ppDoi: '',
        ppDoe: '',
        addr1: '',
        addr2: '',
        cityId: 0,
        city: '',
        pincode: '',
        __xreq__: true,
        _auth: await authToken(),
        userId: User.getUserId()?.toString() || '0',
      };

      (async () => {
        const result = await dispatch(fetchProfileSave(data) as any);
        const payload = result?.payload || result;
        if (payload && payload._data && payload._data.id) {
          onSave(
            {
              ...form,
              birthdayDay: form.birthdayDay,
              birthdayMonth: form.birthdayMonth,
              birthdayYear: form.birthdayYear,
              age: payload._data.age ?? form.age,
            },
            payload._data.id,
          );
          onClose();
        } else if (!payload.success) {
          setShowError(true);
          setShowMessage(
            payload.error_msg ||
              'Failed to save traveller profile. Please try again.',
          );
        }
      })();
    } catch (error) {
      // handle error
      console.error('❌ Error saving customer:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.headerContent}>
            <CustomText variant="text-lg-semibold" color="neutral900">
              {sectionTitle || ''}
            </CustomText>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.neutral900} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={[styles.contentContainer, {backgroundColor: colors.white}]}
            showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
              {/* Title Selection */}
              <View style={styles.titleContainer}>
                <CustomText
                  variant="text-sm-medium"
                  color="neutral900"
                  style={styles.fieldLabel}>
                  Title
                </CustomText>
                <View style={styles.titleButtonsContainer}>
                  {['Mr', 'Mrs', 'Miss', 'Ms'].map(title => (
                    <TouchableOpacity
                      key={title}
                      style={[
                        styles.titleButton,
                        form.title === title && styles.titleButtonSelected,
                      ]}
                      onPress={() => setForm(prev => ({...prev, title}))}>
                      <CustomText
                        variant="text-sm-medium"
                        color={
                          form.title === title ? 'neutral900' : 'neutral600'
                        }>
                        {title}
                      </CustomText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Name Fields */}
              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <View style={styles.inputContainer}>
                    <AnimatedInput
                      label="First Name"
                      value={form.firstName}
                      isFocused={focusStates.firstName}
                      setFocused={setFieldFocused('firstName')}
                      onChangeText={text =>
                        setForm(prev => ({...prev, firstName: text}))
                      }
                      textStyle={styles.inputTextStyle}
                    />
                  </View>
                </View>
                <View style={styles.nameField}>
                  <View style={styles.inputContainer}>
                    <AnimatedInput
                      label="Last Name"
                      value={form.lastName}
                      isFocused={focusStates.lastName}
                      setFocused={setFieldFocused('lastName')}
                      onChangeText={text =>
                        setForm(prev => ({...prev, lastName: text}))
                      }
                      textStyle={styles.inputTextStyle}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <View style={styles.inputContainer}>
                    <AnimatedInput
                      label="Age"
                      value={form.age}
                      isFocused={focusStates.age}
                      setFocused={setFieldFocused('age')}
                      onChangeText={text =>
                        setForm(prev => ({...prev, age: text}))
                      }
                      keyboardType="numeric"
                      maxLength={3}
                      textStyle={styles.inputTextStyle}
                    />
                  </View>
                </View>
                <View style={styles.nameField}>
                  <View style={styles.inputContainer}>
                    <AnimatedInput
                      label="Mobile Number"
                      value={form.mobile}
                      isFocused={focusStates.mobile}
                      setFocused={setFieldFocused('mobile')}
                      onChangeText={text =>
                        setForm(prev => ({...prev, mobile: text}))
                      }
                      keyboardType="phone-pad"
                      textStyle={styles.inputTextStyle}
                    />
                  </View>
                </View>
              </View>

              {/* Age and Nationality Row */}
              {/* <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <View style={styles.inputContainer}>
                    <AnimatedInput
                      label="Age"
                      value={form.age}
                      isFocused={focusStates.age}
                      setFocused={setFieldFocused('age')}
                      onChangeText={text =>
                        setForm(prev => ({...prev, age: text}))
                      }
                      keyboardType="numeric"
                      maxLength={3}
                      textStyle={styles.inputTextStyle}
                    />
                  </View>
                </View>
                <View style={styles.nameField}>
                  <View style={styles.inputContainer}>
                    <AnimatedInput
                      label="Mobile Number"
                      value={form.mobile}
                      isFocused={focusStates.mobile}
                      setFocused={setFieldFocused('mobile')}
                      onChangeText={text =>
                        setForm(prev => ({...prev, mobile: text}))
                      }
                      keyboardType="phone-pad"
                      textStyle={styles.inputTextStyle}
                    />
                  </View>
                </View>
              </View> */}

              {/* Email */}
              <View style={styles.fieldContainer}>
                <View style={styles.inputContainer}>
                  <AnimatedInput
                    label="Email Address"
                    value={form.email}
                    isFocused={focusStates.email}
                    setFocused={setFieldFocused('email')}
                    onChangeText={text =>
                      setForm(prev => ({...prev, email: text}))
                    }
                    keyboardType="email-address"
                    textStyle={styles.inputTextStyle}
                  />
                </View>
              </View>

              {/* Special Requests */}
              <View style={styles.fieldContainer}>
                <View style={[styles.inputContainer, {height: 90}]}>
                  <AnimatedInput
                    label="Special Requests"
                    value={form.specialRequest}
                    isFocused={focusStates.specialRequest}
                    setFocused={setFieldFocused('specialRequest')}
                    onChangeText={text =>
                      setForm(prev => ({...prev, specialRequest: text}))
                    }
                    multiline
                    numberOfLines={3}
                    textStyle={[styles.inputTextStyle, styles.textAreaStyle]}
                  />
                </View>
              </View>

              {/* Customer Notes */}
              <View style={styles.fieldContainer}>
                <View style={[styles.inputContainer, {height: 90}]}>
                  <AnimatedInput
                    label="Customer Notes"
                    value={form.customerNotes}
                    isFocused={focusStates.customerNotes}
                    setFocused={setFieldFocused('customerNotes')}
                    onChangeText={text =>
                      setForm(prev => ({...prev, customerNotes: text}))
                    }
                    multiline
                    numberOfLines={3}
                    textStyle={[styles.inputTextStyle, styles.textAreaStyle]}
                  />
                </View>
              </View>

              {/* Birthday Section */}
              <View style={styles.birthdayContainer}>
                <CustomText
                  variant="text-base-semibold"
                  color="neutral900"
                  style={styles.sectionTitle}>
                  Birthday (Year Optional)
                </CustomText>
                <View style={styles.birthdayRow}>
                  <View style={styles.birthdayField}>
                    <CustomText
                      variant="text-sm-medium"
                      color="neutral600"
                      style={styles.dropdownLabel}>
                      DD
                    </CustomText>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() =>
                        openDropdown('birthdayDay', 'Day', dayOptions)
                      }>
                      <CustomText variant="text-sm-medium" color="neutral900">
                        {form.birthdayDay || 'Any'}
                      </CustomText>
                      <ChevronDown size={20} color={colors.neutral600} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.birthdayField}>
                    <CustomText
                      variant="text-sm-medium"
                      color="neutral600"
                      style={styles.dropdownLabel}>
                      MM
                    </CustomText>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() =>
                        openDropdown('birthdayMonth', 'Month', monthOptions)
                      }>
                      <CustomText variant="text-sm-medium" color="neutral900">
                        {form.birthdayMonth || 'Any'}
                      </CustomText>
                      <ChevronDown size={20} color={colors.neutral600} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.birthdayField}>
                    <CustomText
                      variant="text-sm-medium"
                      color="neutral600"
                      style={styles.dropdownLabel}>
                      YYYY
                    </CustomText>
                    <View
                      style={[
                        styles.inputContainer,
                        {minHeight: 48, height: 50},
                      ]}>
                      <AnimatedInput
                        label=""
                        value={form.birthdayYear}
                        isFocused={focusStates.birthdayYear}
                        setFocused={setFieldFocused('birthdayYear')}
                        onChangeText={text =>
                          setForm(prev => ({...prev, birthdayYear: text}))
                        }
                        keyboardType="numeric"
                        maxLength={4}
                        textStyle={styles.inputTextStyle}
                        placeholder=""
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={{...divider.medium}} />

              {/* Advanced View Toggle */}
              <TouchableOpacity style={styles.advancedToggle}>
                <CustomText variant="text-base-semibold" color="neutral900">
                  Advanced View
                </CustomText>
              </TouchableOpacity>

              {/* Advanced View Content */}
              {/* {showAdvanced && ( */}
              <View style={styles.advancedContainer}>
                {/* Gender and Flight Seat Row */}
                <View style={styles.nameRow}>
                  <View style={styles.nameField}>
                    <View style={styles.dropdownContainer}>
                      <CustomText
                        variant="text-sm-medium"
                        color="neutral600"
                        style={styles.dropdownLabel}>
                        Gender*
                      </CustomText>
                      <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() =>
                          openDropdown('gender', 'Gender', genderOptions)
                        }>
                        <CustomText variant="text-sm-medium" color="neutral900">
                          {form.gender || 'Male'}
                        </CustomText>
                        <ChevronDown size={20} color={colors.neutral600} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.nameField}>
                    <View style={styles.dropdownContainer}>
                      <CustomText
                        variant="text-sm-medium"
                        color="neutral600"
                        style={styles.dropdownLabel}>
                        Flight Seat*
                      </CustomText>
                      <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() =>
                          openDropdown(
                            'flightSeatPref',
                            'Flight Seat',
                            flightSeatOptions,
                          )
                        }>
                        <CustomText variant="text-sm-medium" color="neutral900">
                          {form.flightSeatPref || 'Any'}
                        </CustomText>
                        <ChevronDown size={20} color={colors.neutral600} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Flight Meal and Local Meal Row */}
                <View style={styles.nameRow}>
                  <View style={styles.nameField}>
                    <View style={styles.dropdownContainer}>
                      <CustomText
                        variant="text-sm-medium"
                        color="neutral600"
                        style={styles.dropdownLabel}>
                        Flight Meal*
                      </CustomText>
                      <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() =>
                          openDropdown(
                            'flightMealPref',
                            'Flight Meal',
                            flightMealOptions,
                          )
                        }>
                        <CustomText variant="text-sm-medium" color="neutral900">
                          {form.flightMealPref || 'Vegetarian'}
                        </CustomText>
                        <ChevronDown size={20} color={colors.neutral600} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.nameField}>
                    <View style={styles.dropdownContainer}>
                      <CustomText
                        variant="text-sm-medium"
                        color="neutral600"
                        style={styles.dropdownLabel}>
                        Local Meal*
                      </CustomText>
                      <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() =>
                          openDropdown(
                            'localMealPref',
                            'Local Meal',
                            localMealOptions,
                          )
                        }>
                        <CustomText variant="text-sm-medium" color="neutral900">
                          {form.localMealPref || 'Vegetarian'}
                        </CustomText>
                        <ChevronDown size={20} color={colors.neutral600} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Accommodation */}
                <View style={styles.fieldContainer}>
                  <View style={styles.dropdownContainer}>
                    <CustomText
                      variant="text-sm-medium"
                      color="neutral600"
                      style={styles.dropdownLabel}>
                      Accommodation*
                    </CustomText>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() =>
                        openDropdown(
                          'accommodationPref',
                          'Accommodation',
                          accommodationOptions,
                        )
                      }>
                      <CustomText variant="text-sm-medium" color="neutral900">
                        {form.accommodationPref || 'Double'}
                      </CustomText>
                      <ChevronDown size={20} color={colors.neutral600} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Allergies */}
                <View style={[styles.fieldContainer, {marginBottom: 0}]}>
                  <View style={[styles.inputContainer, {height: 90}]}>
                    <AnimatedInput
                      label="Mention any allergies"
                      value={form.allergies}
                      isFocused={focusStates.allergies}
                      setFocused={setFieldFocused('allergies')}
                      onChangeText={text =>
                        setForm(prev => ({...prev, allergies: text}))
                      }
                      multiline
                      numberOfLines={3}
                      textStyle={[styles.inputTextStyle, styles.textAreaStyle]}
                    />
                  </View>
                </View>
                <View style={{...divider.base}} />

                {/* Anniversary Section */}
                <View style={styles.birthdayContainer}>
                  <CustomText
                    variant="text-base-semibold"
                    color="neutral900"
                    style={styles.sectionTitle}>
                    Anniversary (Year Optional)
                  </CustomText>
                  <View style={styles.birthdayRow}>
                    <View style={styles.birthdayField}>
                      <CustomText
                        variant="text-sm-medium"
                        color="neutral600"
                        style={styles.dropdownLabel}>
                        DD
                      </CustomText>
                      <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() =>
                          openDropdown('anniversaryDay', 'Day', dayOptions)
                        }>
                        <CustomText variant="text-sm-medium" color="neutral900">
                          {form.anniversaryDay || 'Any'}
                        </CustomText>
                        <ChevronDown size={20} color={colors.neutral600} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.birthdayField}>
                      <CustomText
                        variant="text-sm-medium"
                        color="neutral600"
                        style={styles.dropdownLabel}>
                        MM
                      </CustomText>
                      <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() =>
                          openDropdown(
                            'anniversaryMonth',
                            'Month',
                            monthOptions,
                          )
                        }>
                        <CustomText variant="text-sm-medium" color="neutral900">
                          {form.anniversaryMonth || 'Any'}
                        </CustomText>
                        <ChevronDown size={20} color={colors.neutral600} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.birthdayField}>
                      <CustomText
                        variant="text-sm-medium"
                        color="neutral600"
                        style={styles.dropdownLabel}>
                        YYYY
                      </CustomText>
                      <View
                        style={[
                          styles.inputContainer,
                          {minHeight: 48, height: 50},
                        ]}>
                        <AnimatedInput
                          label=""
                          value={form.anniversaryYear}
                          isFocused={focusStates.anniversaryYear}
                          setFocused={setFieldFocused('anniversaryYear')}
                          onChangeText={text =>
                            setForm(prev => ({...prev, anniversaryYear: text}))
                          }
                          keyboardType="numeric"
                          maxLength={4}
                          textStyle={styles.inputTextStyle}
                          placeholder=""
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {/* //   )} */}
            </View>
          </ScrollView>
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onClose}>
              <CustomText variant="text-base-semibold" color="neutral900">
                Cancel
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.saveButton,
                isSaving && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={isSaving}>
              {isSaving ? (
                <View style={styles.savingContainer}>
                  <ActivityIndicator size="small" color="white" />
                  <CustomText
                    variant="text-base-semibold"
                    color="white"
                    style={{marginLeft: 8}}>
                    Saving...
                  </CustomText>
                </View>
              ) : (
                <CustomText variant="text-base-semibold" color="white">
                  Save Traveller
                </CustomText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Dropdown Modal */}
      {showDropdownModal && (
        <Modal
          visible={showDropdownModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDropdownModal(false)}>
          <View style={styles.dropdownModalOverlay}>
            <View style={styles.dropdownModalContent}>
              <View style={styles.dropdownModalHeader}>
                <CustomText variant="text-lg-semibold" color="neutral900">
                  {dropdownTitle}
                </CustomText>
                <TouchableOpacity onPress={() => setShowDropdownModal(false)}>
                  <X size={20} color={colors.neutral900} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.dropdownModalScroll}>
                {dropdownData.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dropdownModalOption,
                      dropdownType &&
                        form[dropdownType] === option &&
                        styles.dropdownModalOptionSelected,
                    ]}
                    onPress={() => handleDropdownSelect(option)}>
                    <CustomText
                      variant={
                        dropdownType && form[dropdownType] === option
                          ? 'text-base-semibold'
                          : 'text-base-normal'
                      }
                      color="neutral900">
                      {option}
                    </CustomText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.lightThemeColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.9,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formContainer: {
    // paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titleContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  fieldLabel: {
    marginBottom: 10,
  },
  titleButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  titleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    backgroundColor: Colors.lightThemeColors.white,
  },
  titleButtonSelected: {
    borderColor: Colors.lightThemeColors.neutral900,
    backgroundColor: Colors.lightThemeColors.neutral100,
  },
  nameRow: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  nameField: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  inputTextStyle: {
    fontSize: 14,
    fontFamily: 'Geist-Medium',
    lineHeight: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    borderRadius: 8,
    backgroundColor: Colors.lightThemeColors.white,
    height: 56,
  },
  textAreaStyle: {
    height: 80,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    marginBottom: 8,
  },
  dropdownLabel: {
    marginBottom: 10,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    borderRadius: 8,
    backgroundColor: Colors.lightThemeColors.white,
    minHeight: 48,
  },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    // marginTop: 8,
    paddingHorizontal: 20,

    marginBottom: 16,
  },
  chevron: {
    transform: [{rotate: '0deg'}],
  },
  chevronUp: {
    transform: [{rotate: '180deg'}],
  },
  advancedContainer: {
    // borderTopWidth: 1,
    // borderTopColor: Colors.lightThemeColors.neutral200,
    // paddingTop: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  birthdayContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  birthdayRow: {
    flexDirection: 'row',
    gap: 12,
  },
  birthdayField: {
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    // marginBottom: 20,
    borderTopWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: Colors.lightThemeColors.white,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
  },
  saveButton: {
    backgroundColor: Colors.lightThemeColors.neutral900,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.lightThemeColors.neutral400,
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModalContent: {
    backgroundColor: Colors.lightThemeColors.white,
    borderRadius: 16,
    width: '80%',
    maxHeight: '60%',
    overflow: 'hidden',
  },
  dropdownModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
  },
  dropdownModalScroll: {
    maxHeight: 300,
  },
  dropdownModalOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral100,
  },
  dropdownModalOptionSelected: {
    backgroundColor: Colors.lightThemeColors.neutral100,
  },
});

export default TravellerFormBottomSheet;
