import React from 'react';
import { Platform, StatusBar, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AppNavigator from './src/navigators/AppNavigator';
import { ToastProvider } from './src/common/components/ToastContext';
const queryClient = new QueryClient();

function AppContent() {
  console.log('AppContent rendering...');
  try {
    const { colors } = useTheme();
    console.log('Theme colors loaded:', colors);
    return (
      <NavigationContainer>
        <StatusBar
          backgroundColor={colors.neutral900}
          barStyle="light-content"
        />
        <AppNavigator />
      </NavigationContainer>
    );
  } catch (error: any) {
    console.error('Error in AppContent:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading app: {error?.message || 'Unknown error'}</Text>
      </View>
    );
  }
}

function AppWithPaper() {
  console.log('AppWithPaper rendering...');
  try {
    const { paperTheme } = useTheme();
    console.log('Paper theme loaded:', paperTheme);

    return (
      <PaperProvider theme={paperTheme}>
        <BottomSheetModalProvider>
          <AppContent />
        </BottomSheetModalProvider>
      </PaperProvider>
    );
  } catch (error: any) {
    console.error('Error in AppWithPaper:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>
          Error in Paper Provider: {error?.message || 'Unknown error'}
        </Text>
      </View>
    );
  }
}

function App() {
  console.log('App starting...');
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ThemeProvider>
            <ToastProvider>
              <AppWithPaper />
            </ToastProvider>
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
