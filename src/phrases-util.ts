import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';

export function speakPhrase(text: string) {
  try {
    Speech.stop();
    Speech.speak(text, { language: 'en-GB', pitch: 1.0, rate: 0.85 });
  } catch {
    // no-op (e.g. unsupported platform)
  }
}

export async function copyPhrase(text: string): Promise<void> {
  try {
    await Clipboard.setStringAsync(text);
  } catch {
    // no-op
  }
}
