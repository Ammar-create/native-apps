import React from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles, { colors } from '../styles';

function Message({ item }) {
  if (item.kind === 'system') return <View style={styles.systemBubble}><Text style={styles.systemText}>⚡ {item.text}</Text></View>;
  return (
    <View style={[styles.msgContainer, item.isPlayer ? styles.playerAlign : styles.charAlign]}>
      {!item.isPlayer && <View style={styles.avatarBadge}><Text style={styles.avatarText}>{item.avatar || '🏴‍☠️'}</Text></View>}
      <View style={[styles.bubble, item.isPlayer ? styles.playerBubble : styles.charBubble]}>
        <View style={styles.msgHeader}>
          <Text style={styles.speakerName}>{item.speaker}</Text>
          {item.role && <Text style={styles.roleBadge}>// {item.role}</Text>}
          {item.shout && <Text style={styles.tagBadge}>📢 SHOUT</Text>}
          {item.target && <Text style={styles.tagBadge}>→ @{item.target}</Text>}
        </View>
        <Text style={styles.msgText}>{item.text}</Text>
      </View>
    </View>
  );
}

export function TargetBar({ characters, target, onSelect }) {
  return (
    <View style={styles.targetBar}>
      <Text style={styles.targetLabel}>TARGET:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={[styles.targetChip, !target && styles.targetChipActive]} onPress={() => onSelect(null)}>
          <Text style={[styles.chipText, !target && styles.chipTextActive]}>ALL CREW</Text>
        </TouchableOpacity>
        {characters.map(character => (
          <TouchableOpacity key={character.key} style={[styles.targetChip, target?.key === character.key && styles.targetChipActive]} onPress={() => onSelect(target?.key === character.key ? null : character)}>
            <Text style={[styles.chipText, target?.key === character.key && styles.chipTextActive]}>{character.avatar} {character.shortName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export function MessageList({ messages, typingName, listRef }) {
  return (
    <>
      <FlatList ref={listRef} data={messages} keyExtractor={item => item.id} renderItem={({ item }) => <Message item={item} />} contentContainerStyle={styles.listContent} onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })} />
      {typingName && <View style={styles.typingContainer}><ActivityIndicator size="small" color={colors.amber} /><Text style={styles.typingText}>{typingName.toUpperCase()} IS TYPING...</Text></View>}
    </>
  );
}

export function ChatInput({ identity, target, inputText, onChangeText, isShout, onToggleShout, isBusy, onSend }) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={[styles.shoutBtn, isShout && styles.shoutBtnActive]} onPress={onToggleShout}><Text style={styles.shoutText}>📢</Text></TouchableOpacity>
        <TextInput style={styles.input} placeholder={target ? `${identity.shortName} to ${target.shortName}...` : `Speak as ${identity.shortName}...`} placeholderTextColor="#665544" value={inputText} onChangeText={onChangeText} onSubmitEditing={onSend} returnKeyType="send" />
        <TouchableOpacity style={[styles.sendBtn, isBusy && styles.sendBtnDisabled]} onPress={onSend} disabled={isBusy}><Text style={styles.sendBtnText}>SEND</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
