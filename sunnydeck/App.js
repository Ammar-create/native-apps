import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default Premade Realm: Thousand Sunny
const DEFAULT_CHARACTERS = [
  { key: 'luffy', name: 'Monkey D. Luffy', role: 'Captain', avatar: '🍖', description: 'Energetic, optimistic, loves meat and adventure.', personality: 'Impulsive, carefree, loyal, direct.' },
  { key: 'zoro', name: 'Roronoa Zoro', role: 'Swordsman', avatar: '⚔️', description: 'Master swordsman, loves sake and napping.', personality: 'Stoic, stern, terrible direction sense, protective.' },
  { key: 'nami', name: 'Nami', role: 'Navigator', avatar: '🍊', description: 'Brilliant navigator, loves money and tangerines.', personality: 'Sharp-witted, practical, bossy when crew gets chaotic.' },
  { key: 'usopp', name: 'Usopp', role: 'Sniper', avatar: '🎯', description: 'Master inventor and storyteller.', personality: 'Dramatic, creative, easily scared, heroic when counts.' },
  { key: 'sanji', name: 'Sanji', role: 'Cook', avatar: '🍳', description: 'Master chef, chivalrous to a fault.', personality: 'Passionate, refined cook, protective, stylish.' },
  { key: 'chopper', name: 'Tony Tony Chopper', role: 'Doctor', avatar: '🌸', description: 'Reindeer doctor who loves sweet treats.', personality: 'Cute, earnest, easily flattered, caring.' }
];

const DEFAULT_SETTINGS = {
  aquaKey: '',
  groqKey: '',
  routerModel: 'aqua:llama-3.3-70b-instruct',
  chatModel: 'aqua:llama-3.3-70b-instruct'
};

const PROVIDERS = {
  aqua: { base: 'https://api.aquadevs.com/v1', keyName: 'aquaKey' },
  groq: { base: 'https://api.groq.com/openai/v1', keyName: 'groqKey' }
};

