# SunnyDeck — Agent Notes

Project state as of **2026-07-31**. Commit `7ffc97b SunnyDeck v2`.

## What this app is
React Native roleplay app on the Thousand Sunny. Player picks (or creates) an identity, chats with the Straw Hat crew. The AI decides who replies (router model), then each chosen character replies in voice (chat model).

## Layout
```
App.js                    194 lines — state, persistence, handleSend, two LLM call sites
src/
  components/
    Header.js
    ChatView.js           exports ChatInput, MessageList, TargetBar
    Modals.js             exports SettingsModal, SessionsModal, CrewModal
  constants/
    config.js             DEFAULT_SETTINGS, STORAGE_KEYS
  data/
    characters.js         STRAW_HAT_CREW, getCharacter, getAiCrew
  utils/
    api.js                requestChatCompletion (41 lines)
    models.js             resolveModel, sanitizeSettings, PROVIDER_CONFIG
    sessions.js           createSession, titleFromMessage
  styles.js
```

## Two-call LLM flow

### 1. Router (`pickResponders` in App.js)
- Model: `settings.routerModel`, temperature 0, max 80 tokens
- Prompt: scene framing + human-controlled identity (excluded) + single user line + candidate roster + "output ONLY JSON"
- Returns `{"responders":["key"]}`, parsed by `parseRouterResponse` (regex first `{...}`)
- Falls back to 1 random crew member on any failure
- **Bypassed entirely when `targetChar` is set** — direct reply

### 2. Character reply (`getCharacterReply` in App.js)
- Model: `settings.chatModel`, temperature 0.85, max 170 tokens
- System: identity + description + personality + rules + alreadyReplied names
- User: last 8 dialogue messages (`Speaker: text`) + user's current line
- Sequential per responder, 450ms typing delay
- `alreadyReplied` carries only NAMES — second responder doesn't see first responder's text yet

### Provider resolution
- `modelSetting` like `"aqua:agnes"` — split on `:`, prefix picks provider (base URL + API key), suffix is model ID
- Providers: `aqua` (AquaDevs), `openai`, `groq` — all OpenAI-compatible `/chat/completions`

## Known limitations (deliberate, not bugs)
1. Router has no history — only sees the current line
2. Character memory is session-scoped, capped at 8 messages
3. Second responder sees only the first's name, not reply text
4. Router JSON parsing tolerates markdown-fenced JSON but not pure-prose responses
5. Crew modal's ScrollView intercepts bottom-tab clicks in Playwright (not a real-device issue)

## Persistence
- `@sunnydeck/settings` — full settings object (sanitized on load + save)
- `@sunnydeck/sessions` — array of `{ id, title, messages[], updatedAt }`
- `@sunnydeck/activeSessionId` — current session pointer
- `sanitizeSettings(draft, VALID_IDENTITIES)` enforces `playAsCharacterKey ∈ ['guest', ...crew keys]`

## Test harness (Playwright)
```bash
# 1. Build web export to /tmp/sunnydeck-export
# 2. Serve: cd /tmp/sunnydeck-export && python3 -m http.server 8321 &
# 3. Run Playwright with:
#    executablePath: /root/.cache/ms-playwright/chromium-1228/chrome-linux/chrome
#    args: ['--no-sandbox']
#    NODE_PATH=/workspace/tools/node_modules
#    viewport: { width: 390, height: 844 }
```
- Always `{ exact: true }` on tab-bar `getByText` (the Crew modal contains "ALL CREW")
- `force: true` on tab clicks after opening any modal (overlay intercepts pointer events)
- Capture `pageerror` events — clean build should report "no errors"

## Parked plan: per-character memory system
Full plan in `/workspace/.Agent/learnings/FEATURE_REQUESTS.md` (entry 2026-07-31).
Three phases:
1. `src/utils/memory.js` — schema + AsyncStorage `@sunnydeck/character_memory`
2. `src/utils/memorySearch.js` — lexical match, inject into character-reply system prompt
3. Pass each responder's reply text into the next responder's context (replaces name-only `alreadyReplied`)

Parked 2026-07-31 by user request — want to commit v2 progress first.
