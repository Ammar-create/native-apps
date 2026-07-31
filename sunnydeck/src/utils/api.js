import { resolveModel } from './models';

async function readApiError(response) {
  const text = await response.text();
  if (!text) return '';
  try {
    const data = JSON.parse(text);
    return data?.error?.message || data?.message || text;
  } catch (_error) {
    return text;
  }
}

export async function requestChatCompletion({ settings, modelSetting, messages, temperature, maxTokens }) {
  const { provider, model, providerConfig, apiKey } = resolveModel(settings, modelSetting);
  if (!apiKey) throw new Error(`Add your ${providerConfig.label} API key in Settings for ${provider}:${model}.`);

  const response = await fetch(`${providerConfig.base}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    const details = await readApiError(response);
    throw new Error(`${provider}:${model} returned ${response.status}${details ? ` — ${details}` : ''}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error(`${provider}:${model} returned an empty response.`);
  return String(content).trim();
}
