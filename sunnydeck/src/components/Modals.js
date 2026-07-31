import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GUEST_CHARACTER, STRAW_HAT_CREW } from '../data/characters';
import { formatSessionTime, sessionPreview } from '../utils/sessions';
import styles from '../styles';

export function SettingsModal({ visible, settings, onClose, onSave }) {
  const [draft, setDraft] = useState(settings);
  useEffect(() => { if (visible) setDraft(settings); }, [visible, settings]);
  const patch = value => setDraft(current => ({ ...current, ...value }));
  const identities = [GUEST_CHARACTER, ...STRAW_HAT_CREW];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBg}><View style={styles.modalCard}>
        <Text style={styles.modalTitle}>⚙️ SUNNY SETTINGS</Text>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionTitle}>ROLEPLAY IDENTITY</Text>
          <Text style={styles.helperText}>Choose an existing Straw Hat to control. That character is removed from AI responders. Guest leaves the whole crew AI-controlled.</Text>
          <View style={styles.roleGrid}>
            {identities.map(character => {
              const active = draft.playAsCharacterKey === character.key;
              return <TouchableOpacity key={character.key} style={[styles.roleChip, active && styles.roleChipActive]} onPress={() => patch({ playAsCharacterKey: character.key })}>
                <Text style={[styles.roleName, active && styles.roleNameActive]}>{character.avatar} {character.shortName}</Text>
                <Text style={styles.roleMeta}>{character.role}</Text>
              </TouchableOpacity>;
            })}
          </View>
          {draft.playAsCharacterKey === 'guest' && <>
            <Text style={styles.inputLabel}>GUEST DISPLAY NAME</Text>
            <TextInput style={styles.modalInput} value={draft.guestName} onChangeText={guestName => patch({ guestName })} placeholder="Player" placeholderTextColor="#665544" />
          </>}

          <Text style={styles.sectionTitle}>MODEL ASSIGNMENTS</Text>
          <Text style={styles.inputLabel}>ROUTER MODEL ID</Text>
          <TextInput style={styles.modalInput} autoCapitalize="none" value={draft.routerModel} onChangeText={routerModel => patch({ routerModel })} placeholder="aqua:agnes" placeholderTextColor="#665544" />
          <Text style={styles.helperText}>Selects 1–2 natural responders. A fast, inexpensive model is ideal.</Text>
          <Text style={styles.inputLabel}>CHAT MODEL ID</Text>
          <TextInput style={styles.modalInput} autoCapitalize="none" value={draft.chatModel} onChangeText={chatModel => patch({ chatModel })} placeholder="aqua:deepseek-v4" placeholderTextColor="#665544" />
          <Text style={styles.helperText}>Generates dialogue. Prefix with aqua:, groq:, or openai:. IDs without a prefix use Aqua.</Text>

          <Text style={styles.sectionTitle}>API KEYS</Text>
          <Text style={styles.inputLabel}>AQUA AIR API KEY</Text>
          <TextInput style={styles.modalInput} autoCapitalize="none" secureTextEntry value={draft.aquaKey} onChangeText={aquaKey => patch({ aquaKey })} placeholder="Aqua key..." placeholderTextColor="#665544" />
          <Text style={styles.inputLabel}>GROQ API KEY</Text>
          <TextInput style={styles.modalInput} autoCapitalize="none" secureTextEntry value={draft.groqKey} onChangeText={groqKey => patch({ groqKey })} placeholder="Groq key..." placeholderTextColor="#665544" />
          <Text style={styles.inputLabel}>OPENAI API KEY</Text>
          <TextInput style={styles.modalInput} autoCapitalize="none" secureTextEntry value={draft.openaiKey} onChangeText={openaiKey => patch({ openaiKey })} placeholder="OpenAI key..." placeholderTextColor="#665544" />
        </ScrollView>
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}><Text style={styles.modalCancelText}>CANCEL</Text></TouchableOpacity>
          <TouchableOpacity style={styles.modalSaveBtn} onPress={() => onSave(draft)}><Text style={styles.modalSaveText}>SAVE SETTINGS</Text></TouchableOpacity>
        </View>
      </View></View>
    </Modal>
  );
}

export function SessionsModal({ visible, sessions, activeSessionId, onClose, onNew, onSwitch, onDelete }) {
  const confirmDelete = session => Alert.alert('Delete Session', `Delete “${session.title}”?`, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => onDelete(session.id) }
  ]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBg}><View style={styles.modalCard}>
        <Text style={styles.modalTitle}>📜 CHAT SESSIONS</Text>
        <TouchableOpacity style={styles.sessionNewBtn} onPress={onNew}><Text style={styles.sessionNewText}>+ START NEW SESSION</Text></TouchableOpacity>
        <ScrollView>
          {[...sessions].sort((a, b) => b.updatedAt - a.updatedAt).map(session => {
            const active = session.id === activeSessionId;
            return <TouchableOpacity key={session.id} style={[styles.sessionRow, active && styles.sessionRowActive]} onPress={() => onSwitch(session.id)} onLongPress={() => confirmDelete(session)}>
              <View style={styles.sessionTitleRow}><Text style={styles.sessionTitle} numberOfLines={1}>{session.title}</Text>{active && <Text style={styles.sessionActiveLabel}>ACTIVE</Text>}</View>
              <Text style={styles.sessionMeta}>{Math.max(0, (session.messages?.length || 1) - 1)} messages • {formatSessionTime(session.updatedAt)}</Text>
              <Text style={styles.sessionPreview} numberOfLines={2}>{sessionPreview(session)}</Text>
              <Text style={styles.deleteText}>LONG-PRESS TO DELETE</Text>
            </TouchableOpacity>;
          })}
        </ScrollView>
        <View style={styles.modalActions}><TouchableOpacity style={styles.modalSaveBtn} onPress={onClose}><Text style={styles.modalSaveText}>CLOSE</Text></TouchableOpacity></View>
      </View></View>
    </Modal>
  );
}

export function CrewModal({ visible, playAsCharacterKey, onPlayAs, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBg}><View style={styles.modalCard}>
        <Text style={styles.modalTitle}>🏴‍☠️ STRAW HAT CREW</Text>
        <Text style={[styles.helperText, { marginBottom: 10 }]}>Tap a crew member to play as them. Their dialogue will then be controlled by you.</Text>
        <ScrollView>
          {STRAW_HAT_CREW.map(character => {
            const controlled = character.key === playAsCharacterKey;
            return <TouchableOpacity key={character.key} style={[styles.crewCard, controlled && styles.sessionRowActive]} onPress={() => onPlayAs(character.key)}>
              <Text style={styles.crewAvatar}>{character.avatar}</Text>
              <View style={styles.crewInfo}>
                <Text style={styles.crewName}>{character.name}</Text><Text style={styles.crewRole}>{character.role.toUpperCase()}</Text>
                <Text style={styles.crewDescription}>{character.description}</Text>{controlled && <Text style={styles.controlledBadge}>YOU ARE PLAYING THIS CHARACTER</Text>}
              </View>
            </TouchableOpacity>;
          })}
        </ScrollView>
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.modalCancelBtn} onPress={() => onPlayAs('guest')}><Text style={styles.modalCancelText}>PLAY AS GUEST</Text></TouchableOpacity>
          <TouchableOpacity style={styles.modalSaveBtn} onPress={onClose}><Text style={styles.modalSaveText}>CLOSE</Text></TouchableOpacity>
        </View>
      </View></View>
    </Modal>
  );
}
