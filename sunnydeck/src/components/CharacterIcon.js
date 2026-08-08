import React from 'react';
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const ICON_MAP = {
  luffy: { library: FontAwesome5, name: 'drumstick-bite', defaultColor: '#ffb59d' },
  zoro: { library: MaterialCommunityIcons, name: 'sword-cross', defaultColor: '#98d2c8' },
  nami: { library: MaterialIcons, name: 'explore', defaultColor: '#ffdfa7' },
  usopp: { library: MaterialIcons, name: 'track-changes', defaultColor: '#ffb59d' },
  sanji: { library: FontAwesome5, name: 'utensils', defaultColor: '#ffdfa7' },
  chopper: { library: MaterialIcons, name: 'medical-services', defaultColor: '#e8deff' },
  robin: { library: MaterialIcons, name: 'auto-stories', defaultColor: '#98d2c8' },
  franky: { library: MaterialIcons, name: 'handyman', defaultColor: '#e8deff' },
  brook: { library: MaterialIcons, name: 'music-note', defaultColor: '#ffdfa7' },
  jinbe: { library: MaterialIcons, name: 'waves', defaultColor: '#98d2c8' },
  guest: { library: FontAwesome5, name: 'flag', defaultColor: '#e8deff' },
};

export default function CharacterIcon({ characterKey, size = 20, color, style }) {
  const spec = ICON_MAP[characterKey] || ICON_MAP.guest;
  const IconComponent = spec.library;
  return <IconComponent name={spec.name} size={size} color={color || spec.defaultColor} style={style} />;
}
