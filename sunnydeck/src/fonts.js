import { useFonts } from 'expo-font';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

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
  RobotoMono_600: require('../assets/fonts/RobotoMono_600SemiBold.ttf'),
  ...MaterialIcons.font,
  ...FontAwesome5.font,
  ...MaterialCommunityIcons.font,
  ...Ionicons.font,
};

export function useSunnyDeckFonts() {
  const [loaded, error] = useFonts(fontAssets);
  return { fontsLoaded: loaded, fontError: error };
}
