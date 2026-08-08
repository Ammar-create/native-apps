import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MotionPressable from './MotionPressable';
import styles from '../styles';

const TABS = [
  { key: 'deck', label: 'Deck', icon: 'sailing' },
  { key: 'settings', label: 'Settings', icon: 'settings' }
];

function NavItem({ tab, active, onPress }) {
  const isActive = active === tab.key;
  const activeAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(activeAnim, {
      toValue: isActive ? 1 : 0,
      stiffness: 280,
      damping: 22,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  const iconScale = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.18],
  });

  const translateY = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
  });

  return (
    <MotionPressable
      activeScale={0.94}
      style={styles.navItem}
      onPress={onPress}
    >
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: iconScale }, { translateY }] }}>
        <MaterialIcons
          name={tab.icon}
          size={22}
          color={isActive ? '#574b7e' : '#cac4d0'}
        />
        <Text style={[styles.navLabel, isActive ? styles.navLabelActive : styles.navLabelInactive]}>
          {tab.label}
        </Text>
      </Animated.View>
    </MotionPressable>
  );
}

export default function BottomNav({ active, onChange }) {
  const [containerWidth, setContainerWidth] = useState(0);
  const activeAnim = useRef(new Animated.Value(active === 'settings' ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(activeAnim, {
      toValue: active === 'settings' ? 1 : 0,
      stiffness: 260,
      damping: 24,
      useNativeDriver: true,
    }).start();
  }, [active]);

  const handleLayout = e => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) setContainerWidth(width - 32); // 16px padding on left and right
  };

  const halfWidth = containerWidth / 2;
  const translateX = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, halfWidth || 150],
  });

  return (
    <View style={styles.bottomNavContainer} onLayout={handleLayout}>
      <View style={styles.bottomNavTrack}>
        {containerWidth > 0 && (
          <Animated.View
            style={[
              styles.navActiveIndicator,
              {
                width: halfWidth,
                transform: [{ translateX }],
              },
            ]}
          />
        )}

        {TABS.map((tab) => (
          <NavItem
            key={tab.key}
            tab={tab}
            active={active}
            onPress={() => onChange(tab.key)}
          />
        ))}
      </View>
    </View>
  );
}
