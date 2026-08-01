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
      text: 'Welcome aboard the Thousand Sunny. The moonlit deck awaits your story.',
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

export function formatRelativeTime(timestamp) {
  if (!timestamp) return 'JUST NOW';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'JUST NOW';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} MIN AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} HOUR${hours > 1 ? 'S' : ''} AGO`;
  const days = Math.floor(hours / 24);
  return `${days} DAY${days > 1 ? 'S' : ''} AGO`;
}
