import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles';

export default function Header({ identity, onNew, onSessions, onCrew, onSettings }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>SUNNY DECK // RETRO</Text>
          <Text style={styles.headerSubtitle}>THOUSAND SUNNY REALM</Text>
          <Text style={styles.playingAs}>PLAYING AS: <Text style={styles.playingAsName}>{identity.avatar} {identity.name.toUpperCase()}</Text></Text>
        </View>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity style={[styles.headerBtn, styles.headerBtnPrimary]} onPress={onNew}>
          <Text style={[styles.headerBtnText, styles.headerBtnTextPrimary]}>+ NEW</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn} onPress={onSessions}><Text style={styles.headerBtnText}>SESSIONS</Text></TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn} onPress={onCrew}><Text style={styles.headerBtnText}>CREW</Text></TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn} onPress={onSettings}><Text style={styles.headerBtnText}>SETTINGS</Text></TouchableOpacity>
      </View>
    </View>
  );
}
