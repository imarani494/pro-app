import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import {Colors} from '../../styles';
import CustomText from './CustomText';

const phrases = [
  'Curating experience...',
  'Creating journey...',
  'Making the change...',
];

export function JourneyLoader() {
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.98)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Text cycling animation
    const textTimer = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setIndex(prev => (prev + 1) % phrases.length);
    }, 3000);

    // Breathing/pulse animation
    const pulseAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1250,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: 1250,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    // Rotation animation
    const rotateAnimation = () => {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    };

    pulseAnimation();
    rotateAnimation();

    return () => {
      clearInterval(textTimer);
    };
  }, [fadeAnim, scaleAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Background Ambience */}
      <View style={[styles.backgroundCircle1]} />
      <View style={[styles.backgroundCircle2]} />

      {/* SPINNER CONTAINER */}
      <View style={styles.spinnerContainer}>
        <Animated.View
          style={[
            styles.spinner,
            {
              transform: [{scale: scaleAnim}, {rotate: spin}],
            },
          ]}>
          {/* Journey Icon/Spinner */}
          <View style={styles.journeyIcon}>
            <View style={styles.centerDot} />
            <View style={[styles.outerRing]} />
            <View style={[styles.innerRing]} />
          </View>
        </Animated.View>
      </View>

      {/* TEXT ANIMATION */}
      <View style={styles.textContainer}>
        <Animated.View style={{opacity: fadeAnim}}>
          <CustomText
            variant="text-lg-medium"
            color="neutral600"
            style={styles.loadingText}>
            {phrases[index]}
          </CustomText>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightThemeColors.white,
    position: 'relative',
  },
  backgroundCircle1: {
    position: 'absolute',
    top: -48,
    right: -48,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: Colors.lightThemeColors.blue100,
    opacity: 0.3,
  },
  backgroundCircle2: {
    position: 'absolute',
    bottom: -48,
    left: -48,
    width: 288,
    height: 288,
    borderRadius: 144,
    backgroundColor: Colors.lightThemeColors.neutral100,
    opacity: 0.3,
  },
  spinnerContainer: {
    marginBottom: 8,
    height: 120,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyIcon: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lightThemeColors.blue600,
    position: 'absolute',
    zIndex: 3,
  },
  outerRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.lightThemeColors.blue200,
    borderTopColor: Colors.lightThemeColors.blue600,
    position: 'absolute',
    zIndex: 1,
  },
  innerRing: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.lightThemeColors.blue100,
    borderBottomColor: Colors.lightThemeColors.blue400,
    position: 'absolute',
    zIndex: 2,
  },
  textContainer: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    textAlign: 'center',
  },
});
