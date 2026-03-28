import {Linking} from 'react-native';
import {CustomText} from '../common/components';
import {useTheme} from '../context/ThemeContext';

const renderTextWithLinks = (text: string) => {
  const words = text.split(/(https?:\/\/[^\s]+)/g);
  const {colors} = useTheme();
  return words.map((word, index) => {
    if (word.match(/https?:\/\/[^\s]+/)) {
      return (
        <CustomText
          variant="text-sm-medium"
          key={index}
          style={{
            color: colors.blue600,
            textDecorationLine: 'underline',
          }}
          onPress={() => Linking.openURL(word)}>
          {word}
        </CustomText>
      );
    }
    return (
      <CustomText
        variant="text-sm-normal"
        key={index}
        style={{color: colors.white}}>
        {word}
      </CustomText>
    );
  });
};

export default renderTextWithLinks;
