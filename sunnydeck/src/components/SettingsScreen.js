import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GUEST_CHARACTER, STRAW_HAT_CREW } from '../data/characters';
import styles from '../styles';

export default function SettingsScreen({ visible, settings, onSave, onClose }) {
  const [draft, setDraft] = useState(settings);
  const [showKeys, setShowKeys] = useState({ aqua: false, groq: false, openai: false });
  useEffect(() => { if (visible) setDraft(settings); }, [visible, settings]);
  const patch = value => setDraft(current => ({ ...current, ...value }));
  const identities = [GUEST_CHARACTER, ...STRAW_HAT_CREW];

  const KeyField = ({ label, value, onChangeText, shown, onToggle }) => (
    <>
      <Text style={styles.settingsLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput style={[styles.settingsInput, { flex: 1, marginBottom: 0 }]} autoCapitalize="none" secureTextEntry={!shown} value={value} onChangeText={onChangeText} placeholder="••••••••••••••••" placeholderTextColor="#8a8794" />
        <Pressable style={({ pressed }) => [{ marginLeft: -44, zIndex: 2, padding: 8 }, pressed && { opacity: 0.6 }]} onPress={onToggle}>
          <MaterialIcons name={shown ? 'visibility' : 'visibility-off'} size={18} color="#cac4d0" />
        </Pressable>
      </View>
    </>
  );

  return (
    <View style={styles.settingsScreen}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>Sunny Settings</Text>
        <Pressable style={({ pressed }) => [styles.settingsClose, pressed && { backgroundColor: '#35343e' }]} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#cac4d0" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.settingsScroll} keyboardShouldPersistTaps="handled">
        {/* Roleplay Identity */}
        <View style={styles.settingsSection}>
          <View style={styles.settingsSectionHeader}>
            <MaterialIcons name="person-pin" size={20} color="#98d2c8" />
            <Text style={[styles.settingsSectionLabel, { color: '#98d2c8' }]}>Roleplay Identity</Text>
          </View>
          <View style={styles.identityGrid}>
            {identities.map(character => {
              const active = draft.playAsCharacterKey === character.key;
              return (
                <Pressable key={character.key} style={({ pressed }) => [styles.identityTile, active && styles.identityTileActive, pressed && { opacity: 0.8 }]} onPress={() => patch({ playAsCharacterKey: character.key })}>
                  {active && (
                    <View style={styles.selectedBadge}><Text style={styles.selectedBadgeText}>Selected</Text></View>
                  )}
                  <Text style={styles.identityTileEmoji}>{character.avatar}</Text>
                  <Text style={styles.identityTileName}>{character.role.toUpperCase()}</Text>
                </Pressable>
              );
            })}
          </View>
          {draft.playAsCharacterKey === 'guest' && (
            <View style={{ marginTop: 14 }}>
              <Text style={styles.settingsLabel}>Guest Display Name</Text>
              <TextInput style={styles.settingsInput} value={draft.guestName} onChangeText={guestName => patch({ guestName })} placeholder="Player" placeholderTextColor="#8a8794" />
            </View>
          )}
        </View>

        {/* Model Assignments */}
        <View style={styles.settingsSection}>
          <View style={styles.settingsSectionHeader}>
            <MaterialIcons name="psychology" size={20} color="#ffdfa7" />
            <Text style={[styles.settingsSectionLabel, { color: '#ffdfa7' }]}>Model Assignments</Text>
          </View>
          <Text style={styles.settingsLabel}>Router Model ID</Text>
          <TextInput style={styles.settingsInput} autoCapitalize="none" value={draft.routerModel} onChangeText={routerModel => patch({ routerModel })} placeholder="aqua:agnes" placeholderTextColor="#8a8794" />
          <Text style={styles.settingsHelper}>Selects 1–2 natural responders. A fast, inexpensive model is ideal.</Text>
          <Text style={styles.settingsLabel}>Chat Model ID</Text>
          <TextInput style={styles.settingsInput} autoCapitalize="none" value={draft.chatModel} onChangeText={chatModel => patch({ chatModel })} placeholder="aqua:agnes" placeholderTextColor="#8a8794" />
          <Text style={styles.settingsHelper}>Generates dialogue. Prefix with aqua:, groq:, or openai:.</Text>
        </View>

        {/* API Keys */}
        <View style={styles.settingsSection}>
          <View style={styles.settingsSectionHeader}>
            <MaterialIcons name="key" size={20} color="#e8deff" />
            <Text style={[styles.settingsSectionLabel, { color: '#e8deff' }]}>API Keys</Text>
          </View>
          <KeyField label="Aqua Air" value={draft.aquaKey} onChangeText={aquaKey => patch({ aquaKey })} shown={showKeys.aqua} onToggle={() => setShowKeys(s => ({ ...s, aqua: !s.aqua }))} />
          <View style={{ height: 12 }} />
          <KeyField label="Groq" value={draft.groqKey} onChangeText={groqKey => patch({ groqKey })} shown={showKeys.groq} onToggle={() => setShowKeys(s => ({ ...s, groq: !s.groq }))} />
          <View style={{ height: 12 }} />
          <KeyField label="OpenAI" value={draft.openaiKey} onChangeText={openaiKey => patch({ openaiKey })} shown={showKeys.openai} onToggle={() => setShowKeys(s => ({ ...s, openai: !s.openai }))} />
        </View>
      </ScrollView>
      <View style={styles.settingsFooter}>
        <Pressable style={({ pressed }) => [styles.settingsCancelBtn, pressed && { backgroundColor: '#35343e' }]} onPress={onClose}>
          <Text style={styles.settingsCancelText}>Cancel</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.settingsSaveBtn, pressed && { opacity: 0.85 }]} onPress={() => onSave(draft)}>
          <Text style={styles.settingsSaveText}>Save Settings</Text>
          <MaterialIcons name="check-circle" size={16} color="#574b7e" />
        </Pressable>
      </View>
    </View>
  );
}
