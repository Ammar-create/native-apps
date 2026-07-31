export const STORAGE_KEYS = {
  settings: 'sunny_settings',
  sessions: 'sunny_sessions_v2',
  activeSessionId: 'sunny_active_session_id_v2'
};

export const DEFAULT_SETTINGS = {
  aquaKey: '',
  groqKey: '',
  openaiKey: '',
  routerModel: 'aqua:agnes',
  chatModel: 'aqua:agnes',
  playAsCharacterKey: 'guest',
  guestName: 'Player'
};

export const PROVIDERS = {
  aqua: { label: 'Aqua AIR', base: 'https://api.aquadevs.com/v1', keyName: 'aquaKey' },
  groq: { label: 'Groq', base: 'https://api.groq.com/openai/v1', keyName: 'groqKey' },
  openai: { label: 'OpenAI', base: 'https://api.openai.com/v1', keyName: 'openaiKey' }
};
