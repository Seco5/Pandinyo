import { createAudioPlayer, AudioPlayer, setAudioModeAsync } from 'expo-audio';

// Lightweight feedback sounds for answers. Players are created lazily and
// reused; playing seeks back to the start so rapid answers still trigger.
let correctPlayer: AudioPlayer | null = null;
let wrongPlayer: AudioPlayer | null = null;
let configured = false;

function ensurePlayers() {
  if (!configured) {
    configured = true;
    // Play even when the device is on silent.
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }
  if (!correctPlayer) correctPlayer = createAudioPlayer(require('../assets/sounds/correct.wav'));
  if (!wrongPlayer) wrongPlayer = createAudioPlayer(require('../assets/sounds/wrong.wav'));
}

function play(player: AudioPlayer | null) {
  if (!player) return;
  try {
    player.seekTo(0);
    player.play();
  } catch {
    // ignore playback errors (e.g. running on web)
  }
}

export function playCorrect() {
  ensurePlayers();
  play(correctPlayer);
}

export function playWrong() {
  ensurePlayers();
  play(wrongPlayer);
}
