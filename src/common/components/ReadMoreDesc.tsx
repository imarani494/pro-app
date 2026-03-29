import {TouchableOpacity, View} from 'react-native';
import CustomText from './CustomText';

export function ReadMoreDescText({
  description = '', 
  maxLines = 2,
  onReadMorePress, 
}: {
  description?: string; 
  maxLines?: number;
  onReadMorePress?: () => void; 
}) {
  return (
    <View style={{borderWidth: 1, borderColor: 'transparent'}}>
      <CustomText
        color="neutral500"
        variant="text-xs-normal"
        numberOfLines={maxLines}>
        {description}
      </CustomText>
      {description.length > 120 && (
        <View>
          <TouchableOpacity onPress={onReadMorePress}>
            <CustomText variant="text-xs-semibold" color="neutral900">
              Read More
            </CustomText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}