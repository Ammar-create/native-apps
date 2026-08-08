# SunnyDeck — Agent Notes

Project state as of **2026-08-08**. Commit `7f16ce3 Violet Hour redesign` + **Motion & SVG Polish Pass**.

## What this app is
React Native roleplay app on the Thousand Sunny (Expo SDK 51, RN 0.74.5). Player picks (or creates) an identity, chats with the Straw Hat crew. The AI decides who replies (router model), then each chosen character replies in voice (chat model). UI = **Violet Hour** theme (M3 Expressive palette, exact values from the Stitch violet-hour screens).

## Motion & Micro-Interactions (August 8, 2026 Polish)
- **`MotionPressable`** (`src/components/MotionPressable.js`): Tactile press scale feedback (`scale(0.96)`) using React Native `Animated.spring` on all buttons, tabs, identity tiles, session cards, chips, and input controls. Eliminates motionless "glued" feel.
- **Sliding Tab Navigation** (`src/components/BottomNav.js`): Fixed tab width and padding so text/icons never jump. Smooth sliding active indicator pill powered by `Animated.spring` (`stiffness: 260, damping: 24`).
- **Target Chip Layout Stability** (`src/components/ChatView.js`): Avatar position strictly fixed. Checkmark indicator animated via `checkWidth` (0 → 20px), scale (0.5 → 1.0), and opacity. ZERO horizontal icon jumping on click.
- **Identity Grid Polish** (`src/components/SettingsScreen.js`): Tiles use constant `borderWidth: 2` across selected and unselected states (prevents 1px jitter). Selected badge scales into view with spring physics (`scale: 0.8 → 1.0`).
- **Screen Transitions** (`App.js`): Kowalski ease-out screen transition (`cubic-bezier(0.23, 1, 0.32, 1)`) between Deck and Settings (Settings slides up from `translateY: 40` while Deck smoothly scales to `0.97` and fades out).
- **Pure Vector SVGs** (`src/components/CharacterIcon.js`): Removed all text emojis. Character identities render crisp vector icons (`@expo/vector-icons`: FontAwesome5, MaterialCommunityIcons, MaterialIcons).
- **Message Rise Entrance** (`src/components/ChatView.js`): New chat bubbles enter with slide-up + fade-in animation (`translateY: 14 → 0`, `opacity: 0 → 1` over 220ms).

## Layout
```
App.js                    212 lines — state, persistence, handleSend, screen transitions, two LLM call sites
src/
  components/
    BottomNav.js          2-tab bottom nav with Animated spring sliding pill indicator
    CharacterIcon.js      Vector SVG icon mapper (@expo/vector-icons) replacing all text emojis
    ChatView.js           ChatInput, MessageList (with rise animation), TargetBar (fixed layout target chips)
    Feedback.js           FeedbackProvider + useFeedback() → { showToast, confirm } (no native alerts)
    MotionPressable.js    Reusable spring pressable component (scale 0.96 feedback)
    SessionsDrawer.js     left slide-in drawer (animated spring), long-press delete, confirm dialog
    SettingsScreen.js     identity grid (constant geometry + spring badges) + model assignments + API keys
    TopBar.js             medallion (vector SVG), "SUNNY DECK" / "Playing as X", + / forum / tune buttons
  constants/
    config.js             DEFAULT_SETTINGS, PROVIDERS, STORAGE_KEYS
  data/
    characters.js         STRAW_HAT_CREW (10), GUEST_CHARACTER, getCharacter, getAiCrew (clean vector keys)
  utils/
    api.js                requestChatCompletion
    models.js             parseModel, sanitizeSettings, resolveModel
    sessions.js           createSession, titleFromMessage, sessionPreview, formatRelativeTime
  fonts.js                useSunnyDeckFonts() via expo-font (10 local TTFs)
  theme.js                palette (Violet Hour), fonts, radius
  styles.js               345 lines, consumes theme tokens, constant layout dimensions
assets/fonts/             10 TTFs: SpaceGrotesk (4), Roboto (3), RobotoMono (3)
```

## Two-call LLM flow
- Router (`pickResponders` in App.js) & Character Reply (`getCharacterReply` in App.js) unchanged.

## Validation Status
- AST Syntax Validation: 17/17 codebase files passed 100%.
- Expo Web Build check: Clean.
