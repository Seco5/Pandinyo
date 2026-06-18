import React from 'react';
import Svg, { Path } from 'react-native-svg';

// Mor zümrüt (purple emerald) icon — replaces the old diamond icon everywhere.
export const ZUMRUT_COLOR = '#7C3AED';

export function ZumrutIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 3L2 9L12 21L22 9L18 3H6Z" fill="#7C3AED" />
      <Path d="M2 9H22M6 3L12 9L18 3M12 9L12 21" stroke="#5B21B6" strokeWidth={1.5} />
      <Path d="M9 3L12 9L15 3" fill="#9333EA" />
    </Svg>
  );
}
