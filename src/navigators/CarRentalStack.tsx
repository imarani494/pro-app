import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {JourneyStackParamList, CarReantalStackParamList} from './types';
import { CarRentalDetailsScreen, CarRentalListingScreen, CarRentalSearchScreen } from '../car';

const Stack = createNativeStackNavigator<CarReantalStackParamList>();

type Props = NativeStackScreenProps<JourneyStackParamList, 'CarReantalStack'>;

function CarRentalStack({route}: Props) {
  const initialRouteName = route.params?.initialRouteName || 'CarRentalSearch';
  const actionParams = route.params?.action
    ? {
        action: route.params.action,
      }
    : {};

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{title: '', headerShown: false}}>
          <Stack.Screen name="CarRentalSearch">
            {(props) => <CarRentalSearchScreen {...props} route={{...props.route, params: actionParams}} />}
          </Stack.Screen>
          <Stack.Screen name="CarRentalDetails" component={CarRentalDetailsScreen} />
          <Stack.Screen name="CarRentalListing" component={CarRentalListingScreen} />
          

    </Stack.Navigator>
  );
}

export default CarRentalStack;
