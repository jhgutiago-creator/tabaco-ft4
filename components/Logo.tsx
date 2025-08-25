import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface LogoProps {
  size?: number;
  showText?: boolean;
  animated?: boolean;
}

export default function Logo({ size = 120, showText = true, animated = true }: LogoProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      // Rotação contínua
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      );

      // Pulso suave
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );

      rotateAnimation.start();
      pulseAnimation.start();

      return () => {
        rotateAnimation.stop();
        pulseAnimation.stop();
      };
    }
  }, [animated, rotateAnim, pulseAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const logoSize = size;
  const fontSize = size * 0.4;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            width: logoSize,
            height: logoSize,
            borderRadius: logoSize / 2,
            transform: [
              { rotate: animated ? spin : '0deg' },
              { scale: animated ? pulseAnim : 1 },
            ],
          },
        ]}
      >
        {/* Círculo externo com gradiente */}
        <View style={[styles.outerCircle, { width: logoSize, height: logoSize, borderRadius: logoSize / 2 }]}>
          {/* Círculo interno */}
          <View style={[styles.innerCircle, { 
            width: logoSize * 0.8, 
            height: logoSize * 0.8, 
            borderRadius: (logoSize * 0.8) / 2 
          }]}>
            {/* Texto FT */}
            <Text style={[styles.logoText, { fontSize }]}>FT</Text>
          </View>
        </View>

        {/* Elementos decorativos */}
        <View style={[styles.decorativeElement, styles.element1, { 
          width: logoSize * 0.15, 
          height: logoSize * 0.15,
          borderRadius: (logoSize * 0.15) / 2,
          top: logoSize * 0.1,
          right: logoSize * 0.2,
        }]} />
        <View style={[styles.decorativeElement, styles.element2, { 
          width: logoSize * 0.1, 
          height: logoSize * 0.1,
          borderRadius: (logoSize * 0.1) / 2,
          bottom: logoSize * 0.15,
          left: logoSize * 0.15,
        }]} />
        <View style={[styles.decorativeElement, styles.element3, { 
          width: logoSize * 0.12, 
          height: logoSize * 0.12,
          borderRadius: (logoSize * 0.12) / 2,
          top: logoSize * 0.3,
          left: logoSize * 0.05,
        }]} />
      </Animated.View>

      {showText && (
        <View style={styles.textContainer}>
          <Text style={styles.projectText}>Projeto</Text>
          <Text style={styles.ftText}>FT</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  innerCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoText: {
    fontWeight: 'bold',
    color: '#22C55E',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  decorativeElement: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  element1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  element2: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  element3: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  textContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  projectText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  ftText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 2,
  },
});