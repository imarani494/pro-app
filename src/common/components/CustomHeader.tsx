import {useEffect} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';

// import {Appbar, Icon} from 'react-native-paper';
import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {Typography} from '../../styles';
import {ArrowLeft, Edit} from 'lucide-react-native';
import CustomText from './CustomText';

const CustomHeader = ({navigation, route, options, back}: any) => {
  const {colors} = useTheme();
  // useEffect(() => {
  //   if (route && route?.name) {
  //     // AppAnalytics.logScreenView(route?.key, route?.name);
  //     // AppCrashlytics.log({ [route?.name]: route?.params });
  //   }
  // }, []);

  const goBack = async () => {
    if (options?.isWebView) {
      options.goBack();
    } else {
      // if (route?.params?.homeOnBack) {
      //   navigation.navigate("Home");
      //   return;
      // }
      navigation.goBack();
    }
  };

  const SecondaryHeader = ({options, goBack, navigation}: any) => (
    <>
      <View
        style={{
          height: Platform.OS === 'ios' ? 100 : 55,
          width: '100%',
          backgroundColor: colors.neutral900,
          borderColor: colors.neutral900,
        }}>
        <View style={styles.headerContent}>
          <ArrowLeft color={colors.white} size={25} onPress={goBack} />
          <CustomText variant="text-lg-medium" color="white">
            {`${options?.title || ''}`}
          </CustomText>
          {/* <Edit color={colors.white} size={25} onPress={() => {}} /> */}
          <View></View>
        </View>
      </View>
    </>
  );

  return (
    <View>
      <SecondaryHeader
        options={options}
        goBack={goBack}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContent: {
    ...Typography.flex.rowJustifyBetweenItemCenter,
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 45 : 10,
    paddingHorizontal: 20,
  },
});

export default CustomHeader;
