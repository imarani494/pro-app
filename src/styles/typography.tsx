import {FlexStyle} from 'react-native';

type FlexCustom =
  | 'center'
  | 'row'
  | 'rowItemCenter'
  | 'rowJustifyBetween'
  | 'rowJustifyBetweenItemCenter';

export const flex: Record<FlexCustom, FlexStyle> = {
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  rowItemCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowJustifyBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowJustifyBetweenItemCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};
