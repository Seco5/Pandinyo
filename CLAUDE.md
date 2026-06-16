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
  - `exam/[id].tsx` — sınav hazırlık (TOEFL/IELTS/YDS/TOEIC) modül+ders listesi; `exam/lesson.tsx` gömülü içerikle ders çalıştırıcı
  - `lesson/[id].tsx` — ders tipine göre (vocab/quiz/dialogue/email) dispatcher
  - `lesson/result.tsx` — ders sonu (XP, seri, öğrenilenler)
- **State** — `src/state.tsx` tek `AppProvider` context (XP, streak, elmas, ilerleme, rozetler). AsyncStorage ile kalıcı (`src/storage.ts`).
- **Mod sistemi** — profil `goal`: `business` (İş Hayatı, sektör içeriği) | `exam` (Eğitim, sınav içeriği). Profil "Öğrenme Ayarları" kartından `updateLearning` ile mod/sektör/sınav değiştirilir. İlerleme mod-bazlı anahtarlanır: `workKey(sector,module)` = `w_<sector>_<module>`, `examKey(module)` = `e_<module>`.
- **Zengin içerik (full)** — `src/data/full/<sector>.json` + `src/data/full.ts`: yeni ders formatları (flashcard, fillInTheBlank, interviewQA, strategyDialogue, expressionMatch, emailWrite, presentationFlow). `hasFullContent(sector)` true ise modül/ders listesi buradan gelir, ders `app/learn/lesson.tsx` ile çalışır. Şu an sadece `tech` dolu; diğer sektörler eski havuz tabanlı (`content.ts`) formata düşer. Ders bileşenleri `src/components/lessons/`.
- **İçerik** — `src/data/` statik TS/JSON: `sectors`, `modules`, `content`/`sectorContent.json` (sektöre göre kelime/quiz/diyalog/e-posta), `badges`. Sınav hazırlık içeriği `examContent.json`, `exams.ts` ile normalize edilip aynı ders bileşenlerine beslenir.
- **Panda maskot** — `src/components/Panda.tsx`, seri/duruma göre kostüm (`src/panda.ts`), Reanimated bounce/shake (`celebrate()`/`shake()`).
- **Tasarım sistemi** — `src/theme.ts` (renkler, tipografi, gölge), `src/components/ui.tsx`.
- **Bildirim** — `src/notifications.ts` günlük seri hatırlatıcısı (expo-notifications).

## Notlar
- Panda Lottie yerine emoji + Reanimated ile temsil edilir (asset bağımlılığı yok).
- Diyalog/e-posta kelime-kelime karşılaştırması: `src/compare.ts`.
- Streak/XP/elmas hesabı `completeLesson` içinde (`src/state.tsx`).
