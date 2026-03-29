import {Check, MapPin, Star} from 'lucide-react-native';
import React from 'react';

import {Dimensions, Image, View} from 'react-native';
import {Colors} from '../../../styles';
import {CustomText} from '../../../common/components';
import {LocationSummary} from '../../../common/components/LocationSummary';
import DashedLine from '../../../common/components/DashedLine';
import {RsltA} from '../../actions/hotelSearhListings';

const {width} = Dimensions.get('window');

const HotelCard = React.memo(
  ({data, commision}: {data: RsltA; commision: boolean}) => {
    return (
      <View
        style={{
          width: width * 0.9,
          alignSelf: 'center',
          borderRadius: 16,
        }}>
        <Image
          source={{
            uri: data?.img,
          }}
          style={{
            height: 128,
            width: '100%',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />
        <View
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 16,
          }}>
          {/* ratings */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              {Array.from({length: data?.st}).map((_, idx) => (
                <Star
                  key={idx}
                  size={16}
                  fill={Colors.lightThemeColors.neutral900}
                />
              ))}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                columnGap: 8,
              }}>
              <CustomText variant="text-xs-normal" color="neutral500">
                {data?.urtO?.numRt} reviews
              </CustomText>
              <CustomText variant="text-xs-semibold" color="neutral900">
                {data?.urtO?.rtTxt}
              </CustomText>
              <View
                style={{
                  backgroundColor: Colors.lightThemeColors.neutral900,
                  alignSelf: 'center',
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}>
                <CustomText variant="text-sm-semibold" color="white">
                  {data?.urtO?.rt}
                </CustomText>
              </View>
            </View>
          </View>
          <View style={{alignSelf: 'flex-start', rowGap: 6}}>
            <CustomText variant="text-base-semibold" color="neutral900">
              {data?.nm}
            </CustomText>

            <LocationSummary location={data?.loc} />
          </View>
          <DashedLine
            dashColor={Colors.lightThemeColors.neutral300}
            style={{marginTop: 10}}
          />

          <View style={{flexDirection: 'row', marginTop: 8}}>
            <View
              style={{
                flex: 1,
                padding: 8,
                minWidth: 0,
                rowGap: 14,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 8,
                  alignItems: 'flex-start',
                }}>
                <Check size={16} />

                <CustomText
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  variant="text-xs-normal"
                  color="neutral700"
                  style={{flexShrink: 1}} // optional safety
                >
                  {data?.rnm}
                </CustomText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 8,
                  alignItems: 'flex-start',
                }}>
                <Check size={16} />

                <CustomText
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  variant="text-xs-normal"
                  color="neutral700"
                  style={{flexShrink: 1}} // optional safety
                >
                  {data?.mpN}
                </CustomText>
              </View>
              {/* {data.hotelInfo.map((item, idx) => (
              
            ))} */}
            </View>

            <View
              style={{
                width: width * 0.28,
                padding: 8,
              }}>
              <CustomText
                style={{alignSelf: 'flex-end'}}
                variant="text-xl-bold"
                color="neutral900">
                {data?.prD}
              </CustomText>

              {/* Commison */}
              {commision ? (
                <View
                  style={{
                    backgroundColor: Colors.lightThemeColors.amber100,
                    alignSelf: 'flex-end',
                    paddingVertical: 4,
                    paddingHorizontal: 6,
                    borderRadius: 10,
                  }}>
                  <CustomText variant="text-sm-medium" color="amber800">
                    {/* {data.commision} */}
                  </CustomText>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  },
  (prev, next) =>
    prev.commision === next.commision && prev.data.id === next.data.id,
);

export default HotelCard;
