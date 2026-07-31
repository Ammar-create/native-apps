import { DEFAULT_SETTINGS, PROVIDERS } from '../constants/config';

const LEGACY_AQUA_MODEL_ALIASES = {
  'deepseek-v4-flash': 'deepseek-v4',
  'deepseek-v4-pro-flash': 'deepseek-v4-pro',
  'deepseek v4': 'deepseek-v4',
  'deepseek-v3': 'deepseek-v3.2',
  'gpt5-nano': 'gpt-5-nano'
};

export function parseModel(value, fallback = DEFAULT_SETTINGS.chatModel) {
  const raw = String(value || fallback).trim();
  const separator = raw.indexOf(':');
  const provider = separator < 0 ? 'aqua' : raw.slice(0, separator).trim().toLowerCase();
  let model = separator < 0 ? raw : raw.slice(separator + 1).trim();

  if (!model) model = 'agnes';
  if (provider === 'aqua') model = LEGACY_AQUA_MODEL_ALIASES[model.toLowerCase()] || model;

  return { provider: provider || 'aqua', model };
}

export function normalizeModelSetting(value, fallback) {
  const { provider, model } = parseModel(value, fallback);
  return `${provider}:${model}`;
}

export function sanitizeSettings(value, validCharacterKeys = []) {
  const merged = { ...DEFAULT_SETTINGS, ...(value || {}) };
  const playAsCharacterKey = validCharacterKeys.includes(merged.playAsCharacterKey)
    ? merged.playAsCharacterKey
    : 'guest';

  return {
    ...merged,
    aquaKey: String(merged.aquaKey || '').trim(),
    groqKey: String(merged.groqKey || '').trim(),
    openaiKey: String(merged.openaiKey || '').trim(),
    routerModel: normalizeModelSetting(merged.routerModel, DEFAULT_SETTINGS.routerModel),
    chatModel: normalizeModelSetting(merged.chatModel, DEFAULT_SETTINGS.chatModel),
    playAsCharacterKey,
    guestName: String(merged.guestName || 'Player').trim() || 'Player'
  };
}

export function resolveModel(settings, modelSetting) {
  const parsed = parseModel(modelSetting);
  const provider = PROVIDERS[parsed.provider];
  if (!provider) throw new Error(`Unsupported provider "${parsed.provider}". Use aqua:, groq:, or openai:.`);

  return {
    ...parsed,
    providerConfig: provider,
    apiKey: settings[provider.keyName] || ''
  };
}
