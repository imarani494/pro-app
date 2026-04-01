import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Platform} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CarReantalStackParamList} from '../../navigators/types';
import {Colors, Typography} from '../../styles';
import {CustomText} from '../../common/components';
import {useDispatch} from 'react-redux';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {ArrowLeft, CircleX} from 'lucide-react-native';
import {useTheme} from '../../context/ThemeContext';


type Props = NativeStackScreenProps<CarReantalStackParamList, 'CarRentalListing'>;

const CarRentalListingScreen: React.FC<Props> = ({navigation, route}) => {
  const {colors} = useTheme();

  const [showError, setShowError] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>('');

  const dispatch = useDispatch();

  const initialCheck = async () => {
   
  };

  useEffect(() => {
   
  }, []); // Empty dependency array - runs once on mount

  const goBack = async () => {
      navigation.goBack();
  };
  return (
    <BottomSheetModalProvider>
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
            Create Proposal
          </CustomText>
          {/* <Edit color={colors.white} size={25} onPress={() => {}} /> */}
          <View></View>
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
                  <View style={{ flex: 1 }}>
                      
          </View>
        </ScrollView>

        {/* Error Toast Message */}
        {showError && (
          <View style={styles.errorToast}>
            <View style={styles.errorToastContent}>
              <CircleX size={20} color={Colors.lightThemeColors.red700} />
              <CustomText
                variant="text-sm-normal"
                color="red700"
                style={styles.errorText}>
                {showMessage || 'Please fill all the required fields'}
              </CustomText>
            </View>
          </View>
        )}
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.white,
    width: '100%',
    paddingVertical: 16,
  },
  errorToast: {
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.red200,
    backgroundColor: Colors.lightThemeColors.red50,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  errorToastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningIcon: {
    fontSize: 20,
  },
  errorText: {
    flex: 1,
  },
  headerContent: {
    ...Typography.flex.rowJustifyBetweenItemCenter,
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 45 : 10,
    paddingHorizontal: 20,
  },
});

export default CarRentalListingScreen;
