import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {CustomText} from '../../common/components';
import {useTheme} from '../../context/ThemeContext';
import {shadows} from '../../styles/shadows';
import {ILLUST_IMG} from '../../utils/assetUtil';

interface AddPackageModalProps {
  mainImage: ImageSourcePropType;
  badgeImage?: ImageSourcePropType;
  title: string;
  description: string;
  buttonText: string;
  onButtonPress?: () => void;
  badgePosition?: {left: number; top: number};
  status?: 'success' | 'error' | 'loading';
  isLoading?: boolean;
  navigateToScreen?: string; // Add navigation screen option
  closeModal?: () => void; // Add close modal function
}

const AddPackageModal: React.FC<AddPackageModalProps> = ({
  mainImage,
  badgeImage,
  title,
  description,
  buttonText,
  onButtonPress,
  badgePosition = {left: 220, top: 88},
  status = 'success',
  isLoading = false,
  navigateToScreen,
  closeModal,
}) => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    }
    
    // Navigate to specified screen if provided
    if (navigateToScreen && status === 'success') {
      navigation.navigate(navigateToScreen as never);
    }
    
    // Close modal if provided
    if (closeModal) {
      closeModal();
    }
  };

  const getButtonColor = () => {
    if (isLoading || status === 'loading') return colors.neutral400;
    if (status === 'success') return colors.neutral900;
    return colors.red600;
  };

  const getTitleColor = () => {
    if (isLoading || status === 'loading') return 'neutral600';
    if (status === 'success') return 'neutral900';
    return 'red600';
  };

  const getImageSource = () => {
    if (status === 'error') return ILLUST_IMG;
    return mainImage;
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.white}]}>
      <View style={styles.contentContainer}>
        <View style={[styles.imageContainer, {backgroundColor: colors.white}]}>
          <Image source={getImageSource()} style={styles.mainImage} />
        </View>

        <View style={styles.titleContainer}>
          <CustomText
            variant="text-2xl-semibold"
            color={getTitleColor()}
            style={styles.titleText}>
            {title}
          </CustomText>
        </View>

        <View style={styles.descriptionContainer}>
          <CustomText
            variant="text-sm-normal"
            color="neutral500"
            style={styles.descriptionText}>
            {description}
          </CustomText>
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[
            styles.button,
            shadows['shadow-2xs'],
            {backgroundColor: getButtonColor()},
          ]}
          onPress={handleButtonPress}
          activeOpacity={0.85}
          disabled={isLoading || status === 'loading'}>
          <View style={styles.buttonContent}>
            {(isLoading || status === 'loading') && (
              <ActivityIndicator
                size="small"
                color={colors.white}
                style={styles.loadingIndicator}
              />
            )}
            <CustomText variant="text-sm-medium" color="neutral50">
              {buttonText}
            </CustomText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
  },
  contentContainer: {
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainImage: {
    height: 117,
    resizeMode: 'contain',
  },
  badgeContainer: {
    position: 'absolute',
    width: 39,
    height: 38,
    zIndex: 2,
  },
  badge: {
    width: 39,
    height: 38,
    resizeMode: 'contain',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleText: {
    textAlign: 'center',
  },
  descriptionContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  descriptionText: {
    textAlign: 'center',
  },
  buttonWrapper: {
    paddingHorizontal: 0,
    paddingBottom: 0,
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    marginRight: 8,
  },
});

export default AddPackageModal;