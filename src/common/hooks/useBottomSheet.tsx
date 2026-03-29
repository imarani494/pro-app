import {useRef, useCallback} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

export const useBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openBottomSheet = useCallback((index: number = 0) => {
    bottomSheetRef.current?.present();
  }, []);

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const snapToIndex = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  return {
    bottomSheetRef,
    openBottomSheet,
    closeBottomSheet,
    snapToIndex,
  };
};
