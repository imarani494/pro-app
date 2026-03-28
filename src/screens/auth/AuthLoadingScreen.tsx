import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Dimensions, Image, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {Sizing, Typography} from '../../styles';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import {TRIPFACTORY_LOGO_DARK} from '../../utils/assetUtil';
import AppConfig from '../../config/AppConfig';
import JailMonkey from 'jail-monkey';
import {User} from '../../data';
import SecureStorageUtil from '../../utils/SecureStorageUtil';
import {saveDeviceInfo} from './redux/authSlice';
import {useAppDispatch} from '../../store/hooks';
import {ActivityIndicator} from 'react-native-paper';
import {AuthStackParamList} from '../../navigators/types';
import {CommonActions} from '@react-navigation/native';

type Props = NativeStackScreenProps<AuthStackParamList, 'AuthLoading'>;

const AuthLoadingScreen: React.FC<Props> = ({navigation}) => {
  const {width} = Dimensions.get('window');
  const dispatch = useAppDispatch();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%', '40%', '40%'], []);
  const onOpenBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const {colors} = useTheme();
  const LOGO_SIZE = width * 0.5;

  const handleSaveDeviceInfo = async () => {
    const data = await dispatch(saveDeviceInfo({}));
    navigation.navigate('Login');
    let routeName = 'Login';
    if (data?.payload.success) {
      await SecureStorageUtil.setSecretKey('secretKey', data?.payload?.clSek);
      await User.storeUserAccount(data?.payload);
      await User.parseJSON(data?.payload);
      await AppConfig.setForceUpdateStatus(data?.payload?.forceUpdate);
      //  if (data?.payload?.forceUpdate) {
      //    routeName = 'ForceUpdate';
      //  } else

      if (await User.isLoggedIn()) {
        Alert.alert('Info', 'User already logged in');
        routeName = 'JourneyFlow';
      } else {
        navigation.navigate('Login');
      }
    }
    // await AppConfig.reset();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'JourneyFlow'}],
      }),
    );
  };

  const appInit = async () => {
    try {
      await AppConfig.initialize();
      console.log('AppConfig initialized successfully');
      // Comment out Firebase-dependent calls until Firebase is properly configured
      // await AppRemoteConfig.initialize();
      // await AppRemoteConfig.fetchAndActivate();
      await User.initialize();
      // await AppAnalytics.initialize();

      // AppAnalytics.logEvent('app_open', {
      //   deviceId: AppConfig.deviceId,
      //   ...AppConfig.getDeviceInfo(),
      // });

      await handleSaveDeviceInfo();
    } catch (error) {
      console.error('Failed to initialize AppConfig:', error);
    }
  };

  useEffect(() => {
    // TODO: get config from remoteConfig
    if (
      !AppConfig.isDebugMode() &&
      !AppConfig.isIOS() &&
      JailMonkey.isJailBroken()
    ) {
      // Alternative behaviour for jail-broken/rooted devices.
      onOpenBottomSheet();
    } else {
      appInit();
    }
  }, []);

  return (
    <View style={[styles.lottieContainer, {backgroundColor: colors.white}]}>
      {/* {!isLoading ? ( */}
      <ActivityIndicator
        size="small"
        color={colors.neutral900}
        style={styles.indicator}
      />
      {/* ) : null} */}
      <Image
        source={TRIPFACTORY_LOGO_DARK}
        style={{
          position: 'absolute',
          width: LOGO_SIZE,
          height: LOGO_SIZE,
          resizeMode: 'contain',
        }}
      />

      {/* <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        detached={true}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
      >
        <View style={styles.modalContainer}>
          <Text variant="bodyLarge" style={styles.sTxt}>
            App do not support on rooted devices due to security and integrity
            concerns.
          </Text>
        </View>
      </BottomSheetModal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  lottieContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  lottieAnimation: {
    height: responsiveHeight(100),
    width: '100%',
  },
  indicator: {
    position: 'absolute',
    bottom: 20,
    zIndex: 300,
  },
  splash: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  modalContainer: {
    padding: Sizing.x20,
    ...Typography.flex.center,
    flex: 1,
  },
  sTxt: {fontSize: 18, lineHeight: 20, textAlign: 'center', color: '#666'},
});

export default AuthLoadingScreen;
