import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, Path, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { SceneId } from '../data/story';

interface SceneCfg {
  from: string;
  to: string;
  accent: string;
  icon: keyof typeof Ionicons.glyphMap;
  kind: 'office' | 'city' | 'stage' | 'desk' | 'room';
}

const SCENES: Record<SceneId, SceneCfg> = {
  waiting_room: { from: '#1B2735', to: '#0E1620', accent: '#FFC83D', icon: 'business', kind: 'office' },
  open_office: { from: '#243B55', to: '#101D2B', accent: '#5AC8FA', icon: 'people', kind: 'office' },
  conference: { from: '#33274A', to: '#160F26', accent: '#C084FC', icon: 'easel', kind: 'office' },
  email_desk: { from: '#234E52', to: '#10262A', accent: '#34D399', icon: 'mail', kind: 'desk' },
  manager_office: { from: '#3A2E22', to: '#1A130C', accent: '#FFC83D', icon: 'briefcase', kind: 'office' },
  video_call: { from: '#1E3A5F', to: '#0C1A2B', accent: '#60A5FA', icon: 'videocam', kind: 'desk' },
  stage: { from: '#3F1D38', to: '#1A0A18', accent: '#F472B6', icon: 'mic', kind: 'stage' },
  night_office: { from: '#0F1B2D', to: '#060B14', accent: '#38BDF8', icon: 'moon', kind: 'room' },
  ceo_office: { from: '#26344A', to: '#0B1118', accent: '#FFC83D', icon: 'trophy', kind: 'city' },
  dark_room: { from: '#15151A', to: '#050507', accent: '#FFC83D', icon: 'bulb', kind: 'room' },
};

export function StoryScene({
  scene,
  revealed = true,
  height = 220,
}: {
  scene: SceneId;
  revealed?: boolean;
  height?: number;
}) {
  const cfg = SCENES[scene];
  const W = 360;
  const H = 220;

  return (
    <View style={[styles.wrap, { height }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={cfg.from} />
            <Stop offset="1" stopColor={cfg.to} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={W} height={H} fill="url(#bg)" />

        {/* setting-specific backdrop */}
        {cfg.kind === 'city' && <CityScape accent={cfg.accent} W={W} H={H} />}
        {cfg.kind === 'office' && <OfficeScape accent={cfg.accent} W={W} H={H} />}
        {cfg.kind === 'desk' && <DeskScape accent={cfg.accent} W={W} H={H} />}
        {cfg.kind === 'stage' && <StageScape accent={cfg.accent} W={W} H={H} />}
        {cfg.kind === 'room' && <RoomScape accent={cfg.accent} W={W} H={H} />}
      </Svg>

      {/* focal icon */}
      <View style={styles.center} pointerEvents="none">
        <View style={[styles.iconBubble, { backgroundColor: cfg.accent + '22', borderColor: cfg.accent + '55' }]}>
          <Ionicons name={cfg.icon} size={36} color={cfg.accent} />
        </View>
      </View>

      {!revealed && (
        <View style={styles.lock} pointerEvents="none">
          <Ionicons name="lock-closed" size={26} color="#fff" />
          <Text style={styles.lockText}>Sahneyi açmak için soruları çöz</Text>
        </View>
      )}
    </View>
  );
}

function CityScape({ accent, W, H }: { accent: string; W: number; H: number }) {
  const bars = [40, 90, 130, 175, 215, 260, 300];
  return (
    <G>
      {bars.map((x, i) => (
        <Rect key={i} x={x} y={H - (60 + (i % 3) * 30)} width={26} height={60 + (i % 3) * 30} rx={3} fill="#FFFFFF14" />
      ))}
      <Circle cx={300} cy={44} r={20} fill={accent + '55'} />
    </G>
  );
}

function OfficeScape({ accent, W, H }: { accent: string; W: number; H: number }) {
  return (
    <G>
      {[30, 110, 190, 270].map((x, i) => (
        <Rect key={i} x={x} y={40} width={60} height={44} rx={4} fill="#FFFFFF12" />
      ))}
      <Rect x={0} y={H - 36} width={W} height={36} fill="#00000033" />
      <Rect x={130} y={H - 70} width={100} height={34} rx={4} fill={accent + '33'} />
    </G>
  );
}

function DeskScape({ accent, W, H }: { accent: string; W: number; H: number }) {
  return (
    <G>
      <Rect x={0} y={H - 50} width={W} height={50} fill="#00000033" />
      <Rect x={120} y={70} width={120} height={74} rx={6} fill="#FFFFFF14" />
      <Rect x={132} y={82} width={96} height={50} rx={3} fill={accent + '33'} />
      <Rect x={150} y={H - 60} width={60} height={12} rx={3} fill="#FFFFFF12" />
    </G>
  );
}

function StageScape({ accent, W, H }: { accent: string; W: number; H: number }) {
  return (
    <G>
      <Path d={`M40 0 L120 ${H} L20 ${H} Z`} fill={accent + '18'} />
      <Path d={`M320 0 L240 ${H} L340 ${H} Z`} fill={accent + '18'} />
      <Rect x={0} y={H - 30} width={W} height={30} fill="#00000044" />
      <Circle cx={W / 2} cy={40} r={16} fill={accent + '55'} />
    </G>
  );
}

function RoomScape({ accent, W, H }: { accent: string; W: number; H: number }) {
  return (
    <G>
      <Circle cx={W / 2} cy={70} r={70} fill={accent + '14'} />
      <Rect x={0} y={H - 34} width={W} height={34} fill="#00000044" />
      <Rect x={W / 2 - 20} y={H - 64} width={40} height={30} rx={4} fill="#FFFFFF12" />
    </G>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', borderRadius: 20, overflow: 'hidden', backgroundColor: '#0E1620' },
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  iconBubble: { width: 72, height: 72, borderRadius: 36, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  lock: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000000AA', alignItems: 'center', justifyContent: 'center', gap: 8 },
  lockText: { color: '#fff', fontFamily: 'Inter_500Medium', fontSize: 13 },
});
