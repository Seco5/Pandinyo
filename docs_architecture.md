# Pandinyo — Yeni İçerik Mimarisi & Tam Spec

## 1. Mod Sistemi

Uygulama iki ana modda çalışır. Kullanıcı profil ekranından istediği zaman değiştirebilir.

```
MOD A → İş Hayatı Modu
  └── Sektör seçimi zorunlu (tech / finance / health / retail / marketing / culinary / aviation)
  └── Tüm içerik seçilen sektöre özel gelir

MOD B → Eğitim Modu
  └── Sektör seçimi yok
  └── Sınav hazırlığı içerikleri gelir (TOEFL / IELTS / YDS / TOEIC)
```

### Mod & Sektör Değiştirme Ekranı

Profil ekranında "Ayarlarım" kartı:

```
┌─────────────────────────────────┐
│  Mevcut mod                     │
│  ● İş Hayatı    ○ Eğitim       │
│                                 │
│  Sektörüm                       │
│  [Teknoloji / Yazılım  ▼]      │
│                                 │
│  [Kaydet]                       │
└─────────────────────────────────┘
```

Mod değişince:
- XP ve streak korunur
- Modül ilerlemesi sıfırlanmaz, her mod için ayrı saklanır
- AsyncStorage key: `mode_work_progress` ve `mode_exam_progress`

---

## 2. Modül Formatları

Her modülün kendine özgü ders tipi var. Aşağıdaki format mapping'e göre ders ekranları render edilecek.

