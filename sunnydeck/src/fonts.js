import { useFonts } from 'expo-font';

const fontAssets = {
  SpaceGrotesk_400: require('../assets/fonts/SpaceGrotesk_400Regular.ttf'),
  SpaceGrotesk_500: require('../assets/fonts/SpaceGrotesk_500Medium.ttf'),
  SpaceGrotesk_600: require('../assets/fonts/SpaceGrotesk_600SemiBold.ttf'),
  SpaceGrotesk_700: require('../assets/fonts/SpaceGrotesk_700Bold.ttf'),
  Roboto_400: require('../assets/fonts/Roboto_400Regular.ttf'),
  Roboto_500: require('../assets/fonts/Roboto_500Medium.ttf'),
  Roboto_700: require('../assets/fonts/Roboto_700Bold.ttf'),
  RobotoMono_400: require('../assets/fonts/RobotoMono_400Regular.ttf'),
  RobotoMono_500: require('../assets/fonts/RobotoMono_500Medium.ttf'),
  RobotoMono_600: require('../assets/fonts/RobotoMono_600SemiBold.ttf')
};

export function useSunnyDeckFonts() {
  const [loaded, error] = useFonts(fontAssets);
  return { fontsLoaded: loaded, fontError: error };
}
