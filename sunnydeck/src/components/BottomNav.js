import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles';

const TABS = [
  { key: 'deck', label: 'Deck', icon: 'sailing' },
  { key: 'settings', label: 'Settings', icon: 'settings' }
];

export default function BottomNav({ active, onChange }) {
  return (
    <View style={styles.bottomNav}>
      {TABS.map(tab => {
        const isActive = active === tab.key;
        return (
          <Pressable key={tab.key} style={({ pressed }) => [styles.navItem, isActive && styles.navItemActive, pressed && { opacity: 0.8 }]} onPress={() => onChange(tab.key)}>
            <MaterialIcons name={tab.icon} size={22} color={isActive ? '#574b7e' : '#cac4d0'} style={isActive && styles.navIconActive} />
            <Text style={[styles.navLabel, isActive ? styles.navLabelActive : styles.navLabelInactive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
