import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthLoadingScreen from '../screens/auth/AuthLoadingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import {AuthStackParamList} from './types';
import VerifyOTPScreen from '../screens/auth/VerifyOtp';

const Stack = createNativeStackNavigator<AuthStackParamList>();

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="AuthLoading"
      screenOptions={{title: '', headerShown: false}}>
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOTPScreen} />
    </Stack.Navigator>
  );
}

export default AuthStack;
