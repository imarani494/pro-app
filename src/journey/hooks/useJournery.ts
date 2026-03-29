import {RootState} from '../../store';
import {useSelector} from 'react-redux';

export function useJournery() {
  return useSelector((state: RootState) => state.journey);
}