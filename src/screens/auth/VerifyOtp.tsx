import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
  Platform,
  Image,
  Modal,
  Linking,
  StatusBar,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigators/types';
import {useTheme} from '../../context/ThemeContext';
import CustomButton from '../../common/components/CustomButton';
import {CustomText} from '../../common/components';
import {MESSAGE_BOX} from '../../utils/assetUtil';
import {ArrowLeft} from 'lucide-react-native';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyOtp'>;

const OTP_LENGTH = 4;

export default function VerifyOTPScreen({route, navigation}: Props) {
  const {input = '', inputType = 'email'} = (route.params ?? {}) as {
    input?: string;
    inputType?: string;
  };
  const {colors} = useTheme();

  // otp state as array of chars
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const refs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    if (inputType === 'email') {
      setTimeout(() => {
        setShowEmailModal(true);
      }, 300);
    }
  }, []);

  useEffect(() => {
    // focus first input on mount
    refs.current[0]?.focus();
    setIsResendDisabled(true);
    setTimer(60);
  }, []);

  useEffect(() => {
    if (!isResendDisabled) return;
    if (timer <= 0) {
      setIsResendDisabled(false);
      return;
    }
    const t = setInterval(() => setTimer(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timer, isResendDisabled]);

  const masked =
    inputType === 'email' ? input : input.replace(/.(?=.{4})/g, '*');

  const onChangeText = (text: string, idx: number) => {
    // handle paste of full OTP
    if (text.length > 1) {
      const splitted = text.split('').slice(0, OTP_LENGTH);
      const newOtp = [...otp];
      for (let i = 0; i < splitted.length; i++) newOtp[i] = splitted[i];
      setOtp(newOtp);
      const nextIndex = Math.min(splitted.length, OTP_LENGTH - 1);
      refs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[idx] = text;
    setOtp(newOtp);

    if (text && idx < OTP_LENGTH - 1) {
      refs.current[idx + 1]?.focus();
    }

    // if user cleared, move focus back
    if (!text && idx > 0) refs.current[idx - 1]?.focus();
  };

  const onKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const submitOtp = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH || code.includes('')) {
      Alert.alert('Invalid OTP', 'Please enter the complete OTP');
      return;
    }
    setLoading(true);
    try {
      // Call verify API
      // await api.verifyOtp({ input, inputType, code });
      // On success navigate further
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Success', 'OTP verified');
        navigation.reset({index: 0, routes: [{name: 'AuthLoading'}]});
      }, 800);
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'OTP verification failed');
    }
  };

  const resendOtp = async () => {
    if (isResendDisabled) return;
    setIsResendDisabled(true);
    setTimer(60);
    // call resend API
    try {
      // await api.resendOtp({ input, inputType });
      Alert.alert('OTP Sent', `A new OTP has been sent to ${masked}`);
    } catch (err) {
      Alert.alert('Error', 'Failed to resend OTP');
      setIsResendDisabled(false);
    }
  };

  const openGmail = async () => {
    setShowEmailModal(false);

    // small delay so modal closes smoothly
    setTimeout(() => {
      Linking.openURL('mailto:');
    }, 300);
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.white}]}>
      {Platform.OS === 'ios' && (
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={
            colors.white === '#ffffff' ? 'dark-content' : 'light-content'
          }
        />
      )}
      <View
        style={{
          marginTop: Platform.OS === 'ios' ? 40 : 20,
          marginBottom: 20,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerRow}>
        <CustomText color="neutral900" variant="text-2xl-semibold">
          Verify {inputType === 'email' ? 'Email address' : 'Mobile Number'}
        </CustomText>
        <CustomText variant="text-sm-normal" color="neutral500">
          Enter the OTP sent to {masked}
        </CustomText>
      </View>

      <View style={[styles.otpContainer]}>
        {Array.from({length: OTP_LENGTH}).map((_, i) => (
          <TextInput
            inputMode="numeric"
            key={i}
            ref={ref => {
              refs.current[i] = ref;
            }}
            style={[
              styles.otpInput,
              {
                borderColor: colors.neutral200,
                borderTopLeftRadius: i === 0 ? 8 : 0,
                borderBottomLeftRadius: i === 0 ? 8 : 0,
                borderTopRightRadius: i === OTP_LENGTH - 1 ? 8 : 0,
                borderBottomRightRadius: i === OTP_LENGTH - 1 ? 8 : 0,
                borderLeftWidth: i != 0 || i != OTP_LENGTH - 1 ? 1 : 0,
                flex: 1,
              },
            ]}
            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
            onSubmitEditing={() => Keyboard.dismiss()}
            returnKeyType={'done'}
            maxLength={1}
            onChangeText={t => onChangeText(t.replace(/[^0-9]/g, ''), i)}
            onKeyPress={e => onKeyPress(e, i)}
            value={otp[i]}
            textContentType={'oneTimeCode'}
            importantForAutofill="yes"
            autoFocus={i === 0}
            selectionColor={colors.neutral700}
          />
        ))}
      </View>

      <View style={styles.resendRow}>
        <CustomText variant="text-sm-normal" style={{color: colors.neutral600}}>
          Didn't receive the OTP?
        </CustomText>
        <TouchableOpacity onPress={resendOtp} disabled={isResendDisabled}>
          <CustomText variant={'text-sm-semibold'}>
            {' '}
            {isResendDisabled
              ? `Resend in 00:${timer.toString().padStart(2, '0')}`
              : 'Resend'}
          </CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <CustomButton
          variant="text-base-medium"
          title="Proceed"
          textStyle={{color: 'neutral50'}}
          onPress={submitOtp}
          isLoading={loading}
        />
      </View>
      <Modal visible={showEmailModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setShowEmailModal(false)}>
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => setShowEmailModal(false)}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={e => e.stopPropagation()}
              style={[
                styles.modalContent,
                {
                  backgroundColor: colors.white,
                },
              ]}>
              <Image source={MESSAGE_BOX} style={styles.modalImage} />
              <View>
                <CustomText
                  variant="text-2xl-semibold"
                  color="neutral900"
                  style={{marginHorizontal: 'auto', marginBottom: 5}}>
                  OTP sent successfully!
                </CustomText>

                <CustomText
                  variant="text-sm-normal"
                  color="neutral500"
                  style={{
                    marginHorizontal: 30,
                    textAlign: 'center',
                    marginBottom: 20,
                  }}>
                  We’ve sent an OTP to{' '}
                  <CustomText variant="text-sm-semibold" color="neutral800">
                    {input}
                  </CustomText>
                  . Please enter it to log in.
                </CustomText>
              </View>
              <CustomButton
                title="Go to Mail"
                variant="text-base-medium"
                textStyle={{color: 'neutral50'}}
                onPress={openGmail}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    // marginTop: 40,
  },
  designPreview: {
    height: 0,
    width: 0,
    opacity: 0,
  },
  headerRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    // marginTop: 10,
    marginBottom: 18,
    padding: 4,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
  otpInput: {
    height: 56,
    borderWidth: 1,
    textAlign: 'center',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    alignContent: 'center',
  },
  modalImage: {
    marginHorizontal: 'auto',
    marginVertical: 30,
  },
});
