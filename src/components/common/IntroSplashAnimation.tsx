// Cinematic Netflix-Style Intro Animation for Z9 Automotive
// Features dramatic logo zoom-in, glowing golden ribbon expansion, and smooth cross-fade into the application.

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

interface IntroSplashAnimationProps {
  onFinish: () => void;
}

export const IntroSplashAnimation: React.FC<IntroSplashAnimationProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const ribbonWidthAnim = useRef(new Animated.Value(0)).current;
  const ribbonOpacityAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const exitAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sequence of cinematic animations
    Animated.sequence([
      // 1. Logo fades in while zooming from 0.8 to 1.05
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.05,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      // 2. Golden ribbon beam flashes and expands horizontally (like Netflix red ribbon)
      Animated.parallel([
        Animated.timing(ribbonOpacityAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: false,
        }),
        Animated.timing(ribbonWidthAnim, {
          toValue: Math.min(width * 0.75, 320),
          duration: 550,
          useNativeDriver: false,
        }),
        Animated.timing(taglineAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),

      // 3. Brief hold for dramatic impact
      Animated.delay(400),

      // 4. Smooth exit cross-fade into app
      Animated.parallel([
        Animated.timing(exitAnim, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onFinish}
      style={[styles.container, { width, height }]}
    >
      <StatusBar style="light" />

      {/* Background glow circle */}
      <View style={styles.glowAura} />

      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: Animated.multiply(fadeAnim, exitAnim),
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Official Z9 Logo */}
        <Image
          source={require('../../../assets/images/logo-dark.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        {/* Cinematic Golden Light Ribbon Beam */}
        <Animated.View
          style={[
            styles.goldRibbon,
            {
              width: ribbonWidthAnim,
              opacity: ribbonOpacityAnim,
            },
          ]}
        />

        {/* Subtitle / Platform Tag */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineAnim,
              transform: [
                {
                  translateY: taglineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.taglineText}>VEHICLE INSPECTION PLATFORM</Text>
          <Text style={styles.subTaglineText}>PRECISION AUTOMOTIVE QUALITY</Text>
        </Animated.View>
      </Animated.View>

      <Text style={styles.tapToSkip}>Tap anywhere to skip</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  glowAura: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 184, 0, 0.08)',
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: Math.min(width * 0.78, 300),
    height: 80,
    marginBottom: 16,
  },
  goldRibbon: {
    height: 3,
    backgroundColor: '#FFB800',
    borderRadius: 1.5,
    marginBottom: 16,
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  taglineText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  subTaglineText: {
    color: '#FFB800',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  tapToSkip: {
    position: 'absolute',
    bottom: 30,
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
