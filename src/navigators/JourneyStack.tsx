import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {JourneyStackParamList} from './types';
import {StatusBar} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import CustomHeader from '../common/components/CustomHeader';
import JourneyCreationScreen from '../journey/create';
import JourneyCreateEntry from '../journey/create/JourneyCreateEntry';
import {JourneyDetails} from '../journey/details';
import SuggestItinerary from '../journey/create/SuggestItinerary';
import {HotelImages} from '../hotels/screens/components/HotelPhotosListing';
import HotelDetailScreen from '../hotels/screens/HotelDetailScreen';
import HotelListingScreen from '../hotels/screens/HotelListingScreen';
import RoomListingScreen from '../hotels/screens/rooms/RoomListingScreen';
import SelectedRoomListing from '../hotels/screens/rooms/SelectedRoomListing';
import HotelSupplementsScreen from '../hotels/screens/HotelSupplementsScreen';
import CarReantalStack from './CarRentalStack';
import {ContentCardScreen} from '../roadtransfer';

const Stack = createNativeStackNavigator<JourneyStackParamList>();

function JourneyStack() {
  const {colors} = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="JourneyCreateEntry"
      // screenOptions={{title: '', headerShown: true}}>
      screenOptions={{
        header: ({navigation, route, options, back}: any) => {
          // if (
          //   [
          //     "GroupChannelSettings",
          //     "MessageSearchScreen",
          //     "GroupChannelMembers",
          //     "FileViewerScreen",
          //     "GroupChannelNotifications",
          //     "SettingsScreen",
          //   ].includes(route.name)
          // ) {
          //   return <View></View>;
          // }
          return (
            <CustomHeader
              back={back}
              navigation={navigation}
              route={route}
              options={options}
            />
          );
        },
      }}>
      <Stack.Screen
        name="JourneyCreateEntry"
        component={JourneyCreateEntry}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="JourneyCreation"
        component={JourneyCreationScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="JourneyDetails"
        component={JourneyDetails}
        options={{
          headerShown: false,
          // title: 'Journey Details',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="SuggestItinerary"
        component={SuggestItinerary}
        options={{
          headerShown: true,
          title: 'Suggest Itinerary',
        }}
      />
      <Stack.Screen
        name="HotelDetail"
        component={HotelDetailScreen}
        options={{
          headerShown: false,
          title: '',
        }}
      />
      <Stack.Screen
        name="HotelImages"
        component={HotelImages}
        options={{
          headerShown: false,
          title: '',
        }}
      />
      <Stack.Screen
        name="HotelListing"
        component={HotelListingScreen}
        options={{
          headerShown: false,
          title: '',
        }}
      />
      <Stack.Screen
        name="SelectedRoomListing"
        component={SelectedRoomListing}
        options={{
          headerShown: false,
          title: '',
        }}
      />
      <Stack.Screen
        name="RoomListing"
        component={RoomListingScreen}
        options={{
          headerShown: false,
          title: '',
        }}
      />
      <Stack.Screen
        name="HotelSupplements"
        component={HotelSupplementsScreen}
        options={{
          headerShown: false,
          title: '',
        }}
      />
      <Stack.Screen
        name="CarReantalStack"
        component={CarReantalStack}
        options={{
          headerShown: false,
          title: '',
        }}
      />

      <Stack.Screen
        name="ContentCard"
        component={ContentCardScreen}
        options={{
          headerShown: false,
          title: '',
        }}
      />
    </Stack.Navigator>
  );
}

export default JourneyStack;
