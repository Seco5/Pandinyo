import { ImageSourcePropType } from 'react-native';

// Single character: Pandinyo (suited, professional panda). Character selection
// has been removed — every story screen shows this one character.
export const PANDINYO_SUIT: ImageSourcePropType = require('../assets/story/pandinyo_suit.png');

// Kept for backwards compatibility with old call sites; always returns Pandinyo.
export function characterImage(_id?: unknown): ImageSourcePropType {
  return PANDINYO_SUIT;
}
