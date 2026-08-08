import { Platform, StyleSheet } from 'react-native';
import { fonts, palette, radius } from './theme';

export const colors = palette;

const FONT = {
  display: { fontFamily: fonts.display },
  displaySemi: { fontFamily: fonts.displaySemiBold },
  displayMed: { fontFamily: fonts.displayMedium },
  body: { fontFamily: fonts.body },
  bodyMed: { fontFamily: fonts.bodyMedium },
  bodyBold: { fontFamily: fonts.bodyBold },
  mono: { fontFamily: fonts.mono },
  monoMed: { fontFamily: fonts.monoMedium },
  monoBold: { fontFamily: fonts.monoBold }
};

const glow = (color, opacity = 0.45, radiusPx = 16) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: opacity,
  shadowRadius: radiusPx,
  elevation: 6
});

export default StyleSheet.create({
  // ---------- Root ----------
  safeArea: { flex: 1, backgroundColor: palette.background },

  // ---------- Top App Bar ----------
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.surfaceContainer,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(72,69,78,0.35)'
  },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  medallion: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: palette.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12
  },
  medallionText: { fontSize: 20 },
  topBarTitles: { flex: 1 },
  topBarTitle: { ...FONT.displaySemi, color: palette.onSurface, fontSize: 20, letterSpacing: -0.3 },
  topBarSubtitle: { ...FONT.monoMed, color: palette.primary, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginTop: 1 },
  topBarActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  topBarBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  topBarBtnPressed: { backgroundColor: palette.surfaceVariant },

  // ---------- Target Rail (filter chips) ----------
  targetBar: { backgroundColor: palette.surfaceDim, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(72,69,78,0.25)' },
  targetRail: { paddingHorizontal: 16 },
  targetChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: palette.surfaceContainerHighest,
    borderWidth: 1, borderColor: palette.outlineVariant,
    borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9,
    marginRight: 10
  },
  targetChipActive: {
    backgroundColor: palette.secondaryContainer,
    borderColor: 'rgba(152,210,200,0.35)',
    ...glow(palette.secondary, 0.35, 18)
  },
  targetCheckSlot: { overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  targetChipIcon: { fontSize: 16 },
  targetChipText: { ...FONT.monoMed, color: palette.onSurface, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', marginLeft: 6 },
  targetChipTextActive: { color: palette.onSecondaryContainer },
  targetCheck: { fontSize: 15, color: palette.onSecondaryContainer },

  // ---------- Message Timeline ----------
  listContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24 },

  systemBanner: { alignSelf: 'center', backgroundColor: palette.surfaceContainerLow, borderWidth: 1, borderColor: 'rgba(72,69,78,0.4)', borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 6, marginVertical: 10 },
  systemText: { ...FONT.monoMed, color: palette.onSurfaceVariant, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center' },

  msgRow: { marginVertical: 8, maxWidth: '88%' },
  crewRow: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  playerRow: { alignSelf: 'flex-end', alignItems: 'flex-end' },

  msgHeader: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4, gap: 4 },
  msgHeaderLeft: { justifyContent: 'flex-start' },
  msgHeaderRight: { justifyContent: 'flex-end' },
  msgAvatar: { fontSize: 13, marginRight: 4 },
  speakerName: { ...FONT.monoMed, color: palette.secondary, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: '700' },
  speakerNamePlayer: { ...FONT.monoMed, color: palette.primary, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: '700' },
  roleText: { ...FONT.mono, color: palette.onSurfaceVariant, fontSize: 10, marginLeft: 4, letterSpacing: 0.5, textTransform: 'uppercase' },
  roleTextPlayer: { ...FONT.mono, color: palette.onSurfaceVariant, fontSize: 10, marginRight: 4, letterSpacing: 0.5, textTransform: 'uppercase' },

  shoutBadge: {
    ...FONT.monoBold, backgroundColor: palette.tertiary, color: palette.onTertiary,
    fontSize: 10, letterSpacing: 0.5, paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: radius.pill, marginLeft: 4,
    ...glow(palette.tertiary, 0.5, 10)
  },
  targetBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(152,210,200,0.12)', borderWidth: 1, borderColor: 'rgba(152,210,200,0.35)',
    borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 4
  },
  targetBadgeIcon: { fontSize: 11, color: palette.secondary },
  targetBadgeText: { ...FONT.monoBold, color: palette.secondary, fontSize: 9, letterSpacing: 0.4 },

  bubble: { borderRadius: radius.bubble, padding: 14 },
  crewBubble: { backgroundColor: palette.surfaceContainerHigh, borderLeftWidth: 2, borderLeftColor: 'rgba(152,210,200,0.5)', borderBottomLeftRadius: 4 },
  playerBubble: { backgroundColor: palette.primaryContainer, borderBottomRightRadius: 4, ...glow(palette.primary, 0.35, 18) },
  msgText: { ...FONT.body, color: palette.onSurface, fontSize: 15, lineHeight: 21 },
  msgTextPlayer: { ...FONT.body, color: palette.onPrimaryContainer, fontSize: 15, lineHeight: 21 },
  timestamp: { ...FONT.mono, color: palette.onSurfaceVariant, fontSize: 10, marginTop: 4, textTransform: 'uppercase' },

  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 6 },
  typingText: { ...FONT.monoBold, color: palette.secondary, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  typingDots: { flexDirection: 'row', gap: 4 },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.secondary },

  // ---------- Input Dock ----------
  inputWrap: { backgroundColor: palette.surfaceContainerLowest, paddingTop: 10, paddingBottom: 10 },
  inputDock: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: palette.surfaceContainerLow,
    borderWidth: 1, borderColor: 'rgba(72,69,78,0.4)',
    borderRadius: radius.pill, padding: 6,
    marginHorizontal: 16,
    ...glow('#000', 0.35, 14)
  },
  shoutBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  shoutBtnActive: { backgroundColor: palette.tertiary, ...glow(palette.tertiary, 0.5, 12) },
  shoutBtnInactive: { backgroundColor: palette.surfaceVariant },
  shoutIcon: { fontSize: 20 },
  shoutIconActive: { color: palette.onTertiary },
  shoutIconInactive: { color: palette.onSurfaceVariant },
  input: { flex: 1, paddingHorizontal: 12, ...FONT.body, color: palette.onSurface, fontSize: 15 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.primaryContainer, ...glow(palette.primary, 0.45, 14) },
  sendBtnDisabled: { opacity: 0.5 },
  sendIcon: { fontSize: 20, color: palette.onPrimaryContainer },

  // ---------- Bottom Navigation ----------
  bottomNavContainer: {
    position: 'relative',
    backgroundColor: palette.surfaceContainerLowest,
    borderTopWidth: 1, borderTopColor: palette.outlineVariant,
    borderTopLeftRadius: radius.nav, borderTopRightRadius: radius.nav,
    paddingTop: 8, paddingBottom: 10, paddingHorizontal: 16
  },
  bottomNavTrack: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', position: 'relative'
  },
  navActiveIndicator: {
    position: 'absolute',
    top: 0, bottom: 0, width: '48%',
    backgroundColor: palette.primaryContainer,
    borderRadius: radius.pill,
    ...glow(palette.primary, 0.35, 14)
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6, zIndex: 2 },
  navIcon: { fontSize: 22 },
  navIconActive: { color: palette.onPrimaryContainer },
  navIconInactive: { color: palette.onSurfaceVariant },
  navLabel: { ...FONT.monoMed, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 2 },
  navLabelActive: { color: palette.onPrimaryContainer },
  navLabelInactive: { color: palette.onSurfaceVariant },

  // ---------- Sessions Drawer ----------
  drawerScrim: { flex: 1, backgroundColor: 'rgba(10,9,18,0.66)' },
  drawerPanel: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: '88%', maxWidth: 360,
    backgroundColor: palette.surface, paddingTop: 8
  },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  drawerHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  drawerMedallion: { width: 40, height: 40, borderRadius: 20, backgroundColor: palette.surfaceContainerHighest, alignItems: 'center', justifyContent: 'center' },
  drawerMedallionText: { fontSize: 20 },
  drawerTitle: { ...FONT.displaySemi, color: palette.primary, fontSize: 22, letterSpacing: 1.5, textTransform: 'uppercase' },
  drawerClose: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  drawerCloseIcon: { fontSize: 22, color: palette.onSurfaceVariant },
  drawerContent: { paddingHorizontal: 20, paddingBottom: 40 },

  sessionNewBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: palette.secondary, height: 56, borderRadius: 28,
    ...glow(palette.secondary, 0.3, 16)
  },
  sessionNewIcon: { fontSize: 22, color: palette.onSecondary },
  sessionNewText: { ...FONT.displayMed, color: palette.onSecondary, fontSize: 15, letterSpacing: 1, textTransform: 'uppercase' },
  longPressHint: { ...FONT.mono, color: palette.error, fontSize: 10, letterSpacing: 0.8, textAlign: 'center', opacity: 0.7, textTransform: 'uppercase', marginVertical: 12 },

  sessionCard: {
    borderRadius: radius.card, padding: 20,
    backgroundColor: palette.surfaceContainer,
    borderWidth: 2, borderColor: 'transparent',
    marginBottom: 12
  },
  sessionCardActive: { borderColor: palette.secondary, ...glow(palette.secondary, 0.3, 18) },
  activeBadge: {
    position: 'absolute', top: 12, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: palette.secondaryContainer,
    borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3
  },
  activeBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.onSecondaryContainer },
  activeBadgeText: { ...FONT.monoBold, color: palette.onSecondaryContainer, fontSize: 9, letterSpacing: 1.2 },
  sessionCardIconMedallion: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(152,210,200,0.18)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  sessionCardIcon: { fontSize: 18, color: palette.secondary },
  sessionCardTitle: { ...FONT.displayMed, color: palette.onSurface, fontSize: 16, flex: 1 },
  sessionMeta: { ...FONT.monoMed, color: palette.secondaryFixed, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 10 },
  sessionPreview: { ...FONT.body, color: palette.onSurfaceVariant, fontSize: 13, lineHeight: 18, marginTop: 6 },

  // ---------- Settings Screen ----------
  settingsScreen: { flex: 1, backgroundColor: palette.background },
  settingsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18 },
  settingsTitle: { ...FONT.displaySemi, color: palette.primary, fontSize: 26, letterSpacing: -0.5 },
  settingsClose: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  settingsCloseIcon: { fontSize: 24, color: palette.onSurfaceVariant },
  settingsScroll: { paddingHorizontal: 20, paddingBottom: 24 },

  settingsSection: { marginBottom: 28 },
  settingsSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  settingsSectionIcon: { fontSize: 20 },
  settingsSectionLabel: { ...FONT.monoBold, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' },

  identityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  identityTile: {
    width: '31%', aspectRatio: 1, borderRadius: 16,
    backgroundColor: palette.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'transparent', padding: 8
  },
  identityTileActive: { borderColor: palette.primaryContainer, ...glow(palette.primary, 0.35, 14) },
  identityTileEmoji: { fontSize: 26, marginBottom: 6 },
  identityTileName: { ...FONT.monoMed, color: palette.onSurface, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', textAlign: 'center' },
  selectedBadge: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: palette.primaryContainer, borderRadius: radius.pill,
    paddingHorizontal: 6, paddingVertical: 2
  },
  selectedBadgeText: { ...FONT.monoBold, color: palette.onPrimaryContainer, fontSize: 7, letterSpacing: 0.4 },

  settingsLabel: { ...FONT.mono, color: palette.onSurfaceVariant, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
  settingsInput: {
    ...FONT.monoMed, color: palette.onSurface,
    backgroundColor: palette.surfaceContainerLow,
    borderWidth: 1, borderColor: palette.outlineVariant,
    borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 13, marginBottom: 12
  },
  settingsHelper: { ...FONT.body, color: palette.onSurfaceVariant, fontSize: 12, lineHeight: 17, marginTop: -6, marginBottom: 10, marginLeft: 4, opacity: 0.8 },

  settingsFooter: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(31,30,40,0.92)',
    borderTopWidth: 1, borderTopColor: 'rgba(72,69,78,0.4)',
    paddingHorizontal: 20, paddingVertical: 12
  },
  settingsCancelBtn: { flex: 1, height: 48, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  settingsCancelText: { ...FONT.monoMed, color: palette.onSurfaceVariant, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  settingsSaveBtn: { flex: 2, height: 48, borderRadius: radius.pill, backgroundColor: palette.primaryContainer, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, ...glow(palette.primary, 0.4, 16) },
  settingsSaveText: { ...FONT.monoMed, color: palette.onPrimaryContainer, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  settingsSaveIcon: { fontSize: 16, color: palette.onPrimaryContainer }
});
