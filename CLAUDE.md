# Pandinyo

İş İngilizcesini Duolingo mantığıyla, GitHub-streak sistemiyle öğreten mobil uygulama (React Native + Expo).

## Çalıştırma
```bash
npm install
npx expo start --ios   # iOS simülatör
```

## Mimari
- **Expo Router** (`app/`) — dosya tabanlı navigasyon
  - `index.tsx` splash → onboarding veya tabs'a yönlendirir
  - `onboarding/` — sektör seçimi + 5 soruluk seviye testi
  - `(tabs)/` — Ana Sayfa, Kelimeler, Skor, Profil
  - `module/[id].tsx` — modüldeki ders listesi
  - `lesson/[id].tsx` — ders tipine göre (vocab/quiz/dialogue/email) dispatcher
  - `lesson/result.tsx` — ders sonu (XP, seri, öğrenilenler)
- **State** — `src/state.tsx` tek `AppProvider` context (XP, streak, elmas, ilerleme, rozetler). AsyncStorage ile kalıcı (`src/storage.ts`).
- **İçerik** — `src/data/` statik TS: `sectors`, `modules`, `content` (sektöre göre kelime/quiz/diyalog/e-posta), `badges`.
- **Panda maskot** — `src/components/Panda.tsx`, seri/duruma göre kostüm (`src/panda.ts`), Reanimated bounce/shake (`celebrate()`/`shake()`).
- **Tasarım sistemi** — `src/theme.ts` (renkler, tipografi, gölge), `src/components/ui.tsx`.
- **Bildirim** — `src/notifications.ts` günlük seri hatırlatıcısı (expo-notifications).

## Notlar
- Panda Lottie yerine emoji + Reanimated ile temsil edilir (asset bağımlılığı yok).
- Diyalog/e-posta kelime-kelime karşılaştırması: `src/compare.ts`.
- Streak/XP/elmas hesabı `completeLesson` içinde (`src/state.tsx`).
