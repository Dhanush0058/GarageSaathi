// Automotive Animated Loader for Z9 Automotive
// Features spinning gauge, pulsing gold glow aura, and dynamic status updates.

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface LoadingInspectionAnimationProps {
  message?: string;
  subMessage?: string;
  dark?: boolean;
}

export const LoadingInspectionAnimation: React.FC<LoadingInspectionAnimationProps> = ({
  message = 'Loading Inspection...',
  subMessage = 'Checking 336 inspection parameters & evidence',
  dark = true,
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous smooth rotation for automotive gauge
    const spinLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Continuous breathing pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    spinLoop.start();
    pulseLoop.start();

    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, dark && styles.darkContainer]}>
      {/* Outer Pulsing Glow Aura */}
      <Animated.View
        style={[
          styles.glowCircle,
          {
            transform: [{ scale: pulseAnim }],
            opacity: pulseAnim.interpolate({
              inputRange: [1, 1.15],
              outputRange: [0.15, 0.3],
            }),
          },
        ]}
      />

      {/* Rotating Automotive Ring Gauge */}
      <View style={styles.spinnerCenter}>
        <Animated.View
          style={[
            styles.spinRing,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <View style={styles.spinDot} />
        </Animated.View>

        {/* Speedometer / Gauge Icon in Center */}
        <View style={styles.centerIconBox}>
          <Ionicons name="speedometer" size={28} color="#FFB800" />
        </View>
      </View>

      {/* Dynamic Text Messages */}
      <Text style={[styles.titleText, dark && styles.textWhite]}>{message}</Text>
      {subMessage ? (
        <Text style={[styles.subText, dark && styles.textGold]}>{subMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  darkContainer: {
    backgroundColor: '#080C14',
  },
  glowCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFB800',
  },
  spinnerCenter: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  spinRing: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: 'rgba(255, 184, 0, 0.2)',
    borderTopColor: '#FFB800',
    borderRightColor: '#FFB800',
  },
  spinDot: {
    position: 'absolute',
    top: 4,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFB800',
    shadowColor: '#FFB800',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  centerIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1E293B',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 6,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  subText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  textGold: {
    color: '#FFB800',
  },
});
