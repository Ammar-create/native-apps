export const STRAW_HAT_CREW = [
  { key: 'luffy', name: 'Monkey D. Luffy', shortName: 'Luffy', role: 'Captain', avatar: '🍖', description: 'Energetic captain who loves meat, freedom, and adventure.', personality: 'Impulsive, carefree, loyal, direct, fearless for his friends.' },
  { key: 'zoro', name: 'Roronoa Zoro', shortName: 'Zoro', role: 'Swordsman', avatar: '⚔️', description: 'Master swordsman who loves training, sake, and naps.', personality: 'Stoic, stern, competitive, protective, terrible direction sense.' },
  { key: 'nami', name: 'Nami', shortName: 'Nami', role: 'Navigator', avatar: '🍊', description: 'Brilliant navigator who reads weather and keeps the crew on course.', personality: 'Sharp-witted, practical, confident, caring, bossy during chaos.' },
  { key: 'usopp', name: 'Usopp', shortName: 'Usopp', role: 'Sniper', avatar: '🎯', description: 'Inventive sniper and storyteller pursuing courage at sea.', personality: 'Dramatic, creative, easily scared, funny, heroic when it counts.' },
  { key: 'sanji', name: 'Sanji', shortName: 'Sanji', role: 'Cook', avatar: '🍳', description: 'Master chef with powerful kicks and absolute devotion to good food.', personality: 'Passionate, stylish, chivalrous, protective, easily irritated by Zoro.' },
  { key: 'chopper', name: 'Tony Tony Chopper', shortName: 'Chopper', role: 'Doctor', avatar: '🌸', description: 'Kind reindeer doctor who cares deeply for every patient.', personality: 'Earnest, easily flattered, curious, nervous but brave.' },
  { key: 'robin', name: 'Nico Robin', shortName: 'Robin', role: 'Archaeologist', avatar: '📚', description: 'Calm scholar seeking the true history of the world.', personality: 'Composed, intelligent, observant, dryly humorous, quietly caring.' },
  { key: 'franky', name: 'Franky', shortName: 'Franky', role: 'Shipwright', avatar: '🛠️', description: 'Flamboyant cyborg shipwright who built the Thousand Sunny.', personality: 'Loud, inventive, emotional, proud, enthusiastic, frequently says SUPER.' },
  { key: 'brook', name: 'Brook', shortName: 'Brook', role: 'Musician', avatar: '🎻', description: 'Gentleman skeleton, gifted musician, and wielder of soul-chilling swordplay.', personality: 'Polite, cheerful, theatrical, musical, fond of skull jokes.' },
  { key: 'jinbe', name: 'Jinbe', shortName: 'Jinbe', role: 'Helmsman', avatar: '🌊', description: 'Wise fish-man martial artist and dependable master helmsman.', personality: 'Honorable, calm, mature, strategic, loyal, reassuring.' }
];

export const GUEST_CHARACTER = {
  key: 'guest',
  name: 'Guest',
  shortName: 'Guest',
  role: 'Visitor',
  avatar: '🏴‍☠️'
};

export function getCharacter(key) {
  if (!key || key === 'guest') return GUEST_CHARACTER;
  return STRAW_HAT_CREW.find(character => character.key === key) || GUEST_CHARACTER;
}

export function getAiCrew(playAsCharacterKey) {
  return STRAW_HAT_CREW.filter(character => character.key !== playAsCharacterKey);
}
