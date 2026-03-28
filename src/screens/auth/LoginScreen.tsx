import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Snackbar} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LOGIN_BG, TRIPFACTORY_LOGO_WHITE} from '../../utils/assetUtil';
import {useTheme} from '../../context/ThemeContext';
import {CustomText} from '../../common/components';
import AnimatedInput from '../../common/components/AnimatedInput';
import CustomButton from '../../common/components/CustomButton';
import {RootState, useAppDispatch} from '../../store';
import {useSelector} from 'react-redux';
import {fetchLogin} from './redux/authSlice';
import SecureStorageUtil from '../../utils/SecureStorageUtil';
import {User} from '../../data';
import {AuthStackParamList} from '../../navigators/types';

const {width} = Dimensions.get('window');

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const {colors} = useTheme();
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [isErrorName, setIsErrorName] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const dispatch = useAppDispatch();

  const {loginLoading, loginResponse, loginError} = useSelector(
    (state: RootState) => state.device,
  );

  console.log({loginLoading, loginResponse, loginError}, 'login state');

  const LOGO_SIZE = width * 0.38; // 38% of screen

  // Toast helper function
  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const isValidEmailOrPhone = (txt: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Phone: allows optional +, country code, and 10–15 digits
    const phoneRegex = /^\+?\d{10,15}$/;

    return emailRegex.test(txt) || phoneRegex.test(txt);
  };

  const isValidEmail = (txt: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(txt);
  // const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  // const isPhone = (value: string) => /^[0-9]{10}$/.test(value);

  const verifyMobile = async () => {
    if (!isValidEmailOrPhone(email)) {
      setIsErrorName(true);
      return;
    }
    const data = await dispatch(
      fetchLogin({email: 'siraj@tripfactory.com', password: 'Typeyourtrip@1'}),
    );
    if (data?.payload?.success) {
      const authToken = data?.payload?.userAccount?.authToken;
      SecureStorageUtil.initialize(authToken);
      await User.parseJSON(data);
      // AppAnalytics.setUserId(`${data?.userAccount?.userId}`);
      const userInput = email; // this variable already contains email or mobile number

      navigation.push('VerifyOtp', {
        input: userInput.toLowerCase(),
        inputType: isValidEmail(userInput) ? 'email' : 'phone',
      });
      // Alert.alert('Info', 'Login successful');
    } else {
      showToast(data?.payload?.error_msg || 'Login failed');
    }
  };

  return (
    <View style={styles.rootContainer}>
      <View style={[styles.container, {backgroundColor: colors.white}]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={45}
          style={{flex: 1}}>
          <ScrollView
            style={{flex: 1, width: '100%'}}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Banner Image */}
            <View style={styles.imageContainer}>
              <Image source={LOGIN_BG} style={styles.bannerImage} />
              <Image
                source={TRIPFACTORY_LOGO_WHITE}
                style={{
                  position: 'absolute',
                  width: LOGO_SIZE,
                  height: LOGO_SIZE,
                  resizeMode: 'contain',
                }}
              />
            </View>

            {/* White rounded container */}
            <View
              style={[styles.formContainer, {backgroundColor: colors.white}]}>
              <CustomText
                variant="text-2xl-semibold"
                color="neutral900"
                style={styles.title}>
                Welcome back!
              </CustomText>

              {/* EMAIL INPUT */}
              <View
                style={[
                  styles.inputText,
                  {
                    borderColor: isErrorName
                      ? colors.red600
                      : emailFocused
                      ? colors.neutral900
                      : colors.neutral200,
                  },
                ]}>
                <AnimatedInput
                  label="Email Address/ Mobile *"
                  value={email}
                  setFocused={setEmailFocused}
                  isFocused={emailFocused}
                  onChangeText={(txt: any) => {
                    setEmail(txt);
                    setIsErrorName(false);
                  }}
                  keyboardType="email-address"
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="yes"
                  errorText={
                    isErrorName
                      ? 'Please enter a valid email or mobile number'
                      : ''
                  }
                  hasError={isErrorName}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* bottom container */}
      <View style={styles.bottomContainer}>
        {/* Login Button */}
        <CustomButton
          title="Get OTP"
          variant="text-base-medium"
          textStyle={{color: 'neutral50'}}
          onPress={verifyMobile}
          isLoading={loginLoading}></CustomButton>
        <CustomText
          style={styles.footerText}
          variant="text-xs-normal"
          color="neutral500">
          By clicking continue, you agree to our{' '}
          <CustomText style={{textDecorationLine: 'underline'}}>
            Terms of Service
          </CustomText>{' '}
          and{' '}
          <CustomText style={{textDecorationLine: 'underline'}}>
            Privacy Policy
          </CustomText>
          .
        </CustomText>
      </View>

      {/* Toast/Snackbar */}
      <Snackbar
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
        duration={3000}
        style={{
          backgroundColor: colors.red600,
          marginBottom: 100,
        }}
        action={{
          label: 'Close',
          onPress: () => setToastVisible(false),
          textColor: colors.white,
        }}>
        <CustomText variant="text-sm-medium" color="white">
          {toastMessage}
        </CustomText>
      </Snackbar>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  adminStaffButtton: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: '65%',
  },
  bannerImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.2,
    resizeMode: 'cover',
  },
  formContainer: {
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 25,
    paddingTop: 20,
    marginTop: -20,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    textAlign: 'center',
    // marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabText: {
    marginBottom: 10,
  },
  defaultLine: {
    height: 1,
    width: '100%',
    marginBottom: 20,
  },
  activeLine: {
    height: 2,
    width: '100%',
    marginTop: 5,
  },
  input: {
    marginBottom: 15,
  },
  inputText: {
    height: 58,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 15,
  },
  forgot: {
    textAlign: 'right',
    marginBottom: 10,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: 40,
  },
  checkboxText: {
    flex: 1,
  },
  loginBtn: {
    borderRadius: 8,
    paddingVertical: 6,
  },
  footerText: {
    marginHorizontal: 20,
    marginTop: 10,
    textAlign: 'center',
  },
});
