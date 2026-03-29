import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {JourneyStackParamList} from '../../navigators/types';
import {Colors} from '../../styles';
import {CustomText} from '../../common/components';
import { AppConfig } from '../../config';
import SecureStorageUtil from '../../utils/SecureStorageUtil';

type Props = NativeStackScreenProps<
  JourneyStackParamList,
  'JourneyCreateEntry'
>;

const JourneyCreateEntry: React.FC<Props> = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.lightThemeColors.neutral800,
          padding: 15,
          borderRadius: 8,
        }}
        onPress={() =>
          navigation.navigate({name: 'JourneyCreation', params: {}})
        }>
        <CustomText variant="text-lg-semibold" color="white">
          Create Journey
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.lightThemeColors.neutral800,
          padding: 15,
          borderRadius: 8,
        }}
        onPress={() =>
          navigation.navigate({
            name: 'JourneyCreation',
            params: {pkgId: 7075412},
          })
        }>
        <CustomText variant="text-lg-semibold" color="white">
          Create Journey with FD Flow
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.lightThemeColors.neutral800,
          padding: 15,
          borderRadius: 8,
        }}
        onPress={() =>
          navigation.navigate({
            name: 'JourneyDetails',
            params: {
              journeyId: 'dad1acca72c2216e',
              jdid: '678b618ae11903d1',
            
            },
          })
        }>
        <CustomText variant="text-lg-semibold" color="white">
          Journey Details Flow
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: Colors.lightThemeColors.neutral800,
          padding: 15,
          borderRadius: 8,
        }}
        onPress={async() => {
          await SecureStorageUtil.deleteData();
          navigation.navigate('Auth', {screen: 'Login'})
        }
        }>
        <CustomText variant="text-lg-semibold" color="white">
          Log Out
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
});

export default JourneyCreateEntry;
