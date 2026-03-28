import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CustomText} from '../../common/components';
import AnimatedInput from '../../common/components/AnimatedInput';
import {useState} from 'react';
import {resetPassword} from '../../common/api/mobile/forgot-password/route';

const ResetPasswordUI = () => {
  const {width} = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [isErrorEmail, setIsErrorEmail] = useState(false);

  const isValidEmail = (txt: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(txt);
  const handleForgotEmail = () => {
    if (!isValidEmail(email)) {
      setIsErrorEmail(true);
      return;
    }
    resetPassword({email});
    console.log(email);
  };

  return (
    <KeyboardAwareScrollView style={styles.rootContainer}>
      {/* Logo */}
      <View style={styles.logoBox}>
        <Image
          source={{uri: 'logo'}}
          style={{
            width: width * 0.38,
            height: width * 0.38,
            resizeMode: 'contain',
          }}
        />
      </View>

      {/* White rounded container */}
      <View style={styles.formContainer}>
        <CustomText
          variant="text-2xl-semibold"
          color="neutral900"
          style={styles.title}>
          Forgot Password
        </CustomText>

        <CustomText
          variant="text-md-normal"
          color="neutral500"
          style={styles.description}>
          Enter your email below and we’ll send you a link to reset your
          password.
        </CustomText>

        {/* Email Input */}
        <View
          style={[
            styles.inputText,
            {
              borderColor: isErrorEmail
                ? '#FF3B30' // red600
                : emailFocused
                ? '#171717' // neutral900
                : '#E5E7EB', // neutral200
            },
          ]}>
          <AnimatedInput
            label="Email Address *"
            value={email}
            setFocused={setEmailFocused}
            isFocused={emailFocused}
            onChangeText={(txt: any) => {
              setEmail(txt);
              setIsErrorEmail(false);
            }}
            keyboardType="email-address"
            autoComplete="off"
            textContentType="none"
            importantForAutofill="yes"
            errorText={isErrorEmail ? 'Please enter a valid email' : ''}
            hasError={isErrorEmail}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleForgotEmail}>
          <CustomText style={styles.primaryButtonText}>
            SEND RESET LINK
          </CustomText>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginHorizontal: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  primaryButton: {
    backgroundColor: '#1A73E8',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  inputText: {
    height: 58,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 15,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});

export default ResetPasswordUI;
