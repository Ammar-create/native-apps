import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

export default function MotionPressable({
  children,
  onPress,
  onLongPress,
  delayLongPress,
  disabled,
  style,
  activeScale = 0.94,
  activeOpacity = 0.88,
  ...props
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(scale, {
        toValue: activeScale,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: activeOpacity,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        stiffness: 400,
        damping: 18,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      {state => {
        const computedStyle = typeof style === 'function' ? style(state) : style;
        return (
          <Animated.View style={[computedStyle, { transform: [{ scale }], opacity }]}>
            {typeof children === 'function' ? children(state) : children}
          </Animated.View>
        );
      }}
    </Pressable>
  );
}
