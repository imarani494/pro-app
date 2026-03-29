import React, {ReactNode} from 'react';
import {View} from 'react-native';
import {Colors} from '../../styles';

export function AddOnCard({
  children,
  height = 25,
  marginTop = 12,
}: {
  children: React.ReactNode;
  height?: number;
  marginTop?: number;
}) {
  return (
    <View
      style={{
        // height: 95,
        width: '100%',
        borderColor: Colors.lightThemeColors.neutral300,
        borderWidth: 1,
        borderRadius: 12,
      }}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            backgroundColor: 'black',
            width: 2,
            height: height,
            marginTop: marginTop,
            borderRadius: 5,
          }}></View>
        <View>{children}</View>
      </View>
    </View>
  );
}
