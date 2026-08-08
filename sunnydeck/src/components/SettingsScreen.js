import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MotionPressable from './MotionPressable';
import CharacterIcon from './CharacterIcon';
import { GUEST_CHARACTER, STRAW_HAT_CREW } from '../data/characters';
import styles from '../styles';

function IdentityTile({ character, active, onPress }) {
  const activeAnim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(activeAnim, {
      toValue: active ? 1 : 0,
      stiffness: 240,
      damping: 22,
      useNativeDriver: false,
    }).start();
  }, [active]);

  const iconScale = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.18],
  });

  const linePercent = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <MotionPressable
      activeScale={0.96}
      style={[styles.identityTile, active && styles.identityTileActive]}
      onPress={onPress}
    >
      <View style={styles.identityTileRow}>
        <Animated.View
          style={[
            styles.identityIconWrapper,
            active && styles.identityIconWrapperActive,
            { transform: [{ scale: iconScale }] },
          ]}
        >
          <CharacterIcon
            characterKey={character.key}
            size={22}
            color={active ? '#f5c04a' : '#98d2c8'}
          />
        </Animated.View>
        <View style={styles.identityMeta}>
          <Text
            style={[styles.identityRoleText, active && styles.identityRoleTextActive]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {character.role.toUpperCase()}
          </Text>
          <Text style={styles.identityNameText} numberOfLines={1} ellipsizeMode="tail">
            {character.name || character.shortName}
          </Text>
        </View>
        {active && (
          <MaterialIcons
            name="check-circle"
            size={18}
            color="#f5c04a"
            style={styles.selectedCheck}
          />
        )}
      </View>
      <Animated.View
        style={[
          styles.identityActiveLine,
          {
            width: linePercent,
            backgroundColor: '#f5c04a',
          },
        ]}
      />
    </MotionPressable>
  );
}

function StyledInput({ style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      style={[styles.settingsInput, focused && styles.settingsInputFocused, style]}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  );
}

export default function SettingsScreen({ visible, settings, onSave, onClose }) {
  const [draft, setDraft] = useState(settings);
  const [showKeys, setShowKeys] = useState({ aqua: false, groq: false, openai: false });

  useEffect(() => { if (visible) setDraft(settings); }, [visible, settings]);
  const patch = value => setDraft(current => ({ ...current, ...value }));
  const identities = [GUEST_CHARACTER, ...STRAW_HAT_CREW];

  const KeyField = ({ label, value, onChangeText, shown, onToggle }) => (\n    <>\n      <Text style={styles.settingsLabel}>{label}</Text>\n      <View style={{ flexDirection: 'row', alignItems: 'center' }}>\n        <StyledInput\n          style={{ flex: 1, marginBottom: 0 }}\n          autoCapitalize=\"none\"\n          secureTextEntry={!shown}\n          value={value}\n          onChangeText={onChangeText}\n          placeholder=\"••••••••••••••••\"\n          placeholderTextColor=\"#8a8794\"\n        />\n        <MotionPressable\n          activeScale={0.9}\n          style={{ marginLeft: -44, zIndex: 2, padding: 8 }}\n          onPress={onToggle}\n        >\n          <MaterialIcons name={shown ? 'visibility' : 'visibility-off'} size={18} color=\"#cac4d0\" />\n        </MotionPressable>\n      </View>\n    </>\n  );

  return (
    <View style={styles.settingsScreen}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>Sunny Settings</Text>
        <MotionPressable style={styles.settingsClose} activeScale={0.9} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#cac4d0" />
        </MotionPressable>
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
                <IdentityTile
                  key={character.key}
                  character={character}
                  active={active}
                  onPress={() => patch({ playAsCharacterKey: character.key })}
                />
              );
            })}
          </View>
          {draft.playAsCharacterKey === 'guest' && (
            <View style={{ marginTop: 14 }}>
              <Text style={styles.settingsLabel}>Guest Display Name</Text>
              <StyledInput value={draft.guestName} onChangeText={guestName => patch({ guestName })} placeholder="Player" placeholderTextColor="#8a8794" />
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
          <StyledInput autoCapitalize="none" value={draft.routerModel} onChangeText={routerModel => patch({ routerModel })} placeholder="aqua:agnes" placeholderTextColor="#8a8794" />
          <Text style={styles.settingsHelper}>Selects 1–2 natural responders. A fast, inexpensive model is ideal.</Text>
          <Text style={styles.settingsLabel}>Chat Model ID</Text>
          <StyledInput autoCapitalize="none" value={draft.chatModel} onChangeText={chatModel => patch({ chatModel })} placeholder="aqua:agnes" placeholderTextColor="#8a8794" />
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
        <MotionPressable style={styles.settingsCancelBtn} activeScale={0.96} onPress={onClose}>
          <Text style={styles.settingsCancelText}>Cancel</Text>
        </MotionPressable>
        <MotionPressable style={styles.settingsSaveBtn} activeScale={0.96} onPress={() => onSave(draft)}>
          <Text style={styles.settingsSaveText}>Save Settings</Text>
          <MaterialIcons name="check-circle" size={16} color="#574b7e" />
        </MotionPressable>
      </View>
    </View>
  );
}
