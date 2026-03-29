import {RootState, useAppSelector} from '../../store';

export function useContentCard() {
  return useAppSelector((state: RootState) => state.contentCard);
}
