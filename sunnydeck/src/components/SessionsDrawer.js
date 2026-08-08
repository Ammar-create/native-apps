import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MotionPressable from './MotionPressable';
import { useFeedback } from './Feedback';
import { formatRelativeTime, sessionPreview } from '../utils/sessions';
import styles from '../styles';

const CARD_ICONS = ['anchor', 'explore', 'restaurant', 'sailing', 'sunny', 'menu-book', 'trending-flat', 'group'];

function pickIcon(title) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = ((hash << 5) - hash + title.charCodeAt(i)) >>> 0;
  return CARD_ICONS[hash % CARD_ICONS.length];
}

export default function SessionsDrawer({ visible, sessions, activeSessionId, onClose, onNew, onSwitch, onDelete }) {
  const slide = useRef(new Animated.Value(-400)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const { confirm } = useFeedback();

  useEffect(() => {
    if (visible) {
      slide.setValue(-400); fade.setValue(0);
      Animated.parallel([
        Animated.spring(slide, { toValue: 0, friction: 8, tension: 240, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true })
      ]).start();
    }
  }, [visible]);

  const confirmDelete = async session => {
    const ok = await confirm({
      title: 'Delete Session',
      message: `Delete “${session.title}”? This cannot be undone.`,
      confirmLabel: 'Delete'
    });
    if (ok) onDelete(session.id);
  };

  const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <Animated.View style={[styles.drawerScrim, { opacity: fade }]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[styles.drawerPanel, { transform: [{ translateX: slide }] }]}>
          <View style={styles.drawerHeader}>
            <View style={styles.drawerHeaderLeft}>
              <View style={styles.drawerMedallion}><Text style={styles.drawerMedallionText}>📜</Text></View>
              <Text style={styles.drawerTitle}>Sessions</Text>
            </View>
            <MotionPressable style={styles.drawerClose} activeScale={0.9} onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#cac4d0" />
            </MotionPressable>
          </View>
          <ScrollView contentContainerStyle={styles.drawerContent} showsVerticalScrollIndicator={false}>
            <MotionPressable style={styles.sessionNewBtn} activeScale={0.96} onPress={onNew}>
              <MaterialIcons name="add" size={22} color="#003732" />
              <Text style={styles.sessionNewText}>Start New Session</Text>
            </MotionPressable>
            <Text style={styles.longPressHint}>Long-press to delete</Text>
            {sorted.map(session => {
              const active = session.id === activeSessionId;
              const count = Math.max(0, (session.messages?.length || 1) - 1);
              return (
                <MotionPressable
                  key={session.id}
                  activeScale={0.97}
                  style={[styles.sessionCard, active && styles.sessionCardActive]}
                  onPress={() => onSwitch(session.id)}
                  onLongPress={() => confirmDelete(session)}
                  delayLongPress={450}
                >
                  {active && (
                    <View style={styles.activeBadge}>
                      <View style={styles.activeBadgeDot} />
                      <Text style={styles.activeBadgeText}>Active</Text>
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.sessionCardIconMedallion}>
                      <MaterialIcons name={pickIcon(session.title)} size={18} color="#98d2c8" />
                    </View>
                    <Text style={styles.sessionCardTitle} numberOfLines={1}>{session.title}</Text>
                  </View>
                  <Text style={styles.sessionMeta}>{active ? 'LIVE' : `${count} MESSAGE${count === 1 ? '' : 'S'}`} • {formatRelativeTime(session.updatedAt)}</Text>
                  <Text style={styles.sessionPreview} numberOfLines={2}>{sessionPreview(session)}</Text>
                </MotionPressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
