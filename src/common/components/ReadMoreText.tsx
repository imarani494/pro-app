import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CustomText from './CustomText';
import { useBottomSheet } from '../hooks/useBottomSheet';
import CustomBottomSheet from './CustomBottomSheet';

interface ReadMoreTextProps {
  text: string;
  maxLength?: number;
  variant?: any;
  color?: any;
  readMoreColor?: any;
  readMoreVariant?: any;
  underline?: boolean;
  onReadMorePress?: () => void;
}

const ReadMoreText: React.FC<ReadMoreTextProps> = ({
  text,
  maxLength = 100,
  variant = 'text-sm-normal',
  color = 'neutral500',
  readMoreColor = 'neutral900',
  readMoreVariant = 'text-lg-semibold',
  underline = true,
  onReadMorePress,
}) => {
  const {bottomSheetRef, closeBottomSheet, openBottomSheet} = useBottomSheet();
  
  if (!text) return null;

  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate 
    ? `${text.substring(0, maxLength)}...` 
    : text;


    
 const handleToggle = () => {
  console.log('🔥 READ MORE CLICKED!');
  console.log('🔥 onReadMorePress:', onReadMorePress);
  console.log('🔥 bottomSheetRef.current:', bottomSheetRef.current);
  
  if (onReadMorePress) {
    console.log('✅ Using custom handler');
    onReadMorePress();
  } else {
    console.log('✅ Using bottom sheet');
    openBottomSheet();
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <CustomText variant={variant} color={color}>
          {displayText}
        </CustomText>
        
        {shouldTruncate && (
          <TouchableOpacity 
            onPress={handleToggle}
            activeOpacity={0.7}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <CustomText 
              variant={readMoreVariant} 
              color={readMoreColor}
              style={underline ? styles.underlineText : undefined}>
            Read More
            </CustomText>
          </TouchableOpacity>
        )}
      </View>

      {!onReadMorePress && (
        <CustomBottomSheet 
          ref={bottomSheetRef} 
          onClose={closeBottomSheet}
          snapPoints={['60%', '90%']}>
          <ScrollView style={styles.bottomSheetContent}>
            <CustomText variant={variant} color={color}>
              {text}
            </CustomText>
          </ScrollView>
        </CustomBottomSheet>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  bottomSheetContent: {
    padding: 16,
    // gap:4,
  },
});

export default ReadMoreText;
