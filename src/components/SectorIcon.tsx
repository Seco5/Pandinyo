import React from 'react';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';

// Per-sector line icons, colored by `color`. Keyed by sector id (+ "exam").
export function SectorIcon({ id, color, size = 28 }: { id: string; color: string; size?: number }) {
  const sw = 1.6;
  const common = { width: size, height: size, viewBox: '0 0 28 28', fill: 'none' as const };

  switch (id) {
    case 'tech':
      return (
        <Svg {...common}>
          <Rect x="3" y="7" width="22" height="15" rx="2" stroke={color} strokeWidth={sw} />
          <Rect x="9" y="3" width="10" height="4" rx="1" stroke={color} strokeWidth={sw} />
          <Line x1="8" y1="13" x2="20" y2="13" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
          <Line x1="8" y1="17" x2="16" y2="17" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        </Svg>
      );
    case 'finance':
      return (
        <Svg {...common}>
          <Rect x="3" y="10" width="22" height="14" rx="2" stroke={color} strokeWidth={sw} />
          <Path d="M9 10V8C9 5.8 10.8 4 13 4H15C17.2 4 19 5.8 19 8V10" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Circle cx="14" cy="17" r="2.5" stroke={color} strokeWidth="1.4" />
          <Line x1="14" y1="14.5" x2="14" y2="12" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        </Svg>
      );
    case 'health':
      return (
        <Svg {...common}>
          <Path d="M14 4C14 4 7 7 7 13C7 17 10 20 14 21C18 20 21 17 21 13C21 7 14 4 14 4Z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
          <Line x1="14" y1="10" x2="14" y2="16" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Line x1="11" y1="13" x2="17" y2="13" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case 'retail':
      return (
        <Svg {...common}>
          <Path d="M5 20L8 9L14 7L20 9L23 20H5Z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
          <Line x1="5" y1="20" x2="23" y2="20" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M10 20V16C10 14.9 10.9 14 12 14H16C17.1 14 18 14.9 18 16V20" stroke={color} strokeWidth="1.4" />
          <Rect x="12" y="10" width="4" height="3" rx="0.5" stroke={color} strokeWidth="1.2" />
        </Svg>
      );
    case 'marketing':
      return (
        <Svg {...common}>
          <Circle cx="14" cy="10" r="4" stroke={color} strokeWidth={sw} />
          <Path d="M6 24C6 20.7 9.6 18 14 18C18.4 18 22 20.7 22 24" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Line x1="19" y1="4" x2="24" y2="4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
          <Line x1="19" y1="7" x2="24" y2="7" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
          <Line x1="19" y1="10" x2="24" y2="10" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        </Svg>
      );
    case 'aviation':
      return (
        <Svg {...common}>
          <Path d="M4 17L12 14L20 11L24 13V16L20 14.5L12 17.5L4 20.5V17Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
          <Path d="M20 11L22 7L24 7L24 13" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M4 17L4 22" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
          <Line x1="3" y1="22" x2="25" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <Circle cx="7" cy="19.5" r="1" fill={color} />
          <Circle cx="21" cy="15" r="1" fill={color} />
        </Svg>
      );
    case 'culinary':
      return (
        <Svg {...common}>
          <Path d="M6 22C6 22 7 14 14 12C21 10 22 22 22 22" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M10 22V18C10 16.3 11.8 15 14 15C16.2 15 18 16.3 18 18V22" stroke={color} strokeWidth="1.4" />
          <Circle cx="14" cy="9" r="3" stroke={color} strokeWidth="1.5" />
          <Path d="M11 7C11 7 10 5 12 4" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <Path d="M17 7C17 7 18 5 16 4" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        </Svg>
      );
    case 'exam':
      return (
        <Svg {...common}>
          <Rect x="4" y="4" width="20" height="20" rx="2" stroke={color} strokeWidth={sw} />
          <Line x1="4" y1="10" x2="24" y2="10" stroke={color} strokeWidth="1.4" />
          <Circle cx="9" cy="7" r="1.5" fill={color} />
          <Circle cx="19" cy="7" r="1.5" fill={color} />
          <Rect x="8" y="14" width="4" height="4" rx="1" stroke={color} strokeWidth="1.2" />
          <Rect x="16" y="14" width="4" height="4" rx="1" stroke={color} strokeWidth="1.2" />
        </Svg>
      );
    default:
      return (
        <Svg {...common}>
          <Circle cx="14" cy="14" r="9" stroke={color} strokeWidth={sw} />
        </Svg>
      );
  }
}
