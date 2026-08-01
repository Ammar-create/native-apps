import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles';

export default function TopBar({ identity, onNew, onSessions, onSettings }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <View style={styles.medallion}>
          <Text style={styles.medallionText}>{identity.avatar}</Text>
        </View>
        <View style={styles.topBarTitles}>
          <Text style={styles.topBarTitle} numberOfLines={1}>SUNNY DECK</Text>
          <Text style={styles.topBarSubtitle} numberOfLines={1}>Playing as {identity.name.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.topBarActions}>
        <Pressable style={({ pressed }) => [styles.topBarBtn, pressed && styles.topBarBtnPressed]} onPress={onNew}>
          <MaterialIcons name="add" size={24} color="#cac4d0" />
        </Pressable>
        <Pressable style={({ pressed }) => [styles.topBarBtn, pressed && styles.topBarBtnPressed]} onPress={onSessions}>
          <MaterialIcons name="forum" size={22} color="#cac4d0" />
        </Pressable>
        <Pressable style={({ pressed }) => [styles.topBarBtn, pressed && styles.topBarBtnPressed]} onPress={onSettings}>
          <MaterialIcons name="tune" size={22} color="#cac4d0" />
        </Pressable>
      </View>
    </View>
  );
}
