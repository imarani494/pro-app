import {useCallback} from 'react';
import {useJournery} from './useJournery';
import User from '../../data/User';
import {updateJourney} from '../redux/journeySlice';
import {useAppDispatch} from '../../store';

export function useUpdateJourney() {
  const dispatch = useAppDispatch();
  const journeyData = useJournery();

  return useCallback(
    async (
      items: any[] = [],
      request: any = null,
      options: {jdid?: string; edit?: boolean} = {},
    ) => {
      const _request = request ? request : {items};
      const authToken = await User.getAuthToken();
      const params: any = {
        jid: journeyData.id,
        jdid: journeyData.jdid || '',
        _auth: authToken,
        userId: User.getUserId(),
        request: JSON.stringify(_request),
        save: journeyData?.save,
      };

      // Add jdid and edit if provided
      if (options.jdid) {
        params.jdid = options.jdid;
      }
      if (options.edit !== undefined) {
        params.edit = options.edit;
      }

      return await dispatch(updateJourney(params) as any);
    },
    [dispatch, journeyData],
  );
}