### MODÜL 1 — Kelimeler
**Format:** Kart çevirme (flashcard)
- Ön yüz: İngilizce kelime + telaffuz ipucu
- Arka yüz: Türkçe anlam + örnek cümle (kelime highlight'lı)
- Kullanıcı: "Biliyorum ✓" veya "Tekrar göster ↺"
- Her ders: 10 kelime
- Spaced repetition: "Tekrar göster" seçilenlerin önce çıkar
- Her sektör için 50 kelime → 5 ders

### MODÜL 2 — Kendini Tanıtma
**Format:** Boşluk doldurma + sıralama
- Adım 1: Model tanıtım metni gösterilir (sektöre özel)
- Adım 2: Aynı metin boşluklu gelir, kullanıcı doğru kelimeyi seçer
- Adım 3: Cümlelerin sırası karışık verilir, kullanıcı doğru sıraya koyar
- Her ders farklı bir tanıtım senaryosu (iş görüşmesi / networking / konferans)
- Her sektör için 5 farklı senaryo → 5 ders

### MODÜL 3 — Telefon Görüşmeleri
**Format:** Diyalog pratiği
- Tam diyalog gösterilir, kullanıcı okur
- Kullanıcının replikleri gizlenir
- Karşı taraf konuşur, kullanıcı repliği yazar
- Kelime kelime karşılaştırma + skor
- Her sektör için 5 farklı telefon senaryosu → 5 ders

### MODÜL 4 — İş Mülakatı
**Format:** Soru-cevap + model cevap karşılaştırma
- Mülakat sorusu gösterilir
- Kullanıcı cevabını yazar (serbest)
- Model cevap gösterilir
- Kullanıcı kendi cevabını model cevapla karşılaştırır
- Anahtar ifadeler highlight edilir
- Her sektör için 10 soru → 5 ders (her ders 2 soru)

### MODÜL 5 — Ücret Görüşmesi
**Format:** Senaryo + strateji seçimi + diyalog
- Senaryo verilir (maaş teklifi, zamm talebi vb.)
- Kullanıcı strateji seçer (3 seçenek)
- Seçilen stratejiye göre diyalog açılır
- Diyalog pratiği yapılır
- En etkili strateji gösterilir + neden etkili olduğu açıklanır
- 5 farklı senaryo → 5 ders

### MODÜL 6 — Toplantı Dili
**Format:** İfade eşleştirme + diyalog
- Adım 1: Toplantı ifadelerini Türkçe karşılıklarıyla eşleştir
- Adım 2: Aynı ifadelerin geçtiği diyalog pratiği
- Her ders farklı toplantı tipi (brifing / brainstorm / karar toplantısı / sunum sonrası Q&A)
- Her sektör için 5 ders

### MODÜL 7 — E-posta Yazma
**Format:** Senaryo → oku → yaz → karşılaştır
- Senaryo verilir
- Örnek e-posta gösterilir (30 sn okuma süresi — timer)
- E-posta kaybolur, kullanıcı yazar
- Kelime kelime karşılaştırma, hata highlight
- Doğruluk yüzdesi + öğrenilen ifadeler
- Her sektör için 5 e-posta → 5 ders

### MODÜL 8 — Sunum Yapma
**Format:** İfade sırala + sunum akışı doldur
- Adım 1: Sunumun bölümleri gösterilir (giriş / ana bölüm / sonuç)
- Adım 2: O bölüm için doğru ifadeyi seç (4 şık)
- Adım 3: Tam sunum akışını sıralama egzersizi
- Her ders farklı sunum tipi (ürün lansmanı / çeyrek raporu / proje güncelleme)
- Her sektör için 5 ders

---

## 3. Veri Yapısı

### src/data/structure.ts (tip tanımları)

```typescript
type LessonType =
  | 'flashcard'
  | 'fillInTheBlank'
  | 'sentenceOrder'
  | 'dialogue'
  | 'interviewQA'
  | 'strategyDialogue'
  | 'expressionMatch'
  | 'emailWrite'
  | 'presentationFlow';

interface Vocabulary {
  id: string;
  english: string;
  turkish: string;
  example: string;          // kelime <highlight> ile işaretli
  pronunciation?: string;   // /rɪˈskɛdʒuːl/
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface DialogueTurn {
  speaker: 'user' | 'other';
  text: string;
}

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  xpReward: number;
  content: any; // tipe göre değişir, aşağıda her tip için ayrı interface
}

interface Module {
  id: string;
  title: string;
  icon: string;       // SVG path string
  iconColor: string;
  lessons: Lesson[];
  totalLessons: number;
  isUnlocked: boolean;
  prerequisite?: string; // hangi modül bitmeli
}

interface Sector {
  id: string;
  name: string;
  vocabulary: Vocabulary[];   // 50 kelime
  modules: Module[];          // 8 modül, her biri 5 ders
}
```

### AsyncStorage yapısı

```typescript
// Kullanıcı ana profili
'user_profile': {
  name: string;
  currentMode: 'work' | 'exam';
  currentSector: string;        // 'tech' | 'finance' | ...
  currentExam: string;          // 'toefl' | 'ielts' | ...
  totalXP: number;
  diamonds: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  activityLog: string[];        // ['2026-06-01', ...]
}

// Mod bazlı ilerleme — ayrı key'lerde saklanır
'progress_work_{sectorId}_{moduleId}': {
  completedLessons: string[];
  xpEarned: number;
  lastCompletedAt: string;
  vocabKnown: string[];         // bilinen kelime id'leri
  vocabRepeat: string[];        // tekrar gösterilecek kelime id'leri
}

'progress_exam_{examId}_{moduleId}': {
  completedLessons: string[];
  xpEarned: number;
}
```

---

## 4. Mod & Sektör Değiştirme — Screen Spec

### Dosya: src/screens/ProfileScreen.tsx

Profil ekranına "Öğrenme Ayarları" kartı ekle:

```
┌─────────────────────────────────────┐
│  🐼 Öğrenme Ayarları                │
│                                     │
│  Mod                                │
│  ┌──────────┐  ┌──────────────┐    │
│  │● İş Hayatı│  │○ Eğitim Modu│    │
│  └──────────┘  └──────────────┘    │
│                                     │
│  Sektörüm  (İş Hayatı modunda)     │
│  ┌─────────────────────────────┐   │
│  │ ✈ Havayolu / Havacılık  ▼ │   │
│  └─────────────────────────────┘   │
│                                     │
│  Sınavım  (Eğitim modunda)         │
│  ┌─────────────────────────────┐   │
│  │ 📋 TOEFL iBT            ▼ │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⚠ Mod değiştirilirse bu moddaki  │
│  ilerlemeniz korunur.               │
│                                     │
│  [Kaydet ve Devam Et]               │
└─────────────────────────────────────┘
```

Davranış:
- Mod toggle'ı: İş Hayatı seçilince sektör dropdown aktif, sınav dropdown pasif (ve tersi)
- Kaydet butonuna basınca `user_profile` güncellenir
- Ana ekran yeniden render edilir yeni mod/sektöre göre
- Toast: "Ayarlar kaydedildi ✓"

---

## 5. Uygulama Güncelleme Sırası

Claude Code şu sırayla geliştirsin:

1. `structure.ts` tip tanımlarını oluştur
2. AsyncStorage helper'larını güncelle (mod bazlı progress key'leri)
3. Profil ekranına mod/sektör değiştirme kartını ekle
4. Her modül için ders ekranı component'lerini oluştur (8 farklı tip)
5. Teknoloji sektörü içeriğini yeni formata göre doldur (tam örnek)
6. Diğer sektörleri aynı formata göre doldur
7. Sınav modu akışını bağla
