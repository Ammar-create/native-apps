// SunnyDeck — Violet Hour theme
// Palette values taken EXACTLY from the Stitch violet-hour HTML screens (deck/settings).
// Only the sessions layout borrows Grand Line Teal's card structure — colors stay violet.

export const palette = {
  // Primary — moonlit lavender
  primary: '#e8deff',
  onPrimary: '#332959',
  primaryContainer: '#cdbffa',
  onPrimaryContainer: '#574b7e',
  primaryFixed: '#e7deff',
  primaryFixedDim: '#ccbef9',
  onPrimaryFixed: '#1e1243',
  onPrimaryFixedVariant: '#4a3f71',
  inversePrimary: '#62578b',

  // Secondary — seafoam teal
  secondary: '#98d2c8',
  onSecondary: '#003732',
  secondaryContainer: '#14524a',
  onSecondaryContainer: '#8ac3ba',
  secondaryFixed: '#b3eee4',
  secondaryFixedDim: '#98d2c8',
  onSecondaryFixed: '#00201c',
  onSecondaryFixedVariant: '#104f48',

  // Tertiary — lantern amber
  tertiary: '#ffdfa7',
  onTertiary: '#412d00',
  tertiaryContainer: '#eec069',
  onTertiaryContainer: '#6d4d00',
  tertiaryFixed: '#ffdea6',
  tertiaryFixedDim: '#edc069',
  onTertiaryFixed: '#271900',
  onTertiaryFixedVariant: '#5d4200',

  // Error
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',

  // Surface ladder
  surface: '#13121c',
  surfaceDim: '#13121c',
  surfaceBright: '#393843',
  surfaceContainerLowest: '#0e0d17',
  surfaceContainerLow: '#1b1a24',
  surfaceContainer: '#1f1e28',
  surfaceContainerHigh: '#2a2933',
  surfaceContainerHighest: '#35343e',
  surfaceVariant: '#35343e',
  onSurface: '#e5e0ef',
  onSurfaceVariant: '#cac4d0',
  background: '#13121c',
  onBackground: '#e5e0ef',

  // Outline / misc
  outline: '#938f99',
  outlineVariant: '#48454e',
  surfaceTint: '#ccbef9',
  inverseSurface: '#e5e0ef',
  inverseOnSurface: '#302f3a'
};

// Font families — loaded via expo-font from /assets/fonts
export const fonts = {
  display: 'SpaceGrotesk_700',
  displaySemiBold: 'SpaceGrotesk_600',
  displayMedium: 'SpaceGrotesk_500',
  displayRegular: 'SpaceGrotesk_400',
  body: 'Roboto_400',
  bodyMedium: 'Roboto_500',
  bodyBold: 'Roboto_700',
  mono: 'RobotoMono_400',
  monoMedium: 'RobotoMono_500',
  monoBold: 'RobotoMono_600'
};

export const radius = {
  card: 28,       // sessions cards (Grand Line Teal layout)
  sheet: 32,      // modal sheets
  bubble: 24,     // message bubbles
  nav: 20,        // bottom nav top corners
  pill: 999       // chips / inputs / buttons
};
