import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
  if (item.kind === 'system') {
    return <View style={styles.systemBanner}><Text style={styles.systemText}>{item.text}</Text></View>;
  }
  const isPlayer = !!item.isPlayer;
  return (
    <View style={[styles.msgRow, isPlayer ? styles.playerRow : styles.crewRow]}>
      <View style={[styles.msgHeader, isPlayer ? styles.msgHeaderRight : styles.msgHeaderLeft]}>
        {!isPlayer && <Text style={styles.msgAvatar}>{item.avatar || '🏴‍☠️'}</Text>}
        <Text style={isPlayer ? styles.speakerNamePlayer : styles.speakerName}>{item.speaker}</Text>
        {item.role && <Text style={isPlayer ? styles.roleTextPlayer : styles.roleText}>• {item.role}</Text>}
        {item.shout && <ShoutBadge />}
        {item.target && <TargetBadge name={item.target} />}
      </View>
      <View style={[styles.bubble, isPlayer ? styles.playerBubble : styles.crewBubble]}>
        <Text style={isPlayer ? styles.msgTextPlayer : styles.msgText}>{item.text}</Text>
      </View>
      <Text style={styles.timestamp}>{new Date(item.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
    </View>
  );
}

export function TargetBar({ characters, target, onSelect }) {
  return (
    <View style={styles.targetBar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.targetRail}>
        <Pressable style={({ pressed }) => [styles.targetChip, !target && styles.targetChipActive, pressed && { opacity: 0.8 }]} onPress={() => onSelect(null)}>
          {!target && <MaterialIcons name="group" size={16} color="#8ac3ba" style={styles.targetCheck} />}
          <Text style={[styles.targetChipText, !target && styles.targetChipTextActive]}>All Crew</Text>
        </Pressable>
        {characters.map(character => {
          const active = target?.key === character.key;
          return (
            <Pressable key={character.key} style={({ pressed }) => [styles.targetChip, active && styles.targetChipActive, pressed && { opacity: 0.8 }]} onPress={() => onSelect(active ? null : character)}>
              {active && <MaterialIcons name="check" size={15} color="#8ac3ba" style={styles.targetCheck} />}
              <Text style={styles.targetChipIcon}>{character.avatar}</Text>
              <Text style={[styles.targetChipText, active && styles.targetChipTextActive]}>{character.shortName}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
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
          <Pressable style={({ pressed }) => [styles.shoutBtn, isShout ? styles.shoutBtnActive : styles.shoutBtnInactive, pressed && { opacity: 0.8 }]} onPress={onToggleShout}>
            <MaterialIcons name="campaign" size={20} color={isShout ? '#412d00' : '#cac4d0'} style={isShout ? styles.shoutIconActive : styles.shoutIconInactive} />
          </Pressable>
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
          <Pressable style={({ pressed }) => [styles.sendBtn, isBusy && styles.sendBtnDisabled, pressed && { opacity: 0.8 }]} onPress={onSend} disabled={isBusy}>
            {isBusy ? <ActivityIndicator size="small" color="#574b7e" /> : <MaterialIcons name="send" size={20} color="#574b7e" />}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
