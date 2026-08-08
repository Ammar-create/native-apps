import React from 'react';
import { Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MotionPressable from './MotionPressable';
import CharacterIcon from './CharacterIcon';
import styles from '../styles';

export default function TopBar({ identity, onNew, onSessions, onSettings }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <View style={styles.medallion}>
          <CharacterIcon characterKey={identity.key} size={20} color="#574b7e" />
        </View>
        <View style={styles.topBarTitles}>
          <Text style={styles.topBarTitle} numberOfLines={1}>SUNNY DECK</Text>
          <Text style={styles.topBarSubtitle} numberOfLines={1}>Playing as {identity.name.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.topBarActions}>
        <MotionPressable style={styles.topBarBtn} activeScale={0.92} onPress={onNew}>
          <MaterialIcons name="add" size={24} color="#cac4d0" />
        </MotionPressable>
        <MotionPressable style={styles.topBarBtn} activeScale={0.92} onPress={onSessions}>
          <MaterialIcons name="forum" size={22} color="#cac4d0" />
        </MotionPressable>
        <MotionPressable style={styles.topBarBtn} activeScale={0.92} onPress={onSettings}>
          <MaterialIcons name="tune" size={22} color="#cac4d0" />
        </MotionPressable>
      </View>
    </View>
  );
}
