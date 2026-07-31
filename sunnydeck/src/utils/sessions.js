export function createSession() {
  const now = Date.now();
  return {
    id: `session_${now}_${Math.random().toString(36).slice(2, 7)}`,
    title: 'New Deck Chat',
    createdAt: now,
    updatedAt: now,
    messages: [{
      id: `system_${now}`,
      kind: 'system',
      speaker: 'SYSTEM',
      text: 'SUNNY DECK // RETRO MOBILE INITIALIZED. Welcome aboard the Thousand Sunny.',
      timestamp: now
    }]
  };
}

export function titleFromMessage(text) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return 'New Deck Chat';
  return clean.length > 34 ? `${clean.slice(0, 34)}…` : clean;
}

export function sessionPreview(session) {
  const last = [...(session.messages || [])].reverse().find(message => message.kind !== 'system');
  return last?.text || 'No dialogue yet.';
}

export function formatSessionTime(timestamp) {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleString([], {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}
