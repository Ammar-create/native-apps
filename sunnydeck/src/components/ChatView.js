import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MotionPressable from './MotionPressable';
import CharacterIcon from './CharacterIcon';
import styles from '../styles';

function ShoutBadge() {
  return <Text style={styles.shoutBadge}>SHOUT</Text>;
}

function TargetBadge({ name }) {
  return (
    <View style={styles.targetBadge}>
      <MaterialIcons name="trending-flat" size={11} color="#98d2c8" />
      <Text style={styles.targetBadgeText}>@{name.toUpperCase()}</Text>
    </View>
  );
}

function Message({ item }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });

  if (item.kind === 'system') {
    return (
      <Animated.View style={[styles.systemBanner, { opacity: anim, transform: [{ translateY }] }]}>
        <Text style={styles.systemText}>{item.text}</Text>
      </Animated.View>
    );
  }
  const isPlayer = !!item.isPlayer;
  return (
    <Animated.View style={[styles.msgRow, isPlayer ? styles.playerRow : styles.crewRow, { opacity: anim, transform: [{ translateY }] }]}>
      <View style={[styles.msgHeader, isPlayer ? styles.msgHeaderRight : styles.msgHeaderLeft]}>
        {!isPlayer && <CharacterIcon characterKey={item.characterKey} size={15} style={{ marginRight: 6 }} />}
        <Text style={isPlayer ? styles.speakerNamePlayer : styles.speakerName}>{item.speaker}</Text>
        {item.role && <Text style={isPlayer ? styles.roleTextPlayer : styles.roleText}>• {item.role}</Text>}
        {item.shout && <ShoutBadge />}
        {item.target && <TargetBadge name={item.target} />}
      </View>
      <View style={[styles.bubble, isPlayer ? styles.playerBubble : styles.crewBubble]}>
        <Text style={isPlayer ? styles.msgTextPlayer : styles.msgText}>{item.text}</Text>
      </View>
      <Text style={styles.timestamp}>{new Date(item.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
    </Animated.View>
  );
}

function TargetChip({ active, characterKey, label, isGroup, onPress }) {
  const checkAnim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(checkAnim, {
      toValue: active ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [active]);

  const checkWidth = checkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });
  const checkScale = checkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <MotionPressable
      activeScale={0.96}
      style={[styles.targetChip, active && styles.targetChipActive]}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.targetCheckSlot,
          { width: checkWidth, opacity: checkAnim, transform: [{ scale: checkScale }] },
        ]}
      >
        <MaterialIcons name={isGroup ? 'group' : 'check'} size={15} color="#8ac3ba" />
      </Animated.View>
      {!isGroup ? <CharacterIcon characterKey={characterKey} size={16} color={active ? '#574b7e' : undefined} /> : null}
      <Text style={[styles.targetChipText, active && styles.targetChipTextActive]}>{label}</Text>
    </MotionPressable>
  );
}

export function TargetBar({ characters, target, onSelect }) {
  return (
    <View style={styles.targetBar}>
      <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.targetRail}>
        <TargetChip
          active={!target}
          label="All Crew"
          isGroup
          onPress={() => onSelect(null)}
        />
        {characters.map(character => {
          const active = target?.key === character.key;
          return (
            <TargetChip
              key={character.key}
              active={active}
              characterKey={character.key}
              label={character.shortName}
              onPress={() => onSelect(active ? null : character)}
            />
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

function TypingDots() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  useEffect(() => {
    const animations = dots.map((dot, index) => Animated.loop(
      Animated.sequence([
        Animated.delay(index * 140),
        Animated.timing(dot, { toValue: -4, duration: 220, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.delay(280)
      ])
    ));
    animations.forEach(animation => animation.start());
    return () => animations.forEach(animation => animation.stop());
  }, []);
  return (
    <View style={styles.typingDots}>
      {dots.map((dot, index) => <Animated.View key={index} style={[styles.typingDot, { transform: [{ translateY: dot }] }]} />)}
    </View>
  );
}

export function MessageList({ messages, typingName, listRef }) {
  return (
    <>
      <FlatList ref={listRef} data={messages} keyExtractor={item => item.id} renderItem={({ item }) => <Message item={item} />} contentContainerStyle={styles.listContent} onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })} />
      {typingName && (
        <View style={styles.typingRow}>
          <TypingDots />
          <Text style={styles.typingText}>{typingName.toUpperCase()} IS TYPING...</Text>
        </View>
      )}
    </>
  );
}

export function ChatInput({ identity, target, inputText, onChangeText, isShout, onToggleShout, isBusy, onSend }) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inputWrap}>
        <View style={styles.inputDock}>
          <MotionPressable
            activeScale={0.90}
            style={[styles.shoutBtn, isShout ? styles.shoutBtnActive : styles.shoutBtnInactive]}
            onPress={onToggleShout}
          >
            <MaterialIcons name="campaign" size={20} color={isShout ? '#412d00' : '#cac4d0'} style={isShout ? styles.shoutIconActive : styles.shoutIconInactive} />
          </MotionPressable>
          <TextInput
            style={styles.input}
            placeholder={target ? `Speak as ${identity.shortName} to ${target.shortName}...` : `Speak as ${identity.shortName}...`}
            placeholderTextColor="#8a8794"
            value={inputText}
            onChangeText={onChangeText}
            onSubmitEditing={onSend}
            returnKeyType="send"
            editable={!isBusy}
          />
          <MotionPressable
            activeScale={0.92}
            style={[styles.sendBtn, isBusy && styles.sendBtnDisabled]}
            onPress={onSend}
            disabled={isBusy}
          >
            {isBusy ? <ActivityIndicator size="small" color="#574b7e" /> : <MaterialIcons name="send" size={20} color="#574b7e" />}
          </MotionPressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
