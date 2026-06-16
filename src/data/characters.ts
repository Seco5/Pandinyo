import { ImageSourcePropType } from 'react-native';

export type CharacterId = 'alex' | 'sara';

export interface Character {
  id: CharacterId;
  name: string;
  tagline: string;
  image: ImageSourcePropType;
}

export const characters: Character[] = [
  { id: 'alex', name: 'Alex', tagline: 'Hırslı, kararlı', image: require('../assets/story/alex_male.png') },
  { id: 'sara', name: 'Sara', tagline: 'Zeki, soğukkanlı', image: require('../assets/story/sara_female.png') },
];

export function characterImage(id: CharacterId | string | undefined): ImageSourcePropType {
  return (characters.find((c) => c.id === id) ?? characters[0]).image;
}
