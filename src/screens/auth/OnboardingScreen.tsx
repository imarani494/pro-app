import React, {useRef, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  ONBOARDING_SCREEN_1,
  ONBOARDING_SCREEN_2,
  ONBOARDING_SCREEN_3,
} from '../../utils/assetUtil';
import {useTheme} from '../../context/ThemeContext';
import {CustomText} from '../../common/components';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigators/types';

export interface Slide {
  id: number;
  title: string;
  title2: string;
  subtitle: string;
  image: any;
}

export const slides: Slide[] = [
  {
    id: 1,
    title: 'From flights to stays – it’s',
    title2: ' all connected.',
    subtitle: 'The easiest way to manage it all',
    image: ONBOARDING_SCREEN_1,
  },
  {
    id: 2,
    title: 'Curated Itineraries –',
    title2: ' Instantly.',
    subtitle:
      'Smart recommendations for flights, stays, and activities – in seconds.',
    image: ONBOARDING_SCREEN_2,
  },
  {
    id: 3,
    title: 'Book Faster.',
    title2: ' Share Seamlessly.',
    subtitle: 'Simplify how you share, and how clients say yes',
    image: ONBOARDING_SCREEN_3,
  },
];

const {width, height} = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const {colors} = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    flatListRef.current?.scrollToIndex({
      index: slides.length - 1,
      animated: true,
    });
  };

  const renderItem = ({item}: {item: Slide}) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.overlay}>
        <CustomText
          variant="text-3xl-medium"
          color="neutral50"
          style={styles.title}>
          {item.title}
        </CustomText>
        <CustomText
          variant="text-3xl-medium"
          color="neutral50"
          style={[styles.title]}>
          {item.title2}
        </CustomText>
        <CustomText
          variant="text-sm-normal"
          color="neutral200"
          style={styles.subtitle}>
          {item.subtitle}
        </CustomText>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.black}]}>
      {/* FlatList Carousel */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        onMomentumScrollEnd={ev => {
          const index = Math.round(ev.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
      />

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: opacity,
                  backgroundColor: colors.white,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Bottom Buttons */}
      <View style={styles.footer}>
        {activeIndex < slides.length - 1 ? (
          <>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: colors.neutral50}]}
              onPress={handleNext}>
              <CustomText variant="text-base-semibold" color="neutral900">
                Next
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkip}>
              <CustomText variant="text-base-semibold" color="neutral50">
                Skip for now
              </CustomText>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: colors.neutral50, marginBottom: 45},
              ]}
              onPress={() => navigation.replace('Screen2')}>
              <CustomText variant="text-base-semibold" color="neutral900">
                Get Started
              </CustomText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
    justifyContent: 'flex-end',
  },
  image: {
    width,
    height: '90%',
    position: 'absolute',
    top: 0,
  },
  overlay: {
    paddingHorizontal: 28,
    paddingBottom: 160,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    margin: 20,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 145,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
    marginBottom: 2,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    width: width * 0.85,
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