function parseModel(str) {
  const i = (str || '').indexOf(':');
  if (i === -1) return { provider: 'aqua', model: str || 'llama-3.3-70b-instruct' };
  return { provider: str.slice(0, i).trim().toLowerCase(), model: str.slice(i + 1).trim() };
}

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', kind: 'system', speaker: 'SYSTEM', text: 'SUNNY DECK // RETRO MOBILE INITIALIZED. Welcome aboard the Thousand Sunny.', timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isShout, setIsShout] = useState(false);
  const [targetChar, setTargetChar] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [typingName, setTypingName] = useState(null);
  
  // Settings & Modal
  const [settingsModal, setSettingsModal] = useState(false);
  const [charModal, setCharModal] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [tempAquaKey, setTempAquaKey] = useState('');
  const [tempGroqKey, setTempGroqKey] = useState('');

  const flatListRef = useRef(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('sunny_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        setTempAquaKey(parsed.aquaKey || '');
        setTempGroqKey(parsed.groqKey || '');
      }
    } catch (e) {
      console.warn('Failed to load settings', e);
    }
  };

  const saveSettings = async () => {
    const updated = { ...settings, aquaKey: tempAquaKey, groqKey: tempGroqKey };
    setSettings(updated);
    try {
      await AsyncStorage.setItem('sunny_settings', JSON.stringify(updated));
      setSettingsModal(false);
      Alert.alert('Settings Saved', 'API keys updated successfully.');
    } catch (e) {
      Alert.alert('Error', 'Could not save settings.');
    }
  };

  // Chat Router logic via Aqua API
  const pickResponders = async (text) => {
    if (targetChar) {
      return [targetChar.key];
    }
    const candidates = DEFAULT_CHARACTERS.map(c => c.key);
    
    if (!settings.aquaKey) {
      return [candidates[Math.floor(Math.random() * candidates.length)]];
    }

    const { provider, model } = parseModel(settings.routerModel);
    const p = PROVIDERS[provider] || PROVIDERS.aqua;
    const key = settings[p.keyName] || settings.aquaKey;

    if (!key) return [candidates[0]];

    const charSummary = DEFAULT_CHARACTERS.map(c => `${c.key} (${c.name}, ${c.role})`).join('; ');
    const prompt = `You are the scene router on the Thousand Sunny deck.\nMessage from Player: "${text}"\nCharacters present: ${charSummary}\nDecide who naturally responds (1 or 2 keys).\nOutput ONLY JSON: {"responders":["key1"]}\nOptions: ${candidates.join(', ')}`;

    try {
      const res = await fetch(`${p.base}/chat/completions`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], max_tokens: 60, temperature: 0 })
      });
      const data = await res.json();
      const m = data.choices?.[0]?.message?.content?.match(/\{[\s\S]*\}/);
      if (m) {
        const parsed = JSON.parse(m[0]);
        const picks = (parsed.responders || []).map(n => String(n).toLowerCase().trim()).filter(n => candidates.includes(n));
        if (picks.length) return picks;
      }
    } catch (e) {
      console.warn('Router fallback', e);
    }
    return [candidates[Math.floor(Math.random() * candidates.length)]];
  };

  // Character response generator
  const getCharacterReply = async (charKey, userText, alreadyReplied) => {
    const c = DEFAULT_CHARACTERS.find(x => x.key === charKey);
    const { provider, model } = parseModel(settings.chatModel);
    const p = PROVIDERS[provider] || PROVIDERS.aqua;
    const key = settings[p.keyName] || settings.aquaKey;

    if (!key) {
      return `(Add your Aqua API Key in Settings to enable live AI responses!) Hi, I'm ${c.name}!`;
    }

    const repliedNote = alreadyReplied.length ? `\nOthers who just spoke: ${alreadyReplied.join(', ')}. React naturally.` : '';
    const sys = `You are ${c.name} (${c.role}) on the Thousand Sunny. ${c.description}. Personality: ${c.personality}.${repliedNote}\nRULES:\n- SPOKEN DIALOGUE ONLY. No asterisks, no actions.\n- Stay fully in character. 1-3 short sentences.\n- Never mention being an AI.`;

    const res = await fetch(`${p.base}/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: `Player says: "${userText}"` }
        ],
        temperature: 0.85,
        max_tokens: 150
      })
    });

    if (!res.ok) throw new Error(`API Error ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content.trim();
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isBusy) return;

    setInputText('');
    setIsBusy(true);

    const userMsg = {
      id: Date.now().toString(),
      kind: 'dialogue',
      speaker: 'Player',
      isPlayer: true,
      text: text,
      shout: isShout,
      target: targetChar ? targetChar.name : null,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsShout(false);

    try {
      const responders = await pickResponders(text);
      const already = [];

      for (const rKey of responders) {
        const c = DEFAULT_CHARACTERS.find(x => x.key === rKey);
        if (!c) continue;

        setTypingName(c.name);
        // Simulate realistic typing delay
        await new Promise(r => setTimeout(r, 600));

        let reply = '';
        try {
          reply = await getCharacterReply(rKey, text, already);
        } catch (e) {
          reply = `[Error generating response: ${e.message}]`;
        } finally {
          setTypingName(null);
        }

        const charMsg = {
          id: (Date.now() + Math.random()).toString(),
          kind: 'dialogue',
          speaker: c.name,
          avatar: c.avatar,
          isPlayer: false,
          text: reply,
          timestamp: Date.now()
        };

        setMessages(prev => [...prev, charMsg]);
        already.push(c.name);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  const renderItem = ({ item }) => {
    if (item.kind === 'system') {
      return (
        <View style={styles.systemBubble}>
          <Text style={styles.systemText}>⚡ {item.text}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.msgContainer, item.isPlayer ? styles.playerAlign : styles.charAlign]}>
        {!item.isPlayer && (
          <View style={styles.avatarBadge}>
            <Text style={styles.avatarText}>{item.avatar || '🏴‍☠️'}</Text>
          </View>
        )}
        <View style={[styles.bubble, item.isPlayer ? styles.playerBubble : styles.charBubble]}>
          <View style={styles.msgHeader}>
            <Text style={styles.speakerName}>{item.speaker}</Text>
            {item.shout && <Text style={styles.tagBadge}>📢 SHOUT</Text>}
            {item.target && <Text style={styles.tagBadge}>👉 @{item.target}</Text>}
          </View>
          <Text style={styles.msgText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0b09" />

      {/* Retro Top Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>SUNNY DECK // RETRO</Text>
          <Text style={styles.headerSubtitle}>THOUSAND SUNNY REALM</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => setSettingsModal(true)}>
          <Text style={styles.settingsBtnText}>⚙️ KEYS</Text>
        </TouchableOpacity>
      </View>

      {/* Target Selector Ribbon */}
      <View style={styles.targetBar}>
        <Text style={styles.targetLabel}>TARGET:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.targetChip, !targetChar && styles.targetChipActive]}
            onPress={() => setTargetChar(null)}
          >
            <Text style={[styles.chipText, !targetChar && styles.chipTextActive]}>ALL CREW</Text>
          </TouchableOpacity>
          {DEFAULT_CHARACTERS.map(c => (
            <TouchableOpacity
              key={c.key}
              style={[styles.targetChip, targetChar?.key === c.key && styles.targetChipActive]}
              onPress={() => setTargetChar(targetChar?.key === c.key ? null : c)}
            >
              <Text style={[styles.chipText, targetChar?.key === c.key && styles.chipTextActive]}>
                {c.avatar} {c.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Typing Indicator */}
      {typingName && (
        <View style={styles.typingContainer}>
          <ActivityIndicator size="small" color="#f5a623" />
          <Text style={styles.typingText}>{typingName.toUpperCase()} IS TYPING...</Text>
        </View>
      )}

      {/* Bottom Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[styles.shoutBtn, isShout && styles.shoutBtnActive]}
            onPress={() => setIsShout(!isShout)}
          >
            <Text style={[styles.shoutText, isShout && styles.shoutTextActive]}>📢</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder={targetChar ? `Speak to ${targetChar.name}...` : "Speak on deck..."}
            placeholderTextColor="#665544"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />

          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={isBusy}>
            <Text style={styles.sendBtnText}>SEND</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Settings Modal */}
      <Modal visible={settingsModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>⚙️ API CONFIGURATION</Text>
            
            <Text style={styles.inputLabel}>AQUA API KEY (CHAT & ROUTER):</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Paste Aqua API key..."
              placeholderTextColor="#665544"
              value={tempAquaKey}
              onChangeText={setTempAquaKey}
              secureTextEntry
            />

            <Text style={styles.inputLabel}>GROQ API KEY (SPEECH/AUDIO):</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Paste Groq API key..."
              placeholderTextColor="#665544"
              value={tempGroqKey}
              onChangeText={setTempGroqKey}
              secureTextEntry
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setSettingsModal(false)}>
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={saveSettings}>
                <Text style={styles.modalSaveText}>SAVE KEYS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d0b09' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2015',
    backgroundColor: '#14100c'
  },
  headerTitle: { color: '#f5a623', fontSize: 16, fontWeight: 'bold', letterSpacing: 1.2 },
  headerSubtitle: { color: '#8c7355', fontSize: 10, letterSpacing: 1 },
  settingsBtn: { borderBottomWidth: 1, borderBottomColor: '#f5a623', paddingVertical: 4 },
  settingsBtnText: { color: '#f5a623', fontSize: 12, fontWeight: 'bold' },

  targetBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#110d0a', borderBottomWidth: 1, borderBottomColor: '#221a12' },
  targetLabel: { color: '#8c7355', fontSize: 10, fontWeight: 'bold', marginRight: 8 },
  targetChip: { backgroundColor: '#1a140f', borderWidth: 1, borderColor: '#33271a', borderRadius: 4, paddingHorizontal: 10, paddingVertical: 5, marginRight: 6 },
  targetChipActive: { backgroundColor: '#f5a623', borderColor: '#f5a623' },
  chipText: { color: '#a68b68', fontSize: 11, fontWeight: 'bold' },
  chipTextActive: { color: '#0d0b09' },

  listContent: { padding: 12 },
  systemBubble: { backgroundColor: '#1c1610', borderWidth: 1, borderColor: '#3a2e1e', borderRadius: 6, padding: 10, marginVertical: 6, alignItems: 'center' },
  systemText: { color: '#d4af37', fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

  msgContainer: { flexDirection: 'row', marginVertical: 6, maxWidth: '85%' },
  playerAlign: { alignSelf: 'flex-end' },
  charAlign: { alignSelf: 'flex-start' },
  avatarBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#261e16', borderWidth: 1, borderColor: '#4a3a28', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  avatarText: { fontSize: 16 },

  bubble: { borderRadius: 8, padding: 10, borderWidth: 1 },
  playerBubble: { backgroundColor: '#261c0e', borderColor: '#59401f' },
  charBubble: { backgroundColor: '#16120e', borderColor: '#33281c' },

  msgHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  speakerName: { color: '#f5a623', fontSize: 11, fontWeight: 'bold', marginRight: 6 },
  tagBadge: { color: '#e67e22', fontSize: 9, fontWeight: 'bold', marginRight: 4 },
  msgText: { color: '#e6dacb', fontSize: 14, lineHeight: 19 },

  typingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 6 },
  typingText: { color: '#f5a623', fontSize: 11, marginLeft: 8, fontWeight: 'bold' },

  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#14100c', borderTopWidth: 1, borderTopColor: '#2a2015' },
  shoutBtn: { padding: 8, borderWidth: 1, borderColor: '#3a2e1e', borderRadius: 6, marginRight: 8, backgroundColor: '#1a140f' },
  shoutBtnActive: { backgroundColor: '#e67e22', borderColor: '#e67e22' },
  shoutText: { fontSize: 16 },
  shoutTextActive: { opacity: 1 },

  input: { flex: 1, backgroundColor: '#0d0b09', borderWidth: 1, borderColor: '#33271a', borderRadius: 6, color: '#f5a623', paddingHorizontal: 12, paddingVertical: 8, fontSize: 14 },
  sendBtn: { backgroundColor: '#f5a623', borderRadius: 6, paddingHorizontal: 16, paddingVertical: 10, marginLeft: 8 },
  sendBtnText: { color: '#0d0b09', fontSize: 12, fontWeight: 'bold' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#16120e', borderWidth: 1, borderColor: '#4a3a28', borderRadius: 8, padding: 20 },
  modalTitle: { color: '#f5a623', fontSize: 16, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  inputLabel: { color: '#a68b68', fontSize: 11, fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
  modalInput: { backgroundColor: '#0d0b09', borderWidth: 1, borderColor: '#33271a', borderRadius: 6, color: '#f5a623', paddingHorizontal: 12, paddingVertical: 8, fontSize: 13 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
  modalCancelBtn: { paddingHorizontal: 16, paddingVertical: 10, marginRight: 10 },
  modalCancelText: { color: '#8c7355', fontSize: 12, fontWeight: 'bold' },
  modalSaveBtn: { backgroundColor: '#f5a623', borderRadius: 6, paddingHorizontal: 16, paddingVertical: 10 },
  modalSaveText: { color: '#0d0b09', fontSize: 12, fontWeight: 'bold' }
});
