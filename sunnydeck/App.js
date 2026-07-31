import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './src/components/Header';
import { ChatInput, MessageList, TargetBar } from './src/components/ChatView';
import { CrewModal, SessionsModal, SettingsModal } from './src/components/Modals';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './src/constants/config';
import { getAiCrew, getCharacter, STRAW_HAT_CREW } from './src/data/characters';
import { requestChatCompletion } from './src/utils/api';
import { sanitizeSettings } from './src/utils/models';
import { createSession, titleFromMessage } from './src/utils/sessions';
import styles from './src/styles';

const VALID_IDENTITIES = ['guest', ...STRAW_HAT_CREW.map(character => character.key)];

function parseRouterResponse(content, candidates) {
  const match = String(content || '').match(/\{[\s\S]*\}/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[0]);
    return [...new Set((parsed.responders || []).map(value => String(value).toLowerCase().trim()))]
      .filter(key => candidates.includes(key))
      .slice(0, 2);
  } catch (_error) {
    return [];
  }
}

export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isShout, setIsShout] = useState(false);
  const [targetChar, setTargetChar] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [typingName, setTypingName] = useState(null);
  const [settingsModal, setSettingsModal] = useState(false);
  const [sessionsModal, setSessionsModal] = useState(false);
  const [crewModal, setCrewModal] = useState(false);
  const flatListRef = useRef(null);

  const activeSession = sessions.find(session => session.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];
  const baseIdentity = getCharacter(settings.playAsCharacterKey);
  const identity = settings.playAsCharacterKey === 'guest' ? { ...baseIdentity, name: settings.guestName, shortName: settings.guestName } : baseIdentity;
  const aiCrew = useMemo(() => getAiCrew(settings.playAsCharacterKey), [settings.playAsCharacterKey]);

  useEffect(() => {
    async function initialize() {
      try {
        const [savedSettings, savedSessions, savedActive] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.settings),
          AsyncStorage.getItem(STORAGE_KEYS.sessions),
          AsyncStorage.getItem(STORAGE_KEYS.activeSessionId)
        ]);
        const cleanSettings = sanitizeSettings(savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS, VALID_IDENTITIES);
        let nextSessions = savedSessions ? JSON.parse(savedSessions) : [];
        if (!Array.isArray(nextSessions) || !nextSessions.length) nextSessions = [createSession()];
        const nextActive = nextSessions.some(session => session.id === savedActive) ? savedActive : nextSessions[0].id;
        setSettings(cleanSettings); setSessions(nextSessions); setActiveSessionId(nextActive);
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(cleanSettings)),
          AsyncStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(nextSessions)),
          AsyncStorage.setItem(STORAGE_KEYS.activeSessionId, nextActive)
        ]);
      } catch (error) {
        console.warn('Initialization failed', error);
        const session = createSession(); setSessions([session]); setActiveSessionId(session.id);
      } finally { setLoaded(true); }
    }
    initialize();
  }, []);

  const commitSessions = async (nextSessions, nextActiveId = activeSessionId) => {
    setSessions(nextSessions); setActiveSessionId(nextActiveId);
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(nextSessions)),
      AsyncStorage.setItem(STORAGE_KEYS.activeSessionId, nextActiveId)
    ]);
  };

  const updateActiveMessages = updater => {
    const now = Date.now();
    setSessions(current => {
      const next = current.map(session => {
        if (session.id !== activeSessionId) return session;
        const nextMessages = typeof updater === 'function' ? updater(session.messages || []) : updater;
        return { ...session, messages: nextMessages, updatedAt: now };
      });
      AsyncStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(next)).catch(error => console.warn('Session save failed', error));
      return next;
    });
  };

  const startNewSession = async () => {
    if (isBusy) return Alert.alert('Please Wait', 'Finish the current response before changing sessions.');
    const session = createSession();
    await commitSessions([session, ...sessions], session.id);
    setTargetChar(null); setInputText(''); setSessionsModal(false);
  };

  const switchSession = async sessionId => {
    if (isBusy) return Alert.alert('Please Wait', 'Finish the current response before changing sessions.');
    setActiveSessionId(sessionId); setTargetChar(null); setInputText(''); setSessionsModal(false);
    await AsyncStorage.setItem(STORAGE_KEYS.activeSessionId, sessionId);
  };

  const deleteSession = async sessionId => {
    if (isBusy) return;
    let next = sessions.filter(session => session.id !== sessionId);
    if (!next.length) next = [createSession()];
    const nextActive = sessionId === activeSessionId ? next[0].id : activeSessionId;
    await commitSessions(next, nextActive);
  };

  const saveSettings = async draft => {
    try {
      const clean = sanitizeSettings(draft, VALID_IDENTITIES);
      setSettings(clean); setTargetChar(current => current?.key === clean.playAsCharacterKey ? null : current);
      await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(clean));
      setSettingsModal(false); Alert.alert('Settings Saved', 'Identity, model assignments, and API keys were updated.');
    } catch (_error) { Alert.alert('Error', 'Could not save settings.'); }
  };

  const selectPlayAs = async key => {
    const clean = sanitizeSettings({ ...settings, playAsCharacterKey: key }, VALID_IDENTITIES);
    setSettings(clean); setTargetChar(current => current?.key === key ? null : current);
    await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(clean));
  };

  const pickResponders = async text => {
    if (targetChar) return [targetChar.key];
    const candidates = aiCrew.map(character => character.key);
    if (!candidates.length) return [];
    const fallback = [candidates[Math.floor(Math.random() * candidates.length)]];
    const summary = aiCrew.map(character => `${character.key} (${character.name}, ${character.role})`).join('; ');
    const prompt = `You route a roleplay scene on the Thousand Sunny.\nThe human controls: ${identity.name} (${identity.role}). Never select that character.\nTheir dialogue: "${text}"\nAI-controlled characters: ${summary}\nChoose the 1 or 2 characters who would respond most naturally. Output ONLY JSON: {"responders":["key1"]}\nValid keys: ${candidates.join(', ')}`;
    try {
      const content = await requestChatCompletion({ settings, modelSetting: settings.routerModel, messages: [{ role: 'user', content: prompt }], temperature: 0, maxTokens: 80 });
      const parsed = parseRouterResponse(content, candidates);
      return parsed.length ? parsed : fallback;
    } catch (error) { console.warn('Router fallback:', error.message); return fallback; }
  };

  const getCharacterReply = async (character, userText, alreadyReplied) => {
    const recentContext = messages.filter(message => message.kind === 'dialogue').slice(-8).map(message => `${message.speaker}: ${message.text}`).join('\n');
    const system = `You are ${character.name}, the ${character.role} of the Straw Hat crew aboard the Thousand Sunny. ${character.description} Personality: ${character.personality}\nThe human controls ${identity.name}${settings.playAsCharacterKey === 'guest' ? ' as a guest' : `, the ${identity.role}`}. Never speak, act, decide, or narrate for the human-controlled identity.\nRules: spoken dialogue only; no asterisks or narration; stay fully in character; use 1–3 short sentences; never mention AI.${alreadyReplied.length ? ` Others who just replied: ${alreadyReplied.join(', ')}.` : ''}`;
    const user = `${recentContext ? `Recent conversation:\n${recentContext}\n` : ''}${identity.name} says${targetChar ? ` to ${targetChar.name}` : ''}: "${userText}"`;
    return requestChatCompletion({ settings, modelSetting: settings.chatModel, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.85, maxTokens: 170 });
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isBusy || !activeSession) return;
    setInputText(''); setIsBusy(true);
    const userMessage = { id: `msg_${Date.now()}_user`, kind: 'dialogue', speaker: identity.name, role: identity.role, avatar: identity.avatar, characterKey: identity.key, isPlayer: true, text, shout: isShout, target: targetChar?.name || null, timestamp: Date.now() };
    setIsShout(false);
    setSessions(current => {
      const next = current.map(session => session.id !== activeSessionId ? session : { ...session, title: session.title === 'New Deck Chat' ? titleFromMessage(text) : session.title, updatedAt: Date.now(), messages: [...session.messages, userMessage] });
      AsyncStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(next)).catch(console.warn); return next;
    });

    try {
      const responders = await pickResponders(text); const already = [];
      for (const key of responders) {
        const character = STRAW_HAT_CREW.find(member => member.key === key); if (!character) continue;
        setTypingName(character.name); await new Promise(resolve => setTimeout(resolve, 450));
        let reply;
        try { reply = await getCharacterReply(character, text, already); }
        catch (error) { reply = `[Response error: ${error.message}]`; }
        finally { setTypingName(null); }
        updateActiveMessages(current => [...current, { id: `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`, kind: 'dialogue', speaker: character.name, role: character.role, avatar: character.avatar, characterKey: character.key, isPlayer: false, text: reply, timestamp: Date.now() }]);
        already.push(character.name);
      }
    } finally { setTypingName(null); setIsBusy(false); }
  };

  if (!loaded) return <SafeAreaView style={styles.safeArea}><StatusBar barStyle="light-content" backgroundColor="#0d0b09" /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0b09" />
      <Header identity={identity} onNew={startNewSession} onSessions={() => setSessionsModal(true)} onCrew={() => setCrewModal(true)} onSettings={() => setSettingsModal(true)} />
      <TargetBar characters={aiCrew} target={targetChar} onSelect={setTargetChar} />
      <MessageList messages={messages} typingName={typingName} listRef={flatListRef} />
      <ChatInput identity={identity} target={targetChar} inputText={inputText} onChangeText={setInputText} isShout={isShout} onToggleShout={() => setIsShout(value => !value)} isBusy={isBusy} onSend={handleSend} />
      <SettingsModal visible={settingsModal} settings={settings} onClose={() => setSettingsModal(false)} onSave={saveSettings} />
      <SessionsModal visible={sessionsModal} sessions={sessions} activeSessionId={activeSessionId} onClose={() => setSessionsModal(false)} onNew={startNewSession} onSwitch={switchSession} onDelete={deleteSession} />
      <CrewModal visible={crewModal} playAsCharacterKey={settings.playAsCharacterKey} onPlayAs={selectPlayAs} onClose={() => setCrewModal(false)} />
    </SafeAreaView>
  );
}
