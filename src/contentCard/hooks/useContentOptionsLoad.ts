import {useAppDispatch} from '../../store';
import {useJournery} from '../../journey/hooks/useJournery';
import {contentOptionsLoad} from '../redux/contentCardSlice';

export function useContentOptionsLoad() {
  const dispatch = useAppDispatch();
  const journeyData = useJournery();

  return (request: any) => {
    if (!journeyData?.id) {
      return;
    }

    const payload = {
      jid: journeyData.id,
      query: JSON.stringify(request),
      jdid: journeyData.jdid || '',
      edit: 'true',
    };

    return dispatch(contentOptionsLoad(payload));
  };
}
