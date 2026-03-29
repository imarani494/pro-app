import {useSelector} from 'react-redux';
import {RootState} from '../../../store';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useJourneyCreation() {
  return useSelector((state: RootState) => state.customTrip);
}
