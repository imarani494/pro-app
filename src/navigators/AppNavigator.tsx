import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import JourneyStack from './JourneyStack';
import AuthStack from './AuthStack';


const Stack = createNativeStackNavigator();

function AppNavigator(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <Stack.Navigator
          initialRouteName="Auth"
          screenOptions={{headerShown: false}}>
          
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen name="JourneyFlow" component={JourneyStack} />
        </Stack.Navigator>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default AppNavigator;